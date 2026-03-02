'use client';

import { memo } from 'react';
import type { FieldDefinition } from '@/lib/field-registry/types';
import type { FieldOption } from '@/lib/types/form';

import { TextField } from '@/components/form-primitives/TextField';
import { TextAreaField } from '@/components/form-primitives/TextAreaField';
import { CheckboxField } from '@/components/form-primitives/CheckboxField';
import { RadioGroupField } from '@/components/form-primitives/RadioGroupField';
import { SelectField } from '@/components/form-primitives/SelectField';
import { DateField } from '@/components/form-primitives/DateField';
import { TelephoneField } from '@/components/form-primitives/TelephoneField';
import { SSNField } from '@/components/form-primitives/SSNField';
import { EmailField } from '@/components/form-primitives/EmailField';
import { CountryField } from '@/components/form-primitives/CountryField';
import { StateField } from '@/components/form-primitives/StateField';
import { HeightField } from '@/components/form-primitives/HeightField';

/**
 * Renders a single form field based on its FieldDefinition from the registry.
 * This is the bridge between the static field registry and the dynamic form UI.
 */
function RegistryFieldInner({ field }: { field: FieldDefinition }) {
  const { semanticKey, label, uiFieldType, required, maxLength, options } = field;

  // Clean up label: truncate very long instructional labels
  const displayLabel = label.length > 100 ? label.slice(0, 97) + '...' : label;

  // Convert string[] options to FieldOption[] format
  const fieldOptions: FieldOption[] | undefined = options?.map((opt) => ({
    value: opt,
    label: opt,
  }));

  switch (uiFieldType) {
    case 'text':
      return (
        <TextField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
          maxLength={maxLength}
        />
      );

    case 'textarea':
      return (
        <TextAreaField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
          maxLength={maxLength}
        />
      );

    case 'checkbox':
      return (
        <CheckboxField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
        />
      );

    case 'radio':
      return (
        <RadioGroupField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
          options={fieldOptions ?? []}
        />
      );

    case 'select':
      return (
        <SelectField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
          options={fieldOptions ?? []}
        />
      );

    case 'date':
      return (
        <DateField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
        />
      );

    case 'telephone':
    case 'phone':
      return (
        <TelephoneField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
        />
      );

    case 'ssn':
      return (
        <SSNField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
        />
      );

    case 'email':
      return (
        <EmailField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
        />
      );

    case 'country':
      // Use SelectField with registry options (full country names matching PDF)
      // NOT CountryField which stores ISO codes that don't match PDF values
      return (
        <SelectField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
          options={fieldOptions ?? []}
          placeholder="-- Select Country --"
        />
      );

    case 'state':
      return (
        <StateField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
        />
      );

    case 'height':
      return (
        <HeightField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
        />
      );

    default:
      // Fallback for unrecognized types
      return (
        <TextField
          semanticKey={semanticKey}
          label={displayLabel}
          required={required}
          maxLength={maxLength}
        />
      );
  }
}

export const RegistryField = memo(RegistryFieldInner);
