'use client';

import { US_STATES } from '@/lib/data/states';
import { SelectField } from './SelectField';
import type { BaseFieldProps } from '@/lib/types/form';

type StateFieldProps = BaseFieldProps;

/**
 * US state and territory dropdown.
 * Lists all 50 states plus DC and US territories.
 */
export function StateField(props: StateFieldProps) {
  return (
    <SelectField
      {...props}
      options={US_STATES}
      placeholder="-- Select State --"
    />
  );
}
