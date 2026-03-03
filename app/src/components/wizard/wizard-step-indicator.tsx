'use client';

import { useRef, useCallback } from 'react';
import type { WizardStep } from '@/lib/wizard/types';

interface WizardStepIndicatorProps {
  steps: WizardStep[];
  currentIndex: number;
  completedSteps: Set<number>;
  onStepClick: (index: number) => void;
  inReviewMode?: boolean;
}

/**
 * Step progress indicator.
 * - ≤10 steps: horizontal dots with checkmarks with keyboard arrow navigation
 * - >10 steps: compact progress bar
 *
 * Keyboard navigation (≤10 steps only):
 * - Left/Up arrow: move focus to previous step
 * - Right/Down arrow: move focus to next step
 * - Home: move focus to first step
 * - End: move focus to last step (or review if at end)
 * - Focuses dot and triggers onStepClick (WAI-ARIA tabs pattern)
 */
export function WizardStepIndicator({
  steps,
  currentIndex,
  completedSteps,
  onStepClick,
  inReviewMode = false,
}: WizardStepIndicatorProps) {
  const tablistRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation handler for arrow keys, Home, End
  // Must be defined before early returns (React Hooks rules)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const key = event.key;

      // Only handle arrow keys, Home, End
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) {
        return;
      }

      event.preventDefault();

      // Get all tab buttons from the tablist
      const tablist = tablistRef.current;
      if (!tablist) return;

      const tabs = Array.from(
        tablist.querySelectorAll('[role="tab"]')
      ) as HTMLButtonElement[];
      if (tabs.length === 0) return;

      // Find currently focused tab
      const activeElement = document.activeElement;
      let currentTabIndex = tabs.findIndex((tab) => tab === activeElement);

      // If nothing focused, default to current step or review
      if (currentTabIndex === -1) {
        currentTabIndex = inReviewMode ? tabs.length - 1 : currentIndex;
      }

      let nextTabIndex = currentTabIndex;

      // Handle key presses
      if (key === 'ArrowLeft' || key === 'ArrowUp') {
        // Move to previous tab
        nextTabIndex = Math.max(0, currentTabIndex - 1);
      } else if (key === 'ArrowRight' || key === 'ArrowDown') {
        // Move to next tab (including review dot)
        nextTabIndex = Math.min(tabs.length - 1, currentTabIndex + 1);
      } else if (key === 'Home') {
        // Move to first tab
        nextTabIndex = 0;
      } else if (key === 'End') {
        // Move to last tab (review dot)
        nextTabIndex = tabs.length - 1;
      }

      // Focus the new tab
      const nextTab = tabs[nextTabIndex];
      if (nextTab) {
        nextTab.focus();

        // Determine what to pass to onStepClick
        // The last tab is the review dot, so check if we're focusing that
        const isReviewTab = nextTabIndex === tabs.length - 1;
        const stepIndex = isReviewTab ? -1 : nextTabIndex;

        // Only trigger click if the step is clickable
        // Review mode: last tab is always clickable
        // Regular step: only if completed or current or in the history
        const isClickable =
          isReviewTab ||
          completedSteps.has(nextTabIndex) ||
          nextTabIndex === currentIndex ||
          nextTabIndex <= currentIndex;

        if (isClickable) {
          onStepClick(stepIndex);
        }
      }
    },
    [currentIndex, completedSteps, inReviewMode, onStepClick]
  );

  if (steps.length === 0) return null;

  // Compact bar for many steps
  if (steps.length > 10) {
    const completedCount = completedSteps.size;
    const pct = Math.round((completedCount / steps.length) * 100);

    return (
      <div className="mx-auto w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-600">
            Step {inReviewMode ? 'Review' : `${currentIndex + 1}`} of {steps.length}
          </span>
          <span className="text-xs text-gray-500">{pct}% complete</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
          {/* Progress fill */}
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${Math.max(((currentIndex + 1) / steps.length) * 100, 2)}%` }}
          />
        </div>
      </div>
    );
  }

  // Dot indicators for ≤10 steps
  return (
    <div className="mx-auto w-full max-w-2xl mb-6">
      <div
        ref={tablistRef}
        className="flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Wizard steps"
        onKeyDown={handleKeyDown}
      >
        {steps.map((step, i) => {
          const isCompleted = completedSteps.has(i);
          const isCurrent = i === currentIndex && !inReviewMode;
          const isClickable = isCompleted || isCurrent || i <= currentIndex;

          // Build status text for aria-label and title
          let statusText = '';
          if (isCurrent) {
            statusText = ' - current';
          } else if (isCompleted) {
            statusText = ' - completed';
          }

          const ariaLabel = `Step ${i + 1}: ${step.title}${statusText}`;
          const titleText = `Step ${i + 1}: ${step.title}${statusText}`;

          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={ariaLabel}
              title={titleText}
              tabIndex={isCurrent ? 0 : -1}
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              className={`
                relative flex items-center justify-center rounded-full transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isCurrent
                  ? 'h-4 w-4 border-2 border-blue-600 bg-white'
                  : isCompleted
                    ? 'h-3 w-3 bg-blue-600 text-white'
                    : 'h-3 w-3 bg-gray-300'
                }
                ${isClickable && !isCurrent ? 'cursor-pointer hover:scale-110 hover:brightness-110' : ''}
                ${!isClickable ? 'cursor-default' : ''}
              `}
            >
              {isCompleted && (
                <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
              )}
            </button>
          );
        })}

        {/* Review dot */}
        {(() => {
          const isReviewClickable = currentIndex >= steps.length - 1 || completedSteps.size === steps.length;
          const reviewAriaLabel = inReviewMode ? 'Review section answers - current' : 'Review section answers';

          return (
            <button
              type="button"
              role="tab"
              aria-selected={inReviewMode}
              aria-label={reviewAriaLabel}
              title={reviewAriaLabel}
              tabIndex={inReviewMode ? 0 : -1}
              onClick={() => {
                // Only clickable if all steps visited
                if (isReviewClickable) {
                  onStepClick(-1); // -1 signals review mode
                }
              }}
              disabled={!isReviewClickable}
              className={`
                relative flex items-center justify-center rounded-full transition-all duration-200 ml-1
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${inReviewMode
                  ? 'h-4 w-4 border-2 border-green-600 bg-white'
                  : 'h-3 w-3 bg-gray-300'
                }
                ${isReviewClickable && !inReviewMode ? 'cursor-pointer hover:scale-110 hover:brightness-110' : ''}
                ${!isReviewClickable ? 'cursor-default' : ''}
              `}
            >
              {inReviewMode && (
                <svg className="h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
              )}
            </button>
          );
        })()}
      </div>
    </div>
  );
}
