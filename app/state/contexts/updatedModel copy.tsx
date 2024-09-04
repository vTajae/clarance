import { ApplicantFormValues } from "../../../api/interfaces2.0/formDefinition";
import { aknowledgementInfo } from "./sections/aknowledgementInfo";
import { birthInfo } from "./sections/birthInfo";
import { citizenshipInfo } from "./sections/citizenshipInfo";
import { contactInfo } from "./sections/contactInfo";
import { dualCitizenshipInfo } from "./sections/dualCitizenshipInfo";
import { employmentInfo } from "./sections/employmentInfo";
import { foreignActivities } from "./sections/foreignActivities";
import { foreignContacts } from "./sections/foreignContacts";
import { militaryHistoryInfo } from "./sections/militaryHistoryInfo";
import { namesInfo } from "./sections/namesInfo";
import { passportInfo } from "./sections/passportInfo";
import { peopleThatKnow } from "./sections/peopleThatKnow";
import { personalInfo } from "./sections/personalInfo";
import { physicalAttributes } from "./sections/physicalAttributes";
import { relationshipInfo } from "./sections/relationshipInfo";
import { relativesInfo } from "./sections/relativesInfo";
import { residencyInfo } from "./sections/residencyInfo";
import { schoolInfo } from "./sections/schoolInfo";
import { serviceInfo } from "./sections/serviceInfo";


const defaultFormData: ApplicantFormValues = {

  personalInfo: personalInfo,
  // namesInfo: namesInfo,
  // aknowledgementInfo: aknowledgementInfo,
  // birthInfo: birthInfo,
  // physicalInfo: physicalAttributes,
  // contactInfo: contactInfo,
  // passportInfo: passportInfo,
  // citizenshipInfo: citizenshipInfo,
  // dualCitizenshipInfo: dualCitizenshipInfo,
  // residencyInfo: residencyInfo,
  // employmentInfo: employmentInfo,
  // schoolInfo: schoolInfo,
  // serviceInfo: serviceInfo,
  // militaryHistoryInfo: militaryHistoryInfo,
  // peopleThatKnow: peopleThatKnow,
  // relativesInfo: relativesInfo,
  // foreignContacts: foreignContacts,
  // foreignActivities: foreignActivities,
  // relationshipInfo: relationshipInfo,
  // mentalHealth: mentalHealthInfo,
  // policeRecord: policeRecordInfo,
  // drugActivity: drugActivityInfo,
  // alcoholUse: alcoholUse,
  // investigationsInfo: investigationsInfo,
  // finances: financesInfo,
  // technology: technologyInfo,
  // civil: civilInfo,
  // association: associationInfo,






  relationshipInfo: {
    _id: 1,
    neverEntered: {
      value: "Yes",
      id: "11749",
      type: "PDFCheckBox",
    },
    currentlyIn: {
      value: "Yes",
      id: "11746",
      type: "PDFCheckBox",
    },
    separated: {
      value: "Yes",
      id: "11748",
      type: "PDFCheckBox",
    },
    annulled: {
      value: "Yes",
      id: "11747",
      type: "PDFCheckBox",
    },
    divorcedDissolved: {
      value: "Yes",
      id: "11745",
      type: "PDFCheckBox",
    },
    widowed: {
      value: "Yes",
      id: "11744",
      type: "PDFCheckBox",
    },
    section17_1: {
      _id: 1,
      fullName: {
        lastName: {
          value: "Entry1LName",
          id: "11770",
          type: "PDFTextField",
        },
        firstName: {
          value: "Entry1FName",
          id: "11771",
          type: "PDFTextField",
        },
        middleName: {
          value: "Entry1MName",
          id: "11772",
          type: "PDFTextField",
        },
        suffix: {
          value: "IV",
          id: "11767",
          type: "PDFDropdown",
        },
      },
      placeOfBirth: {
        city: {
          value: "cityOfMarraige",
          id: "11816",
          type: "PDFTextField",
        },
        county: {
          value: "countyOMarraige",
          id: "11815",
          type: "PDFTextField",
        },
        state: {
          value: "AZ",
          id: "11814",
          type: "PDFDropdown",
        },
        country: {
          value: "Andorra",
          id: "11813",
          type: "PDFDropdown",
        },
      },
      dateOfBirth: {
        date: {
          value: "12-12-23",
          id: "11738",
          type: "date",
        },
        estimated: {
          value: "Yes",
          id: "11739",
          type: "PDFCheckBox",
        },
      },
      citizenship: [
        {
          _id: 1,
          country: {
            value: "Anguilla",
            id: "11774",
            type: "PDFDropdown",
          },
        },
        {
          _id: 2,
          country: {
            value: "Anguilla",
            id: "11750",
            type: "PDFDropdown",
          },
        },
      ],
      documentation: {
        FS240Or545: {
          value: "Yes",
          id: "11737",
          type: "PDFCheckBox",
        },
        DS1350: {
          value: "Yes",
          id: "11736",
          type: "PDFCheckBox",
        },
        AlienRegistration: {
          value: "Yes",
          id: "11735",
          type: "PDFCheckBox",
        },
        PermanentResidentCard: {
          value: "Yes",
          id: "11734",
          type: "PDFCheckBox",
        },
        CertificateOfNaturalization: {
          value: "Yes",
          id: "11733",
          type: "PDFCheckBox",
        },
        CertificateOfCitizenship: {
          value: "Yes",
          id: "11732",
          type: "PDFCheckBox",
        },
        I551: {
          value: "Yes",
          id: "11787",
          type: "PDFCheckBox",
        },
        I766: {
          value: "Yes",
          id: "11786",
          type: "PDFCheckBox",
        },
        I94: {
          value: "Yes",
          id: "11780",
          type: "PDFCheckBox",
        },
        USVisa: {
          value: "Yes",
          id: "11784",
          type: "PDFCheckBox",
        },
        I20: {
          value: "Yes",
          id: "11783",
          type: "PDFCheckBox",
        },
        DS2019: {
          value: "Yes",
          id: "11779",
          type: "PDFCheckBox",
        },
        Other: {
          value: {
            value: "Yes",
            id: "11781",
            type: "PDFCheckBox",
          },
          explanation: {
            value: "otherExplain",
            id: "11728",
            type: "PDFTextField",
          },
        },
        documentNumber: {
          value: "123456",
          id: "11730",
          type: "PDFTextField",
        },
        documentExpirationDate: {
          date: {
            value: "2024-01-01",
            id: "11778",
            type: "date",
          },
          estimated: {
            value: "Yes",
            id: "11777",
            type: "PDFCheckBox",
          },
        },
      },
      NA_OtherNames: {
        value: "Yes",
        id: "11766",
        type: "PDFCheckBox",
      },
      NA_SSN: {
        value: "Yes",
        id: "11729",
        type: "PDFCheckBox",
      },
      usSocialSecurityNumber: {
        value: "123456789",
        id: "11731",
        type: "PDFTextField",
      },
      otherNames: [
        {
          _id: 1,
          lastName: {
            value: "Entry2LName",
            id: "11759",
            type: "PDFTextField",
          },
          firstName: {
            value: "Entry2FName",
            id: "11760",
            type: "PDFTextField",
          },
          middleName: {
            value: "Entry2MName",
            id: "11761",
            type: "PDFTextField",
          },
          suffix: {
            value: "III",
            id: "11756",
            type: "PDFDropdown",
          },
          maidenName: {
            value: "Yes",
            id: "11755",
            type: "PDFCheckBox",
          },
          fromDate: {
            date: {
              value: "Entry2FromDat",
              id: "11758",
              type: "PDFTextField",
            },
            estimated: {
              value: "Yes",
              id: "11753",
              type: "PDFCheckBox",
            },
          },
          toDate: {
            date: {
              value: "Entry2ToDate",
              id: "11757",
              type: "PDFTextField",
            },
            estimated: {
              value: "Yes",
              id: "11754",
              type: "PDFCheckBox",
            },
          },
        },
      ],
      relationshipStatus: {
        value: "",
        id: "",
        type: "PDFCheckBox",
      },
      statusDetails: {
        location: {
          city: {
            value: "Los Angeles",
            id: "11742",
            type: "PDFTextField",
          },
          county: {
            value: "Los Angeles",
            id: "11743",
            type: "PDFTextField",
          },
          state: {
            value: "CA",
            id: "11744",
            type: "PDFDropdown",
          },
          country: {
            value: "USA",
            id: "11745",
            type: "PDFDropdown",
          },
        },
        date: {
          date: {
            value: "2024-01-01",
            id: "11746",
            type: "date",
          },
          estimated: {
            value: "Yes",
            id: "11747",
            type: "PDFCheckBox",
          },
        },
        recordLocation: {
          city: {
            value: "Los Angeles",
            id: "11748",
            type: "PDFTextField",
          },
          county: {
            value: "Los Angeles",
            id: "11749",
            type: "PDFTextField",
          },
          state: {
            value: "CA",
            id: "11750",
            type: "PDFDropdown",
          },
          country: {
            value: "USA",
            id: "11751",
            type: "PDFDropdown",
          },
        },
        deceased: {
          value: "No",
          id: "11752",
          type: "PDFRadioGroup",
        },
        lastKnownAddress: {
          street: {
            value: "123 Main St",
            id: "11753",
            type: "PDFTextField",
          },
          city: {
            value: "Los Angeles",
            id: "11754",
            type: "PDFTextField",
          },
          state: {
            value: "CA",
            id: "11755",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "90001",
            id: "11756",
            type: "PDFTextField",
          },
          country: {
            value: "USA",
            id: "11757",
            type: "PDFDropdown",
          },
        },
      },
    },
  },
  


  // relativesInfo: {
  //   _id: Math.random(),
  //   relativeTypes: [],
  //   entries: [
  //     {
  //       _id: Math.random(),
  //       type: {
  //         value: "Mother",
  //         id: "",
  //         type: "PDFDropdown",
  //       },
  //       fullName: {
  //         firstName: {
  //           value: "",
  //           id: "12137",
  //           type: "PDFTextField",
  //         },
  //         middleName: {
  //           value: "",
  //           id: "12140",
  //           type: "PDFTextField",
  //         },
  //         lastName: {
  //           value: "",
  //           id: "12139",
  //           type: "PDFTextField",
  //         },
  //         suffix: {
  //           value: "",
  //           id: "12138",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       dateOfBirth: {
  //         value: "",
  //         id: "12078",
  //         type: "date",
  //       },
  //       placeOfBirth: {
  //         city: {
  //           value: "",
  //           id: "12143",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "12142",
  //           type: "PDFDropdown",
  //         },
  //         country: {
  //           value: "",
  //           id: "12141",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       countriesOfCitizenship: [
  //         {
  //           _id: Math.random(),
  //           country: {
  //             value: "",
  //             id: "12081",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           country: {
  //             value: "",
  //             id: "12081",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       ],
  //       isDeceased: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       isUSCitizen: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       hasForeignAddress: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       hasUSAddress: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       details: {
  //         section18_1: {
  //           ifMother: {
  //             lastName: {
  //               value: "",
  //               id: "12134",
  //               type: "PDFTextField",
  //             },
  //             firstName: {
  //               value: "",
  //               id: "12133",
  //               type: "PDFTextField",
  //             },
  //             middleName: {
  //               value: "",
  //               id: "12135",
  //               type: "PDFTextField",
  //             },
  //             suffix: {
  //               value: "",
  //               id: "12136",
  //               type: "PDFDropdown",
  //             },
  //             sameAsListed: {
  //               value: "NO",
  //               id: "12132",
  //               type: "PDFCheckBox",
  //             },
  //             iDontKnow: {
  //               value: "NO",
  //               id: "12131",
  //               type: "PDFCheckBox",
  //             },
  //           },
  //           hasOtherNames: {
  //             value: "NO",
  //             id: "12145",
  //             type: "PDFRadioGroup",
  //           },
  //           otherNamesUsed: [
  //             {
  //               _id: Math.random(),
  //               lastName: {
  //                 value: "",
  //                 id: "12128",
  //                 type: "PDFTextField",
  //               },
  //               firstName: {
  //                 value: "",
  //                 id: "12129",
  //                 type: "PDFTextField",
  //               },
  //               middleName: {
  //                 value: "",
  //                 id: "12130",
  //                 type: "PDFTextField",
  //               },
  //               suffix: {
  //                 value: "",
  //                 id: "12125",
  //                 type: "PDFDropdown",
  //               },
  //               maidenName: {
  //                 value: "NO",
  //                 id: "12121",
  //                 type: "PDFRadioGroup",
  //               },
  //               from: {
  //                 value: "",
  //                 id: "12127",
  //                 type: "PDFTextField",
  //               },
  //               to: {
  //                 value: "",
  //                 id: "12126",
  //                 type: "PDFTextField",
  //               },
  //               estimatedFrom: {
  //                 value: "NO",
  //                 id: "12124",
  //                 type: "PDFCheckBox",
  //               },
  //               estimatedTo: {
  //                 value: "NO",
  //                 id: "12123",
  //                 type: "PDFCheckBox",
  //               },
  //               reasonForChange: {
  //                 value: "",
  //                 id: "12086",
  //                 type: "PDFTextField",
  //               },
  //             },
  //           ],
  //         },
  //         section18_2: {
  //           _id: Math.random(),
  //           street: {
  //             value: "",
  //             id: "12167",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "12166",
  //             type: "PDFTextField",
  //           },
  //           state: {
  //             value: "",
  //             id: "12165",
  //             type: "PDFDropdown",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "12163",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "",
  //             id: "12164",
  //             type: "PDFDropdown",
  //           },
  //           hasAPOFPOAddress: {
  //             value: "NO",
  //             id: "12176",
  //             type: "PDFRadioGroup",
  //           },
  //           apofpoAddress: {
  //             address: {
  //               value: "",
  //               id: "12170",
  //               type: "PDFTextField",
  //             },
  //             apofpoStateCode: {
  //               value: "",
  //               id: "12168",
  //               type: "PDFDropdown",
  //             },
  //             apofpoZipCode: {
  //               value: "",
  //               id: "12171",
  //               type: "PDFTextField",
  //             },
  //           },
  //           dontKnowAPOFPO: {
  //             value: "NO",
  //             id: "12174",
  //             type: "PDFRadioGroup",
  //           },
  //         },
  //         section18_3: {
  //           citizenshipDocuments: [
  //             {
  //               type: "FS240or545",
  //               documentNumber: {
  //                 value: "",
  //                 id: "12152",
  //                 type: "PDFTextField",
  //               },
  //             },
  //           ],
  //           courtDetails: {
  //             street: {
  //               value: "",
  //               id: "12178",
  //               type: "PDFTextField",
  //             },
  //             city: {
  //               value: "",
  //               id: "12148",
  //               type: "PDFTextField",
  //             },
  //             state: {
  //               value: "",
  //               id: "12149",
  //               type: "PDFDropdown",
  //             },
  //             zipCode: {
  //               value: "",
  //               id: "12177",
  //               type: "PDFTextField",
  //             },
  //           },
  //         },
  //         section18_4: {
  //           usDocumentation: [
  //             {
  //               type: {
  //                 value: "I551PermanentResident",
  //                 id: "12218",
  //                 type: "PDFCheckBox",
  //               },
  //             },
  //             {
  //               type: {
  //                 value: "I94ArrivalDepartureRecord",
  //                 id: "12213",
  //                 type: "PDFCheckBox",
  //               },
  //             },
  //             {
  //               type: {
  //                 value: "I20CertificateEligibilityF1Student",
  //                 id: "12215",
  //                 type: "PDFCheckBox",
  //               },
  //             },
  //             {
  //               type: {
  //                 value: "DS2019CertificateEligibilityJ1Status",
  //                 id: "12214",
  //                 type: "PDFCheckBox",
  //               },
  //             },
  //             {
  //               type: {
  //                 value: "Other",
  //                 id: "12217",
  //                 type: "PDFCheckBox",
  //               },
  //             },
  //             {
  //               type: {
  //                 value: "I766EmploymentAuthorization",
  //                 id: "12219",
  //                 type: "PDFCheckBox",
  //               },
  //             },
  //             {
  //               type: {
  //                 value: "Other",
  //                 id: "12216",
  //                 type: "PDFCheckBox",
  //               },
  //             },
  //           ],
  //           documentFieldNumber: {
  //             value: "",
  //             id: "12212",
  //             type: "PDFTextField",
  //           },
  //           documentExpirationDate: {
  //             value: "",
  //             id: "12179",
  //             type: "PDFTextField",
  //           },
  //           firstContactDate: {
  //             value: "",
  //             id: "12186",
  //             type: "PDFTextField",
  //           },
  //           lastContactDate: {
  //             value: "",
  //             id: "12182",
  //             type: "PDFTextField",
  //           },
  //           contactMethods: [
  //             {
  //               value: "In Person",
  //               id: "12209",
  //               type: "PDFCheckBox",
  //             },
  //             {
  //               value: "Telephone",
  //               id: "12211",
  //               type: "PDFCheckBox",
  //             },
  //             {
  //               value: "Electronic",
  //               id: "12210",
  //               type: "PDFCheckBox",
  //             },
  //             {
  //               value: "Written Correspondence",
  //               id: "12208",
  //               type: "PDFCheckBox",
  //             },
  //             {
  //               value: "Other",
  //               id: "12207",
  //               type: "PDFCheckBox",
  //             },
  //           ],
  //           contactFrequency: {
  //             frequency: {
  //               value: "Daily",
  //               id: "12204",
  //               type: "PDFCheckBox",
  //             },
  //           },
  //           currentEmployer: {
  //             name: {
  //               value: "",
  //               id: "12199",
  //               type: "PDFTextField",
  //             },
  //             address: {
  //               street: {
  //                 value: "",
  //                 id: "12197",
  //                 type: "PDFTextField",
  //               },
  //               city: {
  //                 value: "",
  //                 id: "12196",
  //                 type: "PDFTextField",
  //               },
  //               state: {
  //                 value: "",
  //                 id: "12195",
  //                 type: "PDFSelect",
  //               },
  //               zipCode: {
  //                 value: "",
  //                 id: "12193",
  //                 type: "PDFTextField",
  //               },
  //               country: {
  //                 value: "",
  //                 id: "12194",
  //                 type: "PDFSelect",
  //               },
  //             },
  //             unknown: {
  //               value: "NO",
  //               id: "12198",
  //               type: "PDFCheckBox",
  //             },
  //           },
  //           recentEmployer: {
  //             name: {
  //               value: "",
  //               id: "12199",
  //               type: "PDFTextField",
  //             },
  //             address: {
  //               street: {
  //                 value: "",
  //                 id: "12197",
  //                 type: "PDFTextField",
  //               },
  //               city: {
  //                 value: "",
  //                 id: "12196",
  //                 type: "PDFTextField",
  //               },
  //               state: {
  //                 value: "",
  //                 id: "12195",
  //                 type: "PDFSelect",
  //               },
  //               zipCode: {
  //                 value: "",
  //                 id: "12193",
  //                 type: "PDFTextField",
  //               },
  //               country: {
  //                 value: "",
  //                 id: "12194",
  //                 type: "PDFSelect",
  //               },
  //             },
  //             unknown: {
  //               value: "NO",
  //               id: "12198",
  //               type: "PDFCheckBox",
  //             },
  //           },
  //           foreignGovernmentAffiliation: {
  //             affiliation: {
  //               value: "NO",
  //               id: "12188",
  //               type: "PDFRadioButton",
  //             },
  //             description: {
  //               value: "",
  //               id: "12187",
  //               type: "PDFTextField",
  //             },
  //           },
  //         },
  //         section18_5: {
  //           firstContactDate: {
  //             value: "",
  //             id: "12224",
  //             type: "PDFTextField",
  //           },
  //           lastContactDate: {
  //             value: "",
  //             id: "12222",
  //             type: "PDFTextField",
  //           },
  //           contactMethods: [
  //             {
  //               value: "In Person",
  //               id: "12247",
  //               type: "PDFCheckBox",
  //             },
  //             {
  //               value: "Telephone",
  //               id: "12249",
  //               type: "PDFCheckBox",
  //             },
  //             {
  //               value: "Electronic",
  //               id: "12248",
  //               type: "PDFCheckBox",
  //             },
  //             {
  //               value: "Written Correspondence",
  //               id: "12246",
  //               type: "PDFCheckBox",
  //             },
  //             {
  //               value: "Other",
  //               id: "12245",
  //               type: "PDFCheckBox",
  //             },
  //           ],
  //           contactFrequency: {
  //             frequency: {
  //               value: "Daily",
  //               id: "12242",
  //               type: "PDFCheckBox",
  //             },
  //             explanation: {
  //               value: "",
  //               id: "12240",
  //               type: "PDFTextField",
  //             },
  //           },
  //           employerDetails: {
  //             name: {
  //               value: "",
  //               id: "12237",
  //               type: "PDFTextField",
  //             },
  //             address: {
  //               street: {
  //                 value: "",
  //                 id: "12235",
  //                 type: "PDFTextField",
  //               },
  //               city: {
  //                 value: "",
  //                 id: "12234",
  //                 type: "PDFTextField",
  //               },
  //               state: {
  //                 value: "",
  //                 id: "12233",
  //                 type: "PDFDropdown",
  //               },
  //               zipCode: {
  //                 value: "",
  //                 id: "12231",
  //                 type: "PDFTextField",
  //               },
  //               country: {
  //                 value: "",
  //                 id: "12232",
  //                 type: "PDFDropdown",
  //               },
  //             },
  //             unknown: {
  //               value: "NO",
  //               id: "12230",
  //               type: "PDFCheckBox",
  //             },
  //           },
  //           foreignGovernmentAffiliation: {
  //             affiliation: {
  //               value: "NO",
  //               id: "",
  //               type: "PDFRadioButton",
  //             },

  //             description: {
  //               value: "",
  //               id: "12225",
  //               type: "PDFTextField",
  //             },
  //           },
  //         },
  //       },
  //     },
  //   ],
  // },
  // foreignContacts: {
  //   _id: Math.random(),
  //   hasForeignContact: {
  //     value: "NO",
  //     id: "",
  //     type: "PDFRadioGroup",
  //   },
  //   entries: [
  //     {
  //       _id: Math.random(),
  //       lastName: {
  //         value: "",
  //         id: "13133",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "",
  //         id: "13132",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "",
  //         id: "13134",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "",
  //         id: "13135",
  //         type: "PDFDropdown",
  //       },
  //       approximateFirstContactDate: {
  //         value: "",
  //         id: "13130",
  //         type: "PDFTextField",
  //       },
  //       approximateLastContactDate: {
  //         value: "",
  //         id: "13128",
  //         type: "PDFTextField",
  //       },
  //       contactMethods: [
  //         {
  //           value: "In Person",
  //           id: "13124",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Telephone",
  //           id: "13126",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Electronic",
  //           id: "13125",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Written Correspondence",
  //           id: "13123",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Other",
  //           id: "13121",
  //           type: "PDFCheckBox",
  //         },
  //       ],
  //       contactFrequency: [
  //         {
  //           value: "Daily",
  //           id: "13120",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Weekly",
  //           id: "13119",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Monthly",
  //           id: "13118",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Quarterly",
  //           id: "13117",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Annually",
  //           id: "13116",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Other",
  //           id: "13196",
  //           type: "PDFRadioGroup",
  //         },
  //       ],
  //       relationshipNature: [
  //         {
  //           value: "Professional or Business",
  //           id: "13191",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Personal",
  //           id: "13192",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Obligation",
  //           id: "13189",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Other",
  //           id: "13193",
  //           type: "PDFCheckBox",
  //         },
  //       ],
  //       otherNames: [
  //         {
  //           lastName: {
  //             value: "",
  //             id: "13188",
  //             type: "PDFTextField",
  //           },
  //           firstName: {
  //             value: "",
  //             id: "13187",
  //             type: "PDFTextField",
  //           },
  //           middleName: {
  //             value: "",
  //             id: "13186",
  //             type: "PDFTextField",
  //           },
  //           suffix: {
  //             value: "",
  //             id: "13185",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       ],
  //       citizenships: [
  //         {
  //           _id: Math.random(),
  //           country: {
  //             value: "",
  //             id: "13138",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           country: {
  //             value: "",
  //             id: "13137",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       ],
  //       dateOfBirth: {
  //         value: "",
  //         id: "13171",
  //         type: "date",
  //       },
  //       placeOfBirth: {
  //         city: {
  //           value: "",
  //           id: "13143",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "13144",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       currentAddress: {
  //         street: {
  //           value: "",
  //           id: "13169",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "13168",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "13167",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "13165",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "13166",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       apoFpoAddress: {
  //         address: {
  //           value: "",
  //           id: "13147",
  //           type: "PDFTextField",
  //         },
  //         stateCode: {
  //           value: "",
  //           id: "13146",
  //           type: "PDFTextField",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "13151",
  //           type: "PDFTextField",
  //         },
  //       },
  //       currentEmployer: {
  //         name: {
  //           value: "",
  //           id: "13163",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "",
  //             id: "13161",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "13160",
  //             type: "PDFTextField",
  //           },
  //           state: {
  //             value: "",
  //             id: "13159",
  //             type: "PDFDropdown",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "13157",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "",
  //             id: "13158",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       },
  //       affiliatedWithForeignGov: {
  //         value: "NO",
  //         id: "13155",
  //         type: "PDFRadioGroup",
  //       },
  //       foreignGovAffiliationDetails: {
  //         value: "",
  //         id: "13152",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  // },

  // foreignActivities: {
  //   _id: Math.random(),
  //   hasForeignFinancialInterest: {
  //     value: "NO",
  //     id: "13459",
  //     type: "PDFRadioGroup",
  //   },
  //   hasForeignInterestOnBehalf: {
  //     value: "NO",
  //     id: "13458",
  //     type: "PDFRadioGroup",
  //   },
  //   wantForeignRealEstate: {
  //     value: "NO",
  //     id: "13469",
  //     type: "PDFCheckBox",
  //   },
  //   hasForeignSupport: {
  //     value: "NO",
  //     id: "13470",
  //     type: "PDFCheckBox",
  //   },
  //   providedForeignSupport: {
  //     value: "NO",
  //     id: "13471",
  //     type: "PDFCheckBox",
  //   },
  //   providedForeignAdvice: {
  //     value: "NO",
  //     id: "13472",
  //     type: "PDFCheckBox",
  //   },
  //   familyProvidedForeignAdvice: {
  //     value: "NO",
  //     id: "13468",
  //     type: "PDFTextField",
  //   },
  //   offeredForeignJob: {
  //     value: "NO",
  //     id: "13447",
  //     type: "date",
  //   },
  //   offeredBuisnessVenture: {
  //     value: "NO",
  //     id: "13446",
  //     type: "PDFCheckBox",
  //   },
  //   foreignConferences: {
  //     value: "NO",
  //     id: "13442",
  //     type: "PDFTextField",
  //   },
  //   contactForeignGovernment: {
  //     value: "NO",
  //     id: "13465",
  //     type: "PDFTextField",
  //   },
  //   sponsoredForeignNational: {
  //     value: "NO",
  //     id: "13466",
  //     type: "PDFCheckBox",
  //   },
  //   foreignPoliticalOffice: {
  //     value: "NO",
  //     id: "13467",
  //     type: "PDFTextField",
  //   },
  //   foreignVote: {
  //     value: "NO",
  //     id: "13464",
  //     type: "PDFCheckBox",
  //   },
  //   traveledOutsideUSA: {
  //     value: "NO",
  //     id: "13462",
  //     type: "date",
  //   },
  //   traveledOutsideUSA_Government: {
  //     value: "NO",
  //     id: "13463",
  //     type: "PDFCheckBox",
  //   },
  //   section20A1: [
  //     {
  //       id_: Math.random(),
  //       ownershipType: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Yourself",
  //             id: "13523",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //       financialInterestType: {
  //         value: "",
  //         id: "13545",
  //         type: "PDFTextField",
  //       },
  //       dateAcquired: {
  //         date: {
  //           value: "",
  //           id: "13566",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13543",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       howAcquired: {
  //         value: "",
  //         id: "13564",
  //         type: "PDFTextField",
  //       },
  //       costAtAcquisition: {
  //         value: {
  //           value: 0,
  //           id: "13821",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13565",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       currentValue: {
  //         value: {
  //           value: 0,
  //           id: "",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13528",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       dateControlRelinquished: {
  //         date: {
  //           value: "",
  //           id: "13527",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13529",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       disposalExplanation: {
  //         value: "",
  //         id: "13525",
  //         type: "PDFTextField",
  //       },
  //       hasCoOwners: {
  //         value: "NO",
  //         id: "13568",
  //         type: "PDFRadioGroup",
  //       },
  //       coOwners: [
  //         {
  //           _id: Math.random(),
  //           lastName: {
  //             value: "",
  //             id: "13539",
  //             type: "PDFTextField",
  //           },
  //           firstName: {
  //             value: "",
  //             id: "13538",
  //             type: "PDFTextField",
  //           },
  //           middleName: {
  //             value: "",
  //             id: "13540",
  //             type: "PDFTextField",
  //           },
  //           suffix: {
  //             value: "",
  //             id: "13541",
  //             type: "PDFDropdown",
  //           },
  //           address: {
  //             street: {
  //               value: "",
  //               id: "13537",
  //               type: "PDFTextField",
  //             },
  //             city: {
  //               value: "",
  //               id: "13536",
  //               type: "PDFTextField",
  //             },
  //             state: {
  //               value: "",
  //               id: "13535",
  //               type: "PDFDropdown",
  //             },
  //             zipCode: {
  //               value: "",
  //               id: "13533",
  //               type: "PDFTextField",
  //             },
  //             country: {
  //               value: "",
  //               id: "13534",
  //               type: "PDFDropdown",
  //             },
  //           },
  //           citizenships: [
  //             {
  //               _id: Math.random(),
  //               type: {
  //                 value: "",
  //                 id: "13532",
  //                 type: "PDFDropdown",
  //               },
  //             },
  //           ],
  //           relationship: {
  //             value: "",
  //             id: "13542",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   section20A2: [
  //     {
  //       id_: Math.random(),
  //       ownershipType: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Yourself",
  //             id: "13579",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //       financialInterestType: {
  //         value: "",
  //         id: "13602",
  //         type: "PDFTextField",
  //       },
  //       controllerInfo: {
  //         lastName: {
  //           value: "",
  //           id: "13571",
  //           type: "PDFTextField",
  //         },
  //         firstName: {
  //           value: "",
  //           id: "13572",
  //           type: "PDFTextField",
  //         },
  //         middleName: {
  //           value: "",
  //           id: "13573",
  //           type: "PDFTextField",
  //         },
  //         suffix: {
  //           value: "",
  //           id: "13574",
  //           type: "PDFDropdown",
  //         },
  //         relationship: {
  //           value: "",
  //           id: "13570",
  //           type: "PDFTextField",
  //         },
  //       },
  //       dateAcquired: {
  //         date: {
  //           value: "",
  //           id: "13575",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13574",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       costAtAcquisition: {
  //         value: {
  //           value: 0,
  //           id: "",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13600",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       currentValue: {
  //         value: {
  //           value: 0,
  //           id: "13821",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13585",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       dateDisposed: {
  //         date: {
  //           value: "",
  //           id: "13584",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13586",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       disposalExplanation: {
  //         value: "",
  //         id: "13582",
  //         type: "PDFTextField",
  //       },
  //       hasCoOwners: {
  //         value: "NO",
  //         id: "13577",
  //         type: "PDFRadioGroup",
  //       },
  //       coOwners: [
  //         {
  //           _id: Math.random(),
  //           lastName: {
  //             value: "",
  //             id: "13596",
  //             type: "PDFTextField",
  //           },
  //           firstName: {
  //             value: "",
  //             id: "13595",
  //             type: "PDFTextField",
  //           },
  //           middleName: {
  //             value: "",
  //             id: "13597",
  //             type: "PDFTextField",
  //           },
  //           suffix: {
  //             value: "",
  //             id: "13598",
  //             type: "PDFDropdown",
  //           },
  //           address: {
  //             street: {
  //               value: "",
  //               id: "13594",
  //               type: "PDFTextField",
  //             },
  //             city: {
  //               value: "",
  //               id: "13593",
  //               type: "PDFTextField",
  //             },
  //             state: {
  //               value: "",
  //               id: "13592",
  //               type: "PDFDropdown",
  //             },
  //             zipCode: {
  //               value: "",
  //               id: "13590",
  //               type: "PDFTextField",
  //             },
  //             country: {
  //               value: "",
  //               id: "13591",
  //               type: "PDFDropdown",
  //             },
  //           },
  //           citizenships: [
  //             {
  //               _id: Math.random(),
  //               type: {
  //                 value: "",
  //                 id: "13589",
  //                 type: "PDFDropdown",
  //               },
  //             },
  //           ],
  //           relationship: {
  //             value: "",
  //             id: "13599",
  //             type: "PDFTextField",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           lastName: {
  //             value: "",
  //             id: "13612",
  //             type: "PDFTextField",
  //           },
  //           firstName: {
  //             value: "",
  //             id: "13611",
  //             type: "PDFTextField",
  //           },
  //           middleName: {
  //             value: "",
  //             id: "13613",
  //             type: "PDFTextField",
  //           },
  //           suffix: {
  //             value: "",
  //             id: "13614",
  //             type: "PDFDropdown",
  //           },
  //           address: {
  //             street: {
  //               value: "",
  //               id: "13610",
  //               type: "PDFTextField",
  //             },
  //             city: {
  //               value: "",
  //               id: "13609",
  //               type: "PDFTextField",
  //             },
  //             state: {
  //               value: "",
  //               id: "13608",
  //               type: "PDFDropdown",
  //             },
  //             zipCode: {
  //               value: "",
  //               id: "13606",
  //               type: "PDFTextField",
  //             },
  //             country: {
  //               value: "",
  //               id: "13607",
  //               type: "PDFDropdown",
  //             },
  //           },
  //           citizenships: [
  //             {
  //               _id: Math.random(),
  //               type: {
  //                 value: "",
  //                 id: "13605",
  //                 type: "PDFDropdown",
  //               },
  //             },
  //           ],
  //           relationship: {
  //             value: "",
  //             id: "13615",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   section20A3: [
  //     {
  //       id_: Math.random(),
  //       ownershipType: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Yourself",
  //             id: "13755",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value:
  //               "Spouse or legally recognized civil union/domestic partner",
  //             id: "13747",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Cohabitant",
  //             id: "13702",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Dependent children",
  //             id: "13703",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],
  //       realEstateType: {
  //         value: "",
  //         id: "13708",
  //         type: "PDFRadioGroup",
  //       },
  //       location: {
  //         street: {
  //           value: "",
  //           id: "13832",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "13831",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "13830",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "13828",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "13829",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       dateOfPurchase: {
  //         date: {
  //           value: "",
  //           id: "13746",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13745",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       howAcquired: {
  //         value: "",
  //         id: "13753",
  //         type: "PDFTextField",
  //       },
  //       dateSold: {
  //         date: {
  //           value: "",
  //           id: "13736",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13733",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       costAtAcquisition: {
  //         value: {
  //           value: 0,
  //           id: "",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13803",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       hasCoOwners: {
  //         value: "NO",
  //         id: "13836",
  //         type: "PDFRadioGroup",
  //       },
  //       coOwners: [
  //         {
  //           _id: Math.random(),
  //           lastName: {
  //             value: "",
  //             id: "13825",
  //             type: "PDFTextField",
  //           },
  //           firstName: {
  //             value: "",
  //             id: "13824",
  //             type: "PDFTextField",
  //           },
  //           middleName: {
  //             value: "",
  //             id: "13826",
  //             type: "PDFTextField",
  //           },
  //           suffix: {
  //             value: "",
  //             id: "13827",
  //             type: "PDFDropdown",
  //           },
  //           address: {
  //             street: {
  //               value: "",
  //               id: "13832",
  //               type: "PDFTextField",
  //             },
  //             city: {
  //               value: "",
  //               id: "13831",
  //               type: "PDFTextField",
  //             },
  //             state: {
  //               value: "",
  //               id: "13830",
  //               type: "PDFDropdown",
  //             },
  //             zipCode: {
  //               value: "",
  //               id: "13828",
  //               type: "PDFTextField",
  //             },
  //             country: {
  //               value: "",
  //               id: "13829",
  //               type: "PDFDropdown",
  //             },
  //           },
  //           citizenships: [
  //             {
  //               _id: Math.random(),
  //               type: {
  //                 value: "",
  //                 id: "13819",
  //                 type: "PDFDropdown",
  //               },
  //             },
  //           ],
  //           relationship: {
  //             value: "",
  //             id: "13823",
  //             type: "PDFTextField",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           lastName: {
  //             value: "",
  //             id: "13842",
  //             type: "PDFTextField",
  //           },
  //           firstName: {
  //             value: "",
  //             id: "13841",
  //             type: "PDFTextField",
  //           },
  //           middleName: {
  //             value: "",
  //             id: "13843",
  //             type: "PDFTextField",
  //           },
  //           suffix: {
  //             value: "",
  //             id: "13844",
  //             type: "PDFDropdown",
  //           },
  //           address: {
  //             street: {
  //               value: "",
  //               id: "13849",
  //               type: "PDFTextField",
  //             },
  //             city: {
  //               value: "",
  //               id: "13848",
  //               type: "PDFTextField",
  //             },
  //             state: {
  //               value: "",
  //               id: "13847",
  //               type: "PDFDropdown",
  //             },
  //             zipCode: {
  //               value: "",
  //               id: "13845",
  //               type: "PDFTextField",
  //             },
  //             country: {
  //               value: "",
  //               id: "13846",
  //               type: "PDFDropdown",
  //             },
  //           },
  //           citizenships: [
  //             {
  //               _id: Math.random(),
  //               type: {
  //                 value: "",
  //                 id: "13834",
  //                 type: "PDFDropdown",
  //               },
  //             },
  //           ],
  //           relationship: {
  //             value: "",
  //             id: "13840",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   section20A4: [
  //     {
  //       id_: Math.random(),
  //       ownershipType: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Yourself",
  //             id: "13755",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value:
  //               "Spouse or legally recognized civil union/domestic partner",
  //             id: "13747",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Cohabitant",
  //             id: "13702",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Dependent children",
  //             id: "13703",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],
  //       benefitType: {
  //         _id: Math.random(),
  //         type: "Educational",
  //         other: {
  //           value: "",
  //           id: "13704",
  //           type: "PDFTextField",
  //         },
  //       },
  //       benefitFrequency: {
  //         type: "Onetime benefit",
  //         other: {
  //           value: "",
  //           id: "13749",
  //           type: "PDFTextField",
  //         },
  //       },
  //       oneTimeBenefit: {
  //         dateReceived: {
  //           date: {
  //             value: "",
  //             id: "13746",
  //             type: "date",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13745",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         countryProviding: {
  //           value: "",
  //           id: "13741",
  //           type: "PDFDropdown",
  //         },
  //         totalValue: {
  //           value: {
  //             value: 0,
  //             id: "",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13743",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         reason: {
  //           value: "",
  //           id: "13742",
  //           type: "PDFTextField",
  //         },
  //         obligatedToForeignCountry: {
  //           value: "NO",
  //           id: "13759",
  //           type: "PDFRadioGroup",
  //         },
  //         explanation: {
  //           value: "",
  //           id: "13754",
  //           type: "PDFTextField",
  //         },
  //         frequency: {
  //           _id: Math.random(),
  //           type: {
  //             value: "Annually",
  //             id: "",
  //             type: "PDFRadioGroup",
  //           },
  //           other: {
  //             value: "",
  //             id: "13728",
  //             type: "PDFTextField",
  //           },
  //         },
  //       },
  //       futureBenefit: {
  //         dateReceived: {
  //           date: {
  //             value: "",
  //             id: "13736",
  //             type: "date",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13733",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         countryProviding: {
  //           value: "",
  //           id: "13740",
  //           type: "PDFDropdown",
  //         },
  //         totalValue: {
  //           value: {
  //             value: 0,
  //             id: "",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13743",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         reason: {
  //           value: "",
  //           id: "13732",
  //           type: "PDFTextField",
  //         },
  //         obligatedToForeignCountry: {
  //           value: "NO",
  //           id: "13759",
  //           type: "PDFRadioGroup",
  //         },
  //         explanation: {
  //           value: "",
  //           id: "13754",
  //           type: "PDFTextField",
  //         },
  //         frequency: {
  //           _id: Math.random(),
  //           type: {
  //             value: "Annually",
  //             id: "",
  //             type: "PDFRadioGroup",
  //           },
  //           other: {
  //             value: "",
  //             id: "13728",
  //             type: "PDFTextField",
  //           },
  //         },
  //       },
  //       continuingBenefit: {
  //         dateReceived: {
  //           date: {
  //             value: "",
  //             id: "13781",
  //             type: "date",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13780",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         countryProviding: {
  //           value: "",
  //           id: "13785",
  //           type: "PDFDropdown",
  //         },
  //         totalValue: {
  //           value: {
  //             value: 0,
  //             id: "",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13718",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         reason: {
  //           value: "",
  //           id: "13717",
  //           type: "PDFTextField",
  //         },
  //         obligatedToForeignCountry: {
  //           value: "NO",
  //           id: "13783",
  //           type: "PDFRadioGroup",
  //         },
  //         explanation: {
  //           value: "",
  //           id: "13784",
  //           type: "PDFTextField",
  //         },
  //         frequency: {
  //           _id: Math.random(),
  //           type: {
  //             value: "Annually",
  //             id: "",
  //             type: "PDFRadioGroup",
  //           },
  //           other: {
  //             value: "",
  //             id: "13714",
  //             type: "PDFTextField",
  //           },
  //         },
  //       },
  //     },
  //   ],
  //   section20A5: [
  //     {
  //       id_: Math.random(),
  //       lastName: {
  //         value: "",
  //         id: "13825",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "",
  //         id: "13824",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "",
  //         id: "13826",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "",
  //         id: "13827",
  //         type: "PDFDropdown",
  //       },
  //       address: {
  //         street: {
  //           value: "",
  //           id: "13832",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "13831",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "13830",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "13828",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "13829",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       relationship: {
  //         value: "",
  //         id: "13823",
  //         type: "PDFTextField",
  //       },
  //       amountProvided: {
  //         value: {
  //           value: 0,
  //           id: "13821",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13822",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       citizenships: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "",
  //             id: "13819",
  //             type: "PDFDropdown",
  //           },
  //           notApplicable: {
  //             value: "NO",
  //             id: "13818",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "",
  //             id: "13818",
  //             type: "PDFDropdown",
  //           },
  //           notApplicable: {
  //             value: "NO",
  //             id: "13818",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],
  //       frequency: {
  //         _id: Math.random(),
  //         type: {
  //           value: "Annually",
  //           id: "13811",
  //           type: "PDFRadioGroup",
  //         },
  //         other: {
  //           value: "",
  //           id: "13808",
  //           type: "PDFTextField",
  //         },
  //       },
  //     },
  //   ],
  //   section20B1: [
  //     {
  //       id_: Math.random(),
  //       description: {
  //         value: "",
  //         id: "13892",
  //         type: "PDFTextField",
  //       },
  //       individual: {
  //         lastName: {
  //           value: "",
  //           id: "13898",
  //           type: "PDFTextField",
  //         },
  //         firstName: {
  //           value: "",
  //           id: "13897",
  //           type: "PDFTextField",
  //         },
  //         middleName: {
  //           value: "",
  //           id: "13896",
  //           type: "PDFTextField",
  //         },
  //         suffix: {
  //           value: "",
  //           id: "13895",
  //           type: "PDFDropdown",
  //         },
  //         relationship: {
  //           value: "",
  //           id: "13933",
  //           type: "PDFTextField",
  //         },
  //       },
  //       organization: {
  //         value: "",
  //         id: "13894",
  //         type: "PDFTextField",
  //       },
  //       organizationCountry: {
  //         value: "",
  //         id: "13893",
  //         type: "PDFDropdown",
  //       },
  //       dateFrom: {
  //         date: {
  //           value: "",
  //           id: "13891",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13890",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       dateTo: {
  //         date: {
  //           value: "",
  //           id: "13889",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13887",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       compensation: {
  //         value: "",
  //         id: "13886",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section20B2: [
  //     {
  //       id_: Math.random(),
  //       lastName: {
  //         value: "",
  //         id: "13866",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "",
  //         id: "13865",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "",
  //         id: "13867",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "",
  //         id: "13868",
  //         type: "PDFDropdown",
  //       },
  //       agency: {
  //         value: "",
  //         id: "13864",
  //         type: "PDFTextField",
  //       },
  //       country: {
  //         value: "",
  //         id: "13863",
  //         type: "PDFDropdown",
  //       },
  //       dateOfRequest: {
  //         date: {
  //           value: "",
  //           id: "13861",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13860",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       circumstances: {
  //         value: "",
  //         id: "13862",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section20B3: [
  //     {
  //       id_: Math.random(),
  //       lastName: {
  //         value: "",
  //         id: "13913",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "",
  //         id: "13912",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "",
  //         id: "13914",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "",
  //         id: "13915",
  //         type: "PDFDropdown",
  //       },
  //       positionDescription: {
  //         value: "",
  //         id: "13911",
  //         type: "PDFTextField",
  //       },
  //       dateOffered: {
  //         date: {
  //           value: "",
  //           id: "13909",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13910",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       accepted: {
  //         value: "NO",
  //         id: "13908",
  //         type: "PDFRadioGroup",
  //       },
  //       explanation: {
  //         value: "",
  //         id: "13901",
  //         type: "PDFTextField",
  //       },
  //       location: {
  //         street: {
  //           value: "",
  //           id: "13905",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "13905",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "13904",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "13902",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "13903",
  //           type: "PDFDropdown",
  //         },
  //       },
  //     },
  //   ],
  //   section20B4: [
  //     {
  //       id_: Math.random(),
  //       lastName: {
  //         value: "",
  //         id: "13937",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "",
  //         id: "13936",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "",
  //         id: "13938",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "",
  //         id: "13939",
  //         type: "PDFDropdown",
  //       },
  //       address: {
  //         street: {
  //           value: "",
  //           id: "13944",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "13943",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "13942",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "13940",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "13941",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       citizenships: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "",
  //             id: "13950",
  //             type: "PDFDropdown",
  //           },
  //           notApplicable: {
  //             value: "NO",
  //             id: "13950",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "",
  //             id: "13949",
  //             type: "PDFDropdown",
  //           },
  //           notApplicable: {
  //             value: "NO",
  //             id: "13949",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       ],
  //       ventureDescription: {
  //         value: "",
  //         id: "13934",
  //         type: "PDFTextField",
  //       },
  //       dateFrom: {
  //         date: {
  //           value: "",
  //           id: "13981",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13980",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       dateTo: {
  //         date: {
  //           value: "",
  //           id: "13979",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13977",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       natureOfAssociation: {
  //         value: "",
  //         id: "13935",
  //         type: "PDFTextField",
  //       },
  //       positionHeld: {
  //         value: "",
  //         id: "13973",
  //         type: "PDFTextField",
  //       },
  //       financialSupport: {
  //         value: {
  //           value: 0,
  //           id: "13972",
  //           type: "number",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "13972",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       compensationDescription: {
  //         value: "",
  //         id: "13975",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section20B5: [
  //     {
  //       id_: Math.random(),
  //       eventDescription: {
  //         value: "",
  //         id: "13993",
  //         type: "PDFTextField",
  //       },
  //       eventDates: {
  //         fromDate: {
  //           date: {
  //             value: "",
  //             id: "13989",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13988",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         toDate: {
  //           date: {
  //             value: "",
  //             id: "13987",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13985",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "13986",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       purpose: {
  //         value: "",
  //         id: "13991",
  //         type: "PDFTextField",
  //       },
  //       sponsoringOrganization: {
  //         value: "",
  //         id: "13990",
  //         type: "PDFTextField",
  //       },
  //       eventLocation: {
  //         street: {
  //           value: "",
  //           id: "13984",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "13984",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "13984",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "13984",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "13992",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       hasContacts: {
  //         value: "NO",
  //         id: "13983",
  //         type: "PDFRadioGroup",
  //       },
  //       subsequentContacts: [
  //         {
  //           _id: Math.random(),
  //           contactExplanation: {
  //             value: "",
  //             id: "14016",
  //             type: "PDFTextField",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           contactExplanation: {
  //             value: "",
  //             id: "14015",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   section20B6: [
  //     {
  //       id_: Math.random(),
  //       individual: {
  //         lastName: {
  //           value: "",
  //           id: "14043",
  //           type: "PDFTextField",
  //         },
  //         firstName: {
  //           value: "",
  //           id: "14042",
  //           type: "PDFTextField",
  //         },
  //         middleName: {
  //           value: "",
  //           id: "14044",
  //           type: "PDFTextField",
  //         },
  //         suffix: {
  //           value: "",
  //           id: "14045",
  //           type: "PDFDropdown",
  //         },
  //         relationship: {
  //           value: "",
  //           id: "14076",
  //           type: "PDFTextField",
  //         },
  //       },
  //       contactLocation: {
  //         street: {
  //           value: "",
  //           id: "14049",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "14049",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "14048",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "14046",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "14047",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       contactDate: {
  //         date: {
  //           value: "",
  //           id: "14041",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "14040",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       establishmentType: {
  //         value: "",
  //         id: "14074",
  //         type: "PDFTextField",
  //       },
  //       foreignRepresentatives: {
  //         value: "",
  //         id: "14018",
  //         type: "PDFTextField",
  //       },
  //       purposeCircumstances: {
  //         value: "",
  //         id: "14017",
  //         type: "PDFTextField",
  //       },
  //       hasContact: {
  //         value: "NO",
  //         id: "14039",
  //         type: "PDFRadioGroup",
  //       },
  //       subsequentContact: [
  //         {
  //           _id: Math.random(),
  //           purpose: {
  //             value: "",
  //             id: "14037",
  //             type: "PDFTextField",
  //           },
  //           dateOfMostRecentContact: {
  //             date: {
  //               value: "",
  //               id: "14036",
  //               type: "PDFTextField",
  //             },
  //             estimated: {
  //               value: "NO",
  //               id: "14036",
  //               type: "PDFCheckBox",
  //             },
  //           },
  //           plansForFutureContact: {
  //             value: "",
  //             id: "14035",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   section20B7: [
  //     {
  //       id_: Math.random(),
  //       lastName: {
  //         value: "",
  //         id: "14101",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "",
  //         id: "14102",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "",
  //         id: "14103",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "",
  //         id: "14104",
  //         type: "PDFDropdown",
  //       },
  //       dateOfBirth: {
  //         date: {
  //           value: "",
  //           id: "14105",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "14106",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       placeOfBirth: {
  //         street: {
  //           value: "",
  //           id: "14107",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "14108",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "14109",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "14110",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "14111",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       currentAddress: {
  //         street: {
  //           value: "",
  //           id: "14112",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "14113",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "14114",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "14115",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "14116",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       citizenships: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "",
  //             id: "14118",
  //             type: "PDFTextField",
  //           },
  //           notApplicable: {
  //             value: "NO",
  //             id: "14119",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],
  //       sponsoringOrganization: {
  //         name: {
  //           value: "",
  //           id: "14120",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "",
  //             id: "14121",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "14122",
  //             type: "PDFTextField",
  //           },
  //           state: {
  //             value: "",
  //             id: "14123",
  //             type: "PDFDropdown",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "14124",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "",
  //             id: "14125",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         notApplicable: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       datesOfStay: {
  //         fromDate: {
  //           date: {
  //             value: "",
  //             id: "14126",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "14127",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         toDate: {
  //           date: {
  //             value: "",
  //             id: "14128",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "14129",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "14130",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       addressDuringStay: {
  //         street: {
  //           value: "",
  //           id: "14131",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "14132",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "14133",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "14134",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "14135",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       purposeOfStay: {
  //         value: "",
  //         id: "14136",
  //         type: "PDFTextField",
  //       },
  //       purposeOfSponsorship: {
  //         value: "",
  //         id: "14137",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section20B8: [
  //     {
  //       id_: Math.random(),
  //       positionHeld: {
  //         value: "",
  //         id: "14301",
  //         type: "PDFTextField",
  //       },
  //       datesHeld: {
  //         fromDate: {
  //           date: {
  //             value: "",
  //             id: "14302",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "14303",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         toDate: {
  //           date: {
  //             value: "",
  //             id: "14304",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "14305",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "14306",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       reasonForActivities: {
  //         value: "",
  //         id: "14307",
  //         type: "PDFTextField",
  //       },
  //       currentEligibility: {
  //         value: "",
  //         id: "14308",
  //         type: "PDFTextField",
  //       },
  //       countryInvolved: {
  //         value: "",
  //         id: "14309",
  //         type: "PDFDropdown",
  //       },
  //     },
  //   ],
  //   section20B9: [
  //     {
  //       id_: Math.random(),
  //       dateVoted: {
  //         date: {
  //           value: "",
  //           id: "14301",
  //           type: "month-day-year",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "14302",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       countryInvolved: {
  //         value: "",
  //         id: "14303",
  //         type: "PDFTextField",
  //       },
  //       reasons: {
  //         value: "",
  //         id: "14304",
  //         type: "PDFTextField",
  //       },
  //       currentEligibility: {
  //         value: "",
  //         id: "14305",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section20C: [
  //     {
  //       _id: Math.random(),
  //       countryVisited: {
  //         value: "",
  //         id: "13642",
  //         type: "PDFTextField",
  //       },
  //       travelDates: {
  //         fromDate: {
  //           date: {
  //             value: "",
  //             id: "13575",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13574",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         toDate: {
  //           date: {
  //             value: "",
  //             id: "13584",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "13586",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "13585",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       numberOfDays: [
  //         {
  //           _id: Math.random(),
  //           option: {
  //             value: "1-5",
  //             id: "13626",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           option: {
  //             value: "6-10",
  //             id: "13625",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),

  //           option: {
  //             value: "11-20",
  //             id: "13627",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           option: {
  //             value: "21-30",
  //             id: "13637",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           option: {
  //             value: "More than 30",
  //             id: "13636",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           option: {
  //             value: "Many short trips",
  //             id: "13638",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],
  //       purposeOfTravel: [
  //         {
  //           _id: Math.random(),
  //           reason: {
  //             value: "Visit family or friends",
  //             id: "13639",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           reason: {
  //             value: "Trade shows, conferences, and seminars",
  //             id: "13640",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           reason: {
  //             value: "Education Tourism",
  //             id: "13641",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           reason: {
  //             value: "Volunteer activities",
  //             id: "13642",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           reason: {
  //             value: "Business/Professional conference",
  //             id: "13643",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           reason: {
  //             value: "Other",
  //             id: "13644",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],
  //       questionedOrSearched: {
  //         value: "NO",
  //         id: "13549",
  //         type: "PDFRadioButton",
  //       },
  //       questionedOrSearchedExplanation: {
  //         value: "",
  //         id: "13550",
  //         type: "PDFTextField",
  //       },
  //       encounterWithPolice: {
  //         value: "NO",
  //         id: "13577",
  //         type: "PDFRadioButton",
  //       },
  //       encounterWithPoliceExplanation: {
  //         value: "",
  //         id: "13576",
  //         type: "PDFTextField",
  //       },
  //       contactWithForeignIntelligence: {
  //         value: "NO",
  //         id: "13645",
  //         type: "PDFRadioButton",
  //       },
  //       contactWithForeignIntelligenceExplanation: {
  //         value: "",
  //         id: "13644",
  //         type: "PDFTextField",
  //       },
  //       counterintelligenceIssues: {
  //         value: "NO",
  //         id: "13652",
  //         type: "PDFRadioButton",
  //       },
  //       counterintelligenceIssuesExplanation: {
  //         value: "",
  //         id: "13651",
  //         type: "PDFTextField",
  //       },
  //       contactExhibitingInterest: {
  //         value: "NO",
  //         id: "13650",
  //         type: "PDFRadioButton",
  //       },
  //       contactExhibitingInterestExplanation: {
  //         value: "",
  //         id: "13649",
  //         type: "PDFTextField",
  //       },
  //       contactAttemptingToObtainInfo: {
  //         value: "NO",
  //         id: "13648",
  //         type: "PDFRadioButton",
  //       },
  //       contactAttemptingToObtainInfoExplanation: {
  //         value: "",
  //         id: "13647",
  //         type: "PDFTextField",
  //       },
  //       threatenedOrCoerced: {
  //         value: "NO",
  //         id: "13646",
  //         type: "PDFRadioButton",
  //       },
  //       threatenedOrCoercedExplanation: {
  //         value: "",
  //         id: "13633",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  // },
  // mentalHealth: {
  //   _id: Math.random(),
  //   declaredMentallyIncompetent: {
  //     value: "NO",
  //     id: "14351",
  //     type: "PDFRadioGroup",
  //   },
  //   consultMentalHealth: {
  //     value: "NO",
  //     id: "14352",
  //     type: "PDFRadioGroup",
  //   },
  //   hospitalizedMentalHealth: {
  //     value: "NO",
  //     id: "14353",
  //     type: "PDFRadioGroup",
  //   },
  //   beenDiagnosed: {
  //     value: "NO",
  //     id: "14354",
  //     type: "PDFRadioGroup",
  //   },
  //   delayedTreatment: {
  //     value: "NO",
  //     id: "14355",
  //     type: "PDFRadioGroup",
  //   },
  //   currentlyInTreatment: {
  //     value: "NO",
  //     id: "14356",
  //     type: "PDFRadioGroup",
  //   },
  //   substantialAffects: {
  //     value: "NO",
  //     id: "14357",
  //     type: "PDFRadioGroup",
  //   },
  //   counseling: {
  //     value: "NO",
  //     id: "14358",
  //     type: "PDFRadioGroup",
  //   },
  //   section21A: [
  //     {
  //       dateOccurred: {
  //         value: "",
  //         id: "14378",
  //         type: "PDFTextField",
  //       },
  //       estimated: {
  //         value: "NO",
  //         id: "14377",
  //         type: "PDFCheckBox",
  //       },
  //       courtAgency: {
  //         name: {
  //           value: "",
  //           id: "14376",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "",
  //             id: "14375",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "14374",
  //             type: "PDFTextField",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "14371",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "United States",
  //             id: "14372",
  //             type: "PDFDropdown",
  //           },
  //           state: {
  //             value: "",
  //             id: "14373",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       },
  //       appealed: {
  //         value: "NO",
  //         id: "14380",
  //         type: "PDFRadioGroup",
  //       },
  //       appeals: [
  //         {
  //           _id: Math.random(),
  //           courtAgency: {
  //             name: {
  //               value: "",
  //               id: "14370",
  //               type: "PDFTextField",
  //             },
  //             address: {
  //               street: {
  //                 value: "",
  //                 id: "14369",
  //                 type: "PDFTextField",
  //               },
  //               city: {
  //                 value: "",
  //                 id: "14368",
  //                 type: "PDFTextField",
  //               },
  //               zipCode: {
  //                 value: "",
  //                 id: "14365",
  //                 type: "PDFTextField",
  //               },
  //               country: {
  //                 value: "United States",
  //                 id: "14366",
  //                 type: "PDFDropdown",
  //               },
  //               state: {
  //                 value: "",
  //                 id: "14367",
  //                 type: "PDFDropdown",
  //               },
  //             },
  //           },
  //           finalDisposition: {
  //             value: "",
  //             id: "14364",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   section21B: [
  //     {
  //       dateOccurred: {
  //         value: "",
  //         id: "14455",
  //         type: "PDFTextField",
  //       },
  //       estimated: {
  //         value: "NO",
  //         id: "14454",
  //         type: "PDFCheckBox",
  //       },
  //       courtAgency: {
  //         name: {
  //           value: "",
  //           id: "14453",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "",
  //             id: "14452",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "14451",
  //             type: "PDFTextField",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "14448",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "United States",
  //             id: "14449",
  //             type: "PDFDropdown",
  //           },
  //           state: {
  //             value: "",
  //             id: "14450",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       },
  //       finalDisposition: {
  //         value: "",
  //         id: "14433",
  //         type: "PDFTextField",
  //       },
  //       appealed: {
  //         value: "NO",
  //         id: "14457",
  //         type: "PDFRadioGroup",
  //       },
  //       appeals: [
  //         {
  //           _id: Math.random(),
  //           courtAgency: {
  //             name: {
  //               value: "",
  //               id: "14447",
  //               type: "PDFTextField",
  //             },
  //             address: {
  //               street: {
  //                 value: "",
  //                 id: "14446",
  //                 type: "PDFTextField",
  //               },
  //               city: {
  //                 value: "",
  //                 id: "14445",
  //                 type: "PDFTextField",
  //               },
  //               zipCode: {
  //                 value: "",
  //                 id: "14442",
  //                 type: "PDFTextField",
  //               },
  //               country: {
  //                 value: "United States",
  //                 id: "14443",
  //                 type: "PDFDropdown",
  //               },
  //               state: {
  //                 value: "",
  //                 id: "14444",
  //                 type: "PDFDropdown",
  //               },
  //             },
  //           },
  //           finalDisposition: {
  //             value: "",
  //             id: "14441",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   section21C: [
  //     {
  //       voluntary: {
  //         value: "NO",
  //         id: "14520",
  //         type: "PDFCheckBox",
  //       },
  //       explanation: {
  //         value: "",
  //         id: "14518",
  //         type: "PDFTextField",
  //       },
  //       facility: {
  //         name: {
  //           value: "",
  //           id: "14531",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "",
  //             id: "14530",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "14529",
  //             type: "PDFTextField",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "14526",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "United States",
  //             id: "14527",
  //             type: "PDFDropdown",
  //           },
  //           state: {
  //             value: "",
  //             id: "14528",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       },
  //       fromDate: {
  //         value: "",
  //         id: "14525",
  //         type: "PDFTextField",
  //       },
  //       toDate: {
  //         value: "",
  //         id: "14523",
  //         type: "PDFTextField",
  //       },
  //       present: {
  //         value: "NO",
  //         id: "14522",
  //         type: "PDFCheckBox",
  //       },
  //       estimatedFrom: {
  //         value: "NO",
  //         id: "14524",
  //         type: "PDFCheckBox",
  //       },
  //       estimatedTo: {
  //         value: "NO",
  //         id: "14521",
  //         type: "PDFCheckBox",
  //       },
  //     },
  //   ],
  //   section21D: [
  //     {
  //       diagnosis: {
  //         value: "",
  //         id: "14562",
  //         type: "PDFTextField",
  //       },
  //       datesOfDiagnosis: {
  //         fromDate: {
  //           value: "",
  //           id: "14572",
  //           type: "PDFTextField",
  //         },
  //         toDate: {
  //           value: "",
  //           id: "14570",
  //           type: "PDFTextField",
  //         },
  //         present: {
  //           value: "NO",
  //           id: "14569",
  //           type: "PDFCheckBox",
  //         },
  //         estimatedFrom: {
  //           value: "NO",
  //           id: "14571",
  //           type: "PDFCheckBox",
  //         },
  //         estimatedTo: {
  //           value: "NO",
  //           id: "14568",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       healthCareProfessional: {
  //         name: {
  //           value: "",
  //           id: "14573",
  //           type: "PDFTextField",
  //         },
  //         telephoneFieldNumber: {
  //           value: "",
  //           id: "14565",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "",
  //           id: "14564",
  //           type: "PDFTextField",
  //         },
  //         day: {
  //           value: "NO",
  //           id: "14567",
  //           type: "PDFCheckBox",
  //         },
  //         night: {
  //           value: "NO",
  //           id: "14566",
  //           type: "PDFCheckBox",
  //         },
  //         internationalOrDsnPhoneFieldNumber: {
  //           value: "NO",
  //           id: "14563",
  //           type: "PDFCheckBox",
  //         },
  //         address: {
  //           street: {
  //             value: "",
  //             id: "14617",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "14616",
  //             type: "PDFTextField",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "14613",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "United States",
  //             id: "14614",
  //             type: "PDFDropdown",
  //           },
  //           state: {
  //             value: "",
  //             id: "14615",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       },
  //       agencyOrFacility: {
  //         name: {
  //           value: "",
  //           id: "14601",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "",
  //             id: "14611",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "14610",
  //             type: "PDFTextField",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "14607",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "United States",
  //             id: "14608",
  //             type: "PDFDropdown",
  //           },
  //           state: {
  //             value: "",
  //             id: "14609",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         telephoneFieldNumber: {
  //           value: "",
  //           id: "14598",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "",
  //           id: "14597",
  //           type: "PDFTextField",
  //         },
  //         day: {
  //           value: "NO",
  //           id: "14600",
  //           type: "PDFCheckBox",
  //         },
  //         night: {
  //           value: "NO",
  //           id: "14599",
  //           type: "PDFCheckBox",
  //         },
  //         internationalOrDsnPhoneFieldNumber: {
  //           value: "NO",
  //           id: "14596",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       counselingEffective: {
  //         value: "NO",
  //         id: "14605",
  //         type: "PDFRadioGroup",
  //       },
  //       counselingExplanation: {
  //         value: "",
  //         id: "14603",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  // },
  // policeRecord: {
  //   _id: Math.random(),
  //   part1Questions: {
  //     value: "NO",
  //     id: "14873",
  //     type: "PDFRadioGroup",
  //   },
  //   part2Questions: {
  //     value: "NO",
  //     id: "14925",
  //     type: "PDFRadioGroup",
  //   },
  //   restrainingOrder: {
  //     value: "NO",
  //     id: "",
  //     type: "PDFRadioGroup",
  //   },
  //   section22_1: [
  //     {
  //       dateOfOffense: {
  //         date: {
  //           value: "",
  //           id: "",
  //           type: "PDFTextField",
  //         },
  //         estimated: { value: "NO", id: "14920", type: "PDFCheckBox" },
  //       },
  //       description: { value: "", id: "14919", type: "PDFTextField" },
  //       involvedDomesticViolence: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       involvedFirearms: { value: "NO", id: "14876", type: "PDFCheckBox" },
  //       involvedAlcoholDrugs: {
  //         value: "NO",
  //         id: "14875",
  //         type: "PDFCheckBox",
  //       },
  //       offenseLocation: {
  //         city: { value: "", id: "14918", type: "PDFTextField" },
  //         county: { value: "", id: "14878", type: "PDFTextField" },
  //         state: { value: "", id: "14917", type: "PDFDropdown" },
  //         zip: { value: "", id: "14915", type: "PDFTextField" },
  //         country: { value: "", id: "14916", type: "PDFDropdown" },
  //       },
  //       arrestedSummonedCited: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       lawEnforcementAgencyName: {
  //         value: "",
  //         id: "14912",
  //         type: "PDFTextField",
  //       },
  //       lawEnforcementLocation: {
  //         city: { value: "", id: "14911", type: "PDFTextField" },
  //         county: { value: "", id: "14879", type: "PDFTextField" },
  //         state: { value: "", id: "14910", type: "PDFDropdown" },
  //         zip: { value: "", id: "14908", type: "PDFTextField" },
  //         country: { value: "", id: "14909", type: "PDFDropdown" },
  //       },
  //       chargedConvicted: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       courtName: { value: "", id: "14922", type: "PDFTextField" },
  //       courtLocation: {
  //         city: { value: "", id: "14905", type: "PDFTextField" },
  //         county: { value: "", id: "14880", type: "PDFTextField" },
  //         state: { value: "", id: "14904", type: "PDFDropdown" },
  //         zip: { value: "", id: "14902", type: "PDFTextField" },
  //         country: { value: "", id: "14903", type: "PDFDropdown" },
  //       },
  //       charges: [
  //         {
  //           _id: Math.random(),
  //           felonyMisdemeanor: {
  //             value: "Felony",
  //             id: "14900",
  //             type: "PDFDropdown",
  //           },
  //           charge: { value: "", id: "14899", type: "PDFTextField" },
  //           outcome: { value: "", id: "14898", type: "PDFTextField" },
  //           dateInfo: {
  //             date: {
  //               value: "",
  //               id: "",
  //               type: "PDFTextField",
  //             },
  //             estimated: { value: "NO", id: "14897", type: "PDFTextField" },
  //           },
  //         },
  //       ],
  //       sentenced: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       sentenceDescription: { value: "", id: "14928", type: "PDFTextField" },
  //       imprisonmentTermExceeding1Year: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       imprisonmentLessThan1Year: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       imprisonmentDates: {
  //         from: { value: "", id: "14946", type: "PDFTextField" },
  //         to: { value: "", id: "14932", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //         present: { value: "NO", id: "14931", type: "PDFCheckBox" },
  //       },
  //       probationParoleDates: {
  //         from: { value: "", id: "14944", type: "PDFTextField" },
  //         to: { value: "", id: "14942", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //         present: { value: "NO", id: "14941", type: "PDFCheckBox" },
  //       },
  //       awaitingTrial: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       awaitingTrialExplanation: {
  //         value: "",
  //         id: "14936",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section22_2: [
  //     {
  //       dateOfOffense: {
  //         date: {
  //           value: "",
  //           id: "",
  //           type: "PDFTextField",
  //         },
  //         estimated: { value: "NO", id: "14996", type: "PDFRadioGroup" },
  //       },
  //       description: { value: "", id: "14991", type: "PDFTextField" },
  //       involvedDomesticViolence: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       involvedFirearms: { value: "NO", id: "14999", type: "PDFCheckBox" },
  //       involvedAlcoholDrugs: {
  //         value: "NO",
  //         id: "14998",
  //         type: "PDFCheckBox",
  //       },
  //       courtName: { value: "", id: "14994", type: "PDFTextField" },
  //       courtLocation: {
  //         city: { value: "", id: "14977", type: "PDFTextField" },
  //         county: { value: "", id: "14952", type: "PDFTextField" },
  //         state: { value: "", id: "14976", type: "PDFDropdown" },
  //         zip: { value: "", id: "14974", type: "PDFTextField" },
  //         country: { value: "", id: "14975", type: "PDFDropdown" },
  //       },
  //       charges: [
  //         {
  //           _id: Math.random(),
  //           felonyMisdemeanor: {
  //             value: "Felony",
  //             id: "14972",
  //             type: "PDFDropdown",
  //           },
  //           charge: { value: "", id: "14971", type: "PDFTextField" },
  //           outcome: { value: "", id: "14970", type: "PDFTextField" },
  //           dateInfo: {
  //             date: {
  //               value: "",
  //               id: "",
  //               type: "PDFTextField",
  //             },
  //             estimated: { value: "NO", id: "14969", type: "PDFTextField" },
  //           },
  //         },
  //       ],
  //       sentenced: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       sentenceDescription: { value: "", id: "15019", type: "PDFTextField" },
  //       imprisonmentTermExceeding1Year: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       imprisonmentLessThan1Year: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       imprisonmentDates: {
  //         from: { value: "", id: "15014", type: "PDFTextField" },
  //         to: { value: "", id: "15012", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //         present: { value: "NO", id: "15011", type: "PDFCheckBox" },
  //       },
  //       probationParoleDates: {
  //         from: { value: "", id: "15009", type: "PDFTextField" },
  //         to: { value: "", id: "15007", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //         present: { value: "NO", id: "15006", type: "PDFCheckBox" },
  //       },
  //       awaitingTrial: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       awaitingTrialExplanation: {
  //         value: "",
  //         id: "15000",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section22_3: [
  //     {
  //       hasRestrainingOrder: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       orders: [
  //         {
  //           explanation: { value: "", id: "15168", type: "PDFTextField" },
  //           dateIssued: {
  //             date: {
  //               value: "",
  //               id: "",
  //               type: "PDFTextField",
  //             },
  //             estimated: { value: "NO", id: "15169", type: "PDFCheckBox" },
  //           },
  //           courtAgencyName: { value: "", id: "15167", type: "PDFTextField" },
  //           courtAgencyLocation: {
  //             city: { value: "", id: "15166", type: "PDFTextField" },
  //             county: { value: "", id: "", type: "PDFTextField" },
  //             state: { value: "", id: "15165", type: "PDFDropdown" },
  //             zip: { value: "", id: "15163", type: "PDFTextField" },
  //             country: { value: "", id: "15164", type: "PDFDropdown" },
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
  // drugActivity: {
  //   _id: Math.random(),
  //   hasUsed: {
  //     value: "NO",
  //     id: "15186",
  //     type: "PDFRadioGroup",
  //   },
  //   hasInvolvement: {
  //     value: "NO",
  //     id: "15185",
  //     type: "PDFRadioGroup",
  //   },
  //   illegalWhileProcessing: {
  //     value: "NO",
  //     id: "15256",
  //     type: "PDFRadioGroup",
  //   },
  //   usedWhilePublicSaftey: {
  //     value: "NO",
  //     id: "15255",
  //     type: "PDFRadioGroup",
  //   },
  //   usedNotPerscribed: {
  //     value: "NO",
  //     id: "15284",
  //     type: "PDFRadioGroup",
  //   },
  //   suggestedCounsoling: {
  //     value: "NO",
  //     id: "15283",
  //     type: "PDFRadioGroup",
  //   },
  //   voluntaryCounsoling: {
  //     value: "NO",
  //     id: "15288",
  //     type: "PDFRadioGroup",
  //   },
  //   section23_1: [
  //     {
  //       typeOfDrug: [
  //         {
  //           value: "Cocaine or crack cocaine (Such as rock, freebase, etc.)",
  //           id: "15174",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "THC (Such as marijuana, weed, pot, hashish, etc.)",
  //           id: "15222",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Ketamine (Such as special K, jet, etc.)",
  //           id: "15221",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Narcotics (Such as opium, morphine, codeine, heroin, etc.)",
  //           id: "15220",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value:
  //             "Stimulants (Such as amphetamines, speed, crystal meth, ecstasy, etc.)",
  //           id: "15219",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value:
  //             "Depressants (Such as barbiturates, methaqualone, tranquilizers, etc.)",
  //           id: "15218",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Hallucinogenic (Such as LSD, PCP, mushrooms, etc.)",
  //           id: "15217",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Steroids (Such as the clear, juice, etc.)",
  //           id: "15216",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Inhalants (Such as toluene, amyl nitrate, etc.)",
  //           id: "15215",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Other",
  //           id: "15214",
  //           type: "PDFCheckBox",
  //         },
  //       ],
  //       otherDrugExplanation: { value: "", id: "15213", type: "PDFTextField" },
  //       firstUse: {
  //         date: { value: "", id: "15184", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15183", type: "PDFCheckBox" },
  //       },
  //       mostRecentUse: {
  //         date: { value: "", id: "15182", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15181", type: "PDFCheckBox" },
  //       },
  //       natureOfUseFrequencyTimes: {
  //         value: "",
  //         id: "15180",
  //         type: "PDFTextField",
  //       },
  //       useWhileEmployedInPublicSafety: {
  //         value: "NO",
  //         id: "15201",
  //         type: "PDFRadioGroup",
  //       },
  //       useWhilePossessingSecurityClearance: {
  //         value: "NO",
  //         id: "15179",
  //         type: "PDFRadioGroup",
  //       },
  //       intendToUseInFuture: {
  //         value: "NO",
  //         id: "15177",
  //         type: "PDFRadioGroup",
  //       },
  //       futureUseExplanation: { value: "", id: "15175", type: "PDFTextField" },
  //     },
  //   ],
  //   section23_2: [
  //     {
  //       typeOfDrug: [
  //         {
  //           value: "Cocaine or crack cocaine (Such as rock, freebase, etc.)",
  //           id: "15242",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "THC (Such as marijuana, weed, pot, hashish, etc.)",
  //           id: "15241",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Ketamine (Such as special K, jet, etc.)",
  //           id: "15240",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Narcotics (Such as opium, morphine, codeine, heroin, etc.)",
  //           id: "15239",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value:
  //             "Stimulants (Such as amphetamines, speed, crystal meth, ecstasy, etc.)",
  //           id: "15238",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value:
  //             "Depressants (Such as barbiturates, methaqualone, tranquilizers, etc.)",
  //           id: "15237",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Hallucinogenic (Such as LSD, PCP, mushrooms, etc.)",
  //           id: "15236",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Steroids (Such as the clear, juice, etc.)",
  //           id: "15235",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Inhalants (Such as toluene, amyl nitrate, etc.)",
  //           id: "15234",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Other",
  //           id: "15233",
  //           type: "PDFCheckBox",
  //         },
  //       ],
  //       otherDrugExplanation: { value: "", id: "15272", type: "PDFTextField" },
  //       firstInvolvement: {
  //         date: { value: "", id: "15270", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15269", type: "PDFCheckBox" },
  //       },
  //       mostRecentInvolvement: {
  //         date: { value: "", id: "15268", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15267", type: "PDFCheckBox" },
  //       },
  //       natureAndFrequencyOfActivity: {
  //         value: "",
  //         id: "15271",
  //         type: "PDFTextField",
  //       },
  //       reasonsForActivity: { value: "", id: "15248", type: "PDFTextField" },
  //       involvementWhileEmployedInPublicSafety: {
  //         value: "NO",
  //         id: "15254",
  //         type: "PDFRadioGroup",
  //       },
  //       involvementWhilePossessingSecurityClearance: {
  //         value: "NO",
  //         id: "15252",
  //         type: "PDFRadioGroup",
  //       },
  //       intendToEngageInFuture: {
  //         value: "NO",
  //         id: "15250",
  //         type: "PDFRadioGroup",
  //       },
  //       futureEngagementExplanation: {
  //         value: "",
  //         id: "15266",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section23_3: [
  //     {
  //       descriptionOfInvolvement: {
  //         value: "",
  //         id: "15277",
  //         type: "PDFTextField",
  //       },
  //       NumberOfTimesInvolved: { value: "", id: "15278", type: "PDFTextField" },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //     },
  //     {
  //       descriptionOfInvolvement: {
  //         value: "",
  //         id: "15301",
  //         type: "PDFTextField",
  //       },
  //       NumberOfTimesInvolved: { value: "", id: "15302", type: "PDFTextField" },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //     },
  //   ],
  //   section23_4: [
  //     {
  //       descriptionOfInvolvement: {
  //         value: "",
  //         id: "15285",
  //         type: "PDFTextField",
  //       },
  //       NumberOfTimesInvolved: { value: "", id: "15286", type: "PDFTextField" },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //     },
  //     {
  //       descriptionOfInvolvement: {
  //         value: "",
  //         id: "15289",
  //         type: "PDFTextField",
  //       },
  //       NumberOfTimesInvolved: { value: "", id: "15290", type: "PDFTextField" },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //     },
  //   ],
  //   section23_5: [
  //     {
  //       nameOfPrescriptionDrug: {
  //         value: "",
  //         id: "15310",
  //         type: "PDFTextField",
  //       },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       reasonsForMisuse: { value: "", id: "15311", type: "PDFTextField" },
  //       involvementWhileEmployedInPublicSafety: {
  //         value: "NO",
  //         id: "15309",
  //         type: "PDFRadioGroup",
  //       },
  //       involvementWhilePossessingSecurityClearance: {
  //         value: "NO",
  //         id: "15331",
  //         type: "PDFRadioGroup",
  //       },
  //     },
  //     {
  //       nameOfPrescriptionDrug: {
  //         value: "",
  //         id: "15329",
  //         type: "PDFTextField",
  //       },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       reasonsForMisuse: { value: "", id: "15330", type: "PDFTextField" },
  //       involvementWhileEmployedInPublicSafety: {
  //         value: "NO",
  //         id: "15328",
  //         type: "PDFRadioGroup",
  //       },
  //       involvementWhilePossessingSecurityClearance: {
  //         value: "NO",
  //         id: "15325",
  //         type: "PDFRadioGroup",
  //       },
  //     },
  //   ],
  //   section23_6: [
  //     {
  //       orderedBy: [
  //         {
  //           value:
  //             "An employer, military commander, or employee assistance program",
  //           id: "15366",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "A court official / judge",
  //           id: "15363",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "A medical professional",
  //           id: "15365",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value:
  //             "I have not been ordered, advised, or asked to seek counseling or treatment by any of the above.",
  //           id: "15362",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "A mental health professional",
  //           id: "15364",
  //           type: "PDFRadioGroup",
  //         },
  //       ],
  //       orderedExplanation: { value: "", id: "15361", type: "PDFTextField" },
  //       receivedTreatment: { value: "NO", id: "15359", type: "PDFRadioGroup" },
  //       noTreatmentExplanation: {
  //         value: "",
  //         id: "15358",
  //         type: "PDFTextField",
  //       },
  //       typeOfDrug: [
  //         {
  //           value: "Cocaine or crack cocaine (Such as rock, freebase, etc.)",
  //           id: "15341",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "THC (Such as marijuana, weed, pot, hashish, etc.)",
  //           id: "15340",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Ketamine (Such as special K, jet, etc.)",
  //           id: "15339",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Narcotics (Such as opium, morphine, codeine, heroin, etc.)",
  //           id: "15338",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value:
  //             "Stimulants (Such as amphetamines, speed, crystal meth, ecstasy, etc.)",
  //           id: "15337",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value:
  //             "Depressants (Such as barbiturates, methaqualone, tranquilizers, etc.)",
  //           id: "15336",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Hallucinogenic (Such as LSD, PCP, mushrooms, etc.)",
  //           id: "15335",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Steroids (Such as the clear, juice, etc.)",
  //           id: "15334",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Inhalants (Such as toluene, amyl nitrate, etc.)",
  //           id: "15333",
  //           type: "PDFRadioGroup",
  //         },
  //         { value: "Other", id: "15332", type: "PDFRadioGroup" },
  //       ],
  //       otherDrugExplanation: { value: "", id: "15342", type: "PDFTextField" },
  //       treatmentProviderName: {
  //         lastName: { value: "", id: "15352", type: "PDFTextField" },
  //         firstName: { value: "", id: "15351", type: "PDFTextField" },
  //       },
  //       treatmentProviderAddress: {
  //         street: { value: "", id: "15357", type: "PDFTextField" },
  //         city: { value: "", id: "15356", type: "PDFTextField" },
  //         state: { value: "", id: "15355", type: "PDFDropdown" },
  //         zipCode: { value: "", id: "15353", type: "PDFTextField" },
  //         country: { value: "", id: "15354", type: "PDFDropdown" },
  //       },
  //       treatmentProviderPhone: {
  //         number: { value: "", id: "15350", type: "PDFTextField" },
  //         international: { value: "NO", id: "15348", type: "PDFCheckBox" },
  //         timeOfDay: { value: "Day", id: "15347", type: "PDFCheckBox" },
  //       },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       successfullyCompleted: {
  //         value: "NO",
  //         id: "15345",
  //         type: "PDFRadioGroup",
  //       },
  //       completionExplanation: { value: "", id: "15343", type: "PDFTextField" },
  //     },
  //   ],
  //   section23_7: [
  //     {
  //       typeOfDrug: [
  //         {
  //           value: "Cocaine or crack cocaine (Such as rock, freebase, etc.)",
  //           id: "15480",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "THC (Such as marijuana, weed, pot, hashish, etc.)",
  //           id: "15479",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Ketamine (Such as special K, jet, etc.)",
  //           id: "15478",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Narcotics (Such as opium, morphine, codeine, heroin, etc.)",
  //           id: "15477",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value:
  //             "Stimulants (Such as amphetamines, speed, crystal meth, ecstasy, etc.)",
  //           id: "15476",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value:
  //             "Depressants (Such as barbiturates, methaqualone, tranquilizers, etc.)",
  //           id: "15475",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Hallucinogenic (Such as LSD, PCP, mushrooms, etc.)",
  //           id: "15474",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Steroids (Such as the clear, juice, etc.)",
  //           id: "15473",
  //           type: "PDFRadioGroup",
  //         },
  //         {
  //           value: "Inhalants (Such as toluene, amyl nitrate, etc.)",
  //           id: "15472",
  //           type: "PDFRadioGroup",
  //         },
  //         { value: "Other", id: "15471", type: "PDFRadioGroup" },
  //       ],
  //       otherDrugExplanation: { value: "", id: "15470", type: "PDFTextField" },
  //       treatmentProviderName: {
  //         lastName: { value: "", id: "15421", type: "PDFTextField" },
  //         firstName: { value: "", id: "15420", type: "PDFTextField" },
  //       },
  //       treatmentProviderAddress: {
  //         street: { value: "", id: "15436", type: "PDFTextField" },
  //         city: { value: "", id: "15435", type: "PDFTextField" },
  //         state: { value: "", id: "15434", type: "PDFDropdown" },
  //         zipCode: { value: "", id: "15432", type: "PDFTextField" },
  //         country: { value: "", id: "15433", type: "PDFDropdown" },
  //       },
  //       treatmentProviderPhone: {
  //         number: { value: "", id: "15426", type: "PDFTextField" },
  //         international: { value: "NO", id: "15424", type: "PDFCheckBox" },
  //         timeOfDay: { value: "Day", id: "15423", type: "PDFCheckBox" },
  //       },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       successfullyCompleted: {
  //         value: "NO",
  //         id: "15419",
  //         type: "PDFRadioGroup",
  //       },
  //       completionExplanation: { value: "", id: "15417", type: "PDFTextField" },
  //     },
  //   ],
  // },
  // alcoholUse: {
  //   _id: Math.random(),
  //   negativeImpact: {
  //     value: "NO",
  //     id: "15504",
  //     type: "PDFRadioGroup",
  //   },
  //   suggestedCounseling: {
  //     value: "NO",
  //     id: "15570",
  //     type: "PDFRadioGroup",
  //   },
  //   voluntaryCounseling: {
  //     value: "NO",
  //     id: "15582",
  //     type: "PDFRadioGroup",
  //   },
  //   additionalCounseling: {
  //     value: "NO",
  //     id: "15641",
  //     type: "PDFRadioGroup",
  //   },
  //   section24_1: [
  //     {
  //       _id: Math.random(),
  //       negativeImpactDate: {
  //         date: { value: "", id: "15282", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //       },
  //       datesOfInvolvement: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       circumstances: {
  //         value: "",
  //         id: "15500",
  //         type: "PDFTextField",
  //       },
  //       negativeImpact: {
  //         value: "",
  //         id: "15499",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: Math.random(),
  //       negativeImpactDate: {
  //         date: { value: "", id: "15282", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //       },
  //       datesOfInvolvement: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       circumstances: {
  //         value: "",
  //         id: "15491",
  //         type: "PDFTextField",
  //       },
  //       negativeImpact: {
  //         value: "",
  //         id: "15490",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: Math.random(),
  //       negativeImpactDate: {
  //         date: { value: "", id: "15282", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //       },
  //       datesOfInvolvement: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       circumstances: {
  //         value: "",
  //         id: "15482",
  //         type: "PDFTextField",
  //       },
  //       negativeImpact: {
  //         value: "",
  //         id: "15481",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: Math.random(),
  //       negativeImpactDate: {
  //         date: { value: "", id: "15282", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //       },
  //       datesOfInvolvement: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       circumstances: {
  //         value: "",
  //         id: "15512",
  //         type: "PDFTextField",
  //       },
  //       negativeImpact: {
  //         value: "",
  //         id: "15511",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section24_2: [
  //     {
  //       _id: Math.random(),
  //       orderedBy: {
  //         value:
  //           "An employer, military commander, or employee assistance program",
  //         id: "15579",
  //         type: "PDFRadioGroup",
  //       },
  //       actionTaken: { value: "NO", id: "15564", type: "PDFRadioGroup" },
  //       noActionExplanation: {
  //         value: "",
  //         id: "15563",
  //         type: "PDFTextField",
  //       },
  //       actionDetails: {
  //         dateRange: {
  //           from: {
  //             date: { value: "", id: "15282", type: "PDFTextField" },
  //             estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //           },
  //           to: {
  //             date: { value: "", id: "15280", type: "PDFTextField" },
  //             estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //           },
  //           present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //         },
  //         providerName: {
  //           value: "",
  //           id: "15557",
  //           type: "PDFTextField",
  //         },
  //         providerAddress: {
  //           street: {
  //             value: "",
  //             id: "15562",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "15561",
  //             type: "PDFTextField",
  //           },
  //           state: {
  //             value: "",
  //             id: "15560",
  //             type: "PDFDropdown",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "15558",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "",
  //             id: "15559",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         providerPhone: {
  //           number: {
  //             value: "",
  //             id: "15567",
  //             type: "PDFTextField",
  //           },
  //           isInternationalOrDSN: {
  //             value: "NO",
  //             id: "15573",
  //             type: "PDFCheckBox",
  //           },
  //           timeOfDay: {
  //             value: "Day",
  //             id: "15572",
  //             type: "PDFCheckBox",
  //           },
  //           extension: {
  //             value: "",
  //             id: "15568",
  //             type: "PDFTextField",
  //           },
  //         },

  //         treatmentCompletion: {
  //           value: "NO",
  //           id: "15556",
  //           type: "PDFRadioGroup",
  //         },
  //         completionExplanation: {
  //           value: "",
  //           id: "15554",
  //           type: "PDFTextField",
  //         },
  //       },
  //     },
  //   ],
  //   section24_3: [
  //     {
  //       _id: Math.random(),
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       providerName: {
  //         value: "",
  //         id: "15611",
  //         type: "PDFTextField",
  //       },
  //       providerAddress: {
  //         street: {
  //           value: "",
  //           id: "15621",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "15620",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "15619",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "15617",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "15618",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       providerPhone: {
  //         number: {
  //           value: "",
  //           id: "15616",
  //           type: "PDFTextField",
  //         },
  //         isInternationalOrDSN: {
  //           value: "NO",
  //           id: "15614",
  //           type: "PDFCheckBox",
  //         },
  //         timeOfDay: {
  //           value: "Day",
  //           id: "15613",
  //           type: "PDFCheckBox",
  //         },
  //         extension: {
  //           value: "",
  //           id: "15615",
  //           type: "PDFTextField",
  //         },
  //       },
  //       treatmentCompletion: {
  //         value: "NO",
  //         id: "15605",
  //         type: "PDFRadioGroup",
  //       },
  //       completionExplanation: {
  //         value: "",
  //         id: "15603",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section24_4: [
  //     {
  //       _id: Math.random(),
  //       counselorName: {
  //         value: "",
  //         id: "15591",
  //         type: "PDFTextField",
  //       },
  //       counselorAddress: {
  //         street: {
  //           value: "",
  //           id: "15601",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "15600",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "15599",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "15597",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "15598",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       agencyName: {
  //         value: "",
  //         id: "15622",
  //         type: "PDFTextField",
  //       },
  //       agencyAddress: {
  //         street: {
  //           value: "",
  //           id: "15633",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "15632",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "15631",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "15629",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "15630",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFCheckBox" },
  //       },
  //       treatmentCompletion: {
  //         value: "NO",
  //         id: "15665",
  //         type: "PDFRadioGroup",
  //       },
  //       completionExplanation: {
  //         value: "",
  //         id: "15663",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  // },
  // investigationsInfo: {
  //   _id: Math.random(),
  //   governmentInvestigated: {
  //     value: "NO",
  //     id: "15692",
  //     type: "PDFRadioGroup",
  //   },
  //   revocation: {
  //     value: "NO",
  //     id: "15736",
  //     type: "PDFRadioGroup",
  //   },
  //   debarred: {
  //     value: "NO",
  //     id: "15730",
  //     type: "PDFRadioGroup",
  //   },
  //   section25_1: [
  //     {
  //       _id: Math.random(),
  //       investigatingAgency: {
  //         _id: Math.random(),
  //         agency: {
  //           value: "U.S. Department of Defense",
  //           id: "15690",
  //           type: "PDFRadioGroup",
  //         },
  //         explanation: { value: "", id: "", type: "PDFTextField" },
  //       },
  //       otherAgency: {
  //         value: "",
  //         id: "15728",
  //         type: "PDFTextField",
  //       },
  //       issuedAgency: {
  //         value: "",
  //         id: "15680",
  //         type: "PDFTextField",
  //       },
  //       investigationCompletionDate: {
  //         date: {
  //           value: "",
  //           id: "15727",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15726",
  //           type: "PDFCheckBox",
  //         },
  //         unknown: {
  //           value: "NO",
  //           id: "15725",
  //           type: "PDFCheckBox",
  //         },
  //       },

  //       clearanceEligibilityDate: {
  //         date: { value: "", id: "15724", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "15723",
  //           type: "PDFCheckBox",
  //         },
  //         unknown: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       levelOfClearance: [
  //         {
  //           _id: Math.random(),
  //           level: {
  //             value: "None",
  //             id: "15679",
  //             type: "PDFTextField",
  //           },
  //           explanation: {
  //             value: "NO",
  //             id: "",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   section25_2: [
  //     {
  //       denialDate: {
  //         date: { value: "", id: "15734", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "15733",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       agency: {
  //         value: "",
  //         id: "15732",
  //         type: "PDFTextField",
  //       },
  //       explanation: {
  //         value: "",
  //         id: "15732",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section25_3: [
  //     {
  //       debarmentDate: {
  //         date: { value: "", id: "15741", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "15742",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       agency: {
  //         value: "",
  //         id: "15743",
  //         type: "PDFTextField",
  //       },
  //       explanation: {
  //         value: "",
  //         id: "15737",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  // },
  // finances: {
  //   _id: Math.random(),
  //   filedBankruptcy: {
  //     value: "NO",
  //     id: "15803",
  //     type: "PDFRadioGroup",
  //   },
  //   gamblingProblem: {
  //     value: "NO",
  //     id: "15862",
  //     type: "PDFRadioGroup",
  //   },
  //   missedTaxes: {
  //     value: "NO",
  //     id: "15843",
  //     type: "PDFRadioGroup",
  //   },
  //   companyViolation: {
  //     value: "NO",
  //     id: "15911",
  //     type: "PDFRadioGroup",
  //   },
  //   counseling: {
  //     value: "NO",
  //     id: "15885",
  //     type: "PDFRadioGroup",
  //   },
  //   delinquent: {
  //     value: "NO",
  //     id: "15939",
  //     type: "PDFRadioGroup",
  //   },
  //   reposessions: {
  //     value: "NO",
  //     id: "",
  //     type: "",
  //   },
  //   section26_1: [
  //     {
  //       _id: Math.random(),
  //       bankruptcyPetitionType: {
  //         value: "Chapter 7",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       courtDocketNumber: {
  //         value: "",
  //         id: "15808",
  //         type: "PDFTextField",
  //       },
  //       dateFiled: {
  //         date: {
  //           value: "",
  //           id: "15807",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15798",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       dateDischarged: {
  //         date: {
  //           value: "",
  //           id: "15797",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15806",
  //           type: "PDFCheckBox",
  //         },
  //         notApplicable: {
  //           value: "NO",
  //           id: "15796",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       amountInvolved: {
  //         amount: {
  //           value: 0,
  //           id: "15795",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15794",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       debtRecordedUnder: {
  //         lastName: {
  //           value: "",
  //           id: "15786",
  //           type: "PDFTextField",
  //         },
  //         firstName: {
  //           value: "",
  //           id: "15785",
  //           type: "PDFTextField",
  //         },
  //         middleName: {
  //           value: "",
  //           id: "15787",
  //           type: "PDFTextField",
  //         },
  //         suffix: {
  //           value: "",
  //           id: "15788",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       courtName: {
  //         value: "",
  //         id: "15777",
  //         type: "PDFTextField",
  //       },
  //       courtAddress: {
  //         street: {
  //           value: "",
  //           id: "15793",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "15792",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "15791",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "15789",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "15790",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       chapter13Details: {
  //         trusteeName: {
  //           value: "",
  //           id: "15779",
  //           type: "PDFTextField",
  //         },
  //         trusteeAddress: {
  //           street: {
  //             value: "",
  //             id: "15784",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "",
  //             id: "15783",
  //             type: "PDFTextField",
  //           },
  //           state: {
  //             value: "",
  //             id: "15782",
  //             type: "PDFDropdown",
  //           },
  //           zipCode: {
  //             value: "",
  //             id: "15780",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "",
  //             id: "15781",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       },
  //       dischargedOfAllDebts: {
  //         value: "NO",
  //         id: "15776",
  //         type: "PDFRadioGroup",
  //       },
  //       dischargeExplanation: {
  //         value: "",
  //         id: "15778",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section26_2: [
  //     {
  //       _id: Math.random(),
  //       financialProblemsDueToGambling: {
  //         value: "NO",
  //         id: "15862",
  //         type: "PDFRadioGroup",
  //       },
  //       dateRange: {
  //         from: {
  //           date: {
  //             value: "",
  //             id: "15858",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "15857",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         to: {
  //           date: {
  //             value: "",
  //             id: "15856",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "15855",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "15859",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       gamblingLosses: {
  //         amount: {
  //           value: 0,
  //           id: "15860",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       descriptionOfFinancialProblems: {
  //         value: "",
  //         id: "15861",
  //         type: "PDFTextField",
  //       },
  //       actionsTaken: {
  //         value: "",
  //         id: "15854",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section26_3: [
  //     {
  //       _id: Math.random(),
  //       failedToFileOrPay: {
  //         value: "File",
  //         id: "15842",
  //         type: "PDFRadioGroup",
  //       },
  //       yearFailed: {
  //         date: {
  //           value: "",
  //           id: "15845",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckbox",
  //         },
  //       },
  //       failureReason: {
  //         value: "",
  //         id: "15834",
  //         type: "PDFTextField",
  //       },
  //       agencyName: {
  //         value: "",
  //         id: "15836",
  //         type: "PDFTextField",
  //       },
  //       taxType: {
  //         value: "",
  //         id: "15833",
  //         type: "PDFTextField",
  //       },
  //       amountInvolved: {
  //         amount: {
  //           value: 0,
  //           id: "15832",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15831",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       dateSatisfied: {
  //         date: {
  //           value: "",
  //           id: "15838",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15839",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       actionsTaken: {
  //         value: "",
  //         id: "15835",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section26_4: [
  //     {
  //       _id: Math.random(),
  //       agencyOrCompanyName: {
  //         value: "",
  //         id: "15907",
  //         type: "PDFTextField",
  //       },
  //       agencyOrCompanyAddress: {
  //         street: {
  //           value: "",
  //           id: "15906",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "15905",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "15904",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "15902",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "15903",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       counselingWarningDisciplinaryDate: {
  //         date: {
  //           value: "",
  //           id: "15909",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15908",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       counselingWarningDisciplinaryReason: {
  //         value: "",
  //         id: "15901",
  //         type: "PDFTextField",
  //       },
  //       violationAmount: {
  //         amount: {
  //           value: 0,
  //           id: "15899",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       rectifyingActions: {
  //         value: "",
  //         id: "15910",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section26_5: [
  //     {
  //       _id: Math.random(),
  //       explanation: {
  //         value: "",
  //         id: "15883",
  //         type: "PDFTextField",
  //       },
  //       creditCounselingOrganizationName: {
  //         value: "",
  //         id: "15875",
  //         type: "PDFTextField",
  //       },
  //       creditCounselingOrganizationPhoneNumber: {
  //         number: {
  //           value: "",
  //           id: "15880",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "",
  //           id: "15879",
  //           type: "PDFTextField",
  //         },
  //         isInternationalOrDSN: {
  //           value: "NO",
  //           id: "15878",
  //           type: "PDFCheckBox",
  //         },
  //         timeOfDay: {
  //           value: "Day",
  //           id: "15877",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       creditCounselingOrganizationLocation: {
  //         street: {
  //           value: "",
  //           id: "15882",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "15882",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "15881",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "15882",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "15881",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       counselingActions: {
  //         value: "",
  //         id: "15884",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section26_6: [
  //     {
  //       _id: Math.random(),
  //       agencyName: {
  //         value: "",
  //         id: "15921",
  //         type: "PDFTextField",
  //       },
  //       doesInclude: {
  //         value: "NO",
  //         id: "15914",
  //         type: "PDFRadioGroup",
  //       },
  //       financialIssueTypes: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Delinquent on alimony or child support payments",
  //             id: "15919",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Judgment entered against you",
  //             id: "15918",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Lien placed against your property",
  //             id: "15917",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Currently delinquent on any Federal debt",
  //             id: "15916",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],
  //       loanAccountNumbers: {
  //         value: "",
  //         id: "15937",
  //         type: "PDFTextField",
  //       },
  //       propertyInvolved: {
  //         value: "",
  //         id: "15934",
  //         type: "PDFTextField",
  //       },
  //       amountInvolved: {
  //         amount: {
  //           value: 0,
  //           id: "15935",
  //           type: "PDFTextField",
  //         },

  //         estimated: {
  //           value: "NO",
  //           id: "15936",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       issueReason: {
  //         value: "",
  //         id: "15933",
  //         type: "PDFTextField",
  //       },
  //       currentStatus: {
  //         value: "",
  //         id: "15932",
  //         type: "PDFTextField",
  //       },
  //       issueDate: {
  //         date: {
  //           value: "",
  //           id: "15931",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15930",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       resolutionDate: {
  //         date: {
  //           value: "",
  //           id: "15929",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15928",
  //           type: "PDFCheckBox",
  //         },
  //         notApplicable: {
  //           value: "NO",
  //           id: "15927",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       courtName: {
  //         value: "",
  //         id: "15927",
  //         type: "PDFTextField",
  //       },
  //       courtAddress: {
  //         street: {
  //           value: "",
  //           id: "15926",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "15925",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "15924",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "15922",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "15923",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       actionsTaken: {
  //         value: "",
  //         id: "15938",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section26_7: [
  //     {
  //       _id: Math.random(),
  //       agencyName: {
  //         value: "",
  //         id: "15949",
  //         type: "PDFTextField",
  //       },
  //       doesInclude: {
  //         value: "NO",
  //         id: "15942",
  //         type: "PDFRadioGroup",
  //       },
  //       financialIssueTypes: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Repossessed or foreclosed property",
  //             id: "15947",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],

  //       loanAccountNumbers: {
  //         value: "",
  //         id: "15965",
  //         type: "PDFTextField",
  //       },
  //       propertyInvolved: {
  //         value: "",
  //         id: "15962",
  //         type: "PDFTextField",
  //       },
  //       amountInvolved: {
  //         amount: {
  //           value: 0,
  //           id: "15963",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "15964",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       issueReason: {
  //         value: "",
  //         id: "15961",
  //         type: "PDFTextField",
  //       },
  //       currentStatus: {
  //         value: "",
  //         id: "15960",
  //         type: "PDFTextField",
  //       },
  //       issueDate: {
  //         date: {
  //           value: "",
  //           id: "15959",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //         notApplicable: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       resolutionDate: {
  //         date: {
  //           value: "",
  //           id: "15957",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //         notApplicable: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       courtName: {
  //         value: "",
  //         id: "15955",
  //         type: "PDFTextField",
  //       },
  //       courtAddress: {
  //         street: {
  //           value: "",
  //           id: "15954",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "15953",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "15952",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "15950",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "15951",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       actionsTaken: {
  //         value: "",
  //         id: "15966",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  // },
  // technology: {
  //   _id: Math.random(),
  //   illegalAccess: {
  //     value: "NO",
  //     id: "16027",
  //     type: "PDFRadioGroup",
  //   },
  //   illegalModification: {
  //     value: "NO",
  //     id: "16029",
  //     type: "PDFRadioGroup",
  //   },
  //   unauthorizedUse: {
  //     value: "NO",
  //     id: "16059",
  //     type: "PDFRadioGroup",
  //   },
  //   section27_1: [
  //     {
  //       _id: Math.random(),
  //       incidentDate: {
  //         date: {
  //           value: "",
  //           id: "16019",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "16020",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       description: {
  //         value: "",
  //         id: "16018",
  //         type: "PDFTextField",
  //       },
  //       location: {
  //         street: {
  //           value: "",
  //           id: "16026",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16025",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16024",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16022",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16023",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       actionDescription: {
  //         value: "",
  //         id: "16021",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: Math.random(),
  //       incidentDate: {
  //         date: {
  //           value: "",
  //           id: "16019",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "16020",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       description: {
  //         value: "",
  //         id: "16049",
  //         type: "PDFTextField",
  //       },
  //       location: {
  //         street: {
  //           value: "",
  //           id: "16057",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16056",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16055",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16053",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16054",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       actionDescription: {
  //         value: "",
  //         id: "16052",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section27_2: [
  //     {
  //       _id: Math.random(),
  //       incidentDate: {
  //         date: {
  //           value: "",
  //           id: "16019",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "16020",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       description: {
  //         value: "",
  //         id: "16040",
  //         type: "PDFTextField",
  //       },
  //       location: {
  //         street: {
  //           value: "",
  //           id: "16048",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16047",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16046",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16044",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16045",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       actionDescription: {
  //         value: "",
  //         id: "16043",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: Math.random(),
  //       incidentDate: {
  //         date: {
  //           value: "",
  //           id: "",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       description: {
  //         value: "",
  //         id: "16031",
  //         type: "PDFTextField",
  //       },
  //       location: {
  //         street: {
  //           value: "",
  //           id: "16039",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16038",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16037",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16035",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16036",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       actionDescription: {
  //         value: "",
  //         id: "16034",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section27_3: [
  //     {
  //       _id: Math.random(),
  //       incidentDate: {
  //         date: {
  //           value: "",
  //           id: "16019",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "16020",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       description: {
  //         value: "",
  //         id: "16070",
  //         type: "PDFTextField",
  //       },
  //       location: {
  //         street: {
  //           value: "",
  //           id: "16078",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16077",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16076",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16074",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16075",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       actionDescription: {
  //         value: "",
  //         id: "16073",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: Math.random(),
  //       incidentDate: {
  //         date: {
  //           value: "",
  //           id: "16019",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "16020",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       description: {
  //         value: "",
  //         id: "16061",
  //         type: "PDFTextField",
  //       },
  //       location: {
  //         street: {
  //           value: "",
  //           id: "16069",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16068",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16067",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16065",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16066",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       actionDescription: {
  //         value: "",
  //         id: "16064",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  // },
  // civil: {
  //   _id: Math.random(),
  //   civilCourt: {
  //     value: "NO",
  //     id: "16098",
  //     type: "PDFRadioGroup",
  //   },
  //   section28_1: [
  //     {
  //       dateOfAction: {
  //         date: {
  //           value: "",
  //           id: "16019",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "16020",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       courtName: {
  //         value: "",
  //         id: "16095",
  //         type: "PDFTextField",
  //       },
  //       courtAddress: {
  //         street: {
  //           value: "",
  //           id: "16092",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16091",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16090",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16088",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16089",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       description: {
  //         value: "",
  //         id: "",
  //         type: "PDFTextField",
  //       },
  //       details: {
  //         value: "",
  //         id: "",
  //         type: "PDFTextField",
  //       },
  //       principalParties: [
  //         {
  //           _id: Math.random(),
  //           name: {
  //             value: "",
  //             id: "16093",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       dateOfAction: {
  //         date: {
  //           value: "",
  //           id: "16019",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "16020",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       courtName: {
  //         value: "",
  //         id: "16084",
  //         type: "PDFTextField",
  //       },
  //       courtAddress: {
  //         street: {
  //           value: "",
  //           id: "16081",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16080",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16104",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16102",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16103",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       description: {
  //         value: "",
  //         id: "",
  //         type: "PDFTextField",
  //       },
  //       details: {
  //         value: "",
  //         id: "",
  //         type: "PDFTextField",
  //       },
  //       principalParties: [
  //         {
  //           _id: Math.random(),
  //           name: {
  //             value: "",
  //             id: "16082",
  //             type: "PDFTextField",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
  // association: {
  //   _id: Math.random(),
  //   terrorismMember: {
  //     value: "NO",
  //     id: "16137",
  //     type: "PDFRadioGroup",
  //   },
  //   actsOfTerrorism: {
  //     value: "NO",
  //     id: "16164",
  //     type: "PDFRadioGroup",
  //   },
  //   overthrowByForce: {
  //     value: "NO",
  //     id: "16157",
  //     type: "PDFRadioGroup",
  //   },
  //   dedicatedViolent: {
  //     value: "NO",
  //     id: "16225",
  //     type: "PDFRadioGroup",
  //   },
  //   advocatesViolence: {
  //     value: "NO",
  //     id: "",
  //     type: "",
  //   },
  //   engagedInOverthrow: {
  //     value: "NO",
  //     id: "16240",
  //     type: "PDFRadioGroup",
  //   },
  //   terrorismAssociate: {
  //     value: "NO",
  //     id: "16284",
  //     type: "PDFRadioGroup",
  //   },
  //   section29_1: [
  //     {
  //       activityDescription: {
  //         value: "",
  //         id: "16133",
  //         type: "PDFTextField",
  //       },
  //       dateRange: {
  //         from: {
  //           date: {
  //             value: "",
  //             id: "16124",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16123",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         to: {
  //           date: {
  //             value: "",
  //             id: "16122",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16121",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16125",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //     },
  //   ],
  //   section29_2: [
  //     {
  //       organizationName: {
  //         value: "",
  //         id: "16135",
  //         type: "PDFTextField",
  //       },
  //       organizationAddress: {
  //         street: {
  //           value: "",
  //           id: "16130",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16129",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16128",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16126",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16127",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       involvementDateRange: {
  //         from: {
  //           date: {
  //             value: "",
  //             id: "16124",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16123",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         to: {
  //           date: {
  //             value: "",
  //             id: "16122",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16121",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16125",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       positionsHeld: {
  //         value: "",
  //         id: "16136",
  //         type: "PDFTextField",
  //       },
  //       contributions: {
  //         value: "",
  //         id: "16134",
  //         type: "PDFTextField",
  //       },
  //       natureOfInvolvement: {
  //         value: "",
  //         id: "16133",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section29_3: [
  //     {
  //       reasonsForAdvocacy: {
  //         value: "",
  //         id: "16166",
  //         type: "PDFTextField",
  //       },
  //       dateRange: {
  //         from: {
  //           date: {
  //             value: "",
  //             id: "16149",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16148",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         to: {
  //           date: {
  //             value: "",
  //             id: "16147",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16146",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16150",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //     },
  //   ],
  //   section29_4: [
  //     {
  //       organizationName: {
  //         value: "",
  //         id: "16183",
  //         type: "PDFTextField",
  //       },
  //       organizationAddress: {
  //         street: {
  //           value: "",
  //           id: "16178",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16177",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16176",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16174",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16175",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       involvementDateRange: {
  //         from: {
  //           date: {
  //             value: "",
  //             id: "16172",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16171",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         to: {
  //           date: {
  //             value: "",
  //             id: "16170",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16169",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16173",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       positionsHeld: {
  //         value: "",
  //         id: "16184",
  //         type: "PDFTextField",
  //       },
  //       contributions: {
  //         value: "",
  //         id: "16182",
  //         type: "PDFTextField",
  //       },
  //       natureOfInvolvement: {
  //         value: "",
  //         id: "16181",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section29_5: [
  //     {
  //       organizationName: {
  //         value: "",
  //         id: "16218",
  //         type: "PDFTextField",
  //       },
  //       organizationAddress: {
  //         street: {
  //           value: "",
  //           id: "16213",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "16212",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "16211",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "16209",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "16210",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       involvementDateRange: {
  //         from: {
  //           date: {
  //             value: "",
  //             id: "16207",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16206",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         to: {
  //           date: {
  //             value: "",
  //             id: "16205",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16204",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16208",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       positionsHeld: {
  //         value: "",
  //         id: "16219",
  //         type: "PDFTextField",
  //       },
  //       contributions: {
  //         value: "",
  //         id: "16217",
  //         type: "PDFTextField",
  //       },
  //       natureOfInvolvement: {
  //         value: "",
  //         id: "16216",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   section29_6: [
  //     {
  //       activityDescription: {
  //         value: "",
  //         id: "16246",
  //         type: "PDFTextField",
  //       },
  //       dateRange: {
  //         from: {
  //           date: {
  //             value: "",
  //             id: "16244",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16243",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         to: {
  //           date: {
  //             value: "",
  //             id: "16242",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "16241",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16245",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //     },
  //   ],
  //   section29_7: [
  //     {
  //       explanation: {
  //         value: "",
  //         id: "16255",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       explanation: {
  //         value: "",
  //         id: "16254",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  // },
  // signature: {
  //   _id: Math.random(),
  //   information: {
  //     value: "NO",
  //     id: "",
  //     type: "",
  //   },
  //   medical: {
  //     value: "NO",
  //     id: "",
  //     type: "",
  //   },
  //   credit: {
  //     value: "NO",
  //     id: "",
  //     type: "",
  //   },
  // },
  // print: {
  //   value: "NO",
  //   id: "",
  //   type: "",
  // },
};

export default defaultFormData;
