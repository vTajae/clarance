import React from "react";
import FormInfo from "api_v2/interfaces/FormInfo";
import {
  APOOrFPODetails,
  ApplicantResidency,
  Phone,
} from "api_v2/interfaces/Residency";

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
  const handleAddEntry = () => {
    onAddEntry(path, getDefaultNewItem("residencyInfo"));
  };

  const handleRemoveEntry = (index: number) => {
    onRemoveEntry(path, index);
  };

  if (data.length === 0) {
    data.push(getDefaultNewItem("residencyInfo"));
  }

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

  const renderAPOOrFPODetails = (
    details: APOOrFPODetails,
    index: number
  ) =>
    details && (
      <div className="space-y-2">
        <label htmlFor={`apoAddressUnit-${index}`} className="block">
          APO/FPO Address:
        </label>
        <input
          type="text"
          id={`apoAddressUnit-${index}`}
          value={details.addressUnitOrDutyLocation}
          placeholder="Address Unit or Duty Location"
          onChange={(e) =>
            onInputChange(
              `${path}[${index}].residenceAddress.APOOrFPODetails.addressUnitOrDutyLocation`,
              e.target.value
            )
          }
          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
        />

        <input
          type="text"
          id={`apoCity-${index}`}
          value={details.cityOrPostName}
          placeholder="City or Post Name"
          onChange={(e) =>
            onInputChange(
              `${path}[${index}].residenceAddress.APOOrFPODetails.cityOrPostName`,
              e.target.value
            )
          }
          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
        />

        <input
          type="text"
          id={`apoState-${index}`}
          value={details.state}
          placeholder="State"
          onChange={(e) =>
            onInputChange(
              `${path}[${index}].residenceAddress.APOOrFPODetails.state`,
              e.target.value
            )
          }
          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
        />

        <input
          type="text"
          id={`apoZip-${index}`}
          value={details.zip}
          placeholder="Zip"
          onChange={(e) =>
            onInputChange(
              `${path}[${index}].residenceAddress.APOOrFPODetails.zip`,
              e.target.value
            )
          }
          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
        />

        <input
          type="text"
          id={`apoCountry-${index}`}
          value={details.country}
          placeholder="Country"
          onChange={(e) =>
            onInputChange(
              `${path}[${index}].residenceAddress.APOOrFPODetails.country`,
              e.target.value
            )
          }
          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
        />
      </div>
    );

  const ResidentData = data as ApplicantResidency[];
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold">
        Section 11 - Where You Have Lived
      </h3>

      {ResidentData.map((residency, index) => (
        <div key={index} className="space-y-2">
          <h4 className="text-md font-semibold">Entry #{index + 1}</h4>

          <label htmlFor={`residenceStartDate-${index}`} className="block">
            Provide dates of residence:
          </label>
          <input
            type="text"
            id={`residenceStartDate-${index}`}
            value={residency.residenceStartDate}
            placeholder="From Date (Month/Year)"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].residenceStartDate`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <label
            htmlFor={`residenceStartDateEst-${index}`}
            className="inline-flex items-center ml-2"
          >
            <input
              type="checkbox"
              id={`residenceStartDateEst-${index}`}
              checked={residency.isStartDateEst}
              onChange={(e) =>
                onInputChange(
                  `${path}[${index}].isStartDateEst`,
                  e.target.checked
                )
              }
              className="mr-2"
            />
            Est.
          </label>
          <input
            type="text"
            id={`residenceEndDate-${index}`}
            value={residency.residenceEndDate}
            placeholder="To Date (Month/Year)"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].residenceEndDate`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <label
            htmlFor={`residenceEndDateEst-${index}`}
            className="inline-flex items-center ml-2"
          >
            <input
              type="checkbox"
              id={`residenceEndDateEst-${index}`}
              checked={residency.isResidenceEndEst}
              onChange={(e) =>
                onInputChange(
                  `${path}[${index}].isResidenceEndEst`,
                  e.target.checked
                )
              }
              className="mr-2"
            />
            Est.
          </label>

          <label
            htmlFor={`residencePresent-${index}`}
            className="inline-flex items-center ml-2"
          >
            <input
              type="checkbox"
              id={`residencePresent-${index}`}
              checked={residency.isResidencePresent}
              onChange={(e) =>
                onInputChange(
                  `${path}[${index}].isResidencePresent`,
                  e.target.checked
                )
              }
              className="mr-2"
            />
            Present
          </label>

          <p className="block">Is/was this residence:</p>
          <div className="flex space-x-2">
            <label
              htmlFor={`residenceStatusOwned-${index}`}
              className="inline-flex items-center"
            >
              <input
                type="radio"
                id={`residenceStatusOwned-${index}`}
                name={`residenceStatus-${index}`}
                value="Owned"
                checked={residency.residenceStatus === "Owned"}
                onChange={(e) =>
                  onInputChange(
                    `${path}[${index}].residenceStatus`,
                    e.target.value
                  )
                }
                className="mr-2"
              />
              Owned by you
            </label>
            <label
              htmlFor={`residenceStatusRented-${index}`}
              className="inline-flex items-center"
            >
              <input
                type="radio"
                id={`residenceStatusRented-${index}`}
                name={`residenceStatus-${index}`}
                value="Rented"
                checked={residency.residenceStatus === "Rented"}
                onChange={(e) =>
                  onInputChange(
                    `${path}[${index}].residenceStatus`,
                    e.target.value
                  )
                }
                className="mr-2"
              />
              Rented or leased by you
            </label>
            <label
              htmlFor={`residenceStatusMilitary-${index}`}
              className="inline-flex items-center"
            >
              <input
                type="radio"
                id={`residenceStatusMilitary-${index}`}
                name={`residenceStatus-${index}`}
                value="Military housing"
                checked={residency.residenceStatus === "Military housing"}
                onChange={(e) =>
                  onInputChange(
                    `${path}[${index}].residenceStatus`,
                    e.target.value
                  )
                }
                className="mr-2"
              />
              Military housing
            </label>
            <label
              htmlFor={`residenceStatusOther-${index}`}
              className="inline-flex items-center"
            >
              <input
                type="radio"
                id={`residenceStatusOther-${index}`}
                name={`residenceStatus-${index}`}
                value="Other"
                checked={residency.residenceStatus === "Other"}
                onChange={(e) =>
                  onInputChange(
                    `${path}[${index}].residenceStatus`,
                    e.target.value
                  )
                }
                className="mr-2"
              />
              Other
            </label>
          </div>
          {residency.residenceStatus === "Other" && (
            <input
              type="text"
              id={`residenceOtherDetails-${index}`}
              value={residency.residenceOtherDetails}
              placeholder="Provide explanation"
              onChange={(e) =>
                onInputChange(
                  `${path}[${index}].residenceOtherDetails`,
                  e.target.value
                )
              }
              className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
            />
          )}

          <label htmlFor={`residenceAddressStreet-${index}`} className="block">
            Provide the street address:
          </label>
          <input
            type="text"
            id={`residenceAddressStreet-${index}`}
            value={residency.residenceAddress.street}
            placeholder="Street"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].residenceAddress.street`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <input
            type="text"
            id={`residenceAddressCity-${index}`}
            value={residency.residenceAddress.city}
            placeholder="City"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].residenceAddress.city`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <input
            type="text"
            id={`residenceAddressState-${index}`}
            value={residency.residenceAddress.state}
            placeholder="State"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].residenceAddress.state`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <input
            type="text"
            id={`residenceAddressZip-${index}`}
            value={residency.residenceAddress.zip}
            placeholder="Zip"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].residenceAddress.zip`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <input
            type="text"
            id={`residenceAddressCountry-${index}`}
            value={residency.residenceAddress.country}
            placeholder="Country"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].residenceAddress.country`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />

          {residency.residenceAddress.hasAPOOrFPO &&
            renderAPOOrFPODetails(
              residency.residenceAddress.APOOrFPODetails,
              index
            )}

          <label htmlFor={`contactLastName-${index}`} className="block">
            Provide the contact information:
          </label>
          <input
            type="text"
            id={`contactLastName-${index}`}
            value={residency.contact.lastname}
            placeholder="Last Name"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].contact.lastname`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <input
            type="text"
            id={`contactFirstName-${index}`}
            value={residency.contact.firstname}
            placeholder="First Name"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].contact.firstname`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <input
            type="text"
            id={`contactMiddleName-${index}`}
            value={residency.contact.middlename}
            placeholder="Middle Name"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].contact.middlename`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <input
            type="text"
            id={`contactSuffix-${index}`}
            value={residency.contact.suffix}
            placeholder="Suffix"
            onChange={(e) =>
              onInputChange(`${path}[${index}].contact.suffix`, e.target.value)
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />

          <label htmlFor={`lastContactDate-${index}`} className="block">
            Last Contact Date:
          </label>
          <input
            type="text"
            id={`lastContactDate-${index}`}
            value={residency.contact.lastContactDate}
            placeholder="Month/Year"
            onChange={(e) =>
              onInputChange(
                `${path}[${index}].contact.lastContactDate`,
                e.target.value
              )
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />
          <label
            htmlFor={`lastContactEst-${index}`}
            className="inline-flex items-center ml-2"
          >
            <input
              type="checkbox"
              id={`lastContactEst-${index}`}
              checked={residency.contact.isLastContactEst}
              onChange={(e) =>
                onInputChange(
                  `${path}[${index}].contact.isLastContactEst`,
                  e.target.checked
                )
              }
              className="mr-2"
            />
            Est.
          </label>

          <label htmlFor={`relationship-${index}`} className="block">
            Relationship:
          </label>
          {/* <div className="flex flex-wrap space-x-2">
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
          </div> */}
          {/* {residency.contact.relationship.includes("Other") && (
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
          )} */}

          <label htmlFor={`contactEmail-${index}`} className="block">
            Email:
          </label>
          <input
            type="email"
            id={`contactEmail-${index}`}
            value={residency.contact.email}
            placeholder="Email"
            onChange={(e) =>
              onInputChange(`${path}[${index}].contact.email`, e.target.value)
            }
            className="mt-1 p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
          />

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

      {ResidentData.length < 4 && (
        <button
          onClick={handleAddEntry}
          className="mt-4 p-2 bg-green-500 text-white rounded-md shadow"
        >
          Add Entry
        </button>
      )}
    </div>
  );
};

export { RenderResidencyInfo };
