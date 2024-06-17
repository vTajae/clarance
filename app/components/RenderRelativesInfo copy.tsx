import React, { useState, useEffect } from "react";
import { RenderSection18_1 } from "./_relatives/Section18.1";
import { RenderSection18_2 } from "./_relatives/Section18.2";
import { RenderSection18_3 } from "./_relatives/Section18.3";
import { RenderSection18_4 } from "./_relatives/Section18.4";
import { RenderSection18_5 } from "./_relatives/Section18.5";
import pkg from "lodash";
import {
  RelativeEntry,
  RelativesInfo,
  RelativeCheckbox,
  RelativeType,
  RelativeDetails,
} from "api_v2/interfaces/relativesInfo";
import FormInfo from "api_v2/interfaces/FormInfo";

interface FormProps {
  data: RelativesInfo;
  onInputChange: (path: string, value: any) => void;
  onAddEntry: (path: string, newItem: any) => void;
  onRemoveEntry: (path: string, index: number) => void;
  getDefaultNewItem: (itemType: string) => any;
  isReadOnlyField: (fieldName: string) => boolean;
  path: string;
  formInfo: FormInfo;
}

const relativeTypesList: RelativeType[] = [
  "Mother",
  "Foster Parent",
  "Sister",
  "Half-Sister",
  "Father",
  "Child",
  "Stepbrother",
  "Father-in-law",
  "Stepmother",
  "Stepchild",
  "Stepsister",
  "Mother-in-law",
  "Stepfather",
  "Brother",
  "Half-Brother",
  "Guardian",
];

const RenderRelativesInfo: React.FC<FormProps> = ({
  data,
  onInputChange,
  onAddEntry,
  onRemoveEntry,
  getDefaultNewItem,
  isReadOnlyField,
  path,
}) => {
  const { cloneDeep } = pkg;
  const [selectedRelativeTypes, setSelectedRelativeTypes] = useState<
    RelativeCheckbox[]
  >(data.relativeTypes || []);

  const handleInputChange = (fieldPath: string, value: any) => {
    onInputChange(fieldPath, value);
  };

  const handleCheckboxChange = (type: RelativeType) => {
    const updatedSelectedTypes = selectedRelativeTypes.some(
      (item) => item.type === type
    )
      ? selectedRelativeTypes.filter((item) => item.type !== type)
      : [...selectedRelativeTypes, { _id: new Date().getTime(), type }];

    setSelectedRelativeTypes(updatedSelectedTypes);
    onInputChange(`${path}.relativeTypes`, updatedSelectedTypes);


    if (updatedSelectedTypes.length === 1) {
      const newEntry = getDefaultNewItem("relativesInfo.entries");
      newEntry.type = type;
      onAddEntry(`${path}.entries`, newEntry);
    } else {
      const existingEntryIndex = data.entries.findIndex(
        (entry) => entry.type === type
      );
      if (existingEntryIndex !== -1) {
        handleRelativeChange(
          data.entries[existingEntryIndex]._id,
          type,
          existingEntryIndex
        );
      } else {
        const newEntry = getDefaultNewItem("relativesInfo.entries");
        newEntry.type = type;
        onAddEntry(`${path}.entries`, newEntry);
      }
    }

  };

  const getSectionsBasedOnRelative = (relative: RelativeEntry) => {
    const sections: (keyof RelativeDetails)[] = [];

    if (relative.isDeceased) {
      sections.push("section18_3");
    } else {
      sections.push("section18_1");
      if (relative.isUSCitizen && relative.hasUSAddress) {
        sections.push("section18_2", "section18_3");
      }
      if (!relative.isUSCitizen && relative.hasUSAddress) {
        sections.push("section18_4");
      }
      if (!relative.isUSCitizen && relative.hasForeignAddress) {
        sections.push("section18_5");
      }
    }

    return sections;
  };

  const handleRelativeChange = (
    relativeId: number,
    event: string,
    index: number
  ) => {
    const relative = data.entries.find((entry) => entry._id === relativeId);
    if (!relative) {
      console.error("Relative not found");
      return;
    }

    relative.type = event;

    const necessarySections = getSectionsBasedOnRelative(relative);
    const updatedData = cloneDeep(data);

    const relativeIndex = updatedData.entries.findIndex(
      (entry) => entry._id === relativeId
    );
    if (relativeIndex === -1) {
      console.error("Relative not found in cloned data");
      return;
    }

    const currentDetails = updatedData.entries[relativeIndex].details;
    Object.keys(currentDetails).forEach((key) => {
      if (
        key.startsWith("section18") &&
        !necessarySections.includes(key as keyof RelativeDetails)
      ) {
        delete currentDetails[key as keyof RelativeDetails];
      }
    });

    necessarySections.forEach((section) => {
      if (!currentDetails[section]) {
        currentDetails[section] = getDefaultNewItem(
          `relativesInfo.entries.details.${section}`
        );
      }
    });

    console.log(necessarySections, "necessarySections");

    handleInputChange(`${path}.entries[${index}].type`, event);
    onInputChange(
      `${path}.entries[${relativeIndex}]`,
      updatedData.entries[relativeIndex]
    );
  };

  console.log(data, "Data in RenderRelativesInfo");
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold">Section 18 - Relatives</h3>
      <div className="space-y-2">
        <div className="flex flex-col space-y-4">
          <label htmlFor={`relativeTypes`} className="mr-2">
            Select each type of relative applicable to you, regardless if they
            are living or deceased. (An opportunity will be provided to list
            multiple relatives for each type.) Check all that apply.
          </label>
          {relativeTypesList.map((type) => (
            <div key={type}>
              <input
                type="checkbox"
                id={`relativeType_${type}`}
                name={`relativeType_${type}`}
                value={type}
                checked={selectedRelativeTypes.some(
                  (item) => item.type === type
                )}
                onChange={() => handleCheckboxChange(type)}
                disabled={isReadOnlyField(`${path}.relativeTypes`)}
              />
              <label htmlFor={`relativeType_${type}`}>{type}</label>
            </div>
          ))}
        </div>
      </div>

      {data.entries.map((entry, index) => (
        <div key={entry._id} className="relative-entry space-y-2">
          <h3 className="text-lg font-semibold">Section 18 - Relatives</h3>
          <div className="space-y-2">
            <div className="relative-details space-y-2">
              <div>
                <label htmlFor={`type-${entry._id}`}>
                  <strong>Type:</strong>
                </label>
                <select
                  id={`type-${entry._id}`}
                  value={entry.type}
                  onChange={(e) => {
                    handleRelativeChange(entry._id, e.target.value, index);
                  }}
                  disabled={isReadOnlyField(`${path}.entries[${index}].type`)}
                >
                  {data.relativeTypes.map((relType) => (
                    <option key={relType._id} value={relType.type}>
                      {relType.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>{/* Additional fields here */}</div>
            </div>
          </div>

          {/* {entry.details.section18_1 && (
            <RenderSection18_1
              data={entry.details.section18_1}
              onInputChange={(path, value) => {
                handleInputChange(`${path}`, value);
              }}
              path={`${path}.entries[${index}].details.section18_1`}
              isReadOnlyField={isReadOnlyField}
            />
          )}
          {entry.details.section18_2 && (
            <RenderSection18_2
              data={entry.details.section18_2}
              onInputChange={(path, value) => {
                handleInputChange(`${path}`, value);
              }}
              path={`${path}.entries[${index}].details.section18_2`}
              isReadOnlyField={isReadOnlyField}
            />
          )}
          {entry.details.section18_3 && (
            <RenderSection18_3
              data={entry.details.section18_3}
              onInputChange={(path, value) => {
                handleInputChange(`${path}`, value);
              }}
              path={`${path}.entries[${index}].details.section18_3`}
              isReadOnlyField={isReadOnlyField}
            />
          )}
          {entry.details.section18_4 && (
            <RenderSection18_4
              data={entry.details.section18_4}
              onInputChange={(path, value) => {
                handleInputChange(`${path}`, value);
              }}
              path={`${path}.entries[${index}].details.section18_4`}
              isReadOnlyField={isReadOnlyField}
            />
          )}
          {entry.details.section18_5 && (
            <RenderSection18_5
              data={entry.details.section18_5}
              onInputChange={(path, value) => {
                handleInputChange(`${path}`, value);
              }}
              path={`${path}.entries[${index}].details.section18_5`}
              isReadOnlyField={isReadOnlyField}
            />
          )} */}
        </div>
      ))}
    </div>
  );
};

export { RenderRelativesInfo };
