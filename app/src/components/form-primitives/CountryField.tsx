'use client';

import { COUNTRIES } from '@/lib/data/countries';
import { SelectField } from './SelectField';
import type { BaseFieldProps } from '@/lib/types/form';

type CountryFieldProps = BaseFieldProps;

/**
 * Country dropdown.
 * United States is listed first, then all other countries alphabetically.
 */
export function CountryField(props: CountryFieldProps) {
  return (
    <SelectField
      {...props}
      options={COUNTRIES}
      placeholder="-- Select Country --"
    />
  );
}
