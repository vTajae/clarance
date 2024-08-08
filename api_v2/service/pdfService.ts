import {
  PDFArray,
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFName,
  PDFRadioGroup,
  PDFTextField,
} from "pdf-lib";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { ApplicantFormValues } from "~/components/form86/lastTry/formDefinition copy 2";

// Handle __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface UserServiceResponse {
  success: boolean;
  formData?: ApplicantFormValues;
  message: string;
}

interface PDFFormField {
  name: string;
  type: "PDFTextField" | "PDFRadioGroup" | "PDFDropdown" | "PDFCheckBox";
  value: string | string[] | undefined;
}

class PdfService {
  async mapFilledValuesfrom_PDF(pdfDoc: PDFDocument) {
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    const fieldData = fields
      .map((field) => {
        const name = field.getName();
        const type = field.constructor.name;
        const id = field.ref.tag.toString(); // Extract only the sequence of consecutive numbers
        let value: string | string[] | undefined = undefined;

        if (field instanceof PDFTextField) {
          value = field.getText();
        } else if (field instanceof PDFDropdown) {
          value = field.getSelected();
          if (Array.isArray(value) && value.length === 0) {
            value = undefined; // Treat empty arrays as undefined
          }
        } else if (field instanceof PDFCheckBox) {
          value = field.isChecked() ? "Yes" : "No";
          if (value === "No") {
            value = undefined; // Treat "No" as undefined
          }
        } else if (field instanceof PDFRadioGroup) {
          value = field.getSelected();
        }

        if (
          value !== null &&
          value !== undefined &&
          !(Array.isArray(value) && value.length === 0) &&
          value !== ""
        ) {
          return {
            name,
            id,
            type,
            value,
          };
        } else {
          return null;
        }
      })
      .filter((field) => field !== null); // Remove null values

    return fieldData;
  }

  async mapFormFields(pdfDoc: PDFDocument) {
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    const fieldData = fields.map((field) => {
      const name = field.getName();
      const type = field.constructor.name;
      const id = field.ref.tag.toString(); // Extract only the sequence of consecutive numbers
      let value: string | string[] | undefined = undefined;

      if (field instanceof PDFTextField) {
        value = field.getText();
      } else if (field instanceof PDFDropdown) {
        value = field.getSelected();
      } else if (field instanceof PDFCheckBox) {
        value = field.isChecked() ? "Yes" : "No";
      } else if (field instanceof PDFRadioGroup) {
        value = field.getSelected();
      }

      return {
        name,
        id,
        type,
        value,
      };
    });

    return fieldData;
  }

  async setFieldValue(
    pdfDoc: PDFDocument,
    fieldName: string,
    fieldValue: string
  ) {
    const form = pdfDoc.getForm();
    const field = form.getField(fieldName);

    if (!field) {
      console.log(`Field ${fieldName} not found in the PDF.`);
      return;
    }

    if (field instanceof PDFTextField) {
      field.setText(fieldValue);
    } else if (field instanceof PDFDropdown) {
      field.select(fieldValue);
    } else if (field instanceof PDFCheckBox) {
      if (fieldValue.toLowerCase() === "yes") {
        field.check();
      } else {
        field.uncheck();
      }
    } else if (field instanceof PDFRadioGroup) {
      field.select(fieldValue);
    }
  }

  async loadAndFillPdf(
    formData: ApplicantFormValues
  ): Promise<UserServiceResponse> {
    try {
      // Load the PDF from a local file
      const pdfPath = join(__dirname, "../../public/sf861.pdf"); // Adjust path if necessary
      const pdfBytes = fs.readFileSync(pdfPath);

      console.log("PDF loaded from file.");

      const pdfDoc = await PDFDocument.load(pdfBytes);

      console.log("PDF document loaded.");

      const fieldMapping = await this.mapFormFields(pdfDoc);

      const finalForm = await this.mapFormValuesToJsonData(
        fieldMapping,
        formData
      );

      // Convert object or array to JSON string
      const dataToWrite = JSON.stringify(finalForm, null, 2); // null and 2 for pretty formatting

      // Write to file synchronously
      const myOutputPath = join(__dirname, "../../public/Reference.json");
      fs.writeFileSync(myOutputPath, dataToWrite);

      console.log("Form values mapped to Reference.json");

      // // Update the PDF with the mapped values
      for (const item of finalForm) {
        if (item.value) {
          await this.setFieldValue(pdfDoc, item.name, item.value as string);
        }
      }

      console.log("PDF fields updated.");

      // Save the updated PDF to a file
      const modifiedPdfBytes = await pdfDoc.save();
      const outputPath = join(__dirname, "../../public/example.pdf");
      fs.writeFileSync(outputPath, modifiedPdfBytes);
      console.log("PDF Saved.");

      return {
        success: true,
        formData,
        message: "PDF filled successfully and saved.",
      };
    } catch (error) {
      console.error(`Error processing PDF: ${error}`);
      return {
        success: false,
        message: `Error processing PDF: ${error}`,
      };
    }
  }

  async reverseloadAndFillPdf(
    formData: ApplicantFormValues
  ): Promise<UserServiceResponse> {
    try {
      // Load the PDF from a local file
      const pdfPath = join(__dirname, "../../public/sf862.pdf"); // Adjust path if necessary
      const pdfBytes = fs.readFileSync(pdfPath);

      console.log("PDF loaded from file.");

      const pdfDoc = await PDFDocument.load(pdfBytes);

      console.log("PDF document loaded.");

      const fieldMapping = await this.mapFilledValuesfrom_PDF(pdfDoc);

      console.log("Form fields mapped. v1");

      // const finalForm = await this.mapFormValuesToJsonData(
      //   fieldMapping,
      //   formData
      // );

      // Convert object or array to JSON string
      const dataToWrite = JSON.stringify(fieldMapping, null, 2); // null and 2 for pretty formatting

      // // Write to file synchronously
      const myOutputPath = join(__dirname, "../../public/completedFields.json");
      fs.writeFileSync(myOutputPath, dataToWrite);

      console.log("Form values mapped to completedFields.json");

      // // Update the PDF with the mapped values
      // for (const item of finalForm) {
      //   if (item.value) {
      //     await this.setFieldValue(pdfDoc, item.name, item.value as string);
      //   }
      // }

      console.log("PDF fields updated.");

      // Save the updated PDF to a file
      // const modifiedPdfBytes = await pdfDoc.save();
      // const outputPath = join(__dirname, "../../public/example.pdf");
      // fs.writeFileSync(outputPath, modifiedPdfBytes);

      console.log("PDF saved to file.");

      return {
        success: true,
        formData,
        message: "PDF filled successfully and saved.",
      };
    } catch (error) {
      console.error(`Error processing PDF: ${error}`);
      return {
        success: false,
        message: `Error processing PDF: ${error}`,
      };
    }
  }

  async pages(formData: ApplicantFormValues): Promise<UserServiceResponse> {
    try {
      // Load the PDF from a local file
      const pdfPath = join(__dirname, "../../public/sf861.pdf"); // Adjust path if necessary
      const pdfBytes = fs.readFileSync(pdfPath);

      console.log("PDF loaded from file.");

      const pdfDoc = await PDFDocument.load(pdfBytes);

      console.log("PDF document loaded.");

      // Get the fields from the AcroForm
      const fields = pdfDoc.getForm().getFields();

      // Create a mapping of page indexes to field references
      const pageFieldMap = new Map<
        number,
        { name: string; id: string; type: string }[]
      >();

      // Iterate over each page in the PDF
      const pages = pdfDoc.getPages();
      pages.forEach((page, pageIndex) => {
        // Get the annotations for the current page
        const pageAnnotsRaw = page.node.lookupMaybe(
          PDFName.of("Annots"),
          PDFArray
        );
        const pageAnnots = pageAnnotsRaw ? pageAnnotsRaw.asArray() : [];

        // Check each field to see if it is on the current page
        fields.forEach((field) => {
          if (pageAnnots.includes(field.ref)) {
            if (!pageFieldMap.has(pageIndex)) {
              pageFieldMap.set(pageIndex, []);
            }
            pageFieldMap.get(pageIndex).push({
              name: field.getName(),
              id: field.ref.toString(),
              type: field.constructor.name,
            });
          }
        });
      });

      // Prepare output to be written to the file
      let output = "";
      for (const [pageIndex, fieldInfos] of pageFieldMap.entries()) {
        output += `Page ${pageIndex + 1}:\n`;
        fieldInfos.forEach(({ name, id, type }) => {
          output += `  Name: ${name}, ID: ${id}\n, Type: ${type}\n`;
        });
      }

      // let output = "";
      // for (const field of fields) {
      //   output =
      //     output +
      //     `Name: ${field.getName()}, ID: ${field.ref.toString()}, Type: ${
      //       field.constructor.name
      //     }\n`;
      // }

      // Write output to a text file
      const outputPath = join(__dirname, "../../public/field_analysis.txt");
      fs.writeFileSync(outputPath, output);

      return {
        success: true,
        formData,
        message: "PDF filled successfully and analysis saved.",
      };
    } catch (error) {
      console.error(`Error processing PDF: ${error}`);
      return {
        success: false,
        message: `Error processing PDF: ${error}`,
      };
    }
  }

  async getRadioResponses(
    formData: ApplicantFormValues
  ): Promise<UserServiceResponse> {
    try {
      // Load the PDF from a local file
      const pdfPath = join(__dirname, "../../public/filled-form-1_1.pdf"); // Adjust path if necessary
      const pdfBytes = fs.readFileSync(pdfPath);

      console.log("PDF loaded from file.");

      const pdfDoc = await PDFDocument.load(pdfBytes);

      console.log("PDF document loaded.");

      // Get the fields from the AcroForm
      const fields = pdfDoc.getForm().getFields();

      const radioFieldsWithValues = fields
        .filter((field) => field.constructor.name === "PDFRadioGroup")
        .map((field) => {
          const radioGroupField = field as PDFRadioGroup;
          const selectedValue = radioGroupField.getSelected();
          if (selectedValue) {
            return {
              name: radioGroupField.getName(),
              id: radioGroupField.ref.toString(),
              type: radioGroupField.constructor.name,
              value: selectedValue,
            };
          }
          return null;
        })
        .filter((field) => field !== null) // Remove null values
        .sort((a, b) => a.id.localeCompare(b.id)); // Sort by ID

      let output = "";
      radioFieldsWithValues.forEach((field) => {
        output += `Name: ${field.name}, ID: ${field.id}, Type: ${field.type}, Value: ${field.value}\n`;
      });

      // Write output to a text file
      const outputPath = join(__dirname, "../../public/field_analysis.txt");
      fs.writeFileSync(outputPath, output);

      return {
        success: true,
        formData,
        message: "PDF filled successfully and analysis saved.",
      };
    } catch (error) {
      console.error(`Error processing PDF: ${error}`);
      return {
        success: false,
        message: `Error processing PDF: ${error}`,
      };
    }
  }

  async analysis(formData: ApplicantFormValues): Promise<UserServiceResponse> {
    try {
      // Load the PDF from a local file
      const pdfPath = join(__dirname, "../../public/filled-form-1_1.pdf"); // Adjust path if necessary
      const pdfBytes = fs.readFileSync(pdfPath);

      console.log("PDF loaded from file.");

      const pdfDoc = await PDFDocument.load(pdfBytes);

      console.log("PDF document loaded.");

      // Get the fields from the AcroForm
      const fields = pdfDoc.getForm().getFields();

      const fieldsWithValues = fields
        .map((field) => {
          if (field instanceof PDFRadioGroup) {
            const selectedValue = field.getSelected();
            if (selectedValue) {
              return {
                name: field.getName(),
                id: field.ref.toString(),
                type: "RadioGroup",
                value: selectedValue,
              };
            }
          } else if (field instanceof PDFTextField) {
            const textValue = field.getText();
            if (textValue) {
              return {
                name: field.getName(),
                id: field.ref.toString(),
                type: "TextField",
                value: textValue,
              };
            }
          } else if (field instanceof PDFDropdown) {
            const selectedValue = field.getSelected();
            if (selectedValue) {
              return {
                name: field.getName(),
                id: field.ref.toString(),
                type: "Dropdown",
                value: selectedValue,
              };
            }
          }
          return null;
        })
        .filter((field) => field !== null) // Remove null values
        .sort((a, b) => a.id.localeCompare(b.id)); // Sort by ID

      let output = "";
      fieldsWithValues.forEach((field) => {
        output += `Name: ${field.name}, ID: ${field.id}, Type: ${field.type}, Value: ${field.value}\n`;
      });

      // Write output to a text file
      const outputPath = join(__dirname, "../../public/field_analysis.txt");
      fs.writeFileSync(outputPath, output);

      return {
        success: true,
        formData,
        message: "PDF filled successfully and analysis saved.",
      };
    } catch (error) {
      console.error(`Error processing PDF: ${error}`);
      return {
        success: false,
        message: `Error processing PDF: ${error}`,
      };
    }
  }

  async field_analysis(
    formData: ApplicantFormValues
  ): Promise<UserServiceResponse> {
    try {
      // Load the PDF from a local file
      const pdfPath = join(__dirname, "../../public/filled-form-1_1.pdf"); // Adjust path if necessary
      const pdfBytes = fs.readFileSync(pdfPath);

      console.log("PDF loaded from file.");

      const pdfDoc = await PDFDocument.load(pdfBytes);

      console.log("PDF document loaded.");

      // Get the fields from the AcroForm
      const fields = pdfDoc.getForm().getFields();

      const fieldsWithValues = fields
        .map((field) => {
          if (field instanceof PDFTextField) {
            const textValue = field.getText();
            console.log("textValue", textValue);
            if (
              textValue !== null &&
              textValue !== undefined &&
              textValue !== ""
            ) {
              return {
                name: field.getName(),
                id: field.ref.toString(),
                type: "TextField",
                value: textValue,
              };
            }
          } else if (field instanceof PDFDropdown) {
            const selectedValue = field.getSelected();
            if (
              selectedValue !== null &&
              selectedValue !== undefined &&
              selectedValue.length > 0
            ) {
              return {
                name: field.getName(),
                id: field.ref.toString(),
                type: "Dropdown",
                value: selectedValue,
              };
            }
          } else if (field instanceof PDFRadioGroup) {
            const selectedValue = field.getSelected();
            if (
              selectedValue !== null &&
              selectedValue !== undefined &&
              selectedValue !== ""
            ) {
              return {
                name: field.getName(),
                id: field.ref.toString(),
                type: "RadioGroup",
                value: selectedValue,
              };
            }
          } else if (field instanceof PDFCheckBox) {
            const isChecked = field.isChecked();
            if (isChecked !== null && isChecked !== undefined) {
              return {
                name: field.getName(),
                id: field.ref.toString(),
                type: "CheckBox",
                value: isChecked ? "Yes" : "No",
              };
            }
          }
          return null;
        })
        .filter((field) => field !== null) // Remove null values
        .sort((a, b) => a.id.localeCompare(b.id)); // Sort by ID

      let output = "";
      fieldsWithValues.forEach((field) => {
        output += `Name: ${field.name}, ID: ${field.id}, Type: ${field.type}, Value: ${field.value}\n`;
      });

      // Write output to a text file
      const outputPath = join(__dirname, "../../public/field_analysis.txt");
      fs.writeFileSync(outputPath, output);

      return {
        success: true,
        formData,
        message: "PDF filled successfully and analysis saved.",
      };
    } catch (error) {
      console.error(`Error processing PDF: ${error}`);
      return {
        success: false,
        message: `Error processing PDF: ${error}`,
      };
    }
  }

  async mapFormValuesToJsonData(json: any[], formValues: ApplicantFormValues) {
    const idValueMap = new Map<string, string>();

    // console.log(idValueMap, "idValueMap");
    // Helper function to format IDs to match JSON IDs
    const formatId = (id: string) => `${id} 0 R`;

    // Flatten the form values to create a map of formatted IDs to values
    const flattenFormValues = (data: any, path: string = "") => {
      for (const key in data) {
        if (data[key] && typeof data[key] === "object") {
          const currentPath = path ? `${path}.${key}` : key;

          if ("id" in data[key] && "value" in data[key] && data[key].id) {
            const formattedId = formatId(data[key].id);
            idValueMap.set(formattedId, data[key].value);
          } else {
            flattenFormValues(data[key], currentPath);
          }
        }
      }
    };

    // Flatten form values
    flattenFormValues(formValues);

    // Map and update the JSON data
    json.forEach((item) => {
      const id = item.id;
      if (idValueMap.has(id)) {
        item.value = idValueMap.get(id);
      }
    });

    return json;
  }
}

export default PdfService;
