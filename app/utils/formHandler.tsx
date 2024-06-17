import React, { useState } from "react";
import lodash, { has } from "lodash";
import { useEmployee } from "~/state/contexts/new-context";
import { ApplicantFormValues } from "~/components/form86/lastTry/formDefinition";
import { RenderBasicInfo } from "../components/RenderBasicInfo";
import { RenderBirthInfo } from "../components/RenderBirthInfo";
import { RenderAcknowledgementInfo } from "../components/RenderAcknowledgementInfo";
import { RenderNames } from "../components/RenderNames";
import FormInfo from "api_v2/interfaces/FormInfo";
import { goToStep, selectCurrentStep } from "../state/user/formSice";
import StepperFooter from "../components/form86/samples/stepperFooter";
import { useDispatch, useTypedSelector } from "~/state/hooks/user";
import { RenderPhysicalsInfo } from "~/components/RenderPhysicals";
import { RenderContactInfo } from "~/components/RenderContactInfo";
import { RenderPassportInfo } from "~/components/RenderPassportInfo";
import { RenderCitizenshipInfo } from "~/components/RenderCitizenshipInfo";
import { RenderDualCitizenshipInfo } from "~/components/RenderDuelCitizenship";
import { RenderResidencyInfo } from "~/components/RenderResidencyInfo";
import { RenderSchoolInfo } from "~/components/RenderSchoolInfo";
import { RenderEmploymentInfo } from "~/components/RenderEmployementInfo";
import { RenderServiceInfo } from "~/components/RenderServiceInfo";
import { RenderMilitaryInfo } from "~/components/RenderMilitaryInfo";
import { RenderPeopleThatKnow } from "~/components/RenderPeopleThatKnow";
import { RenderRelationshipInfo } from "~/components/RenderRelationshipInfo";
import { RenderRelativesInfo } from "~/components/RenderRelativesInfo";

const { set, get, cloneDeep, merge } = lodash;

interface DynamicFormProps {
  data: ApplicantFormValues;
  onChange: (data: ApplicantFormValues) => void;
  FormInfo: FormInfo;
}

const DynamicForm3: React.FC<DynamicFormProps> = ({
  data,
  onChange,
  FormInfo,
}) => {
  const [formData, setFormData] = useState<ApplicantFormValues>(
    cloneDeep(data)
  );
  const dispatch = useDispatch();
  const currentStep = useTypedSelector(selectCurrentStep);

  const { updateField } = useEmployee();

  const formSections = Object.keys(formData);

  const handleInputChange = (path: string, value: any) => {
    // console.log("Before update:", { ...formData.employmentInfo });
    const updatedFormData = set({ ...formData }, path, value);
    // console.log("After update:", updatedFormData.employmentInfo);
    setFormData(updatedFormData);
    onChange(updatedFormData);
    updateField(path, value);
  };

  const isValidValue = (path: string, value: any): boolean => {
    // Reject undefined or null values
    if (value === undefined || value === null) {
      return false;
    }

    // Reject empty strings
    if (typeof value === "string" && value.trim() === "") {
      return false;
    }

    // Specific validation for employee_description to not exceed 255 characters
    if (path.endsWith("employee_description") && value.length > 255) {
      return false;
    }

    // Check for arrays being empty
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    // Ensure objects are not empty (excluding arrays)
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return false;
    }

    return true;
  };

  const handleAddEntry = (path: string, updatedItem: any) => {
    const updatedFormData = cloneDeep(formData);
    const currentData = get(updatedFormData, path);

    console.log(`Path: ${path}`);
    console.log(`Current Data before push: ${JSON.stringify(currentData)}`);
    console.log(`Updated Item to be added: ${JSON.stringify(updatedItem)}`);

    if (Array.isArray(currentData)) {
      console.log("THIS IS AN ARRAY");

      // Ensure updatedItem is not an array itself
      const itemToPush = Array.isArray(updatedItem)
        ? updatedItem[0]
        : updatedItem;

      console.log(`Item to be pushed: ${JSON.stringify(itemToPush)}`);

      // Push the itemToPush into the currentData array
      currentData.push(itemToPush);
      set(updatedFormData, path, currentData);

      console.log(`Current Data after push: ${JSON.stringify(currentData)}`);
    } else {
      // If currentData is an object or undefined, set or merge the updatedItem
      const mergedData = merge(currentData || {}, updatedItem);
      set(updatedFormData, path, mergedData);
    }

    setFormData(updatedFormData);
    onChange(updatedFormData);
    updateField(path, updatedItem);
  };

  const handleRemoveEntry = (path: string, index: number) => {
    const updatedFormData = cloneDeep(formData);
    const list = get(updatedFormData, path, []);
    if (list && Array.isArray(list)) {
      list.splice(index, 1);
      set(updatedFormData, path, list);
      setFormData(updatedFormData);
      updateField(path, list);
      onChange(updatedFormData);
    }
  };

  const getDefaultNewItem = (path: string): any => {
    const templates = {
      names: [
        {
          _id: Math.random(),
          hasNames: false,
          lastName: "",
          firstName: "",
          middleName: "",
          suffix: "",
          nameStarted: "",
          isStartDateEst: false,
          nameEnded: "",
          isNamePresent: false,
          isEndDateEst: false,
          isMaidenName: false,
          reasonChanged: "",
        },
      ],
      residencyInfo: {
        _id: Math.random(),
        residenceStartDate: "",
        isStartDateEst: false,
        residenceEndDate: "",
        isResidenceEndEst: false,
        isResidencePresent: false,
        residenceStatus: "None",
        residenceOtherDetails: "",
        residenceAddress: {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          hasAPOOrFPO: false,
          APOOrFPODetails: {
            addressUnitOrDutyLocation: "",
            cityOrPostName: "",
            state: "",
            zip: "",
            country: "",
            hadAPOFPOAddress: false,
            APOFPOAddress: "",
            APOOrFPO: "APO",
            APOFPOStateCode: "",
            APOFPOZip: "",
          },
        },
        contact: {
          lastname: "",
          firstname: "",
          middlename: "",
          suffix: "",
          lastContactDate: "",
          isLastContactEst: false,
          relationship: "",
          relationshipOtherDetail: "",
          phone: [
            {
              type: "Evening",
              knowsNumber: false,
              isInternationalOrDSN: false,
              number: "",
              extension: "",
            },
          ],
          email: "",
          contactAddress: {
            street: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            hasAPOOrFPO: false,
            APOOrFPODetails: {
              addressUnitOrDutyLocation: "",
              cityOrPostName: "",
              state: "",
              zip: "",
              country: "",
              hadAPOFPOAddress: false,
              APOFPOAddress: "",
              APOOrFPO: "APO",
              APOFPOStateCode: "",
              APOFPOZip: "",
            },
          },
        },
      },
      physicalAttributes: {
        heightFeet: 0,
        heightInch: 0,
        weight: 0,
        hairColor: "None",
        eyeColor: "None",
      },
      citizenshipInfo: {
        birth: {
          doc_type: "FS240",
          doc_num: "",
          doc_issue_date: "",
          is_issue_date_est: false,
          issue_city: "",
          issued_state: "",
          issued_country: "",
          issued_fname: "",
          issued_lname: "",
          issued_mname: "",
          issued_suffix: "",
          citizenship_num: "",
          certificate_issue_date: "",
          is_certificate_date_est: false,
          certificate_fname: "",
          certificate_lname: "",
          certificate_mname: "",
          certificate_suffix: "",
          is_born_installation: false,
          base_name: "",
        },
        naturalized: {
          us_entry_date: "",
          is_us_entry_date_est: false,
          entry_city: "",
          entry_state: "",
          country_of_citizenship_1: "",
          country_of_citizenship_2: "",
          has_alien_registration: false,
          alien_registration_num: "",
          naturalization_num: "",
          naturalization_issue_date: "",
          is_natural_issue_est: false,
          court_issued_date: "",
          court_street: "",
          court_city: "",
          court_state: "",
          court_zip: "",
          court_issued_fname: "",
          court_issued_lname: "",
          court_issued_mname: "",
          court_issued_suffix: "",
          basis_of_naturalization: "",
          other_basis_detail: "",
        },
        derived: {
          alien_registration_num: "",
          permanent_resident_num: "",
          certificate_of_citizenship_num: "",
          doc_fname: "",
          doc_lname: "",
          doc_mname: "",
          doc_suffix: "",
          doc_issue_date: "",
          is_doc_date_est: false,
          basis_of_citizenship: "other",
          basis_of_citizenship_explanation: "",
        },
        nonCitizen: {
          residence_status: "",
          us_entry_date: "",
          is_entry_date_est: false,
          country_of_citizenship1: "",
          country_of_citizenship2: "",
          entry_city: "",
          entry_state: "",
          alien_registration_num: "",
          expiration_date: "",
          is_expiration_est: false,
          document_issued: "I-94",
          other_doc: "",
          doc_num: "",
          doc_issued_date: "",
          is_doc_date_est: false,
          doc_expire_date: "",
          is_doc_expiration_est: false,
          doc_fname: "",
          doc_lname: "",
          doc_mname: "",
          doc_suffix: "",
        },
      },
      dualCitizenshipInfo: {
        citizenships: {
          _id: Math.random(),
          country: "",
          howCitizenshipAcquired: "",
          citizenshipStart: "",
          isCitizenshipStartEstimated: false,
          citizenshipEnd: "",
          isCitizenshipEndPresent: false,
          isCitizenshipEndEstimated: false,
          isRenounced: false,
          renouncementDetails: "",
          isCitizenshipHeld: false,
          citizenshipExplanation: "",
        },
        passports: {
          _id: Math.random(),
          countryIssued: "",
          passportDateIssued: "",
          isPassportDateEst: false,
          passportCity: "",
          passportCountry: "",
          passportLName: "",
          passportFName: "",
          passportMName: "",
          passportSuffix: "",
          passportNumber: "",
          passportExpiration: "",
          isExpirationEst: false,
          isPassportUsed: false,
          passportUses: [
            {
              _id: Math.random(),
              passportCountry: "",
              fromDate: "",
              toDate: "",
              isFromDateEst: false,
              isToDateEst: false,
              isVisitCurrent: false,
            },
          ],
        },
      },
      contactInfo: {
        contactNumbers: {
          _id: Math.random(),
          numberType: "Home", // Default type, can be changed by the user
          phoneNumber: "",
          phoneExtension: "",
          isUsableDay: false,
          isUsableNight: false,
          internationalOrDSN: false,
        },
      },
      schoolInfo: {
        schoolEntry: {
          _id: Math.random(),
          fromDate: "",
          toDate: "",
          present: false,
          est: false,
          schoolName: "",
          schoolAddress: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          schoolType: "",
          knownPerson: {
            firstName: "",
            lastName: "",
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            phoneNumber: {
              type: "Evening",
              knowsNumber: false,
              isInternationalOrDSN: false,
              number: "",
              extension: "",
            },
            email: "",
            unknown: false,
          },
          degreeReceived: true,
          degrees: [
            {
              degreeID: Math.random(),
              type: "",
              dateAwarded: "",
              est: false,
            },
          ],
        },
      },
      employmentInfo: {
        _id: Math.random(),
        employmentActivity: "none",
        section13A1: {
          fromDate: "",
          toDate: "",
          present: false,
          estimated: false,
          employmentStatus: {
            fullTime: false,
            partTime: false,
          },
          dutyStation: "",
          rankOrPosition: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          telephone: {
            number: "",
            extension: "",
            internationalOrDsn: false,
            day: false,
            night: false,
          },
          apoFpoAddress: {
            physicalLocationData: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            physicalWorkLocation: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            apoOrFpo: "",
            apoFpoStateCode: "",
          },
          supervisor: {
            name: "",
            rankOrPosition: "",
            email: "",
            emailUnknown: false,
            phone: {
              number: "",
              extension: "",
              internationalOrDsn: false,
              day: false,
              night: false,
            },
            physicalWorkLocation: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
          },
        },
        section13A2: {
          fromDate: "",
          toDate: "",
          present: false,
          estimated: false,
          employmentStatus: {
            fullTime: false,
            partTime: false,
          },
          positionTitle: "",
          employerName: "",
          employerAddress: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          telephone: {
            number: "",
            extension: "",
            internationalOrDsn: false,
            day: false,
            night: false,
          },
          additionalPeriods: [
            {
              _id: Math.random(),
              fromDate: "",
              toDate: "",
              estimatedFrom: false,
              estimatedTo: false,
              positionTitle: "",
              supervisor: "",
            },
          ],
          physicalWorkAddress: {
            differentThanEmployer: false,
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            telephone: {
              number: "",
              extension: "",
              internationalOrDsn: false,
              day: false,
              night: false,
            },
          },
        },
        section13A3: {
          fromDate: "",
          toDate: "",
          present: false,
          estimated: false,
          employmentStatus: {
            fullTime: false,
            partTime: false,
          },
          positionTitle: "",
          employmentName: "",
          employmentAddress: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          telephone: {
            number: "",
            extension: "",
            internationalOrDsn: false,
            day: false,
            night: false,
          },
          physicalWorkAddress: {
            fullTime: false,
            partTime: false,
          },
          apoFpoAddress: {
            physicalLocationData: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            physicalWorkLocation: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            apoOrFpo: "",
            apoFpoStateCode: "",
          },
          selfEmploymentVerifier: {
            lastName: "",
            firstName: "",
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            telephone: {
              number: "",
              extension: "",
              internationalOrDsn: false,
              day: false,
              night: false,
            },
            apoFpoAddress: {
              physicalLocationData: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
              physicalWorkLocation: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
              apoOrFpo: "",
              apoFpoStateCode: "",
            },
          },
        },
        section13A4: {
          fromDate: "",
          toDate: "",
          present: false,
          estimated: false,
          verifier: {
            lastName: "",
            firstName: "",
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            telephone: {
              number: "",
              extension: "",
              internationalOrDsn: false,
              day: false,
              night: false,
            },
            apoFpoAddress: {
              physicalLocationData: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
              physicalWorkLocation: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
              apoOrFpo: "",
              apoFpoStateCode: "",
            },
          },
        },
        section13A5: {
          reasonForLeaving: "",
          incidentInLastSevenYears: false,
          incidentDetails: [
            {
              type: "fired", // Default value as an example
              reason: "",
              departureDate: "",
              estimated: false,
            },
          ],
        },
        section13A6: {
          warnedInLastSevenYears: false,
          warningDetails: [
            {
              reason: "",
              date: "",
              estimated: false,
            },
          ],
        },
        section13B: {
          hasFormerFederalEmployment: false,
          employmentEntries: [
            {
              _id: Math.random(),
              fromDate: "",
              toDate: "",
              present: false,
              estimated: false,
              agencyName: "",
              positionTitle: "",
              location: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
            },
          ],
        },
      },
      militaryHistoryInfo: {
        section15_1: [
          {
            branch: "",
            stateOfService: "",
            status: "",
            officerOrEnlisted: "",
            serviceNumber: "",
            serviceFromDate: "",
            serviceToDate: "",
            present: false,
            estimatedFromDate: false,
            estimatedToDate: false,
            discharged: false,
            typeOfDischarge: "",
            dischargeTypeOther: "",
            dischargeDate: "",
            estimatedDischargeDate: false,
            dischargeReason: "",
          },
        ],
        section15_2: [
          {
            date: "",
            estimatedDate: false,
            descriptionOfOffense: "",
            nameOfProcedure: "",
            courtDescription: "",
            outcomeDescription: "",
          },
        ],
        section15_3: [
          {
            organizationType: "",
            organizationTypeOther: "",
            organizationName: "",
            country: "",
            periodOfServiceFrom: "",
            periodOfServiceTo: "",
            present: false,
            estimatedPeriodFrom: false,
            estimatedPeriodTo: false,
            highestRank: "",
            departmentOrOffice: "",
            associationDescription: "",
            reasonForLeaving: "",
            maintainsContact: null,
            contacts: [
              {
                lastName: "",
                firstName: "",
                middleName: "",
                suffix: "",
                address: {
                  street: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  country: "",
                },
                officialTitle: "",
                frequencyOfContact: "",
                associationFrom: "",
                associationTo: "",
                present: false,
                estimatedAssociationFrom: false,
                estimatedAssociationTo: false,
              },
            ],
          },
        ],
      },
      serviceInfo: {
        bornAfter1959: null,
        registeredWithSSS: null,
      },
      peopleThatKnow: [
        {
          _id: Math.random(),
          knownFromDate: "",
          knownToDate: null,
          present: true,
          estimatedFromDate: false,
          estimatedToDate: false,
          lastName: "",
          firstName: "",
          middleName: "",
          suffix: "",
          emailAddress: "",
          emailUnknown: false,
          rankOrTitle: "",
          rankOrTitleNotApplicable: false,
          relationshipToApplicant: {
            neighbor: false,
            workAssociate: false,
            friend: false,
            schoolmate: false,
            other: "",
          },
          phoneNumber: "",
          phoneNumberUnknown: false,
          phoneExtension: "",
          phoneType: "",
          mobileNumber: "",
          preferredContactTime: {
            day: false,
            night: false,
          },
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
        },
      ],
      relationshipInfo: {
        currentStatus: "NeverEntered",
        section17_1: {
          _id: Math.random(),
          fullName: {
            lastName: "",
            firstName: "",
            middleName: "",
            suffix: "",
          },
          placeOfBirth: {
            city: "",
            county: "",
            state: "",
            country: "",
          },
          dateOfBirth: {
            date: "",
            estimated: false,
          },
          citizenship: [
            {
              _id: Math.random(),
              country: "",
            },
          ],
          documentation: {
            type: "Other",
            documentNumber: "",
            documentExpirationDate: {
              date: "",
              estimated: false,
            },
            otherExplanation: "",
          },
          usSocialSecurityNumber: "",
          otherNames: [
            {
              _id: Math.random(),
              lastName: "",
              firstName: "",
              middleName: "",
              suffix: "",
              maidenName: false,
              fromDate: {
                date: "",
                estimated: false,
              },
              toDate: {
                date: "",
                estimated: false,
              },
            },
          ],
          relationshipStatus: "Divorced",
          statusDetails: {
            location: {
              city: "",
              county: "",
              state: "",
              country: "",
            },
            date: {
              date: "",
              estimated: false,
            },
            recordLocation: {
              city: "",
              county: "",
              state: "",
              country: "",
            },
            deceased: false,
            lastKnownAddress: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
          },
        },
        section17_2: [
          {
            _id: Math.random(),
            marriageStatus: "",
            dateOfMarriage: {
              date: "",
              estimated: false,
            },
            placeOfMarriage: {
              city: "",
              county: "",
              state: "",
              country: "",
            },
            spouseName: {
              lastName: "",
              firstName: "",
              middleName: "",
              suffix: "",
            },
            spousePlaceOfBirth: {
              city: "",
              county: "",
              state: "",
              country: "",
            },
            spouseDateOfBirth: {
              date: "",
              estimated: false,
            },
            spouseCitizenship: [
              {
                _id: Math.random(),
                country: "",
              },
            ],
            spouseDocumentation: {
              type: "Other",
              documentNumber: "",
              documentExpirationDate: {
                date: "",
                estimated: false,
              },
              otherExplanation: "",
            },
            spouseUsSocialSecurityNumber: "",
            spouseOtherNames: [
              {
                _id: Math.random(),
                lastName: "",
                firstName: "",
                middleName: "",
                suffix: "",
                maidenName: false,
                fromDate: {
                  date: "",
                  estimated: false,
                },
                toDate: {
                  date: "",
                  estimated: false,
                },
              },
            ],
          },
        ],
        section17_3: {
          _id: Math.random(),
          hasCohabitant: false,
          cohabitants: [
            {
              _id: Math.random(),
              fullName: {
                lastName: "",
                firstName: "",
                middleName: "",
                suffix: "",
              },
              placeOfBirth: {
                city: "",
                county: "",
                state: "",
                country: "",
              },
              dateOfBirth: {
                date: "",
                estimated: false,
              },
              citizenship: [
                {
                  _id: Math.random(),
                  country: "",
                },
              ],
              documentation: {
                type: "Other",
                documentNumber: "",
                documentExpirationDate: {
                  date: "",
                  estimated: false,
                },
                otherExplanation: "",
              },
              usSocialSecurityNumber: "",
              otherNames: [
                {
                  _id: Math.random(),
                  lastName: "",
                  firstName: "",
                  middleName: "",
                  suffix: "",
                  maidenName: false,
                  fromDate: {
                    date: "",
                    estimated: false,
                  },
                  toDate: {
                    date: "",
                    estimated: false,
                  },
                },
              ],
              cohabitationStartDate: {
                date: "",
                estimated: false,
              },
            },
          ],
        },
      },

      relativesInfo: {
        _id: Math.random(),
        relativeTypes: [],
        entries: [
          {
            _id: Math.random(),
            type: "",
            fullName: {
              firstName: "",
              middleName: "",
              lastName: "",
              suffix: "",
            },
            dateOfBirth: "",
            placeOfBirth: {
              city: "",
              state: "",
              country: "",
            },
            countriesOfCitizenship: [],
            isDeceased: false,
            isUSCitizen: false,
            hasForeignAddress: false,
            hasUSAddress: false,
            details: {
              section18_1: {
                ifMother: {
                  lastName: "",
                  firstName: "",
                  middleName: "",
                  suffix: "",
                  sameAsListed: false,
                  iDontKnow: false,
                },
                hasOtherNames: false,
                otherNamesUsed: [
                  {
                    _id: Math.random(),
                    lastName: "",
                    firstName: "",
                    middleName: "",
                    suffix: "",
                    maidenName: false,
                    from: "",
                    to: "",
                    estimatedFrom: false,
                    estimatedTo: false,
                    reasonForChange: "",
                  },
                ],
              },
              section18_2: {
                _id: Math.random(),
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
                hasAPOFPOAddress: false,
                apofpoAddress: {
                  address: "",
                  apofpoStateCode: "",
                  apofpoZipCode: "",
                },
                dontKnowAPOFPO: false,
              },
              section18_3: {
                citizenshipDocuments: [
                  {
                    type: "FS240or545",
                    documentNumber: "",
                  },
                ],
                courtDetails: {
                  street: "",
                  city: "",
                  state: "",
                  zipCode: "",
                },
              },
              section18_4: {
                usDocumentation: [
                  {
                    type: "I551PermanentResident",
                  },
                ],
                documentNumber: "",
                documentExpirationDate: "",
                firstContactDate: "",
                lastContactDate: "",
                contactMethods: [],
                contactFrequency: {
                  frequency: "Daily",
                  explanation: "",
                },
                currentEmployer: {
                  name: "",
                  address: {
                    street: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "",
                  },
                  unknown: false,
                },
                recentEmployer: {
                  name: "",
                  address: {
                    street: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "",
                  },
                  unknown: false,
                },
                foreignGovernmentAffiliation: {
                  description: "",
                  relatedTo: "Government",
                },
              },
              section18_5: {
                firstContactDate: "",
                lastContactDate: "",
                contactMethods: [],
                contactFrequency: {
                  frequency: "Daily",
                  explanation: "",
                },
                employerDetails: {
                  name: "",
                  address: {
                    street: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "",
                  },
                  unknown: false,
                },
                foreignGovernmentAffiliation: {
                  description: "",
                  relatedTo: "Government",
                },
              },
            },
          },
        ],
      },
    };

    console.log(`Path: ${path}`);

    const pathSegments = path.split(".");
    const lastSegment = pathSegments.slice(-1)[0];
    const isNestedPath = pathSegments.length > 1;

    console.log(`Path segments: ${pathSegments}`);
    console.log(`Last segment: ${lastSegment}`);
    console.log(`Is nested path: ${isNestedPath}`);

    const nestedTemplates = {
      dualCitizenshipInfo: ["citizenships", "passports", "passportUses"],
      residencyInfo: ["residenceAddress", "contact"],
      contactInfo: ["contactNumbers"],
      schoolInfo: ["degrees", "schoolEntry"],
      employmentInfo: [
        "section13A1",
        "section13A2",
        "section13A3",
        "section13A4",
        "section13A5",
        "section13A6",
        "additionalPeriods",
        "section13B",
        "section13C",
        "employmentEntries",
        "contacts",
      ],
      militaryHistoryInfo: ["section15_1", "section15_2", "section15_3"],
      relationshipInfo: ["section17_1", "otherNames"],
      relativesInfo: ["entries", "section18_1", "section18_2", "section18_3"],
    };

    const findNestedTemplate = (pathSegments, templates) => {
      let currentTemplate = templates;
      console.log(`Initial template: ${JSON.stringify(currentTemplate)}`);
      for (const segment of pathSegments) {
        console.log(`Current segment: ${segment}`);
        if (Array.isArray(currentTemplate)) {
          console.log(`Current template is array, selecting first element.`);
          currentTemplate = currentTemplate[0];
        }
        if (currentTemplate[segment]) {
          console.log(`Found segment in template: ${segment}`);
          currentTemplate = currentTemplate[segment];
        } else {
          console.log(`Segment not found, checking nested templates.`);
          // Handle the case where the segment is part of nested templates
          for (const [templateKey, nestedKeys] of Object.entries(
            nestedTemplates
          )) {
            if (
              pathSegments.includes(templateKey) &&
              nestedKeys.includes(segment)
            ) {
              console.log(`Nested template key matched: ${templateKey}`);
              currentTemplate = currentTemplate[templateKey];
            }
          }
        }
        console.log(`Updated template: ${JSON.stringify(currentTemplate)}`);
      }
      return cloneDeep(currentTemplate);
    };

    if (isNestedPath) {
      const nestedTemplate = findNestedTemplate(pathSegments, templates);
      if (nestedTemplate) {
        console.log(`Nested template found: ${JSON.stringify(nestedTemplate)}`);
        return nestedTemplate;
      } else {
        console.log(`No nested template found for path: ${path}`);
      }
    }

    console.log(
      isNestedPath,
      lastSegment,
      path,
      templates[lastSegment as keyof typeof templates],
      "LOG TESTING"
    );

    if (path === "employmentInfo") {
      return {
        _id: templates.employmentInfo._id,
        employmentActivity: templates.employmentInfo.employmentActivity,
      };
    }

    if (path.startsWith("citizenshipInfo.")) {
      const citizenshipType = pathSegments[1];
      console.log(`Citizenship type: ${citizenshipType}`);
      const citizenshipTemplate = templates.citizenshipInfo[citizenshipType];
      if (citizenshipTemplate) {
        // console.log(
        //   `Citizenship template found: ${JSON.stringify(citizenshipTemplate)}`
        // );
        return cloneDeep(citizenshipTemplate);
      } else {
        console.error(
          `No template found for citizenship type: ${citizenshipType}`
        );
        return {};
      }
    }

    const defaultItem = cloneDeep(templates[lastSegment]);
    console.log(`Default item: ${JSON.stringify(defaultItem)}`);

    if (Object.keys(defaultItem).length === 0) {
      console.error(`No template found for path: ${path}`);
    }

    return defaultItem;
  };

  const isReadOnlyField = (key: string) => {
    return key.endsWith("_id") || key === "createdAt" || key === "updatedAt";
  };

  const renderField = (key: string, value: any, path: string) => {
    if (!value) return null;

    const props = {
      key: path,
      data: value,
      onInputChange: handleInputChange,
      onAddEntry: handleAddEntry,
      onRemoveEntry: handleRemoveEntry,
      isValidValue: isValidValue,
      getDefaultNewItem: getDefaultNewItem,
      isReadOnlyField: isReadOnlyField,
      path: path,
      formInfo: FormInfo,
    };

    const employeeId = data.personalInfo.applicantID;

    if (!employeeId) {
      return null;
    }

    // console.log("Rendering field for key:", key, "with data:", value);

    switch (key) {
      case "personalInfo":
        return <RenderBasicInfo {...props} />;
      case "birthInfo":
        return <RenderBirthInfo {...props} />;
      case "namesInfo":
        return <RenderNames {...props} />;
      case "aknowledgementInfo":
        return <RenderAcknowledgementInfo {...props} />;
      case "physicalAttributes":
        return <RenderPhysicalsInfo {...props} />;
      case "contactInfo":
        return <RenderContactInfo {...props} />;
      case "passportInfo":
        return <RenderPassportInfo {...props} />;
      case "citizenshipInfo":
        return <RenderCitizenshipInfo {...props} />;
      case "dualCitizenshipInfo":
        return <RenderDualCitizenshipInfo {...props} />;
      case "residencyInfo":
        return <RenderResidencyInfo {...props} />;
      case "schoolInfo":
        return <RenderSchoolInfo {...props} />;
      case "employmentInfo":
        return <RenderEmploymentInfo {...props} />;
      case "serviceInfo":
        return <RenderServiceInfo {...props} />;
      case "militaryHistoryInfo":
        return <RenderMilitaryInfo {...props} />;
      case "peopleThatKnow":
        return <RenderPeopleThatKnow {...props} />;
      case "relationshipInfo":
        return <RenderRelationshipInfo {...props} />;
      case "relativesInfo":
        return <RenderRelativesInfo {...props} />;

      default:
        return (
          <div key={path} className="text-gray-500 p-4">
            No data available for this section
          </div>
        );
    }
  };

  const handleStepChange = (step: number) => {
    dispatch(goToStep(step));
  };

  return (
    <>
      {formData &&
        formSections.length > currentStep &&
        renderField(
          formSections[currentStep],
          formData[formSections[currentStep] as keyof typeof formData],
          formSections[currentStep]
        )}
      <StepperFooter
        onStepChange={handleStepChange}
        totalSteps={formSections.length}
      />
    </>
  );
};

export default DynamicForm3;
