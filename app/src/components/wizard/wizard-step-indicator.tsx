'use client';

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
 * - ≤10 steps: horizontal dots with checkmarks
 * - >10 steps: compact progress bar
 */
export function WizardStepIndicator({
  steps,
  currentIndex,
  completedSteps,
  onStepClick,
  inReviewMode = false,
}: WizardStepIndicatorProps) {
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
      <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Wizard steps">
        {steps.map((step, i) => {
          const isCompleted = completedSteps.has(i);
          const isCurrent = i === currentIndex && !inReviewMode;
          const isClickable = isCompleted || isCurrent || i <= currentIndex;

          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={`Step ${i + 1}: ${step.title}${isCompleted ? ' (completed)' : ''}`}
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
                ${isClickable && !isCurrent ? 'cursor-pointer hover:scale-110' : ''}
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
        <button
          type="button"
          role="tab"
          aria-selected={inReviewMode}
          aria-label="Review"
          onClick={() => {
            // Only clickable if all steps visited
            if (currentIndex >= steps.length - 1 || completedSteps.size === steps.length) {
              onStepClick(-1); // -1 signals review mode
            }
          }}
          className={`
            relative flex items-center justify-center rounded-full transition-all duration-200 ml-1
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${inReviewMode
              ? 'h-4 w-4 border-2 border-green-600 bg-white'
              : 'h-3 w-3 bg-gray-300'
            }
          `}
        >
          {inReviewMode && (
            <svg className="h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 12 12">
              <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
