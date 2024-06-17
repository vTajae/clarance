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

  const renderSection = (entry: EmploymentInfo, index: number) => {
    const commonSections = [
      "activeMilitaryDutyStation",
      "nationalGuardReserve",
      "usphsCommissionedCorps",
      "otherFederalEmployment",
      "stateGovernment",
      "nonGovernmentEmployment",
      "selfEmployment",
      "federalContractor",
    ];

    const completeSection13A2 = [
      "otherFederalEmployment",
      "stateGovernment",
      "nonGovernmentEmployment",
      "federalContractor",
      "other",
    ];

    console.log("entry value", entry.employmentActivity.toString());
    console.log("entry", entry);

    return (
      <>

        {[
          "activeMilitaryDutyStation",
          "nationalGuardReserve",
          "usphsCommissionedCorps",
        ].includes(entry.employmentActivity.toString()) &&
          entry.section13A1 && (
            <RenderSection13A1
              data={entry.section13A1}
              onInputChange={onInputChange}
              path={`${path}[${index}].section13A1`}
              isReadOnlyField={isReadOnlyField}
            />
          )}

        {completeSection13A2.includes(entry.employmentActivity.toString()) &&
          entry.section13A2 && (
            <RenderSection13A2
              data={entry.section13A2}
              onInputChange={onInputChange}
              path={`${path}[${index}].section13A2`}
              isReadOnlyField={isReadOnlyField}
            />
          )}

        {entry.employmentActivity.toString() === "selfEmployment" &&
          entry.section13A3 && (
            <RenderSection13A3
              data={entry.section13A3}
              onInputChange={onInputChange}
              path={`${path}[${index}].section13A3`}
              isReadOnlyField={isReadOnlyField}
            />
          )}

        {entry.employmentActivity.toString() === "unemployment" &&
          entry.section13A4 && (
            <RenderSection13A4
              data={entry.section13A4}
              onInputChange={onInputChange}
              path={`${path}[${index}].section13A4`}
              isReadOnlyField={isReadOnlyField}
            />
          )}

        {commonSections.includes(entry.employmentActivity.toString()) && (
          <>
            {entry.section13A5 && (
              <RenderSection13A5
                data={entry.section13A5}
                onInputChange={onInputChange}
                path={`${path}[${index}].section13A5`}
                isReadOnlyField={isReadOnlyField}
              />
            )}
            {entry.section13A6 && (
              <RenderSection13A6
                data={entry.section13A6}
                onInputChange={onInputChange}
                path={`${path}[${index}].section13A6`}
                isReadOnlyField={isReadOnlyField}
              />
            )}
          </>
        )}

      </>
    );
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold">
        Section 13A - Employment Activities
      </h3>

      {employmentInfo.map((entry, index) => {
        // console.log("entry value", entry.employmentActivity);
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center space-x-4">
              <label htmlFor={`employmentActivity-${index}`} className="mr-2">
                Select your employment activity:
              </label>
              <select
                id={`employmentActivity-${index}`}
                defaultValue={""}
                onChange={(e) => {
                  onInputChange(
                    `${path}[${index}].employmentActivity`,
                    e.target.value
                  );
                }}
                disabled={isReadOnlyField(
                  `${path}[${index}].employmentActivity`
                )}
                className="p-2 border rounded"
              >
                <option value="" disabled>
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

            {renderSection(entry, index)}

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
