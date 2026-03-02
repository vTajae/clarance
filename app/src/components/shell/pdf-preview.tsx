'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type KeyboardEvent,
} from 'react';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

/** US Letter dimensions in PDF points (72 dpi). */
const PDF_PAGE_WIDTH_PT = 612;
const PDF_PAGE_HEIGHT_PT = 792;

/** Default rendering DPI used by the PDF service. */
const RENDER_DPI = 150;

/** Default total page count for the SF-86 form. */
const SF86_TOTAL_PAGES = 127;

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface FieldRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PdfPreviewProps {
  /** 0-based page number to display. */
  pageNumber: number;
  /** Total pages in the PDF (defaults to 127 for SF-86). */
  totalPages?: number;
  /** Bounding rect of the active field to highlight (PDF point coordinates). */
  activeFieldRect?: FieldRect | null;
  /** Callback when user manually navigates pages. */
  onPageChange?: (page: number) => void;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function PdfPreview({
  pageNumber,
  totalPages = SF86_TOTAL_PAGES,
  activeFieldRect = null,
  onPageChange,
}: PdfPreviewProps) {
  /* -- State --------------------------------------------------------------- */
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  /* -- Refs ---------------------------------------------------------------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  /* -- Derived values ------------------------------------------------------ */
  const safePage = clamp(pageNumber, 0, totalPages - 1);
  const scale = containerWidth > 0 ? containerWidth / PDF_PAGE_WIDTH_PT : 1;
  const aspectRatio = PDF_PAGE_WIDTH_PT / PDF_PAGE_HEIGHT_PT;

  /* -- Observe container width for responsive scaling ---------------------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
        setContainerWidth(width);
      }
    });

    observer.observe(el);
    // Set initial width synchronously
    setContainerWidth(el.clientWidth);

    return () => observer.disconnect();
  }, []);

  /* -- Fetch page image ---------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function fetchPage() {
      setLoadState('loading');
      setErrorMessage('');

      try {
        const response = await fetch(
          `/api/pdf/render-page/sf861/${safePage}?dpi=${RENDER_DPI}`,
        );

        if (!response.ok) {
          const body = await response.text();
          throw new Error(body || `HTTP ${response.status}`);
        }

        const blob = await response.blob();

        if (cancelled) return;

        // Revoke previous object URL to prevent memory leaks
        if (imageSrc) {
          URL.revokeObjectURL(imageSrc);
        }

        const url = URL.createObjectURL(blob);
        setImageSrc(url);
        setLoadState('loaded');
      } catch (err) {
        if (cancelled) return;
        setLoadState('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load page',
        );
      }
    }

    fetchPage();

    return () => {
      cancelled = true;
    };
    // We intentionally exclude imageSrc from deps to avoid re-fetch loops.
    // The previous URL is cleaned up inside fetchPage itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  /* -- Cleanup object URL on unmount -------------------------------------- */
  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
    // Only on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -- Navigation handlers ------------------------------------------------- */
  const goToPrev = useCallback(() => {
    if (safePage > 0) {
      onPageChange?.(safePage - 1);
    }
  }, [safePage, onPageChange]);

  const goToNext = useCallback(() => {
    if (safePage < totalPages - 1) {
      onPageChange?.(safePage + 1);
    }
  }, [safePage, totalPages, onPageChange]);

  const handlePageInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const raw = Number.parseInt(e.currentTarget.value, 10);
        if (!Number.isNaN(raw)) {
          // Input shows 1-based, convert to 0-based
          const target = clamp(raw - 1, 0, totalPages - 1);
          onPageChange?.(target);
        }
      }
    },
    [totalPages, onPageChange],
  );

  const handlePageInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const raw = Number.parseInt(e.currentTarget.value, 10);
      if (!Number.isNaN(raw)) {
        const target = clamp(raw - 1, 0, totalPages - 1);
        onPageChange?.(target);
      }
    },
    [totalPages, onPageChange],
  );

  /* -- Highlight overlay --------------------------------------------------- */
  const highlightStyle = activeFieldRect
    ? {
        left: `${activeFieldRect.x * scale}px`,
        top: `${activeFieldRect.y * scale}px`,
        width: `${activeFieldRect.width * scale}px`,
        height: `${activeFieldRect.height * scale}px`,
      }
    : null;

  /* -- Render -------------------------------------------------------------- */
  return (
    <div className="flex flex-col gap-3">
      {/* Page navigation controls */}
      <nav
        className="flex items-center justify-between gap-2"
        aria-label="PDF page navigation"
      >
        <button
          type="button"
          onClick={goToPrev}
          disabled={safePage <= 0}
          className="
            rounded-md border border-gray-300 bg-white px-2 py-1 text-sm
            text-gray-700 shadow-sm
            hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            disabled:cursor-not-allowed disabled:opacity-40
          "
          aria-label="Previous page"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <label htmlFor="pdf-page-input" className="sr-only">
            Page number
          </label>
          <span>Page</span>
          <input
            id="pdf-page-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            defaultValue={safePage + 1}
            key={safePage}
            onKeyDown={handlePageInputKeyDown}
            onBlur={handlePageInputBlur}
            className="
              w-10 rounded border border-gray-300 px-1 py-0.5 text-center text-sm
              focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
            "
            aria-label={`Page ${safePage + 1} of ${totalPages}`}
          />
          <span>of {totalPages}</span>
        </div>

        <button
          type="button"
          onClick={goToNext}
          disabled={safePage >= totalPages - 1}
          className="
            rounded-md border border-gray-300 bg-white px-2 py-1 text-sm
            text-gray-700 shadow-sm
            hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            disabled:cursor-not-allowed disabled:opacity-40
          "
          aria-label="Next page"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </nav>

      {/* Page viewport */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-md border border-gray-200 bg-white"
        style={{ aspectRatio: `${aspectRatio}` }}
        role="img"
        aria-label={`PDF page ${safePage + 1} of ${totalPages}`}
      >
        {/* Loading skeleton */}
        {loadState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="h-6 w-6 animate-spin text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span className="text-xs text-gray-400">Loading page...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {loadState === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <svg
                className="h-8 w-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="text-sm font-medium text-red-700">
                Could not load preview
              </p>
              <p className="text-xs text-red-500">{errorMessage}</p>
              <button
                type="button"
                onClick={() => onPageChange?.(safePage)}
                className="
                  mt-1 rounded-md border border-red-300 bg-white px-3 py-1
                  text-xs text-red-600
                  hover:bg-red-50
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
                "
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Rendered page image */}
        {imageSrc && (
          <img
            ref={imgRef}
            src={imageSrc}
            alt={`SF-86 form page ${safePage + 1}`}
            className={`
              block w-full h-auto
              ${loadState === 'loading' ? 'invisible' : ''}
            `}
            onLoad={() => setLoadState('loaded')}
            onError={() => {
              setLoadState('error');
              setErrorMessage('Image failed to decode');
            }}
            draggable={false}
          />
        )}

        {/* Active field highlight overlay */}
        {loadState === 'loaded' && highlightStyle && (
          <div
            className="
              pointer-events-none absolute
              rounded-sm border-2 border-blue-500
              bg-blue-500/15
              shadow-[0_0_0_1px_rgba(59,130,246,0.3)]
              transition-all duration-150 ease-out
            "
            style={highlightStyle}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-gray-400 text-center" aria-hidden="true">
        Type a page number and press Enter to jump directly.
      </p>
    </div>
  );
}
