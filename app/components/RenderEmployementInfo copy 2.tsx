import React from "react";
import FormInfo from "api_v2/interfaces/FormInfo";
import { EmploymentInfo } from "api_v2/interfaces/employmentInfo";
import { RenderSection13A1 } from "./_employment/Section13A1";
import { RenderSection13A4 } from "./_employment/Section13A4";
import { RenderSection13A5 } from "./_employment/Section13A5";
import { RenderSection13A6 } from "./_employment/Section13A6";
import { RenderSection13A3 } from "./_employment/Section13A3";
import { RenderSection13A2 } from "./_employment/Section13A2";

interface FormProps {
  data: EmploymentInfo[];
  onInputChange: (path: string, value: any) => void;
  onAddEntry: (path: string, newItem: any) => void;
  onRemoveEntry: (path: string, index: number) => void;
  isValidValue: (path: string, value: any) => boolean;
  getDefaultNewItem: (itemType: string) => any;
  isReadOnlyField: (fieldName: string) => boolean;
  path: string;
  formInfo: FormInfo;
  actionType?: string;
}

const RenderEmploymentInfo: React.FC<FormProps> = ({
  data,
  onInputChange,
  onAddEntry,
  onRemoveEntry,
  isValidValue,
  getDefaultNewItem,
  isReadOnlyField,
  path,
  formInfo,
}) => {
  const employmentInfo = data as EmploymentInfo[];

  const renderEmploymentSections = (entry: EmploymentInfo, index: number) => {
    switch (entry.employmentActivity) {
      case "activeMilitaryDutyStation":
      case "nationalGuardReserve":
      case "usphsCommissionedCorps":
      onAddEntry(`${path}[${index}]`, getDefaultNewItem(`employmentInfo.section13A1`))
      onAddEntry(`${path}[${index}]`, getDefaultNewItem(`employmentInfo.section13A5`))
      onAddEntry(`${path}[${index}]`, getDefaultNewItem(`employmentInfo.section13A6`))

        return (
          <>
            <RenderSection13A1
              data={entry.section13A1}
              onInputChange={(field, value) =>
                onInputChange(`${path}[${index}].section13A1.${field}`, value)
              }
            />
            <RenderSection13A5
              data={entry.section13A5}
              onInputChange={(field, value) =>
                onInputChange(`${path}[${index}].section13A5.${field}`, value)
              }
            />
            <RenderSection13A6
              data={entry.section13A6}
              onInputChange={(field, value) =>
                onInputChange(`${path}[${index}].section13A6.${field}`, value)
              }
            />
          </>
        );
      case "unemployment":
        return (
          <RenderSection13A4
            data={entry.section13A4}
            onInputChange={(field, value) =>
              onInputChange(`${path}[${index}].section13A4.${field}`, value)
            }
          />
        );
      case "selfEmployment":
        return (
          <>
            <RenderSection13A3
              data={entry.section13A3}
              onInputChange={(field, value) =>
                onInputChange(`${path}[${index}].section13A3.${field}`, value)
              }
            />
            <RenderSection13A5
              data={entry.section13A5}
              onInputChange={(field, value) =>
                onInputChange(`${path}[${index}].section13A5.${field}`, value)
              }
            />
            <RenderSection13A6
              data={entry.section13A6}
              onInputChange={(field, value) =>
                onInputChange(`${path}[${index}].section13A6.${field}`, value)
              }
            />
          </>
        );
      case "otherFederalEmployment":
      case "stateGovernment":
      case "nonGovernmentEmployment":
      case "federalContractor":
      case "other":
        return (
          <>
            <RenderSection13A2
              data={entry.section13A2}
              onInputChange={(field, value) =>
                onInputChange(`${path}[${index}].section13A2.${field}`, value)
              }
            />
            <RenderSection13A5
              data={entry.section13A5}
              onInputChange={(field, value) =>
                onInputChange(`${path}[${index}].section13A5.${field}`, value)
              }
            />
            <RenderSection13A6
              data={entry.section13A6}
              onInputChange={(field, value) =>
                onInputChange(`${path}[${index}].section13A6.${field}`, value)
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold">
        Section 13A - Employment Activities
      </h3>

      {employmentInfo.map((entry, index) => {
        return (
          <div key={entry._id} className="space-y-2">
            <div className="flex items-center space-x-4">
              <label htmlFor={`employmentActivity-${index}`} className="mr-2">
                Select your employment activity:
              </label>
              <select
                id={`employmentActivity-${index}`}
                defaultValue={entry.employmentActivity}
                onChange={(e) => {
                  console.log(`${path}[${index}].employmentActivity`, "SLVNEV");
                  onInputChange(
                    `${path}[${index}].employmentActivity`,
                    e.target.value
                  );

                  console.log(
                    employmentInfo[index].employmentActivity,
                    "employmentActivity"
                  );
                }}
                disabled={isReadOnlyField(
                  `${path}[${index}].employmentActivity`
                )}
                className="p-2 border rounded"
              >
                <option value="none" disabled>
                  Select an activity
                </option>
                <option value="activeMilitaryDutyStation">
                  Active military duty station
                </option>
                <option value="nationalGuardReserve">
                  National Guard/Reserve
                </option>
                <option value="usphsCommissionedCorps">
                  USPHS Commissioned Corps
                </option>
                <option value="otherFederalEmployment">
                  Other Federal employment
                </option>
                <option value="stateGovernment">State Government</option>
                <option value="nonGovernmentEmployment">
                  Non-government employment
                </option>
                <option value="selfEmployment">Self-employment</option>
                <option value="unemployment">Unemployment</option>
                <option value="federalContractor">Federal Contractor</option>
                <option value="other">Other</option>
              </select>
            </div>

            {renderEmploymentSections(entry, index)}

            <button
              onClick={(event) => {
                event.preventDefault();
                onRemoveEntry(`${path}`, index);
              }}
              className="mt-4 p-2 bg-red-500 text-white rounded-md shadow"
            >
              Remove Entry
            </button>
          </div>
        );
      })}

      <button
        onClick={(event) => {
          event.preventDefault();
          onAddEntry(`${path}`, getDefaultNewItem(`employmentInfo`));
        }}
        className="mt-4 p-2 bg-green-500 text-white rounded-md shadow"
      >
        Add Entry
      </button>
    </div>
  );
};

export { RenderEmploymentInfo };
