/**
 * Client-Side PDF Operations — Fill & Extract using pdf-lib
 *
 * Runs entirely in the browser. No server-side PDF service needed.
 *
 * Key gotchas from the SF-86 registry:
 * - Radio groups: valueMap values are 1-based indices ("1","2","3")
 *   but pdf-lib radio options are 0-based in the options array.
 * - Checkboxes: on_state may be '2' not just 'Yes'. We use check()/uncheck().
 * - Text fields: straightforward setText().
 * - Dropdowns: use select() with the option string.
 */

import { PDFDocument, PDFCheckBox, PDFDropdown, PDFRadioGroup, PDFTextField } from 'pdf-lib';

// ---------------------------------------------------------------------------
// Fill PDF
// ---------------------------------------------------------------------------

/**
 * Fill a PDF template with the given field values.
 *
 * @param templateBytes - The raw PDF template as ArrayBuffer/Uint8Array
 * @param fieldValues - Map of PDF field name → PDF value string
 *   (already transformed from UI values via uiToPdf)
 * @returns Filled PDF as Uint8Array
 */
export async function fillPdf(
  templateBytes: ArrayBuffer | Uint8Array,
  fieldValues: Record<string, string>,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();

  for (const [fieldName, value] of Object.entries(fieldValues)) {
    if (value === '' || value == null) continue;

    try {
      const field = form.getField(fieldName);

      if (field instanceof PDFTextField) {
        field.setText(value);
      } else if (field instanceof PDFCheckBox) {
        // Truthy values → check; falsy → uncheck
        const truthy = ['Yes', 'yes', 'YES', 'On', 'on', 'ON', 'True', 'true', '1'];
        if (truthy.includes(value)) {
          field.check();
        } else {
          field.uncheck();
        }
      } else if (field instanceof PDFRadioGroup) {
        // Radio values from our registry are 1-based numeric strings ("1","2","3").
        // pdf-lib's select() takes the option name from the radio group's options array.
        const options = field.getOptions();
        const idx = parseInt(value, 10);
        if (!isNaN(idx) && idx >= 1 && idx <= options.length) {
          // 1-based registry value → 0-based options index
          field.select(options[idx - 1]);
        } else {
          // Try direct option name match (for non-numeric valueMap entries)
          if (options.includes(value)) {
            field.select(value);
          }
        }
      } else if (field instanceof PDFDropdown) {
        field.select(value);
      }
    } catch {
      // Field not found in this PDF — skip silently.
      // This happens for fields that exist in the registry but not in
      // every template version.
    }
  }

  // Flatten the form so filled values are visible in all viewers
  form.flatten();

  return pdfDoc.save();
}

// ---------------------------------------------------------------------------
// Extract Fields
// ---------------------------------------------------------------------------

/**
 * Extract all field values from a filled PDF.
 *
 * @param pdfBytes - The PDF file as ArrayBuffer/Uint8Array
 * @returns Map of PDF field name → raw PDF value string
 */
export async function extractFields(
  pdfBytes: ArrayBuffer | Uint8Array,
): Promise<Record<string, string>> {
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const result: Record<string, string> = {};

  for (const field of fields) {
    const name = field.getName();

    try {
      if (field instanceof PDFTextField) {
        const text = field.getText();
        if (text) result[name] = text;
      } else if (field instanceof PDFCheckBox) {
        if (field.isChecked()) {
          result[name] = 'Yes';
        }
        // Don't record unchecked — matches existing Python service behavior
      } else if (field instanceof PDFRadioGroup) {
        const selected = field.getSelected();
        if (selected) {
          // Convert option name back to 1-based index
          const options = field.getOptions();
          const idx = options.indexOf(selected);
          if (idx >= 0) {
            result[name] = String(idx + 1); // 0-based → 1-based
          } else {
            result[name] = selected;
          }
        }
      } else if (field instanceof PDFDropdown) {
        const selections = field.getSelected();
        if (selections.length > 0) {
          result[name] = selections[0];
        }
      }
    } catch {
      // Skip fields that can't be read
    }
  }

  return result;
}
