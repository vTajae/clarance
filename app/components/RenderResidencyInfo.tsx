import React from "react";
import FormInfo from "api_v2/interfaces/FormInfo";
import { ApplicantResidency, Phone } from "api_v2/interfaces/Residency";

interface FormProps {
  data: ApplicantResidency[];
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

const RenderResidencyInfo: React.FC<FormProps> = ({
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
  const handleRemoveEntry = (index: number) => {
    return onRemoveEntry(path, index);
  };

  const renderPhoneSection = (
    phone: Phone,
    index: number,
    phoneIndex: number
  ) => (
    <div key={phoneIndex} className="space-y-2">
      <h4 className="text-md font-semibold">Phone Entry #{phoneIndex + 1}</h4>

      <label htmlFor={`phoneType-${index}-${phoneIndex}`} className="block">
        Phone Type:
      </label>

      <select
        id={`phoneType-${index}-${phoneIndex}`}
        value={phone.type}
        onChange={(e) =>
          onInputChange(
            `${path}[${index}].contact.phone[${phoneIndex}].type`,
            e.target.value
          )
        }
        className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
      >
        <option value="Evening">Evening</option>
        <option value="Daytime">Daytime</option>
        <option value="Cell/mobile">Cell/mobile</option>
      </select>

      <label htmlFor={`knowsNumber-${index}-${phoneIndex}`} className="block">
        Knows Number:
      </label>
      <input
        type="checkbox"
        id={`knowsNumber-${index}-${phoneIndex}`}
        checked={phone.knowsNumber}
        onChange={(e) =>
          onInputChange(
            `${path}[${index}].contact.phone[${phoneIndex}].knowsNumber`,
            e.target.checked
          )
        }
        className="mt-1 mr-2"
      />

      <label
        htmlFor={`isInternationalOrDSN-${index}-${phoneIndex}`}
        className="block"
      >
        International or DSN:
      </label>
      <input
        type="checkbox"
        id={`isInternationalOrDSN-${index}-${phoneIndex}`}
        checked={phone.isInternationalOrDSN}
        onChange={(e) =>
          onInputChange(
            `${path}[${index}].contact.phone[${phoneIndex}].isInternationalOrDSN`,
            e.target.checked
          )
        }
        className="mt-1 mr-2"
      />

      <label htmlFor={`phoneNumber-${index}-${phoneIndex}`} className="block">
        Phone Number:
      </label>
      <input
        type="text"
        id={`phoneNumber-${index}-${phoneIndex}`}
        value={phone.number}
        onChange={(e) =>
          onInputChange(
            `${path}[${index}].contact.phone[${phoneIndex}].number`,
            e.target.value
          )
        }
        className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
      />

      <label
        htmlFor={`phoneExtension-${index}-${phoneIndex}`}
        className="block"
      >
        Extension:
      </label>
      <input
        type="text"
        id={`phoneExtension-${index}-${phoneIndex}`}
        value={phone.extension}
        onChange={(e) =>
          onInputChange(
            `${path}[${index}].contact.phone[${phoneIndex}].extension`,
            e.target.value
          )
        }
        className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
      />
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold">
        Section 11 - Where You Have Lived
      </h3>

      {data.map((residency, index) => (
        <div key={residency._id} className="space-y-2">
          <h4 className="text-md font-semibold">Entry #{index + 1}</h4>

          <label htmlFor={`relationship-${index}`} className="block">
            Relationship:
          </label>
          <div className="flex flex-wrap space-x-2">
            {[
              "Neighbor",
              "Friend",
              "Landlord",
              "Business associate",
              "Other",
            ].map((relation) => (
              <label
                key={relation}
                htmlFor={`relationship-${index}-${relation}`}
                className="inline-flex items-center"
              >
                <input
                  type="checkbox"
                  id={`relationship-${index}-${relation}`}
                  value={relation}
                  checked={residency.contact.relationship.includes(relation)}
                  onChange={(e) => {
                    const newRelations = [...residency.contact.relationship];
                    if (e.target.checked) {
                      newRelations.push(relation);
                    } else {
                      const relIndex = newRelations.indexOf(relation);
                      newRelations.splice(relIndex, 1);
                    }
                    onInputChange(
                      `${path}[${index}].contact.relationship`,
                      newRelations
                    );
                  }}
                  className="mr-2"
                />
                {relation}
              </label>
            ))}
          </div>

          {residency.contact.relationship.includes("Other") && (
            <input
              type="text"
              id={`relationshipOtherDetail-${index}`}
              value={residency.contact.relationshipOtherDetail}
              placeholder="Provide explanation"
              onChange={(e) =>
                onInputChange(
                  `${path}[${index}].contact.relationshipOtherDetail`,
                  e.target.value
                )
              }
              className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
            />
          )}

          {residency.contact.phone.map((phone, phoneIndex) =>
            renderPhoneSection(phone, index, phoneIndex)
          )}

          {residency.contact.phone.length < 3 && (
            <button
              onClick={() =>
                onAddEntry(
                  `${path}[${index}].contact.phone`,
                  getDefaultNewItem("residencyInfo.contact.phone")
                )
              }
              className="mt-2 p-2 bg-blue-500 text-white rounded-md shadow"
            >
              Add Phone
            </button>
          )}

          <button
            onClick={() => handleRemoveEntry(index)}
            className="mt-2 p-2 bg-red-500 text-white rounded-md shadow"
          >
            Remove Entry
          </button>
        </div>
      ))}

      {data.length < 4 && (
        <button
          onClick={(event) => {
            event.preventDefault();
            onAddEntry(path, getDefaultNewItem("residencyInfo"));
          }}
          className="mt-4 p-2 bg-green-500 text-white rounded-md shadow"
        >
          Add Entry
        </button>
      )}
    </div>
  );
};

export { RenderResidencyInfo };
