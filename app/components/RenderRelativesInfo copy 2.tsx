import React, { useState } from "react";
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

console.log(data, "data in RenderRelativesInfo");

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

    if (data.relativeTypes.length === 1) {
      onAddEntry(`${path}.entries`, getDefaultNewItem("relativesInfo.entries"));
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


    console.log(necessarySections, "necessarySections")
    necessarySections.forEach((section) => {
      if (!currentDetails[section]) {
        currentDetails[section] = getDefaultNewItem(`relativesInfo.entries.details.${section}`);
      }
    });

    handleInputChange(`${path}.entries[${index}].type`, event);
    onInputChange(
      `${path}.entries[${relativeIndex}]`,
      updatedData.entries[relativeIndex]
    );
  };

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
              <div>
                <label htmlFor={`fullName-${entry._id}-firstName`}>
                  <strong>First Name:</strong>
                </label>
                <input
                  type="text"
                  id={`fullName-${entry._id}-firstName`}
                  value={entry.fullName.firstName}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].fullName.firstName`,
                      e.target.value
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].fullName.firstName`
                  )}
                />
                <label htmlFor={`fullName-${entry._id}-middleName`}>
                  <strong>Middle Name:</strong>
                </label>
                <input
                  type="text"
                  id={`fullName-${entry._id}-middleName`}
                  value={entry.fullName.middleName}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].fullName.middleName`,
                      e.target.value
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].fullName.middleName`
                  )}
                />
                <label htmlFor={`fullName-${entry._id}-lastName`}>
                  <strong>Last Name:</strong>
                </label>
                <input
                  type="text"
                  id={`fullName-${entry._id}-lastName`}
                  value={entry.fullName.lastName}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].fullName.lastName`,
                      e.target.value
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].fullName.lastName`
                  )}
                />
              </div>
              <div>
                <label htmlFor={`dateOfBirth-${entry._id}`}>
                  <strong>Date of Birth:</strong>
                </label>
                <input
                  type="text"
                  id={`dateOfBirth-${entry._id}`}
                  value={entry.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].dateOfBirth`,
                      e.target.value
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].dateOfBirth`
                  )}
                />
              </div>
              <div>
                <label htmlFor={`placeOfBirth-${entry._id}-city`}>
                  <strong>Place of Birth - City:</strong>
                </label>
                <input
                  type="text"
                  id={`placeOfBirth-${entry._id}-city`}
                  value={entry.placeOfBirth.city}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].placeOfBirth.city`,
                      e.target.value
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].placeOfBirth.city`
                  )}
                />
                {entry.placeOfBirth.state && (
                  <>
                    <label htmlFor={`placeOfBirth-${entry._id}-state`}>
                      <strong>State:</strong>
                    </label>
                    <input
                      type="text"
                      id={`placeOfBirth-${entry._id}-state`}
                      value={entry.placeOfBirth.state}
                      onChange={(e) =>
                        handleInputChange(
                          `${path}.entries[${index}].placeOfBirth.state`,
                          e.target.value
                        )
                      }
                      disabled={isReadOnlyField(
                        `${path}.entries[${index}].placeOfBirth.state`
                      )}
                    />
                  </>
                )}
                <label htmlFor={`placeOfBirth-${entry._id}-country`}>
                  <strong>Country:</strong>
                </label>
                <input
                  type="text"
                  id={`placeOfBirth-${entry._id}-country`}
                  value={entry.placeOfBirth.country}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].placeOfBirth.country`,
                      e.target.value
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].placeOfBirth.country`
                  )}
                />
              </div>
              <div>
                <label htmlFor={`countriesOfCitizenship-${entry._id}`}>
                  <strong>Countries of Citizenship:</strong>
                </label>
                {entry.countriesOfCitizenship.map((country, i) => (
                  <input
                    key={country._id}
                    type="text"
                    value={country.country}
                    onChange={(e) =>
                      handleInputChange(
                        `${path}.entries[${index}].countriesOfCitizenship[${i}].country`,
                        e.target.value
                      )
                    }
                    disabled={isReadOnlyField(
                      `${path}.entries[${index}].countriesOfCitizenship[${i}].country`
                    )}
                  />
                ))}
              </div>
              <div>
                <label htmlFor={`isDeceased-${entry._id}`}>
                  <strong>Deceased:</strong>
                </label>
                <input
                  type="checkbox"
                  id={`isDeceased-${entry._id}`}
                  checked={entry.isDeceased}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].isDeceased`,
                      e.target.checked
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].isDeceased`
                  )}
                />
              </div>
              <div>
                <label htmlFor={`isUSCitizen-${entry._id}`}>
                  <strong>U.S. Citizen:</strong>
                </label>
                <input
                  type="checkbox"
                  id={`isUSCitizen-${entry._id}`}
                  checked={entry.isUSCitizen}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].isUSCitizen`,
                      e.target.checked
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].isUSCitizen`
                  )}
                />
              </div>
              <div>
                <label htmlFor={`hasForeignAddress-${entry._id}`}>
                  <strong>Has Foreign Address:</strong>
                </label>
                <input
                  type="checkbox"
                  id={`hasForeignAddress-${entry._id}`}
                  checked={entry.hasForeignAddress}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].hasForeignAddress`,
                      e.target.checked
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].hasForeignAddress`
                  )}
                />
              </div>
              <div>
                <label htmlFor={`hasUSAddress-${entry._id}`}>
                  <strong>Has U.S. Address:</strong>
                </label>
                <input
                  type="checkbox"
                  id={`hasUSAddress-${entry._id}`}
                  checked={entry.hasUSAddress}
                  onChange={(e) =>
                    handleInputChange(
                      `${path}.entries[${index}].hasUSAddress`,
                      e.target.checked
                    )
                  }
                  disabled={isReadOnlyField(
                    `${path}.entries[${index}].hasUSAddress`
                  )}
                />
              </div>
            </div>
          </div>

          {entry.details.section18_1 && (
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
          )}
        </div>
      ))}
    </div>
  );
};

export { RenderRelativesInfo };
