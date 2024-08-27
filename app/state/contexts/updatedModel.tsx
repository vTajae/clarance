import { ApplicantFormValues } from "~/components/form86/lastTry/formDefinition copy 2";

const defaultFormData: ApplicantFormValues = {
  // personalInfo: {
  //   lastName: {
  //     value: "lastName",
  //     id: "9449",
  //     type: "PDFTextField",
  //   },
  //   firstName: {
  //     value: "firstName",
  //     id: "9448",
  //     type: "PDFTextField",
  //   },
  //   middleName: {
  //     value: "middleName",
  //     id: "9447",
  //     type: "PDFTextField",
  //   },
  //   suffix: {
  //     value: "suffix",
  //     id: "9435",
  //     type: "PDFDropdown",
  //   },
  // },
  // birthInfo: {
  //   birthDate: {
  //     value: "birthDate",
  //     id: "9432",
  //     type: "PDFTextField",
  //   },
  //   isBirthDateEstimate: {
  //     value: "Yes",
  //     id: "9431",
  //     type: "PDFCheckBox",
  //   },
  //   birthCity: {
  //     value: "birthCity",
  //     id: "9446",
  //     type: "PDFTextField",
  //   },
  //   birthCounty: {
  //     value: "birthCounty",
  //     id: "9445",
  //     type: "PDFTextField",
  //   },
  //   birthCountry: {
  //     value: "birthCountry",
  //     id: "9444",
  //     type: "PDFDropdown",
  //   },
  //   birthState: {
  //     value: "birthState",
  //     id: "9443",
  //     type: "PDFDropdown",
  //   },
  // },
  // aknowledgementInfo: {
  //   aknowledge: {
  //     value: "Yes",
  //     id: "17237",
  //     type: "PDFRadioGroup",
  //   },
  //   ssn: {
  //     value: "ssn",
  //     id: "9441",
  //     type: "PDFTextField",
  //   },
  //   notApplicable: {
  //     value: "Yes",
  //     id: "9442",
  //     type: "PDFCheckBox",
  //   },
  // },
  // namesInfo: {
  //   hasNames: {
  //     value: "YES",
  //     id: "17241",
  //     type: "PDFRadioGroup",
  //   },
  //   names: [
  //     {
  //       _id: 1,
  //       lastName: {
  //         value: "lastName",
  //         id: "9486",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "firstName",
  //         id: "9487",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "middleName",
  //         id: "9488",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "III",
  //         id: "9494",
  //         type: "PDFDropdown",
  //       },
  //       startDate: {
  //         date: {
  //           value: "startDate",
  //           id: "9498",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "YES",
  //           id: "9493",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       endDate: {
  //         date: {
  //           value: "endDate",
  //           id: "9497",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "YES",
  //           id: "9492",
  //           type: "PDFCheckBox",
  //         },
  //         isPresent: {
  //           value: "YES",
  //           id: "9491",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       isMaidenName: {
  //         value: "YES",
  //         id: "17240",
  //         type: "PDFRadioGroup",
  //       },
  //       reasonChanged: {
  //         value: "reasonChanged",
  //         id: "9499",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: 2,
  //       lastName: {
  //         value: "lastName",
  //         id: "9486",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "firstName",
  //         id: "9487",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "YES",
  //         id: "9488",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "III",
  //         id: "9480",
  //         type: "PDFDropdown",
  //       },
  //       startDate: {
  //         date: {
  //           value: "startDate",
  //           id: "9484",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "YES",
  //           id: "9479",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       endDate: {
  //         date: {
  //           value: "endDate",
  //           id: "9483",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "YES",
  //           id: "9478",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       isMaidenName: {
  //         value: "YES",
  //         id: "17243",
  //         type: "PDFRadioGroup",
  //       },
  //       reasonChanged: {
  //         value: "reasonChanged",
  //         id: "9485",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: 3,
  //       lastName: {
  //         value: "lastName",
  //         id: "9474",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "YES",
  //         id: "9475",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "YES",
  //         id: "9476",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "II",
  //         id: "9468",
  //         type: "PDFDropdown",
  //       },
  //       startDate: {
  //         date: {
  //           value: "startDate",
  //           id: "9472",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "YES",
  //           id: "9467",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       endDate: {
  //         date: {
  //           value: "endDate",
  //           id: "9471",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "YES",
  //           id: "9466",
  //           type: "PDFCheckBox",
  //         },
  //         isPresent: {
  //           value: "NO",
  //           id: "9465",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       isMaidenName: {
  //         value: "YES",
  //         id: "17245",
  //         type: "PDFRadioGroup",
  //       },
  //       reasonChanged: {
  //         value: "reasonChanged",
  //         id: "9473",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: 4,
  //       lastName: {
  //         value: "lastName",
  //         id: "9462",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "firstName",
  //         id: "9463",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "middleName",
  //         id: "9464",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "III",
  //         id: "9456",
  //         type: "PDFDropdown",
  //       },
  //       startDate: {
  //         date: {
  //           value: "startDate",
  //           id: "9460",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "YES",
  //           id: "9455",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       endDate: {
  //         date: {
  //           value: "endDate",
  //           id: "9459",
  //           type: "PDFTextField",
  //         },
  //         estimated: {
  //           value: "YES",
  //           id: "9454",
  //           type: "PDFCheckBox",
  //         },
  //         isPresent: {
  //           value: "NO",
  //           id: "9453",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       isMaidenName: {
  //         value: "YES",
  //         id: "17247",
  //         type: "PDFRadioGroup",
  //       },
  //       reasonChanged: {
  //         value: "reasonChanged",
  //         id: "9461",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  // },
  // physicalAttributes: {
  //   heightFeet: {
  //     value: "heightFeet",
  //     id: "9434",
  //     type: "PDFDropdown",
  //   },
  //   heightInch: {
  //     value: "heightInch",
  //     id: "9433",
  //     type: "PDFDropdown",
  //   },
  //   weight: {
  //     value: "130",
  //     id: "9438",
  //     type: "PDFTextField",
  //   },
  //   hairColor: {
  //     value: "hairColor",
  //     id: "9437",
  //     type: "PDFDropdown",
  //   },
  //   eyeColor: {
  //     value: "eyeColor",
  //     id: "9436",
  //     type: "PDFDropdown",
  //   },
  //   gender: {
  //     value: "Female",
  //     id: "17238",
  //     type: "PDFRadioGroup",
  //   },
  // },

  // passportInfo: {
  //   hasPassport: {
  //     value: "NO (If NO, proceed to Section 9)",
  //     id: "17231",
  //     type: "PDFRadioGroup",
  //   },
  //   section8: {
  //     passportNum: {
  //       value: "PassportNum",
  //       id: "9553",
  //       type: "PDFTextField",
  //     },
  //     issueDate: {
  //       value: "issueDate",
  //       id: "9551",
  //       type: "PDFTextField",
  //     },
  //     isIssuedEst: {
  //       value: "YES",
  //       id: "9523",
  //       type: "PDFCheckBox",
  //     },
  //     expirationDate: {
  //       value: "",
  //       id: "9550",
  //       type: "PDFTextField",
  //     },
  //     isExpirationEst: {
  //       value: "YES",
  //       id: "9549",
  //       type: "PDFCheckBox",
  //     },
  //     passportLName: {
  //       value: "",
  //       id: "9547",
  //       type: "PDFTextField",
  //     },
  //     passportFName: {
  //       value: "",
  //       id: "9546",
  //       type: "PDFTextField",
  //     },
  //     passportMName: {
  //       value: "",
  //       id: "9548",
  //       type: "PDFTextField",
  //     },
  //     passportSuffix: {
  //       value: "",
  //       id: "9545",
  //       type: "PDFDropdown",
  //     },
  //   },
  // },

  // contactInfo: {
  //   homeEmail: {
  //     value: "homeEmail",
  //     id: "9513",
  //     type: "PDFTextField",
  //   },
  //   workEmail: {
  //     value: "workEmail",
  //     id: "9512",
  //     type: "PDFTextField",
  //   },
  //   contactNumbers: [
  //     {
  //       _id: 1,
  //       numberType: {
  //         value: "DSN",
  //         id: "9511",
  //         type: "PDFTextField",
  //       },
  //       phoneNumber: {
  //         value: "phoneNumber1",
  //         id: "9511",
  //         type: "PDFTextField",
  //       },
  //       phoneExtension: {
  //         value: "1",
  //         id: "9510",
  //         type: "PDFTextField",
  //       },
  //       isUsableDay: {
  //         value: "YES",
  //         id: "9507",
  //         type: "PDFCheckBox",
  //       },
  //       isUsableNight: {
  //         value: "YES",
  //         id: "9508",
  //         type: "PDFCheckBox",
  //       },
  //       internationalOrDSN: {
  //         value: "YES",
  //         id: "9509",
  //         type: "PDFCheckBox",
  //       },
  //     },
  //     {
  //       _id: 2,
  //       numberType: {
  //         value: "International",
  //         id: "",
  //         type: "PDFTextField",
  //       },
  //       phoneNumber: {
  //         value: "phoneNumber2",
  //         id: "9506",
  //         type: "PDFTextField",
  //       },
  //       phoneExtension: {
  //         value: "2",
  //         id: "9505",
  //         type: "PDFTextField",
  //       },
  //       isUsableDay: {
  //         value: "YES",
  //         id: "9562",
  //         type: "PDFCheckBox",
  //       },
  //       isUsableNight: {
  //         value: "YES",
  //         id: "9503",
  //         type: "PDFCheckBox",
  //       },
  //       internationalOrDSN: {
  //         value: "YES",
  //         id: "9504",
  //         type: "PDFCheckBox",
  //       },
  //     },
  //     {
  //       _id: 3,
  //       numberType: {
  //         value: "Home",
  //         id: "",
  //         type: "PDFTextField",
  //       },
  //       phoneNumber: {
  //         value: "phoneNumber3",
  //         id: "9561",
  //         type: "PDFTextField",
  //       },
  //       phoneExtension: {
  //         value: "3",
  //         id: "9560",
  //         type: "PDFTextField",
  //       },
  //       isUsableDay: {
  //         value: "YES",
  //         id: "9557",
  //         type: "PDFCheckBox",
  //       },
  //       isUsableNight: {
  //         value: "YES",
  //         id: "9558",
  //         type: "PDFCheckBox",
  //       },
  //       internationalOrDSN: {
  //         value: "NO",
  //         id: "9559",
  //         type: "PDFCheckBox",
  //       },
  //     },
  //   ],
  // },

  // citizenshipInfo: {
  //   citizenship_status_code: {
  //     value:
  //       "I am a U.S. citizen or national by birth in the U.S. or U.S. territory/commonwealth. (Proceed to Section 10)   ",
  //     id: "17233",
  //     type: "PDFRadioGroup",
  //   },
  //   section9_1: {
  //     doc_type: {
  //       value: "Other (Provide explanation)",
  //       id: "17235",
  //       type: "PDFRadioGroup",
  //     },
  //     other_doc: {
  //       value: "OtherExplain9.1",
  //       id: "9539",
  //       type: "PDFTextField",
  //     },
  //     doc_num: {
  //       value: "DocumentNumber9.1",
  //       id: "9538",
  //       type: "PDFTextField",
  //     },
  //     doc_issue_date: {
  //       value: "DateIssued9.1",
  //       id: "9522",
  //       type: "PDFTextField",
  //     },
  //     is_issue_date_est: {
  //       value: "Yes",
  //       id: "9521",
  //       type: "PDFCheckBox",
  //     },
  //     issue_city: {
  //       value: "City9.1",
  //       id: "9535",
  //       type: "PDFTextField",
  //     },
  //     issued_state: {
  //       value: "DC",
  //       id: "9536",
  //       type: "PDFDropdown",
  //     },
  //     issued_country: {
  //       value: "Angola",
  //       id: "9537",
  //       type: "PDFDropdown",
  //     },
  //     issued_fname: {
  //       value: "9.1FirstName",
  //       id: "9532",
  //       type: "PDFTextField",
  //     },
  //     issued_lname: {
  //       value: "9.1LastName",
  //       id: "9533",
  //       type: "PDFTextField",
  //     },
  //     issued_mname: {
  //       value: "9.1MiddleName",
  //       id: "9534",
  //       type: "PDFTextField",
  //     },
  //     issued_suffix: {
  //       value: "III",
  //       id: "9531",
  //       type: "PDFDropdown",
  //     },
  //     citizenship_num: {
  //       value: "CertificateNumber9.1",
  //       id: "9520",
  //       type: "PDFTextField",
  //     },
  //     certificate_issue_date: {
  //       value: "DateCertificateIssued9.1",
  //       id: "9519",
  //       type: "PDFTextField",
  //     },
  //     is_certificate_date_est: {
  //       value: "Yes",
  //       id: "9518",
  //       type: "PDFCheckBox",
  //     },
  //     certificate_fname: {
  //       value: "CertificateLFName",
  //       id: "9528",
  //       type: "PDFTextField",
  //     },
  //     certificate_lname: {
  //       value: "CertificateLName",
  //       id: "9529",
  //       type: "PDFTextField",
  //     },
  //     certificate_mname: {
  //       value: "CertificateMName",
  //       id: "9530",
  //       type: "PDFTextField",
  //     },
  //     certificate_suffix: {
  //       value: "V",
  //       id: "9527",
  //       type: "PDFDropdown",
  //     },
  //     is_born_installation: {
  //       value: "YES",
  //       id: "17234",
  //       type: "PDFRadioGroup",
  //     },
  //     base_name: {
  //       value: "Military Installation Base",
  //       id: "9556",
  //       type: "PDFTextField",
  //     },
  //   },
  //   section9_2: {
  //     us_entry_date: {
  //       value: "9.2DateOfEntry",
  //       id: "9591",
  //       type: "PDFTextField",
  //     },
  //     is_us_entry_date_est: {
  //       value: "Yes",
  //       id: "9590",
  //       type: "PDFCheckBox",
  //     },
  //     entry_city: {
  //       value: "9.2CityEntry",
  //       id: "9588",
  //       type: "PDFTextField",
  //     },
  //     entry_state: {
  //       value: "AZ",
  //       id: "9589",
  //       type: "PDFDropdown",
  //     },
  //     country_of_citizenship_1: {
  //       value: "Algeria",
  //       id: "9587",
  //       type: "PDFDropdown",
  //     },
  //     country_of_citizenship_2: {
  //       value: "Albania",
  //       id: "9583",
  //       type: "PDFDropdown",
  //     },
  //     has_alien_registration: {
  //       value: "YES",
  //       id: "17230",
  //       type: "PDFRadioGroup",
  //     },
  //     alien_registration_num: {
  //       value: "9.2AlienRegistrationNumber",
  //       id: "9586",
  //       type: "PDFTextField",
  //     },
  //     naturalization_num: {
  //       value: "9.2NaturalizationCertificateNumber",
  //       id: "9616",
  //       type: "PDFTextField",
  //     },
  //     naturalization_issue_date: {
  //       value: "9.3DateIssued",
  //       id: "9603",
  //       type: "PDFTextField",
  //     },
  //     is_natural_issue_est: {
  //       value: "Yes",
  //       id: "9617",
  //       type: "PDFCheckBox",
  //     },
  //     court_name: {
  //       value: "9.2NaturalizationCourt",
  //       id: "9592",
  //       type: "PDFTextField",
  //     },
  //     court_issued_date: {
  //       value: "9.2NaturalizationDate",
  //       id: "9618",
  //       type: "PDFTextField",
  //     },
  //     court_street: {
  //       value: "9.2NaturalizationStreet",
  //       id: "9620",
  //       type: "PDFTextField",
  //     },
  //     court_city: {
  //       value: "9.2NaturalizationCity",
  //       id: "9625",
  //       type: "PDFTextField",
  //     },
  //     court_state: {
  //       value: "CA",
  //       id: "9626",
  //       type: "PDFDropdown",
  //     },
  //     court_zip: {
  //       value: "9.2Zip",
  //       id: "9619",
  //       type: "PDFTextField",
  //     },
  //     court_issued_fname: {
  //       value: "9.2NaturalizationFName",
  //       id: "9623",
  //       type: "PDFTextField",
  //     },
  //     court_issued_lname: {
  //       value: "9.2NaturalizationLName",
  //       id: "9624",
  //       type: "PDFTextField",
  //     },
  //     court_issued_mname: {
  //       value: "9.2NaturalizationMName",
  //       id: "9622",
  //       type: "PDFTextField",
  //     },
  //     court_issued_suffix: {
  //       value: "IV",
  //       id: "9621",
  //       type: "PDFDropdown",
  //     },
  //     is_other: {
  //       value: "Yes",
  //       id: "9600",
  //       type: "PDFCheckBox",
  //     },
  //     is_basedOn_naturalization: {
  //       value: "Yes",
  //       id: "9599",
  //       type: "PDFCheckBox",
  //     },
  //     other_basis_detail: {
  //       value: "9.2NaturalizationOtherExplaination",
  //       id: "9614",
  //       type: "PDFTextField",
  //     },
  //   },
  //   section9_3: {
  //     alien_registration_num: {
  //       value: "9.3AlienNumber",
  //       id: "9578",
  //       type: "PDFTextField",
  //     },
  //     permanent_resident_num: {
  //       value: "9.3ResidentCard",
  //       id: "9577",
  //       type: "PDFTextField",
  //     },
  //     certificate_of_citizenship_num: {
  //       value: "9.3CertificateNumber",
  //       id: "9576",
  //       type: "PDFTextField",
  //     },
  //     doc_fname: {
  //       value: "9.3FirstName",
  //       id: "9573",
  //       type: "PDFTextField",
  //     },
  //     doc_lname: {
  //       value: "9.3LastName",
  //       id: "9574",
  //       type: "PDFTextField",
  //     },
  //     doc_mname: {
  //       value: "9.3MiddleName",
  //       id: "9575",
  //       type: "PDFTextField",
  //     },
  //     doc_suffix: {
  //       value: "VII",
  //       id: "9572",
  //       type: "PDFDropdown",
  //     },
  //     doc_issue_date: {
  //       value: "9.3DateIssued",
  //       id: "9568",
  //       type: "PDFTextField",
  //     },
  //     is_doc_date_est: {
  //       value: "Yes",
  //       id: "9567",
  //       type: "PDFCheckBox",
  //     },
  //     is_other: {
  //       value: "Yes",
  //       id: "9570",
  //       type: "PDFCheckBox",
  //     },
  //     is_basedOn_naturalization: {
  //       value: "Yes",
  //       id: "9569",
  //       type: "PDFCheckBox",
  //     },
  //     basis_of_citizenship_explanation: {
  //       value: "9.3OtherExplaination",
  //       id: "9571",
  //       type: "PDFTextField",
  //     },
  //   },
  //   section9_4: {
  //     residence_status: {
  //       value: "9.4ResidenceStatus",
  //       id: "9611",
  //       type: "PDFTextField",
  //     },
  //     us_entry_date: {
  //       value: "9.4DateOfEntry",
  //       id: "9613",
  //       type: "PDFTextField",
  //     },
  //     is_entry_date_est: {
  //       value: "Yes",
  //       id: "9612",
  //       type: "PDFCheckBox",
  //     },
  //     country_of_citizenship1: {
  //       value: "Antigua and Barbuda",
  //       id: "9580",
  //       type: "PDFDropdown",
  //     },
  //     country_of_citizenship2: {
  //       value: "Argentina",
  //       id: "9579",
  //       type: "PDFDropdown",
  //     },
  //     entry_city: {
  //       value: "9.4City",
  //       id: "9581",
  //       type: "PDFTextField",
  //     },
  //     entry_state: {
  //       value: "IA",
  //       id: "9582",
  //       type: "PDFDropdown",
  //     },
  //     alien_registration_num: {
  //       value: "9.4AlienRegistrationNumb",
  //       id: "9608",
  //       type: "PDFTextField",
  //     },
  //     expiration_date: {
  //       value: "9.4Expiration(I-766)",
  //       id: "9566",
  //       type: "PDFTextField",
  //     },
  //     is_expiration_est: {
  //       value: "Yes",
  //       id: "9569",
  //       type: "PDFCheckBox",
  //     },
  //     document_issued: {
  //       value: "5",
  //       id: "17229",
  //       type: "PDFRadioGroup",
  //     },
  //     other_doc: {
  //       value: "9.4Explaination",
  //       id: "9593",
  //       type: "PDFTextField",
  //     },
  //     doc_num: {
  //       value: "9.4DocumentNumber",
  //       id: "9602",
  //       type: "PDFTextField",
  //     },
  //     doc_issued_date: {
  //       value: "9.4DocumentIssued",
  //       id: "9610",
  //       type: "PDFTextField",
  //     },
  //     is_doc_date_est: {
  //       value: "Yes",
  //       id: "9601",
  //       type: "PDFCheckBox",
  //     },
  //     doc_expire_date: {
  //       value: "9.4DocumentExpeiration",
  //       id: "9603",
  //       type: "PDFTextField",
  //     },
  //     is_doc_expiration_est: {
  //       value: "Yes",
  //       id: "9609",
  //       type: "PDFCheckBox",
  //     },
  //     doc_fname: {
  //       value: "9.4DocumentFName",
  //       id: "9605",
  //       type: "PDFTextField",
  //     },
  //     doc_lname: {
  //       value: "9.4DocumentLName",
  //       id: "9606",
  //       type: "PDFTextField",
  //     },
  //     doc_mname: {
  //       value: "9.4DocumentMName",
  //       id: "9607",
  //       type: "PDFTextField",
  //     },
  //     doc_suffix: {
  //       value: "VIII",
  //       id: "9604",
  //       type: "PDFDropdown",
  //     },
  //   },
  // },

  // dualCitizenshipInfo: {
  //   heldMultipleCitizenships: {
  //     value: "NO (If NO, proceed to 10.2)",
  //     id: "17213",
  //     type: "PDFRadioGroup",
  //   },
  //   hadNonUSPassport: {
  //     value: "NO (If NO, proceed to Section 11)",
  //     id: "17218",
  //     type: "PDFRadioGroup",
  //   },
  //   citizenships: [
  //     {
  //       _id: 1,
  //       country: {
  //         value: "",
  //         id: "9705",
  //         type: "PDFDropdown",
  //       },
  //       howCitizenshipAcquired: {
  //         value: "",
  //         id: "9704",
  //         type: "PDFTextField",
  //       },
  //       citizenshipStart: {
  //         value: "",
  //         id: "9703",
  //         type: "PDFTextField",
  //       },
  //       isCitizenshipStartEstimated: {
  //         value: "Yes",
  //         id: "9702",
  //         type: "PDFCheckBox",
  //       },
  //       citizenshipEnd: {
  //         value: "",
  //         id: "9701",
  //         type: "PDFTextField",
  //       },
  //       isCitizenshipEndPresent: {
  //         value: "Yes",
  //         id: "9700",
  //         type: "PDFCheckBox",
  //       },
  //       isCitizenshipEndEstimated: {
  //         value: "Yes",
  //         id: "9699",
  //         type: "PDFCheckBox",
  //       },
  //       isRenounced: {
  //         value: "YES",
  //         id: "17214",
  //         type: "PDFRadioGroup",
  //       },
  //       renouncementDetails: {
  //         value: "",
  //         id: "9696",
  //         type: "PDFTextField",
  //       },
  //       isCitizenshipHeld: {
  //         value: "YES",
  //         id: "17215",
  //         type: "PDFRadioGroup",
  //       },
  //       citizenshipExplanation: {
  //         value: "",
  //         id: "9693",
  //         type: "PDFTextField",
  //       },
  //     },
  //     {
  //       _id: 2,
  //       country: {
  //         value: "Afghanistan",
  //         id: "9680",
  //         type: "PDFDropdown",
  //       },
  //       howCitizenshipAcquired: {
  //         value: "",
  //         id: "9692",
  //         type: "PDFTextField",
  //       },
  //       citizenshipStart: {
  //         value: "",
  //         id: "9691",
  //         type: "PDFTextField",
  //       },
  //       isCitizenshipStartEstimated: {
  //         value: "NO",
  //         id: "9690",
  //         type: "PDFCheckBox",
  //       },
  //       citizenshipEnd: {
  //         value: "",
  //         id: "9689",
  //         type: "PDFTextField",
  //       },
  //       isCitizenshipEndPresent: {
  //         value: "Yes",
  //         id: "9688",
  //         type: "PDFCheckBox",
  //       },
  //       isCitizenshipEndEstimated: {
  //         value: "Yes",
  //         id: "9687",
  //         type: "PDFCheckBox",
  //       },
  //       isRenounced: {
  //         value: "YES",
  //         id: "17216",
  //         type: "PDFRadioGroup",
  //       },
  //       renouncementDetails: {
  //         value: "",
  //         id: "9684",
  //         type: "PDFTextField",
  //       },
  //       isCitizenshipHeld: {
  //         value: "YES",
  //         id: "17217",
  //         type: "PDFRadioGroup",
  //       },
  //       citizenshipExplanation: {
  //         value: "",
  //         id: "9683",
  //         type: "PDFTextField",
  //       },
  //     },
  //   ],
  //   passports: [
  //     {
  //       _id: 1,
  //       countryIssued: {
  //         value: "",
  //         id: "9677",
  //         type: "PDFDropdown",
  //       },
  //       passportDateIssued: {
  //         value: "",
  //         id: "9676",
  //         type: "PDFTextField",
  //       },
  //       isPassportDateEst: {
  //         value: "Yes",
  //         id: "9675",
  //         type: "PDFCheckBox",
  //       },
  //       passportCity: {
  //         value: "",
  //         id: "9674",
  //         type: "PDFTextField",
  //       },
  //       passportCountry: {
  //         value: "",
  //         id: "9673",
  //         type: "PDFDropdown",
  //       },
  //       passportLName: {
  //         value: "",
  //         id: "9672",
  //         type: "PDFTextField",
  //       },
  //       passportFName: {
  //         value: "",
  //         id: "9671",
  //         type: "PDFTextField",
  //       },
  //       passportMName: {
  //         value: "",
  //         id: "9670",
  //         type: "PDFTextField",
  //       },
  //       passportSuffix: {
  //         value: "",
  //         id: "9669",
  //         type: "PDFDropdown",
  //       },
  //       passportNumber: {
  //         value: "",
  //         id: "9668",
  //         type: "PDFTextField",
  //       },
  //       passportExpiration: {
  //         value: "",
  //         id: "9667",
  //         type: "PDFTextField",
  //       },
  //       isExpirationEst: {
  //         value: "Yes",
  //         id: "9666",
  //         type: "PDFCheckBox",
  //       },
  //       isPassportUsed: {
  //         value: "YES",
  //         id: "17219",
  //         type: "PDFRadioGroup",
  //       },
  //       passportUses: [
  //         {
  //           _id: 1,
  //           passportCountry: {
  //             value: "Angola",
  //             id: "9688",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9662",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9660",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9661",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9659",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9658",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 2,
  //           passportCountry: {
  //             value: "China",
  //             id: "9657",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9656",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9654",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9655",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9653",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9652",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 3,
  //           passportCountry: {
  //             value: "Azerbaijan",
  //             id: "9651",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9650",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9648",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9649",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9647",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9646",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 4,
  //           passportCountry: {
  //             value: "Chad",
  //             id: "9645",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9644",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9642",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9643",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9641",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9634",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 5,
  //           passportCountry: {
  //             value: "Fiji",
  //             id: "9639",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9638",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9636",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9637",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9635",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9651",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 6,
  //           passportCountry: {
  //             value: "Grenada",
  //             id: "9633",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9632",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9630",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9631",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9629",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9628",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       _id: 2,
  //       countryIssued: {
  //         value: "Aruba",
  //         id: "9725",
  //         type: "PDFDropdown",
  //       },
  //       passportDateIssued: {
  //         value: "",
  //         id: "9724",
  //         type: "PDFTextField",
  //       },
  //       isPassportDateEst: {
  //         value: "Yes",
  //         id: "9723",
  //         type: "PDFCheckBox",
  //       },
  //       passportCity: {
  //         value: "",
  //         id: "9722",
  //         type: "PDFTextField",
  //       },
  //       passportCountry: {
  //         value: "",
  //         id: "9721",
  //         type: "PDFDropdown",
  //       },
  //       passportLName: {
  //         value: "",
  //         id: "9720",
  //         type: "PDFTextField",
  //       },
  //       passportFName: {
  //         value: "",
  //         id: "9719",
  //         type: "PDFTextField",
  //       },
  //       passportMName: {
  //         value: "",
  //         id: "9718",
  //         type: "PDFTextField",
  //       },
  //       passportSuffix: {
  //         value: "",
  //         id: "9717",
  //         type: "PDFDropdown",
  //       },
  //       passportNumber: {
  //         value: "",
  //         id: "9716",
  //         type: "PDFTextField",
  //       },
  //       passportExpiration: {
  //         value: "",
  //         id: "9715",
  //         type: "PDFTextField",
  //       },
  //       isExpirationEst: {
  //         value: "Yes",
  //         id: "9714",
  //         type: "PDFCheckBox",
  //       },
  //       isPassportUsed: {
  //         value: "YES",
  //         id: "17203",
  //         type: "PDFRadioGroup",
  //       },
  //       passportUses: [
  //         {
  //           _id: 1,
  //           passportCountry: {
  //             value: "Japan",
  //             id: "9711",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9710",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9708",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9709",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9726",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9757",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 2,
  //           passportCountry: {
  //             value: "Jamaica",
  //             id: "9756",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9755",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9753",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9754",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9758",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9751",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 3,
  //           passportCountry: {
  //             value: "Jan Mayen",
  //             id: "9750",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9749",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9747",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9748",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9752",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9745",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 4,
  //           passportCountry: {
  //             value: "Jersey",
  //             id: "9744",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9743",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9741",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9742",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9746",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9739",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 5,
  //           passportCountry: {
  //             value: "Juan de Nova Island",
  //             id: "9738",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9737",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9735",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9736",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9734",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9733",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: 6,
  //           passportCountry: {
  //             value: "Jordan",
  //             id: "9732",
  //             type: "PDFDropdown",
  //           },
  //           fromDate: {
  //             value: "",
  //             id: "9731",
  //             type: "PDFTextField",
  //           },
  //           toDate: {
  //             value: "",
  //             id: "9729",
  //             type: "PDFTextField",
  //           },
  //           isFromDateEst: {
  //             value: "Yes",
  //             id: "9730",
  //             type: "PDFCheckBox",
  //           },
  //           isToDateEst: {
  //             value: "Yes",
  //             id: "9728",
  //             type: "PDFCheckBox",
  //           },
  //           isVisitCurrent: {
  //             value: "Yes",
  //             id: "9727",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },

  // residencyInfo: [
  // {
  //   _id: 1,
  //   residenceStartDate: {
  //     value: "E1From",
  //     id: "9814",
  //     type: "PDFTextField",
  //   },
  //   isStartDateEst: {
  //     value: "Yes",
  //     id: "9813",
  //     type: "PDFCheckBox",
  //   },
  //   residenceEndDate: {
  //     value: "E1To",
  //     id: "9812",
  //     type: "PDFTextField",
  //   },
  //   isResidenceEndEst: {
  //     value: "Yes",
  //     id: "9811",
  //     type: "PDFCheckBox",
  //   },
  //   isResidencePresent: {
  //     value: "Yes",
  //     id: "9810",
  //     type: "PDFCheckBox",
  //   },
  //   residenceStatus: {
  //     value: "4",
  //     id: "17200",
  //     type: "PDFRadioGroup",
  //   },
  //   residenceOtherDetails: {
  //     value: "E1OtherField",
  //     id: "9805",
  //     type: "PDFTextField",
  //   },
  //   residenceAddress: {
  //     street: {
  //       value: "E1Street",
  //       id: "9804",
  //       type: "PDFTextField",
  //     },
  //     city: {
  //       value: "E1City",
  //       id: "9803",
  //       type: "PDFTextField",
  //     },
  //     state: {
  //       value: "AK",
  //       id: "9802",
  //       type: "PDFDropdown",
  //     },
  //     zip: {
  //       value: "E1Zip",
  //       id: "9800",
  //       type: "PDFTextField",
  //     },
  //     country: {
  //       value: "Afghanistan",
  //       id: "9801",
  //       type: "PDFDropdown",
  //     },
  //     hasAPOOrFPO: {
  //       value: "NO",
  //       id: "17201",
  //       type: "PDFRadioGroup",
  //     },
  //     APOOrFPODetails: {
  //       addressUnitOrDutyLocation: {
  //         value: "aE1Street",
  //         id: "9780",
  //         type: "PDFTextField",
  //       },
  //       cityOrPostName: {
  //         value: "aE1City",
  //         id: "9779",
  //         type: "PDFTextField",
  //       },
  //       state: {
  //         value: "AL",
  //         id: "9778",
  //         type: "PDFDropdown",
  //       },
  //       zip: {
  //         value: "aE1Zip",
  //         id: "9772",
  //         type: "PDFTextField",
  //       },
  //       country: {
  //         value: "Akrotiri Sovereign Base",
  //         id: "9777",
  //         type: "PDFDropdown",
  //       },
  //       hadAPOFPOAddress: {
  //         value: "Yes",
  //         id: "9776",
  //         type: "PDFCheckBox",
  //       },
  //       APOFPOAddress: {
  //         value: "bE1Street",
  //         id: "9776",
  //         type: "PDFTextField",
  //       },
  //       APOOrFPO: {
  //         value: "APO",
  //         id: "9775",
  //         type: "PDFTextField",
  //       },
  //       APOFPOStateCode: {
  //         value: "APO/FPO America",
  //         id: "9774",
  //         type: "PDFDropdown",
  //       },
  //       APOFPOZip: {
  //         value: "bE1Zip",
  //         id: "9773",
  //         type: "PDFTextField",
  //       },
  //     },
  //   },
  //   contact: {
  //     lastname: {
  //       value: "E1neighborLname",
  //       id: "9798",
  //       type: "PDFTextField",
  //     },
  //     firstname: {
  //       value: "E1neighborFname",
  //       id: "9797",
  //       type: "PDFTextField",
  //     },
  //     middlename: {
  //       value: "E1neighborMname",
  //       id: "9799",
  //       type: "PDFTextField",
  //     },
  //     suffix: {
  //       value: "III",
  //       id: "9796",
  //       type: "PDFDropdown",
  //     },
  //     lastContactDate: {
  //       value: "E1neighboMonth",
  //       id: "9782",
  //       type: "PDFTextField",
  //     },
  //     isLastContactEst: {
  //       value: "Yes",
  //       id: "9824",
  //       type: "PDFCheckBox",
  //     },
  //     relationship: {
  //       checkboxes: [
  //         {
  //           value: "Yes",
  //           id: "9795",
  //           type: "PDFCheckbox",
  //         },
  //         {
  //           value: "Yes",
  //           id: "9794",
  //           type: "PDFCheckbox",
  //         },
  //         {
  //           value: "Yes",
  //           id: "9793",
  //           type: "PDFCheckbox",
  //         },
  //         {
  //           value: "Yes",
  //           id: "9792",
  //           type: "PDFCheckbox",
  //         },
  //         {
  //           value: "Yes",
  //           id: "9791",
  //           type: "PDFCheckbox",
  //         },
  //       ],
  //     },
  //     relationshipOtherDetail: {
  //       value: "E1RelationshipOther",
  //       id: "9790",
  //       type: "PDFTextField",
  //     },
  //     phone: [
  //       {
  //         _id: 1,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "9823",
  //           type: "PDFCheckBox",
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "9824",
  //           type: "PDFCheckBox",
  //         },
  //         number: {
  //           value: "E1neighborTeleNumber1",
  //           id: "9826",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "E1-1",
  //           id: "9825",
  //           type: "PDFTextField",
  //         },
  //       },
  //       {
  //         _id: 2,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "9823",
  //           type: "PDFCheckBox",
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "9818",
  //           type: "PDFCheckBox",
  //         },
  //         number: {
  //           value: "E1neighborTeleNumber2",
  //           id: "9822",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "E1-2",
  //           id: "9821",
  //           type: "PDFTextField",
  //         },
  //       },
  //       {
  //         _id: 3,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "9815",
  //           type: "PDFCheckBox",
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "9816",
  //           type: "PDFCheckBox",
  //         },
  //         number: {
  //           value: "E1neighborTeleNumber3",
  //           id: "9820",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "E1-3",
  //           id: "9819",
  //           type: "PDFTextField",
  //         },
  //       },
  //     ],
  //     email: {
  //       value: "E1neighborEmail",
  //       id: "9784",
  //       type: "PDFTextField",
  //     },
  //     dontKnowEmail: {
  //       value: "Yes",
  //       id: "9783",
  //       type: "PDFCheckbox"
  //     },
  //     contactAddress: {
  //       street: {
  //         value: "E1neighborStreet",
  //         id: "9789",
  //         type: "PDFTextField",
  //       },
  //       city: {
  //         value: "E1neighborCity",
  //         id: "9788",
  //         type: "PDFTextField",
  //       },
  //       state: {
  //         value: "AS",
  //         id: "9787",
  //         type: "PDFDropdown",
  //       },
  //       zip: {
  //         value: "E1neighborZip",
  //         id: "9785",
  //         type: "PDFTextField",
  //       },
  //       country: {
  //         value: "Antarctica",
  //         id: "9786",
  //         type: "PDFDropdown",
  //       },
  //       hasAPOOrFPO: {
  //         value: "YES ",
  //         id: "17202",
  //         type: "PDFCheckBox",
  //       },
  //       APOOrFPODetails: {
  //         addressUnitOrDutyLocation: {
  //           value: "E1nieghborAStreet",
  //           id: "9771",
  //           type: "PDFTextField",
  //         },
  //         cityOrPostName: {
  //           value: "E1nieghborACity",
  //           id: "9770",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "CA",
  //           id: "9769",
  //           type: "PDFDropdown",
  //         },
  //         zip: {
  //           value: "E1nieghborAZi",
  //           id: "9767",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "Argentina",
  //           id: "9768",
  //           type: "PDFDropdown",
  //         },
  //         hadAPOFPOAddress: {
  //           value: "Yes",
  //           id: "9760",
  //           type: "PDFCheckBox",
  //         },
  //         APOFPOAddress: {
  //           value: "E1AddressBAPO",
  //           id: "9764",
  //           type: "PDFTextField",
  //         },
  //         APOOrFPO: {
  //           value: "APO",
  //           id: "9763",
  //           type: "PDFTextField",
  //         },
  //         APOFPOStateCode: {
  //           value: "APO/FPO Europe",
  //           id: "9762",
  //           type: "PDFDropdown",
  //         },
  //         APOFPOZip: {
  //           value: "E1nieghbor",
  //           id: "9761",
  //           type: "PDFTextField",
  //         },
  //       },
  //     },
  //   },
  // },
  // {
  //   _id: 2,
  //   residenceStartDate: {
  //     value: "E2fromDate",
  //     id: "9883",
  //     type: "PDFTextField",
  //   },
  //   isStartDateEst: {
  //     value: "Yes",
  //     id: "9893",
  //     type: "PDFCheckBox",
  //   },
  //   residenceEndDate: {
  //     value: "E2ToDate",
  //     id: "9881",
  //     type: "PDFTextField",
  //   },
  //   isResidenceEndEst: {
  //     value: "Yes",
  //     id: "9892",
  //     type: "PDFCheckBox",
  //   },
  //   isResidencePresent: {
  //     value: "Yes",
  //     id: "9880",
  //     type: "PDFCheckBox",
  //   },
  //   residenceStatus: {
  //     value: "4",
  //     id: "17197",
  //     type: "PDFRadioGroup",
  //   },
  //   residenceOtherDetails: {
  //     value: "E2OtherExplaination",
  //     id: "9874",
  //     type: "PDFTextField",
  //   },
  //   residenceAddress: {
  //     street: {
  //       value: "E2Street",
  //       id: "9873",
  //       type: "PDFTextField",
  //     },
  //     city: {
  //       value: "E2City",
  //       id: "9872",
  //       type: "PDFTextField",
  //     },
  //     state: {
  //       value: "AK",
  //       id: "9871",
  //       type: "PDFDropdown",
  //     },
  //     zip: {
  //       value: "E2Zip",
  //       id: "9869",
  //       type: "PDFTextField",
  //     },
  //     country: {
  //       value: "Afghanistan",
  //       id: "9870",
  //       type: "PDFDropdown",
  //     },
  //     hasAPOOrFPO: {
  //       value: "NO",
  //       id: "17198",
  //       type: "PDFRadioGroup",
  //     },
  //     APOOrFPODetails: {
  //       addressUnitOrDutyLocation: {
  //         value: "aE2Street",
  //         id: "9849",
  //         type: "PDFTextField",
  //       },
  //       cityOrPostName: {
  //         value: "aE2City",
  //         id: "9848",
  //         type: "PDFTextField",
  //       },
  //       state: {
  //         value: "AL",
  //         id: "9847",
  //         type: "PDFDropdown",
  //       },
  //       zip: {
  //         value: "aE2Zip",
  //         id: "9841",
  //         type: "PDFTextField",
  //       },
  //       country: {
  //         value: "Akrotiri Sovereign Base",
  //         id: "9846",
  //         type: "PDFDropdown",
  //       },
  //       hadAPOFPOAddress: {
  //         value: "No",
  //         id: "9860",
  //         type: "PDFCheckBox",
  //       },
  //       APOFPOAddress: {
  //         value: "bE2Address",
  //         id: "9845",
  //         type: "PDFTextField",
  //       },
  //       APOOrFPO: {
  //         value: "APO",
  //         id: "9844",
  //         type: "PDFTextField",
  //       },
  //       APOFPOStateCode: {
  //         value: "APO/FPO America",
  //         id: "9843",
  //         type: "PDFDropdown",
  //       },
  //       APOFPOZip: {
  //         value: "bE2Zip",
  //         id: "9842",
  //         type: "PDFTextField",
  //       },
  //     },
  //   },
  //   contact: {
  //     lastname: {
  //       value: "bE2LName",
  //       id: "9867",
  //       type: "PDFTextField",
  //     },
  //     firstname: {
  //       value: "bE2FName",
  //       id: "9866",
  //       type: "PDFTextField",
  //     },
  //     middlename: {
  //       value: "bE2MName",
  //       id: "9868",
  //       type: "PDFTextField",
  //     },
  //     suffix: {
  //       value: "Jr",
  //       id: "9865",
  //       type: "PDFDropdown",
  //     },
  //     lastContactDate: {
  //       value: "bE2LastContact",
  //       id: "9851",
  //       type: "PDFTextField",
  //     },
  //     isLastContactEst: {
  //       value: "Yes",
  //       id: "9816",
  //       type: "PDFCheckBox",
  //     },
  //     relationship: {
  //       checkboxes: [
  //         {
  //           value: "Yes",
  //           id: "9864",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Yes",
  //           id: "9863",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Yes",
  //           id: "9862",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Yes",
  //           id: "9861",
  //           type: "PDFCheckBox",
  //         },
  //         {
  //           value: "Yes",
  //           id: "9884",
  //           type: "PDFCheckBox",
  //         },
  //       ],
  //     },
  //     relationshipOtherDetail: {
  //       value: "E2OtherExplainRelation",
  //       id: "9859",
  //       type: "PDFTextField",
  //     },
  //     phone: [
  //       {
  //         _id: 1,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "9882",
  //           type: "PDFCheckBox",
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "9879",
  //           type: "PDFCheckBox",
  //         },
  //         number: {
  //           value: "E2Phone1",
  //           id: "9895",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "1",
  //           id: "9894",
  //           type: "PDFTextField",
  //         },
  //       },
  //       {
  //         _id: 2,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "9882",
  //           type: "PDFCheckBox",
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "9879",
  //           type: "PDFCheckBox",
  //         },
  //         number: {
  //           value: "E2Phone2",
  //           id: "9891",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "2",
  //           id: "9890",
  //           type: "PDFTextField",
  //         },
  //       },
  //       {
  //         _id: 3,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "9882",
  //           type: "PDFCheckBox",
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "9879",
  //           type: "PDFCheckBox",
  //         },
  //         number: {
  //           value: "E2Phone3",
  //           id: "9889",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "3",
  //           id: "9888",
  //           type: "PDFTextField",
  //         },
  //       },
  //     ],
  //     email: {
  //       value: "E2ContactEmail",
  //       id: "9853",
  //       type: "PDFTextField",
  //     },
  //     dontKnowEmail: {
  //       value: "Yes",
  //       id: "9852",
  //       type: "PDFCheckBox",
  //     },
  //     contactAddress: {
  //       street: {
  //         value: "E2ContactAddress",
  //         id: "9858",
  //         type: "PDFTextField",
  //       },
  //       city: {
  //         value: "E2ContactCity",
  //         id: "9857",
  //         type: "PDFTextField",
  //       },
  //       state: {
  //         value: "AR",
  //         id: "9856",
  //         type: "PDFDropdown",
  //       },
  //       zip: {
  //         value: "E2Zip",
  //         id: "9854",
  //         type: "PDFTextField",
  //       },
  //       country: {
  //         value: "Afghanistan",
  //         id: "9855",
  //         type: "PDFDropdown",
  //       },
  //       hasAPOOrFPO: {
  //         value: "YES ",
  //         id: "17199",
  //         type: "PDFRadioGroup",
  //       },
  //       APOOrFPODetails: {
  //         addressUnitOrDutyLocation: {
  //           value: "aE2Street",
  //           id: "9840",
  //           type: "PDFTextField",
  //         },
  //         cityOrPostName: {
  //           value: "aE2City",
  //           id: "9839",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "CT",
  //           id: "9838",
  //           type: "PDFDropdown",
  //         },
  //         zip: {
  //           value: "aE2Zip",
  //           id: "9836",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "Albania",
  //           id: "9837",
  //           type: "PDFDropdown",
  //         },
  //         hadAPOFPOAddress: {
  //           value: "Yes",
  //           id: "9860",
  //           type: "PDFCheckBox",
  //         },
  //         APOFPOAddress: {
  //           value: "bE2Address",
  //           id: "9833",
  //           type: "PDFTextField",
  //         },
  //         APOOrFPO: {
  //           value: "APO",
  //           id: "9832",
  //           type: "PDFTextField",
  //         },
  //         APOFPOStateCode: {
  //           value: "APO/FPO America",
  //           id: "9831",
  //           type: "PDFDropdown",
  //         },
  //         APOFPOZip: {
  //           value: "bE2Zip",
  //           id: "9830",
  //           type: "PDFTextField",
  //         },
  //       },
  //     },
  //   },
  // },
  // {
  //   _id: 3,
  //   residenceStartDate: {
  //     value: "E3FromDate",
  //     id: "9957",
  //     type: "PDFTextField"
  //   },
  //   isStartDateEst: {
  //     value: "Yes",
  //     id: "9956",
  //     type: "PDFCheckBox"
  //   },
  //   residenceEndDate: {
  //     value: "E3ToDate",
  //     id: "9955",
  //     type: "PDFTextField"
  //   },
  //   isResidenceEndEst: {
  //     value: "Yes",
  //     id: "9954",
  //     type: "PDFCheckBox"
  //   },
  //   isResidencePresent: {
  //     value: "Yes",
  //     id: "9953",
  //     type: "PDFCheckBox"
  //   },
  //   residenceStatus: {
  //     value: "4",
  //     id: "17194",
  //     type: "PDFRadioGroup"
  //   },
  //   residenceOtherDetails: {
  //     value: "E3OtherExplaination",
  //     id: "9948",
  //     type: "PDFTextField"
  //   },
  //   residenceAddress: {
  //     street: {
  //       value: "E3StreetAddress",
  //       id: "9947",
  //       type: "PDFTextField"
  //     },
  //     city: {
  //       value: "E3City",
  //       id: "9946",
  //       type: "PDFTextField"
  //     },
  //     state: {
  //       value: "AL",
  //       id: "9945",
  //       type: "PDFDropdown"
  //     },
  //     zip: {
  //       value: "E3Zipcode",
  //       id: "9943",
  //       type: "PDFTextField"
  //     },
  //     country: {
  //       value: "Albania",
  //       id: "9944",
  //       type: "PDFDropdown"
  //     },
  //     hasAPOOrFPO: {
  //       value: "NO",
  //       id: "17195",
  //       type: "PDFRadioGroup"
  //     },
  //     APOOrFPODetails: {
  //       addressUnitOrDutyLocation: {
  //         value: "aE3Address",
  //         id: "9923",
  //         type: "PDFTextField"
  //       },
  //       cityOrPostName: {
  //         value: "aE3City",
  //         id: "9922",
  //         type: "PDFTextField"
  //       },
  //       state: {
  //         value: "AR",
  //         id: "9921",
  //         type: "PDFDropdown"
  //       },
  //       zip: {
  //         value: "aE3Zip",
  //         id: "9915",
  //         type: "PDFTextField"
  //       },
  //       country: {
  //         value: "Algeria",
  //         id: "9920",
  //         type: "PDFDropdown"
  //       },
  //       hadAPOFPOAddress: {
  //         value: "No",
  //         id: "9938",
  //         type: "PDFCheckBox"
  //       },
  //       APOFPOAddress: {
  //         value: "bE3Address",
  //         id: "9919",
  //         type: "PDFTextField"
  //       },
  //       APOOrFPO: {
  //         value: "APO",
  //         id: "9918",
  //         type: "PDFTextField"
  //       },
  //       APOFPOStateCode: {
  //         value: "APO/FPO Pacific",
  //         id: "9917",
  //         type: "PDFDropdown"
  //       },
  //       APOFPOZip: {
  //         value: "bE3Zip",
  //         id: "9916",
  //         type: "PDFTextField"
  //       }
  //     }
  //   },
  //   contact: {
  //     lastname: {
  //       value: "E3NeightborLName",
  //       id: "9941",
  //       type: "PDFTextField"
  //     },
  //     firstname: {
  //       value: "E3NeighborFName",
  //       id: "9940",
  //       type: "PDFTextField"
  //     },
  //     middlename: {
  //       value: "E3NeightborMName",
  //       id: "9942",
  //       type: "PDFTextField"
  //     },
  //     suffix: {
  //       value: "Jr",
  //       id: "9939",
  //       type: "PDFDropdown"
  //     },
  //     lastContactDate: {
  //       value: "e3LastContact",
  //       id: "9925",
  //       type: "PDFTextField"
  //     },
  //     isLastContactEst: {
  //       value: "Yes",
  //       id: "9852",
  //       type: "PDFCheckBox"
  //     },
  //     relationship: {
  //       checkboxes: [
  //         {
  //           value: "Yes",
  //           id: "9938",
  //           type: "PDFCheckBox"
  //         },
  //         {
  //           value: "Yes",
  //           id: "9937",
  //           type: "PDFCheckBox"
  //         },
  //         {
  //           value: "Yes",
  //           id: "9936",
  //           type: "PDFCheckBox"
  //         },
  //         {
  //           value: "Yes",
  //           id: "9935",
  //           type: "PDFCheckBox"
  //         },
  //         {
  //           value: "Yes",
  //           id: "9934",
  //           type: "PDFCheckBox"
  //         }
  //       ]
  //     },
  //     relationshipOtherDetail: {
  //       value: "E3OtherRelationship",
  //       id: "9933",
  //       type: "PDFTextField"
  //     },
  //     phone: [
  //       {
  //         _id: 1,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "9898",
  //           type: "PDFCheckBox"
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "9897",
  //           type: "PDFCheckBox"
  //         },
  //         number: {
  //           value: "E3Phone1",
  //           id: "9900",
  //           type: "PDFTextField"
  //         },
  //         extension: {
  //           value: "1",
  //           id: "9899",
  //           type: "PDFTextField"
  //         }
  //       },
  //       {
  //         _id: 2,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "9961",
  //           type: "PDFCheckBox"
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "9960",
  //           type: "PDFCheckBox"
  //         },
  //         number: {
  //           value: "E3Phone2",
  //           id: "9965",
  //           type: "PDFTextField"
  //         },
  //         extension: {
  //           value: "2",
  //           id: "9964",
  //           type: "PDFTextField"
  //         }
  //       },
  //       {
  //         _id: 3,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "9959",
  //           type: "PDFCheckBox"
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "9958",
  //           type: "PDFCheckBox"
  //         },
  //         number: {
  //           value: "E3Phone3",
  //           id: "9963",
  //           type: "PDFTextField"
  //         },
  //         extension: {
  //           value: "3",
  //           id: "9962",
  //           type: "PDFTextField"
  //         }
  //       }
  //     ],
  //     email: {
  //       value: "E3emai",
  //       id: "9927",
  //       type: "PDFTextField"
  //     },
  //     dontKnowEmail: {
  //       value: "Yes",
  //       id: "9926",
  //       type: "PDFCheckBox"
  //     },
  //     contactAddress: {
  //       street: {
  //         value: "E3ContactStreetE3",
  //         id: "9932",
  //         type: "PDFTextField"
  //       },
  //       city: {
  //         value: "E3ContactCity",
  //         id: "9931",
  //         type: "PDFTextField"
  //       },
  //       state: {
  //         value: "AS",
  //         id: "9930",
  //         type: "PDFDropdown"
  //       },
  //       zip: {
  //         value: "E3ZipCode",
  //         id: "9928",
  //         type: "PDFTextField"
  //       },
  //       country: {
  //         value: "Andorra",
  //         id: "9929",
  //         type: "PDFDropdown"
  //       },
  //       hasAPOOrFPO: {
  //         value: "YES ",
  //         id: "17196",
  //         type: "PDFRadioGroup"
  //       },
  //       APOOrFPODetails: {
  //         addressUnitOrDutyLocation: {
  //           value: "aE3Address",
  //           id: "9907",
  //           type: "PDFTextField"
  //         },
  //         cityOrPostName: {
  //           value: "aE3City",
  //           id: "9922",
  //           type: "PDFTextField"
  //         },
  //         state: {
  //           value: "APO/FPO Europe",
  //           id: "9905",
  //           type: "PDFDropdown"
  //         },
  //         zip: {
  //           value: "aE3Zip",
  //           id: "9915",
  //           type: "PDFTextField"
  //         },
  //         country: {
  //           value: "Algeria",
  //           id: "9920",
  //           type: "PDFDropdown"
  //         },
  //         hadAPOFPOAddress: {
  //           value: "Yes",
  //           id: "9938",
  //           type: "PDFCheckBox"
  //         },
  //         APOFPOAddress: {
  //           value: "bE3Address",
  //           id: "9906",
  //           type: "PDFTextField"
  //         },
  //         APOOrFPO: {
  //           value: "APO",
  //           id: "9918",
  //           type: "PDFTextField"
  //         },
  //         APOFPOStateCode: {
  //           value: "APO/FPO Pacific",
  //           id: "9905",
  //           type: "PDFDropdown"
  //         },
  //         APOFPOZip: {
  //           value: "bE3Zip",
  //           id: "9904",
  //           type: "PDFTextField"
  //         }
  //       }
  //     }
  //   }
  // },
  // {
  //   _id: 4,
  //   residenceStartDate: {
  //     value: "e4FromDate",
  //     id: "10017",
  //     type: "PDFTextField",
  //   },
  //   isStartDateEst: { value: "Yes", id: "10016", type: "PDFCheckBox" },
  //   residenceEndDate: {
  //     value: "e4ToDate",
  //     id: "10015",
  //     type: "PDFTextField",
  //   },
  //   isResidenceEndEst: { value: "Yes", id: "10014", type: "PDFCheckBox" },
  //   isResidencePresent: {
  //     value: "Yes",
  //     id: "10013",
  //     type: "PDFCheckBox",
  //   },
  //   residenceStatus: { value: "4", id: "17193", type: "PDFRadioGroup" },
  //   residenceOtherDetails: {
  //     value: "e4OtherExplaination",
  //     id: "10012",
  //     type: "PDFTextField",
  //   },
  //   residenceAddress: {
  //     street: { value: "e4Street", id: "10011", type: "PDFTextField" },
  //     city: { value: "e4City", id: "10010", type: "PDFTextField" },
  //     state: { value: "AK", id: "10009", type: "PDFDropdown" },
  //     zip: { value: "e4Zip", id: "10007", type: "PDFTextField" },
  //     country: { value: "USA", id: "10008", type: "" }, // Assuming USA as country
  //     hasAPOOrFPO: {
  //       value: "NO",
  //       id: "17195",
  //       type: "PDFRadioGroup",
  //     },
  //     APOOrFPODetails: {
  //       addressUnitOrDutyLocation: {
  //         value: "aE3Address",
  //         id: "9987",
  //         type: "PDFTextField",
  //       },
  //       cityOrPostName: {
  //         value: "aE3City",
  //         id: "9986",
  //         type: "PDFTextField",
  //       },
  //       state: {
  //         value: "AR",
  //         id: "9985",
  //         type: "PDFDropdown",
  //       },
  //       zip: {
  //         value: "aE3Zip",
  //         id: "9979",
  //         type: "PDFTextField",
  //       },
  //       country: {
  //         value: "Algeria",
  //         id: "9984",
  //         type: "PDFDropdown",
  //       },
  //       hadAPOFPOAddress: {
  //         value: "No",
  //         id: "17191",
  //         type: "PDFCheckBox",
  //       },
  //       APOFPOAddress: {
  //         value: "bE3Address",
  //         id: "9983",
  //         type: "PDFTextField",
  //       },
  //       APOOrFPO: {
  //         value: "APO",
  //         id: "9982",
  //         type: "PDFTextField",
  //       },
  //       APOFPOStateCode: {
  //         value: "APO/FPO Pacific",
  //         id: "9981",
  //         type: "PDFDropdown",
  //       },
  //       APOFPOZip: {
  //         value: "bE3Zip",
  //         id: "9980",
  //         type: "PDFTextField",
  //       },
  //     },
  //   },
  //   contact: {
  //     lastname: { value: "bE4LName", id: "10005", type: "PDFTextField" },
  //     firstname: { value: "bE4FName", id: "10004", type: "PDFTextField" },
  //     middlename: {
  //       value: "bE4MName",
  //       id: "10006",
  //       type: "PDFTextField",
  //     },
  //     suffix: { value: "Jr", id: "10003", type: "PDFDropdown" },
  //     lastContactDate: {
  //       value: "bE4LastContact",
  //       id: "9989",
  //       type: "PDFTextField",
  //     },
  //     isLastContactEst: { value: "Yes", id: "9988", type: "PDFCheckBox" },
  //     relationship: {
  //       checkboxes: [
  //         { value: "Yes", id: "10002", type: "PDFCheckBox" },
  //         { value: "Yes", id: "10001", type: "PDFCheckBox" },
  //         { value: "Yes", id: "10000", type: "PDFCheckBox" },
  //         { value: "Yes", id: "9999", type: "PDFCheckBox" },
  //         { value: "Yes", id: "9998", type: "PDFCheckBox" },
  //       ],
  //     },
  //     relationshipOtherDetail: {
  //       value: "OtherRelationship",
  //       id: "9997",
  //       type: "PDFTextField",
  //     },
  //     phone: [
  //       {
  //         _id: 1,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "10021",
  //           type: "PDFCheckBox",
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "10020",
  //           type: "PDFCheckBox",
  //         },
  //         number: {
  //           value: "e4Phone1",
  //           id: "10029",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "1",
  //           id: "10028",
  //           type: "PDFTextField",
  //         },
  //       },
  //       {
  //         _id: 2,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "10027",
  //           type: "PDFCheckBox",
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "10026",
  //           type: "PDFCheckBox",
  //         },
  //         number: {
  //           value: "e4Phone2",
  //           id: "10025",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "2",
  //           id: "10024",
  //           type: "PDFTextField",
  //         },
  //       },
  //       {
  //         _id: 3,
  //         dontKnowNumber: {
  //           value: "Yes",
  //           id: "10019",
  //           type: "PDFCheckBox",
  //         },
  //         isInternationalOrDSN: {
  //           value: "Yes",
  //           id: "10018",
  //           type: "PDFCheckBox",
  //         },
  //         number: {
  //           value: "e4Phone3",
  //           id: "10023",
  //           type: "PDFTextField",
  //         },
  //         extension: {
  //           value: "3",
  //           id: "10022",
  //           type: "PDFTextField",
  //         },
  //       },
  //     ],
  //     email: {
  //       value: "e4ContactEmail",
  //       id: "9991",
  //       type: "PDFTextField",
  //     },
  //     dontKnowEmail: { value: "Yes", id: "9990", type: "PDFCheckBox" },
  //     contactAddress: {
  //       street: {
  //         value: "e4ContactStreet",
  //         id: "9996",
  //         type: "PDFTextField",
  //       },
  //       city: {
  //         value: "e4ContactCity",
  //         id: "9995",
  //         type: "PDFTextField",
  //       },
  //       state: { value: "AS", id: "9994", type: "PDFDropdown" },
  //       zip: { value: "e4ContactZip", id: "9992", type: "PDFTextField" },
  //       country: { value: "Algeria", id: "9993", type: "PDFDropdown" },
  //       hasAPOOrFPO: {
  //         value: "YES ",
  //         id: "17191",
  //         type: "PDFRadioGroup",
  //       },
  //       APOOrFPODetails: {
  //         addressUnitOrDutyLocation: {
  //           value: "aE3Address",
  //           id: "9978",
  //           type: "PDFTextField",
  //         },
  //         cityOrPostName: {
  //           value: "aE3City",
  //           id: "9977",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "AR",
  //           id: "9976",
  //           type: "PDFDropdown",
  //         },
  //         zip: {
  //           value: "aE3Zip",
  //           id: "9974",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "Algeria",
  //           id: "9975",
  //           type: "PDFDropdown",
  //         },
  //         hadAPOFPOAddress: {
  //           value: "YES ",
  //           id: "17192",
  //           type: "PDFCheckBox",
  //         },
  //         APOFPOAddress: {
  //           value: "bE3Address",
  //           id: "9971",
  //           type: "PDFTextField",
  //         },
  //         APOOrFPO: {
  //           value: "APO",
  //           id: "9970",
  //           type: "PDFTextField",
  //         },
  //         APOFPOStateCode: {
  //           value: "APO/FPO Pacific",
  //           id: "9969",
  //           type: "PDFDropdown",
  //         },
  //         APOFPOZip: {
  //           value: "bE3Zip",
  //           id: "9968",
  //           type: "PDFTextField",
  //         },
  //       },        },
  //   },
  // },
  //],

  // schoolInfo: {
  //   hasAttendedSchool: {
  //     value: "YES",
  //     id: "17183",
  //     type: "PDFRadioGroup",
  //   },
  //   hasReceivedDegree: {
  //     value: "YES",
  //     id: "17184",
  //     type: "PDFRadioGroup",
  //   },
  //   schoolEntry: [
  //     {
  //       _id: 1,
  //       fromDate: {
  //         value: "13fromDate",
  //         id: "10095",
  //         type: "PDFTextField",
  //       },
  //       fromEst: {
  //         value: "YES",
  //         id: "10094",
  //         type: "PDFCheckBox",
  //       },
  //       toDate: {
  //         value: "13ToDate",
  //         id: "10056",
  //         type: "PDFTextField",
  //       },
  //       present: {
  //         value: "YES",
  //         id: "10093",
  //         type: "PDFCheckBox",
  //       },
  //       toEst: {
  //         value: "YES",
  //         id: "10092",
  //         type: "PDFCheckBox",
  //       },
  //       schoolName: {
  //         value: "13NameOfSchool",
  //         id: "10079",
  //         type: "PDFTextField",
  //       },
  //       schoolAddress: {
  //         street: {
  //           value: "13SchoolAddress",
  //           id: "10085",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "schoolCity",
  //           id: "10084",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "AS",
  //           id: "10083",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "schoolZip",
  //           id: "10080",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "Andorra",
  //           id: "10082",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       schoolType: {
  //         value: "High School",
  //         id: "17185",
  //         type: "PDFRadioGroup",
  //       },
  //       knownPerson: {
  //         dontKnowName: {
  //           value: "YES",
  //           id: "10076",
  //           type: "PDFCheckBox",
  //         },
  //         firstName: {
  //           value: "knownPersonFirstName",
  //           id: "10077",
  //           type: "PDFTextField",
  //         },
  //         lastName: {
  //           value: "knownPersonLastName",
  //           id: "10078",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "knownPersonStreet",
  //             id: "10075",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "knownPersonCity",
  //             id: "10074",
  //             type: "PDFTextField",
  //           },
  //           state: {
  //             value: "CA",
  //             id: "10073",
  //             type: "PDFDropdown",
  //           },
  //           zipCode: {
  //             value: "knownPersonZ",
  //             id: "10071",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "Antigua and Barbuda",
  //             id: "10072",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         phoneNumber: {
  //           _id: 1,
  //           dontKnowNumber: {
  //             value: "Yes",
  //             id: "10067",
  //             type: "PDFCheckBox",
  //           },
  //           isInternationalOrDSN: {
  //             value: "Yes",
  //             id: "10068",
  //             type: "PDFCheckBox",
  //           },
  //           number: {
  //             value: "phone1",
  //             id: "10070",
  //             type: "PDFTextField",
  //           },
  //           extension: {
  //             value: "1",
  //             id: "10069",
  //             type: "PDFTextField",
  //           },
  //           day: {
  //             value: "Yes",
  //             id: "10036",
  //             type: "PDFCheckBox",
  //           },
  //           night: {
  //             value: "Yes",
  //             id: "10035",
  //             type: "PDFCheckBox",
  //           }
  //         },
  //         email: {
  //           value: "email",
  //           id: "10066",
  //           type: "PDFTextField",
  //         },
  //         dontKnowEmail: {
  //           value: "YES",
  //           id: "10065",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       degreeReceived: {
  //         value: "YES",
  //         id: "17186",
  //         type: "PDFRadioGroup",
  //       },
  //       degrees: [
  //         {
  //           _id: 1,
  //           type: {
  //             value: "Associate's",
  //             id: "10064",
  //             type: "PDFDropdown",
  //           },
  //           dateAwarded: {
  //             value: "dateawarded1",
  //             id: "10062",
  //             type: "PDFTextField",
  //           },
  //           est: {
  //             value: "YES",
  //             id: "10061",
  //             type: "PDFCheckBox",
  //           },
  //           otherDegree: {
  //             value: "OtherDegree2",
  //             id: "10063",
  //             type: "PDFTextField",
  //           }
  //         },
  //         {
  //           _id: 2,
  //           type: {
  //             value: "Master's",
  //             id: "10060",
  //             type: "PDFDropdown",
  //           },
  //           dateAwarded: {
  //             value: "OtherDiploma2",
  //             id: "10058",
  //             type: "PDFTextField",
  //           },
  //           est: {
  //             value: "YES",
  //             id: "10057",
  //             type: "PDFCheckBox",
  //           },
  //           otherDegree: {
  //             value: "OtherDegree2",
  //             id: "10059",
  //             type: "PDFTextField",
  //           }
  //         },
  //       ],
  //     },
  //     {
  //       _id: 2,
  //       fromDate: {
  //         value: "e2fromDate",
  //         id: "10055",
  //         type: "PDFTextField",
  //       },
  //       toDate: {
  //         value: "e2toDate",
  //         id: "10037",
  //         type: "PDFTextField",
  //       },
  //       present: {
  //         value: "YES",
  //         id: "10052",
  //         type: "PDFCheckBox",
  //       },
  //       fromEst: {
  //         value: "YES",
  //         id: "10054",
  //         type: "PDFCheckBox",
  //       },
  //       toEst: {
  //         value: "YES",
  //         id: "10053",
  //         type: "PDFCheckBox",
  //       },
  //       schoolName: {
  //         value: "e2SchoolName",
  //         id: "10041",
  //         type: "PDFTextField",
  //       },
  //       schoolAddress: {
  //         street: {
  //           value: "e2Street",
  //           id: "10047",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "e2City",
  //           id: "10046",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "AR",
  //           id: "10045",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "e2Zip",
  //           id: "10042",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "Albania",
  //           id: "10044",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       schoolType: {
  //         value: "High School",
  //         id: "17188",
  //         type: "PDFRadioGroup",
  //       },
  //       knownPerson: {
  //         dontKnowName: {
  //           value: "YES",
  //           id: "10038",
  //           type: "PDFCheckBox",
  //         },
  //         firstName: {
  //           value: "e2KnownPersonFName",
  //           id: "10039",
  //           type: "PDFTextField",
  //         },
  //         lastName: {
  //           value: "e2KnownPersonLName",
  //           id: "10040",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "e2KnownPersonStreet",
  //             id: "10133",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "e2KnownPersonCity",
  //             id: "10132",
  //             type: "PDFTextField",
  //           },
  //           state: {
  //             value: "AR",
  //             id: "10131",
  //             type: "PDFDropdown",
  //           },
  //           zipCode: {
  //             value: "e2KnownPerso",
  //             id: "10129",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "Anguilla",
  //             id: "10130",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         phoneNumber: {
  //           _id: Math.random(),
  //           dontKnowNumber: {
  //             value: "Yes",
  //             id: "10142",
  //             type: "PDFCheckBox",
  //           },
  //           isInternationalOrDSN: {
  //             value: "Yes",
  //             id: "10141",
  //             type: "PDFCheckBox",
  //           },
  //           day: {
  //             value: "Yes",
  //             id: "10138",
  //             type: "PDFCheckBox",
  //           },
  //           night: {
  //             value: "Yes",
  //             id: "10137",
  //             type: "PDFCheckBox",
  //           },
  //           number: {
  //             value: "e2Phone1",
  //             id: "10140",
  //             type: "PDFTextField",
  //           },
  //           extension: {
  //             value: "2",
  //             id: "10139",
  //             type: "PDFTextField",
  //           }
  //         },
  //         email: {
  //           value: "e2Email",
  //           id: "10128",
  //           type: "PDFTextField",
  //         },
  //         dontKnowEmail: {
  //           value: "YES",
  //           id: "10065",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       degreeReceived: {
  //         value: "NO",
  //         id: "17174",
  //         type: "PDFRadioGroup",
  //       },
  //       degrees: [
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Associate's",
  //             id: "10126",
  //             type: "PDFDropdown",
  //           },
  //           dateAwarded: {
  //             value: "e2DateAwarded1",
  //             id: "10124",
  //             type: "PDFTextField",
  //           },
  //           est: {
  //             value: "YES",
  //             id: "10123",
  //             type: "PDFCheckBox",
  //           },
  //           otherDegree: {
  //             value: "e2OtherDiploma1",
  //             id: "10125",
  //             type: "PDFTextField",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Professional Degree (e.g. MD, DVM, JD)",
  //             id: "10122",
  //             type: "PDFDropdown",
  //           },
  //           dateAwarded: {
  //             value: "e2DateAwarded2",
  //             id: "10120",
  //             type: "PDFTextField",
  //           },
  //           est: {
  //             value: "YES",
  //             id: "10119",
  //             type: "PDFCheckBox",
  //           },
  //           otherDegree: {
  //             value: "e2OtherDiploma2",
  //             id: "10121",
  //             type: "PDFTextField",
  //           },
  //         }
  //       ],
  //     },
  //     {
  //       _id: 3,
  //       fromDate: {
  //         value: "e3FromDate",
  //         id: "10118",
  //         type: "PDFTextField",
  //       },
  //       toDate: {
  //         value: "e3ToDate",
  //         id: "10149",
  //         type: "PDFTextField",
  //       },
  //       present: {
  //         value: "YES",
  //         id: "10115",
  //         type: "PDFCheckBox",
  //       },
  //       fromEst: {
  //         value: "YES",
  //         id: "10117",
  //         type: "PDFCheckBox",
  //       },
  //       toEst: {
  //         value: "YES",
  //         id: "10116",
  //         type: "PDFCheckBox",
  //       },
  //       schoolName: {
  //         value: "e3SchoolName",
  //         id: "10102",
  //         type: "PDFTextField",
  //       },
  //       schoolAddress: {
  //         street: {
  //           value: "e3SchooStreer",
  //           id: "10108",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "e3City",
  //           id: "10107",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "AR",
  //           id: "10106",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "e3Zip",
  //           id: "10103",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "Albania",
  //           id: "10105",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       schoolType: {
  //         value: "High School",
  //         id: "17176",
  //         type: "PDFRadioGroup",
  //       },
  //       knownPerson: {
  //         dontKnowName: {
  //           value: "YES",
  //           id: "10165",
  //           type: "PDFCheckBox",
  //         },
  //         firstName: {
  //           value: "e3KnownPersonFName",
  //           id: "10166",
  //           type: "PDFTextField",
  //         },
  //         lastName: {
  //           value: "e3KnownPersonLName",
  //           id: "10101",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "e3KnownPersonStreet",
  //             id: "10164",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "e3KnownPersonCity",
  //             id: "10163",
  //             type: "PDFTextField",
  //           },
  //           state: {
  //             value: "AS",
  //             id: "10162",
  //             type: "PDFDropdown",
  //           },
  //           zipCode: {
  //             value: "e3KnownPerso",
  //             id: "10160",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "Angola",
  //             id: "10161",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         phoneNumber: {
  //           _id: 1,
  //           dontKnowNumber: {
  //             value: "Yes",
  //             id: "10148",
  //             type: "PDFCheckBox",
  //           },
  //           isInternationalOrDSN: {
  //             value: "Yes",
  //             id: "10147",
  //             type: "PDFCheckBox",
  //           },
  //           number: {
  //             value: "e3Phone",
  //             id: "10146",
  //             type: "PDFTextField",
  //           },
  //           extension: {
  //             value: "3",
  //             id: "10145",
  //             type: "PDFTextField",
  //           },
  //           day: {
  //             value: "Yes",
  //             id: "10144",
  //             type: "PDFCheckBox",
  //           },
  //           night: {
  //             value: "Yes",
  //             id: "10143",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         email: {
  //           value: "email",
  //           id: "10159",
  //           type: "PDFTextField",
  //         },
  //         dontKnowEmail: {
  //           value: "YES",
  //           id: "10158",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       degreeReceived: {
  //         value: "NO",
  //         id: "17177",
  //         type: "PDFRadioGroup",
  //       },
  //       degrees: [
  //         {
  //           _id: 1,
  //           type: {
  //             value: "Associate's",
  //             id: "10157",
  //             type: "PDFDropdown",
  //           },
  //           dateAwarded: {
  //             value: "e2DateAwarded1",
  //             id: "10155",
  //             type: "PDFTextField",
  //           },
  //           est: {
  //             value: "YES",
  //             id: "10154",
  //             type: "PDFCheckBox",
  //           },
  //           otherDegree: {
  //             value: "e3Other1",
  //             id: "10156",
  //             type: "PDFTextField",
  //           },
  //         },
  //         {
  //           _id: 2,
  //           type: {
  //             value: "Associate's",
  //             id: "10153",
  //             type: "PDFDropdown",
  //           },
  //           dateAwarded: {
  //             value: "e2DateAwarded2",
  //             id: "10151",
  //             type: "PDFTextField",
  //           },
  //           est: {
  //             value: "YES",
  //             id: "10150",
  //             type: "PDFCheckBox",
  //           },
  //           otherDegree: {
  //             value: "e3Other2",
  //             id: "10152",
  //             type: "PDFTextField",
  //           },
  //         }
  //       ],
  //     },
  //     {
  //       _id: 4,
  //       fromDate: {
  //         value: "e4FromDate",
  //         id: "10208",
  //         type: "PDFTextField",
  //       },
  //       toDate: {
  //         value: "e4ToDate",
  //         id: "10173",
  //         type: "PDFTextField",
  //       },
  //       present: {
  //         value: "Yes",
  //         id: "10206",
  //         type: "PDFCheckBox",
  //       },
  //       fromEst: {
  //         value: "Yes",
  //         id: "10207",
  //         type: "PDFCheckBox",
  //       },
  //       toEst: {
  //         value: "Yes",
  //         id: "10205",
  //         type: "PDFCheckBox",
  //       },
  //       schoolName: {
  //         value: "e4Schoolname",
  //         id: "10192",
  //         type: "PDFTextField",
  //       },
  //       schoolAddress: {
  //         street: {
  //           value: "e4Street",
  //           id: "10198",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "e4City",
  //           id: "10197",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "AR",
  //           id: "10196",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "e4Zip",
  //           id: "10193",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "Anguilla",
  //           id: "10195",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       schoolType: {
  //         value: "High School",
  //         id: "17169",
  //         type: "PDFRadioGroup",
  //       },
  //       knownPerson: {
  //         dontKnowName: {
  //           value: "YES",
  //           id: "10189",
  //           type: "PDFCheckBox",
  //         },
  //         firstName: {
  //           value: "e4KnownPersonFName",
  //           id: "10190",
  //           type: "PDFTextField",
  //         },
  //         lastName: {
  //           value: "e4KnownPersonLName",
  //           id: "10191",
  //           type: "PDFTextField",
  //         },
  //         address: {
  //           street: {
  //             value: "e4KnownPersonStreet",
  //             id: "10188",
  //             type: "PDFTextField",
  //           },
  //           city: {
  //             value: "e4KnownPersonCity",
  //             id: "10187",
  //             type: "PDFTextField",
  //           },
  //           state: {
  //             value: "AS",
  //             id: "10186",
  //             type: "PDFDropdown",
  //           },
  //           zipCode: {
  //             value: "e4KnownPerso",
  //             id: "10184",
  //             type: "PDFTextField",
  //           },
  //           country: {
  //             value: "Argentina",
  //             id: "10185",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         phoneNumber: {
  //           _id: 1,
  //           dontKnowNumber: {
  //             value: "Yes",
  //             id: "10182",
  //             type: "PDFCheckBox",
  //           },
  //           isInternationalOrDSN: {
  //             value: "Yes",
  //             id: "10172",
  //             type: "PDFCheckBox",
  //           },
  //           number: {
  //             value: "e4Phone1",
  //             id: "10170",
  //             type: "PDFTextField",
  //           },
  //           extension: {
  //             value: "4",
  //             id: "10169",
  //             type: "PDFTextField",
  //           },
  //           day: {
  //             value: "Yes",
  //             id: "10168",
  //             type: "PDFCheckBox",
  //           },
  //           night: {
  //             value: "Yes",
  //             id: "10167",
  //             type: "PDFCheckBox",
  //           },
  //         },
  //         email: {
  //           value: "e4KnownPersonEmail",
  //           id: "10183",
  //           type: "PDFTextField",
  //         },
  //         dontKnowEmail: {
  //           value: "Yes",
  //           id: "10171",
  //           type: "PDFCheckBox",
  //         },
  //       },
  //       degreeReceived: {
  //         value: "YES",
  //         id: "17170",
  //         type: "PDFRadioGroup",
  //       },
  //       degrees: [
  //         {
  //           _id:1,
  //           type: {
  //             value: "Associate's",
  //             id: "10181",
  //             type: "PDFDropdown",
  //           },
  //           dateAwarded: {
  //             value: "DateAwarded1",
  //             id: "10179",
  //             type: "PDFTextField",
  //           },
  //           est: {
  //             value: "YES",
  //             id: "10178",
  //             type: "PDFCheckBox",
  //           },
  //           otherDegree: {
  //             value: "OtherDiploma1",
  //             id: "10180",
  //             type: "PDFTextField",
  //           },
  //         },
  //         {
  //           _id: 1,
  //           type: {
  //             value: "Doctorate",
  //             id: "10177",
  //             type: "PDFDropdown",
  //           },
  //           dateAwarded: {
  //             value: "DateAwarded2",
  //             id: "10175",
  //             type: "PDFTextField",
  //           },
  //           est: {
  //             value: "Yes",
  //             id: "10174",
  //             type: "PDFCheckBox",
  //           },
  //           otherDegree: {
  //             value: "OtherDiploma2",
  //             id: "10176",
  //             type: "PDFTextField",
  //           },
  //         }
  //       ],
  //     }

  //   ],
  // },

  employmentInfo: {
    _id: 1,

    section13A: [
      // {
      //   _id: 1,
      //   employmentActivity: {
      //     value:
      //       "Other (Provide explanation and complete 13A.2, 13A.5 and 13A.6)",
      //     id: "17167",
      //     type: "PDFRadioGroup",
      //   },
      //   otherExplanation: {
      //     value: "13OtherExplanation",
      //     id: "10240",
      //   // {
      //   _id: 1,
      //   employmentActivity: {
      //     value:
      //       "Other (Provide explanation and complete 13A.2, 13A.5 and 13A.6)",
      //     id: "17167",
      //     type: "PDFRadioGroup",
      //   },
      //   otherExplanation: {
      //     value: "13OtherExplanation",
      //     id: "10240",
      //     type: "PDFTextField",
      //   },
      //   section13A1: {
      //     fromDate: {
      //       date: {
      //         value: "13A1StartDate",
      //         id: "10236",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10235",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     toDate: {
      //       date: {
      //         value: "13A1ToDate",
      //         id: "10233",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10239",
      //         type: "PDFCheckBox",
      //       },
      //       present: {
      //         value: "Yes",
      //         id: "10234",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     employmentStatus: {
      //       fullTime: {
      //         value: "Yes",
      //         id: "10238",
      //         type: "PDFCheckBox",
      //       },
      //       partTime: {
      //         value: "Yes",
      //         id: "10237",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     dutyStation: {
      //       value: "13A1DutyStation",
      //       id: "10231",
      //       type: "PDFTextField",
      //     },
      //     rankOrPosition: {
      //       value: "13A1RankTitle",
      //       id: "10232",
      //       type: "PDFTextField",
      //     },
      //     address: {
      //       street: {
      //         value: "13A1DutyStreet",
      //         id: "10253",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "13A1DutyCity",
      //         id: "10252",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "AL",
      //         id: "10251",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "13A1DutyZip",
      //         id: "10249",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Afghanistan",
      //         id: "10250",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     telephone: {
      //       number: {
      //         value: "13A1Phone",
      //         id: "10247",
      //         type: "PDFTextField",
      //       },
      //       extension: {
      //         value: "1",
      //         id: "10246",
      //         type: "PDFTextField",
      //       },
      //       internationalOrDsn: {
      //         value: "Yes",
      //         id: "10245",
      //         type: "PDFCheckBox",
      //       },
      //       day: {
      //         value: "Yes",
      //         id: "10244",
      //         type: "PDFCheckBox",
      //       },
      //       night: {
      //         value: "Yes",
      //         id: "10243",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     aLocation: {
      //       street: {
      //         value: "13A1SupervisorAddress",
      //         id: "10220",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "13A1SupervisorCity",
      //         id: "10265",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "DC",
      //         id: "10264",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "13A1Superviso",
      //         id: "10212",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Argentina",
      //         id: "10263",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     hasAPOFPOAddress: {
      //       value: "YES ",
      //       id: "17168",
      //       type: "PDFRadioGroup",
      //     },
      //     apoFPOAddress: {
      //       street: {
      //         value: "a13A1Street",
      //         id: "10216",
      //         type: "PDFTextField",
      //       },
      //       zipCode: {
      //         value: "a13A1Zip",
      //         id: "10213",
      //         type: "PDFTextField",
      //       },
      //       apoOrFpo: {
      //         value: "APO",
      //         id: "10215",
      //         type: "PDFTextField",
      //       },
      //       apoFpoStateCode: {
      //         value: "APO/FPO Europe",
      //         id: "10214",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     supervisor: {
      //       name: {
      //         value: "13A1SupervisorName",
      //         id: "10270",
      //         type: "PDFTextField",
      //       },
      //       rankOrPosition: {
      //         value: "13A1SupervisorRank",
      //         id: "10269",
      //         type: "PDFTextField",
      //       },
      //       email: {
      //         value: "13A1SupervisorEmail",
      //         id: "10242",
      //         type: "PDFTextField",
      //       },
      //       emailUnknown: {
      //         value: "Yes",
      //         id: "10241",
      //         type: "PDFCheckBox",
      //       },
      //       phone: {
      //         number: {
      //           value: "13A1SupervisorPhone",
      //           id: "10268",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "13A1Sup",
      //           id: "10267",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10256",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10255",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10254",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       physicalWorkLocation: {
      //         street: {
      //           value: "13A1SupervisorAddress",
      //           id: "10266",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A1SupervisorCity",
      //           id: "10265",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "DC",
      //           id: "10264",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A1Superviso",
      //           id: "10262",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Argentina",
      //           id: "10263",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         street: {
      //           value: "a13A1Street",
      //           id: "10261",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "a13A1City",
      //           id: "10260",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AS",
      //           id: "10259",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "a13A1Zip",
      //           id: "10257",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Angola",
      //           id: "10258",
      //           type: "PDFDropdown",
      //         },
      //       },
      //     },
      //   },

      //   section13A2: {
      //     fromDate: {
      //       date: {
      //         value: "13A2FromDate",
      //         id: "10272",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10273",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     toDate: {
      //       date: {
      //         value: "13A2ToDate",
      //         id: "10274",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10276",
      //         type: "PDFCheckBox",
      //       },
      //       present: {
      //         value: "Yes",
      //         id: "10275",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     employmentStatus: {
      //       fullTime: {
      //         value: "Yes",
      //         id: "10280",
      //         type: "PDFCheckBox",
      //       },
      //       partTime: {
      //         value: "Yes",
      //         id: "10279",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     positionTitle: {
      //       value: "13A2RecentTitle",
      //       id: "10277",
      //       type: "PDFTextField",
      //     },
      //     employerName: {
      //       value: "13A2RecentEmployer",
      //       id: "10278",
      //       type: "PDFTextField",
      //     },
      //     employerAddress: {
      //       street: {
      //         value: "13A2Street",
      //         id: "10307",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "13A2City",
      //         id: "10306",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "CA",
      //         id: "10305",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "13A2Zip",
      //         id: "10303",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Afghanistan",
      //         id: "10304",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     telephone: {
      //       number: {
      //         value: "13A2Phone",
      //         id: "10297",
      //         type: "PDFTextField",
      //       },
      //       extension: {
      //         value: "1",
      //         id: "10296",
      //         type: "PDFTextField",
      //       },
      //       internationalOrDsn: {
      //         value: "Yes",
      //         id: "10295",
      //         type: "PDFCheckBox",
      //       },
      //       day: {
      //         value: "Yes",
      //         id: "10294",
      //         type: "PDFCheckBox",
      //       },
      //       night: {
      //         value: "Yes",
      //         id: "10293",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     periodsNotApplicable: {
      //       value: "Yes",
      //       id: "10271",
      //       type: "PDFCheckBox",
      //     },
      //     additionalPeriods: [
      //       {
      //         _id: 1,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate1",
      //             id: "10363",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10362",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate1",
      //             id: "10361",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10360",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle1",
      //           id: "10359",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor1",
      //           id: "10358",
      //           type: "PDFTextField",
      //         },
      //       },
      //       {
      //         _id: 2,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate2",
      //             id: "10357",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10356",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate2",
      //             id: "10355",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10354",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle2",
      //           id: "10353",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor2",
      //           id: "10352",
      //           type: "PDFTextField",
      //         },
      //       },
      //       {
      //         _id: 3,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate3",
      //             id: "10351",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10350",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate3",
      //             id: "10349",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10348",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle3",
      //           id: "10347",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor3",
      //           id: "10346",
      //           type: "PDFTextField",
      //         },
      //       },
      //       {
      //         _id: 4,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate4",
      //             id: "10345",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10344",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate4",
      //             id: "10343",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10342",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle4",
      //           id: "10341",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor4",
      //           id: "10340",
      //           type: "PDFTextField",
      //         },
      //       },
      //     ],
      //     physicalWorkAddress: {
      //       differentThanEmployer: {
      //         value: "YES ",
      //         id: "17159",
      //         type: "PDFRadioGroup",
      //       },
      //       aLocation: {
      //         street: {
      //           value: "a13A2Street",
      //           id: "10289",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "a13A2City",
      //           id: "10288",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AZ",
      //           id: "10287",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "a13A2Zip",
      //           id: "10285",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Antarctica",
      //           id: "10286",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "a13A2Phone",
      //           id: "10292",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "1",
      //           id: "10291",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10290",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10284",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10283",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       b1Location: {
      //         street: {
      //           value: "a13A2Street",
      //           id: "10332",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "a13A2City",
      //           id: "10331",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AZ",
      //           id: "10330",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "a13A2Zip",
      //           id: "10324",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Antarctica",
      //           id: "10329",
      //           type: "PDFDropdown",
      //         },
      //       },

      //       hasApoFpoAddress: {
      //         value: "YES ",
      //         id: "17161",
      //         type: "PDFRadioGroup",
      //       },
      //       apoFpoAddress: {
      //         dutyLocation: {
      //           value: "a13A1Street",
      //           id: "10328",
      //           type: "PDFTextField",
      //         },

      //         apoOrFpo: {
      //           value: "APO",
      //           id: "10327",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO Europe",
      //           id: "10326",
      //           type: "PDFDropdown",
      //         },
      //         zipcode: {
      //           value: "zipcode",
      //           id: "10325",
      //           type: "PDFTextField",
      //         },
      //       },
      //     },
      //     supervisor: {
      //       name: {
      //         value: "13A2SupervisorName",
      //         id: "10309",
      //         type: "PDFTextField",
      //       },
      //       rankOrPosition: {
      //         value: "13A2SupervisorTitle",
      //         id: "10308",
      //         type: "PDFTextField",
      //       },
      //       email: {
      //         value: "13A2SupervisorEmail",
      //         id: "10334",
      //         type: "PDFTextField",
      //       },
      //       emailUnknown: {
      //         value: "Yes",
      //         id: "10333",
      //         type: "PDFCheckBox",
      //       },
      //       phone: {
      //         number: {
      //           value: "13A2SupervisorPhone",
      //           id: "10339",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "1",
      //           id: "10338",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10337",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10336",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10335",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       physicalWorkLocation: {
      //         street: {
      //           value: "13A2SupervisorStreet",
      //           id: "10302",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A2SupervisorCity",
      //           id: "10301",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "CA",
      //           id: "10300",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A2Supervisor",
      //           id: "10298",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Bahrain",
      //           id: "10299",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       hasAPOFPOAddress: {
      //         value: "YES ",
      //         id: "17162",
      //         type: "PDFRadioGroup",
      //       },
      //       apoFPOAddress: {
      //         dutyLocation: {
      //           value: "b13A2SupervisorAddress",
      //           id: "10317",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b13A2SupervisorAPO",
      //           id: "10316",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO Pacific",
      //           id: "10315",
      //           type: "PDFDropdown",
      //         },
      //         zipcode: {
      //           value: "b13A2SupervisorZip",
      //           id: "10314",
      //           type: "PDFTextField",
      //         },
      //       },
      //       aLocation: {
      //         street: {
      //           value: "13A2SupervisorStreet",
      //           id: "10321",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A2SupervisorCity",
      //           id: "10320",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "CA",
      //           id: "10319",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A2Supervisor",
      //           id: "10313",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Bahrain",
      //           id: "10318",
      //           type: "PDFDropdown",
      //         },
      //       },
      //     },
      //   },
      //   section13A3: {
      //     fromDate: {
      //       date: { value: "13A3Start", id: "10404", type: "PDFTextField" },
      //       estimated: { value: "Yes", id: "10405", type: "PDFCheckBox" },
      //     },
      //     toDate: {
      //       date: { value: "13A3To", id: "10406", type: "PDFTextField" },
      //       estimated: { value: "Yes", id: "10408", type: "PDFCheckBox" },
      //       present: { value: "Yes", id: "10407", type: "PDFCheckBox" },
      //     },
      //     employmentStatus: {
      //       fullTime: { value: "Yes", id: "10412", type: "PDFCheckBox" },
      //       partTime: { value: "Yes", id: "10411", type: "PDFCheckBox" },
      //     },
      //     positionTitle: {
      //       value: "13A3PositionTitle",
      //       id: "10409",
      //       type: "PDFTextField",
      //     },
      //     employmentName: {
      //       value: "13A3Employment",
      //       id: "10410",
      //       type: "PDFTextField",
      //     },
      //     employmentAddress: {
      //       street: { value: "13AStreet", id: "10427", type: "PDFTextField" },
      //       city: { value: "13A3City", id: "10426", type: "PDFTextField" },
      //       state: { value: "CT", id: "10425", type: "PDFDropdown" },
      //       zipCode: { value: "13A3Zip", id: "10423", type: "PDFTextField" },
      //       country: { value: "Algeria", id: "10424", type: "PDFDropdown" },
      //     },
      //     telephone: {
      //       number: { value: "13A3Phone", id: "10422", type: "PDFTextField" },
      //       extension: {
      //         value: "13A3Ext",
      //         id: "10421",
      //         type: "PDFTextField",
      //       },
      //       internationalOrDsn: {
      //         value: "Yes",
      //         id: "10420",
      //         type: "PDFCheckBox",
      //       },
      //       day: { value: "Yes", id: "10419", type: "PDFCheckBox" },
      //       night: { value: "Yes", id: "10418", type: "PDFCheckBox" },
      //     },
      //     physicalWorkAddress: {
      //       differentThanEmployer: {
      //         value: "YES",
      //         id: "17156",
      //         type: "PDFRadioGroup",
      //       },
      //       aLocation: {
      //         street: {
      //           value: "a13A3Street",
      //           id: "10371",
      //           type: "PDFTextField",
      //         },
      //         city: { value: "a13A3City", id: "10370", type: "PDFTextField" },
      //         state: { value: "CA", id: "10369", type: "PDFDropdown" },
      //         zipCode: { value: "13aZip", id: "10367", type: "PDFTextField" },
      //         country: {
      //           value: "Antarctica",
      //           id: "10368",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "a13A3Phone",
      //           id: "10366",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "a13A3ext",
      //           id: "10365",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10364",
      //           type: "PDFCheckBox",
      //         },
      //         day: { value: "Yes", id: "10429", type: "PDFCheckBox" },
      //         night: { value: "Yes", id: "10428", type: "PDFCheckBox" },
      //       },
      //       hasApoFpoAddress: {
      //         value: "YES ",
      //         id: "17157",
      //         type: "PDFRadioGroup",
      //       },
      //       b1Location: {
      //         street: {
      //           value: "b1_13A3Street",
      //           id: "10403",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "b1_13A3City",
      //           id: "10402",
      //           type: "PDFTextField",
      //         },
      //         state: { value: "DC", id: "10401", type: "PDFDropdown" },
      //         zipCode: {
      //           value: "b1_13A3Zip",
      //           id: "10395",
      //           type: "PDFTextField",
      //         },
      //         country: { value: "Bahrain", id: "10400", type: "PDFDropdown" },
      //       },
      //       apoFpoAddress: {
      //         dutyLocation: {
      //           value: "b2_13A3Street",
      //           id: "10399",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "13b2APO",
      //           id: "10398",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO Europe",
      //           id: "10397",
      //           type: "PDFDropdown",
      //         },
      //         zipcode: {
      //           value: "13b2ZipCod",
      //           id: "10396",
      //           type: "PDFTextField",
      //         },
      //       },
      //     },
      //     selfEmploymentVerifier: {
      //       lastName: {
      //         value: "13A3LName",
      //         id: "10380",
      //         type: "PDFTextField",
      //       },
      //       firstName: {
      //         value: "13A3FName",
      //         id: "10379",
      //         type: "PDFTextField",
      //       },
      //       address: {
      //         street: {
      //           value: "13A3Street",
      //           id: "10378",
      //           type: "PDFTextField",
      //         },
      //         city: { value: "13A3City", id: "10377", type: "PDFTextField" },
      //         state: { value: "CT", id: "10376", type: "PDFDropdown" },
      //         zipCode: {
      //           value: "13A3Zip",
      //           id: "10374",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Argentina",
      //           id: "10375",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "13A3phone",
      //           id: "10417",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "13A3Ext",
      //           id: "10416",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10415",
      //           type: "PDFCheckBox",
      //         },
      //         day: { value: "Yes", id: "10414", type: "PDFCheckBox" },
      //         night: { value: "Yes", id: "10413", type: "PDFCheckBox" },
      //       },
      //       aLocation: {
      //         street: {
      //           value: "13A3Street",
      //           id: "10392",
      //           type: "PDFTextField",
      //         },
      //         city: { value: "13A3City", id: "10391", type: "PDFTextField" },
      //         state: { value: "CT", id: "10390", type: "PDFDropdown" },
      //         zipCode: {
      //           value: "13A3Zip",
      //           id: "10384",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Argentina",
      //           id: "10389",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       hasAPOFPOAddress: {
      //         value: "YES ",
      //         id: "17158",
      //         type: "PDFRadioGroup",
      //       },
      //       apoFpoAddress: {
      //         dutyLocation: {
      //           value: "bb13A3Street",
      //           id: "10388",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "bb13A3APO",
      //           id: "10387",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO Pacific",
      //           id: "10386",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "bb13A3Zip",
      //           id: "10385",
      //           type: "PDFTextField",
      //         },
      //       },
      //     },
      //   },
      //   section13A4: {
      //     fromDate: {
      //       date: {
      //         value: "13A4FromDate",
      //         id: "10485",
      //         type: "PDFTextField",
      //       },
      //       estimated: { value: "Yes", id: "10486", type: "PDFCheckBox" },
      //     },
      //     toDate: {
      //       date: { value: "13A4ToDate", id: "10487", type: "PDFTextField" },
      //       estimated: { value: "Yes", id: "10488", type: "PDFCheckBox" },
      //       present: { value: "Yes", id: "10489", type: "PDFCheckBox" },
      //     },
      //     verifier: {
      //       lastName: {
      //         value: "13A4LName",
      //         id: "10491",
      //         type: "PDFTextField",
      //       },
      //       firstName: {
      //         value: "13A4FName",
      //         id: "10490",
      //         type: "PDFTextField",
      //       },
      //       address: {
      //         street: {
      //           value: "13A4Street",
      //           id: "10484",
      //           type: "PDFTextField",
      //         },
      //         city: { value: "13A4City", id: "10483", type: "PDFTextField" },
      //         state: { value: "AL", id: "10482", type: "PDFDropdown" },
      //         zipCode: {
      //           value: "13A4Zip",
      //           id: "10480",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Antarctica",
      //           id: "10481",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "13A4Phone",
      //           id: "10479",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "13A4Ext",
      //           id: "10478",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10477",
      //           type: "PDFCheckBox",
      //         },
      //         day: { value: "Yes", id: "10476", type: "PDFCheckBox" },
      //         night: { value: "Yes", id: "10475", type: "PDFCheckBox" },
      //       },
      //       hasApoFpoAddress: {
      //         value: "YES ",
      //         id: "17155",
      //         type: "PDFRadioGroup",
      //       },
      //       aLocation: {
      //         street: {
      //           value: "a13A4Street",
      //           id: "10440",
      //           type: "PDFTextField",
      //         },
      //         city: { value: "a13A4City", id: "10439", type: "PDFTextField" },
      //         state: { value: "AR", id: "10438", type: "PDFDropdown" },
      //         zipCode: {
      //           value: "a13A4Zip",
      //           id: "10432",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Anguilla",
      //           id: "10437",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         dutyLocation: {
      //           value: "b13A4Street",
      //           id: "10436",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b13A4APO",
      //           id: "10435",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO Pacific",
      //           id: "10434",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b13A4Zip",
      //           id: "10433",
      //           type: "PDFTextField",
      //         },
      //       },
      //     },
      //   },
      //   section13A5: {
      //     reasonForLeaving: {
      //       value: "13A5ResonForLEaving",
      //       id: "10473",
      //       type: "PDFTextField",
      //     },
      //     incidentInLastSevenYears: {
      //       value: "NO (If NO, proceed to 13A.6)",
      //       id: "17150",
      //       type: "PDFRadioGroup",
      //     },
      //     incidentDetails: [
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "10470",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ReasonForBeingFired",
      //           id: "10463",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateFired",
      //           id: "10461",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "10462",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "10469",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ReasonForQuitting",
      //           id: "10464",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateQuit",
      //           id: "10460",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "10459",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "10468",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ChargesorAllegations",
      //           id: "10465",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateLeft",
      //           id: "10456",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "10455",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "10467",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ReasonforUnsatisfactory",
      //           id: "10466",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateLeftMutual",
      //           id: "10458",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "10457",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //     ],
      //   },
      //   section13A6: {
      //     warnedInLastSevenYears: {
      //       value: "YES",
      //       id: "17154",
      //       type: "PDFRadioGroup",
      //     },
      //     warningDetails: [
      //       {
      //         reason: {
      //           value: "13A6Reason1",
      //           id: "10453",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date1",
      //             id: "10451",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10452",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //       {
      //         reason: {
      //           value: "13A6Reason2",
      //           id: "10454",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date2",
      //             id: "10450",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10449",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //       {
      //         reason: {
      //           value: "13A6Reason3",
      //           id: "10447",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date3",
      //             id: "10445",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10446",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //       {
      //         reason: {
      //           value: "13A6Reason4",
      //           id: "10448",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date4",
      //             id: "10444",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10443",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //     ],
      //   },
      // },

      // {
      //   _id: 2,
      //   employmentActivity: {
      //     value:
      //       "Other (Provide explanation and complete 13A.2, 13A.5 and 13A.6)",
      //     id: "17148",
      //     type: "PDFRadioGroup",
      //   },
      //   otherExplanation: {
      //     value: "13OtherExplanation",
      //     id: "10536",
      //     type: "PDFTextField",
      //   },
      //   section13A1: {
      //     fromDate: {
      //       date: {
      //         value: "13A1StartDate",
      //         id: "10532",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10535",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     toDate: {
      //       date: {
      //         value: "13A1ToDate",
      //         id: "10529",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10534",
      //         type: "PDFCheckBox",
      //       },
      //       present: {
      //         value: "Yes",
      //         id: "10533",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     employmentStatus: {
      //       fullTime: {
      //         value: "Yes",
      //         id: "10531",
      //         type: "PDFCheckBox",
      //       },
      //       partTime: {
      //         value: "Yes",
      //         id: "10530",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     dutyStation: {
      //       value: "13A1DutyStation",
      //       id: "10527",
      //       type: "PDFTextField",
      //     },
      //     rankOrPosition: {
      //       value: "13A1RankTitle",
      //       id: "10528",
      //       type: "PDFTextField",
      //     },
      //     address: {
      //       street: {
      //         value: "13A1DutyStreet",
      //         id: "10549",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "13A1DutyCity",
      //         id: "10548",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "AL",
      //         id: "10547",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "13A1DutyZip",
      //         id: "10545",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Afghanistan",
      //         id: "10546",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     telephone: {
      //       number: {
      //         value: "13A1Phone",
      //         id: "10543",
      //         type: "PDFTextField",
      //       },
      //       extension: {
      //         value: "1",
      //         id: "10542",
      //         type: "PDFTextField",
      //       },
      //       internationalOrDsn: {
      //         value: "Yes",
      //         id: "10541",
      //         type: "PDFCheckBox",
      //       },
      //       day: {
      //         value: "Yes",
      //         id: "10540",
      //         type: "PDFCheckBox",
      //       },
      //       night: {
      //         value: "Yes",
      //         id: "10539",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     aLocation: {
      //       street: {
      //         value: "13A1SupervisorAddress",
      //         id: "10516",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "13A1SupervisorCity",
      //         id: "10515",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "DC",
      //         id: "10514",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "13A1Superviso",
      //         id: "10508",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Argentina",
      //         id: "10513",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     hasAPOFPOAddress: {
      //       value: "YES ",
      //       id: "17149",
      //       type: "PDFRadioGroup",
      //     },
      //     apoFPOAddress: {
      //       street: {
      //         value: "10512",
      //         id: "10512",
      //         type: "PDFTextField",
      //       },
      //       apoOrFpo: {
      //         value: "APO",
      //         id: "10511",
      //         type: "PDFTextField",
      //       },
      //       apoFpoStateCode: {
      //         value: "APO/FPO Europe",
      //         id: "10510",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "bZip",
      //         id: "10509",
      //         type: "PDFTextField",
      //       },
      //     },
      //     supervisor: {
      //       name: {
      //         value: "13A1SupervisorName",
      //         id: "10505",
      //         type: "PDFTextField",
      //       },
      //       rankOrPosition: {
      //         value: "13A1SupervisorRankTitle",
      //         id: "10504",
      //         type: "PDFTextField",
      //       },
      //       email: {
      //         value: "13A1SupervisorEmail",
      //         id: "10538",
      //         type: "PDFTextField",
      //       },
      //       emailUnknown: {
      //         value: "Yes",
      //         id: "10537",
      //         type: "PDFCheckBox",
      //       },
      //       phone: {
      //         number: {
      //           value: "13A1SupervisorPhone",
      //           id: "10503",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "13A1Sup",
      //           id: "10502",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10552",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10551",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10550",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       physicalWorkLocation: {
      //         street: {
      //           value: "13A1SupervisorAddress",
      //           id: "10501",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A1SupervisorCity",
      //           id: "10500",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "DC",
      //           id: "10499",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A1Superviso",
      //           id: "10497",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Argentina",
      //           id: "10498",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         street: {
      //           value: "a13A1Street",
      //           id: "10496",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "a13A1City",
      //           id: "10495",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AS",
      //           id: "10494",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "a13A1Zip",
      //           id: "10492",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Angola",
      //           id: "10493",
      //           type: "PDFDropdown",
      //         },
      //       },
      //     },
      //   },

      //   section13A2: {
      //     fromDate: {
      //       date: {
      //         value: "13A2FromDate",
      //         id: "10613",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10614",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     toDate: {
      //       date: {
      //         value: "13A2ToDate",
      //         id: "10615",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10612",
      //         type: "PDFCheckBox",
      //       },
      //       present: {
      //         value: "Yes",
      //         id: "10617",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     employmentStatus: {
      //       fullTime: {
      //         value: "Yes",
      //         id: "10620",
      //         type: "PDFCheckBox",
      //       },
      //       partTime: {
      //         value: "Yes",
      //         id: "10616",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     positionTitle: {
      //       value: "13A2RecentTitle",
      //       id: "10618",
      //       type: "PDFTextField",
      //     },
      //     employerName: {
      //       value: "13A2RecentEmployer",
      //       id: "10619",
      //       type: "PDFTextField",
      //     },
      //     employerAddress: {
      //       street: {
      //         value: "13A2Street",
      //         id: "10555",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "13A2City",
      //         id: "10554",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "AK",
      //         id: "10553",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "13A2Zip",
      //         id: "10644",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Afghanistan",
      //         id: "10645",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     telephone: {
      //       number: {
      //         value: "13A2Phone",
      //         id: "10638",
      //         type: "PDFTextField",
      //       },
      //       extension: {
      //         value: "1",
      //         id: "10637",
      //         type: "PDFTextField",
      //       },
      //       internationalOrDsn: {
      //         value: "Yes",
      //         id: "10636",
      //         type: "PDFCheckBox",
      //       },
      //       day: {
      //         value: "Yes",
      //         id: "10635",
      //         type: "PDFCheckBox",
      //       },
      //       night: {
      //         value: "Yes",
      //         id: "10634",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     periodsNotApplicable: {
      //       value: "Yes",
      //       id: "10621",
      //       type: "PDFCheckBox",
      //     },
      //     additionalPeriods: [
      //       {
      //         _id: 1,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate1",
      //             id: "10611",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10610",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate1",
      //             id: "10609",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10608",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle1",
      //           id: "10607",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor1",
      //           id: "10606",
      //           type: "PDFTextField",
      //         },
      //       },
      //       {
      //         _id: 2,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate2",
      //             id: "10605",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10604",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate2",
      //             id: "10603",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10602",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle2",
      //           id: "10601",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor2",
      //           id: "10600",
      //           type: "PDFTextField",
      //         },
      //       },
      //       {
      //         _id: 3,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate3",
      //             id: "10599",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10598",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate3",
      //             id: "10597",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10596",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle3",
      //           id: "10595",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor3",
      //           id: "10594",
      //           type: "PDFTextField",
      //         },
      //       },
      //       {
      //         _id: 4,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate4",
      //             id: "10593",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10592",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate4",
      //             id: "10591",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10590",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle4",
      //           id: "10589",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor4",
      //           id: "10588",
      //           type: "PDFTextField",
      //         },
      //       },
      //     ],
      //     physicalWorkAddress: {
      //       differentThanEmployer: {
      //         value: "NO (If NO, proceed to (b))",
      //         id: "17140",
      //         type: "PDFRadioGroup",
      //       },
      //       aLocation: {
      //         street: {
      //           value: "a13A2Street",
      //           id: "10630",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "a13A2City",
      //           id: "10629",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AL",
      //           id: "10628",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "a13A2Zip",
      //           id: "10626",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Albania",
      //           id: "10627",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "a13A2Phone",
      //           id: "10633",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "1",
      //           id: "10632",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10631",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10625",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10624",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       b1Location: {
      //         street: {
      //           value: "b1Street",
      //           id: "10580",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "b1City",
      //           id: "10579",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AK",
      //           id: "10578",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b1Zip",
      //           id: "10572",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Afghanistan",
      //           id: "10577",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         street: {
      //           value: "b2Street",
      //           id: "10576",
      //           type: "PDFTextField",
      //         },

      //         apoFpoStateCode: {
      //           value: "b2Zip",
      //           id: "10574",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b2Zip",
      //           id: "10575",
      //           type: "PDFTextField",
      //         },
      //         zipCode: {
      //           value: "b2Zip",
      //           id: "10573",
      //           type: "PDFTextField",
      //         },

      //       },
      //       hasApoFpoAddress: {
      //         value: "NO",
      //         id: "17142",
      //         type: "PDFRadioGroup",
      //       },
      //     },
      //     supervisor: {
      //             name: {
      //               value: "13A2SupervisorName",
      //               id: "10557",
      //               type: "PDFTextField",
      //             },
      //             rankOrPosition: {
      //               value: "13A2SupervisorTitle",
      //               id: "10556",
      //               type: "PDFTextField",
      //             },
      //             email: {
      //               value: "13A2SupervisorEmail",
      //               id: "10582",
      //               type: "PDFTextField",
      //             },
      //             emailUnknown: {
      //               value: "Yes",
      //               id: "10581",
      //               type: "PDFCheckBox",
      //             },
      //             phone: {
      //               number: {
      //                 value: "13A2SupervisorPhone",
      //                 id: "10587",
      //                 type: "PDFTextField",
      //               },
      //               extension: {
      //                 value: "1",
      //                 id: "10586",
      //                 type: "PDFTextField",
      //               },
      //               internationalOrDsn: {
      //                 value: "Yes",
      //                 id: "10585",
      //                 type: "PDFCheckBox",
      //               },
      //               day: {
      //                 value: "Yes",
      //                 id: "10584",
      //                 type: "PDFCheckBox",
      //               },
      //               night: {
      //                 value: "Yes",
      //                 id: "10583",
      //                 type: "PDFCheckBox",
      //               },
      //             },
      //             physicalWorkLocation: {
      //               street: {
      //                 value: "13A2SupervisorStreet",
      //                 id: "10643",
      //                 type: "PDFTextField",
      //               },
      //               city: {
      //                 value: "13A2SupervisorCity",
      //                 id: "10642",
      //                 type: "PDFTextField",
      //               },
      //               state: {
      //                 value: "CA",
      //                 id: "10641",
      //                 type: "PDFDropdown",
      //               },
      //               zipCode: {
      //                 value: "13A2Supervisor",
      //                 id: "10639",
      //                 type: "PDFTextField",
      //               },
      //               country: {
      //                 value: "Bahrain",
      //                 id: "10640",
      //                 type: "PDFDropdown",
      //               },
      //             },
      //             hasAPOFPOAddress: {
      //               value: "YES ",
      //               id: "17143",
      //               type: "PDFRadioGroup",
      //             },
      //             apoFPOAddress: {
      //               street: {
      //                 value: "b13A2SupervisorAddress",
      //                 id: "10565",
      //                 type: "PDFTextField",
      //               },
      //               apoOrFpo: {
      //                 value: "b13A2SupervisorAPO",
      //                 id: "10564",
      //                 type: "PDFTextField",
      //               },
      //               apoFpoStateCode: {
      //                 value: "APO/FPO Pacific",
      //                 id: "10563",
      //                 type: "PDFDropdown",
      //               },
      //               zipCode: {
      //                 value: "b13A2SupervisorZip",
      //                 id: "10562",
      //                 type: "PDFTextField",
      //               },
      //             },
      //             aLocation: {
      //               street: {
      //                 value: "13A2SupervisorStreet",
      //                 id: "10569",
      //                 type: "PDFTextField",
      //               },
      //               city: {
      //                 value: "13A2SupervisorCity",
      //                 id: "10568",
      //                 type: "PDFTextField",
      //               },
      //               state: {
      //                 value: "CA",
      //                 id: "10567",
      //                 type: "PDFDropdown",
      //               },
      //               zipCode: {
      //                 value: "13A2Supervisor",
      //                 id: "10561",
      //                 type: "PDFTextField",
      //               },
      //               country: {
      //                 value: "Bahrain",
      //                 id: "10566",
      //                 type: "PDFDropdown",
      //               },
      //             },

      //     }
      //   },

      //   section13A3: {
      //     fromDate: {
      //       date: {
      //         value: "FromDate",
      //         id: "10668",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10669",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     toDate: {
      //       date: {
      //         value: "ToDate",
      //         id: "10670",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10672",
      //         type: "PDFCheckBox",
      //       },
      //       present: {
      //         value: "Yes",
      //         id: "10671",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     employmentStatus: {
      //       fullTime: {
      //         value: "Yes",
      //         id: "10676",
      //         type: "PDFCheckBox",
      //       },
      //       partTime: {
      //         value: "Yes",
      //         id: "10675",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     positionTitle: {
      //       value: "RecentPositionTitle",
      //       id: "10673",
      //       type: "PDFTextField",
      //     },
      //     employmentName: {
      //       value: "NameOfEmployment",
      //       id: "10674",
      //       type: "PDFTextField",
      //     },
      //     employmentAddress: {
      //       street: {
      //         value: "EmploymentStreet",
      //         id: "10691",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "EmploymentCity",
      //         id: "10690",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "AK",
      //         id: "10689",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "EmploymentZip",
      //         id: "10687",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Afghanistan",
      //         id: "10688",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     telephone: {
      //       number: {
      //         value: "EmploymentPhone",
      //         id: "10686",
      //         type: "PDFTextField",
      //       },
      //       extension: {
      //         value: "EXT",
      //         id: "10685",
      //         type: "PDFTextField",
      //       },
      //       internationalOrDsn: {
      //         value: "Yes",
      //         id: "10684",
      //         type: "PDFCheckBox",
      //       },
      //       day: {
      //         value: "Yes",
      //         id: "10683",
      //         type: "PDFCheckBox",
      //       },
      //       night: {
      //         value: "Yes",
      //         id: "10682",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     physicalWorkAddress: {
      //       differentThanEmployer: {
      //         value: "YES",
      //         id: "17137",
      //         type: "PDFRadioGroup",
      //       },
      //       aLocation: {
      //         street: {
      //           value: "aWorkStreet",
      //           id: "10701",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "aWorkCity",
      //           id: "10700",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AR",
      //           id: "10699",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "aWorkZip",
      //           id: "10697",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Albania",
      //           id: "10698",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "aWorkPhone",
      //           id: "10696",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "aEXT",
      //           id: "10695",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10694",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10693",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10692",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       hasApoFpoAddress: {
      //         value: "YES ",
      //         id: "17138",
      //         type: "PDFRadioGroup",
      //       },
      //       b1Location: {
      //         street: {
      //           value: "b1Street",
      //           id: "10667",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "b1City",
      //           id: "10666",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "DC",
      //           id: "10665",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b1Zip",
      //           id: "10620",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Bahrain",
      //           id: "10664",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         street: {
      //           value: "b2Street",
      //           id: "10663",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b2APO",
      //           id: "10662",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO America",
      //           id: "10661",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b2Zip",
      //           id: "10660",
      //           type: "PDFTextField",
      //         },
      //       },
      //     },
      //     selfEmploymentVerifier: {
      //       lastName: {
      //         value: "VerifyerLastName",
      //         id: "10710",
      //         type: "PDFTextField",
      //       },
      //       firstName: {
      //         value: "VerifyerFirstName",
      //         id: "10709",
      //         type: "PDFTextField",
      //       },
      //       address: {
      //         street: {
      //           value: "VerifyerStreet",
      //           id: "10708",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "VeryfierCity",
      //           id: "10707",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "CT",
      //           id: "10706",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "VeryfierZip",
      //           id: "10704",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Argentina",
      //           id: "10705",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "VeryfierPhone",
      //           id: "10681",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "VeryfierEX",
      //           id: "10680",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10679",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10678",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10677",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       aLocation: {
      //         street: {
      //           value: "13A3Street",
      //           id: "10656",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A3City",
      //           id: "10655",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "CT",
      //           id: "10654",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A3Zip",
      //           id: "10648",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Argentina",
      //           id: "10653",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       hasAPOFPOAddress: {
      //         value: "YES ",
      //         id: "17139",
      //         type: "PDFRadioGroup",
      //       },
      //       apoFpoAddress: {
      //         street: {
      //           value: "b2Street",
      //           id: "10652",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b2APO",
      //           id: "10651",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO America",
      //           id: "10650",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b2Zip",
      //           id: "10649",
      //           type: "PDFTextField",
      //         },
      //       }
      //     },
      //   },

      //   section13A4: {
      //     fromDate: {
      //       date: {
      //         value: "13A4FromDate",
      //         id: "10738",
      //         type: "PDFTextField",
      //       },
      //       estimated: { value: "Yes", id: "10739", type: "PDFCheckBox" },
      //     },
      //     toDate: {
      //       date: { value: "13A4ToDate", id: "10740", type: "PDFTextField" },
      //       estimated: { value: "Yes", id: "10742", type: "PDFCheckBox" },
      //       present: { value: "Yes", id: "10741", type: "PDFCheckBox" },
      //     },
      //     verifier: {
      //       lastName: {
      //         value: "13A4LName",
      //         id: "10744",
      //         type: "PDFTextField",
      //       },
      //       firstName: {
      //         value: "13A4FName",
      //         id: "10743",
      //         type: "PDFTextField",
      //       },
      //       address: {
      //         street: {
      //           value: "13A4Street",
      //           id: "10737",
      //           type: "PDFTextField",
      //         },
      //         city: { value: "13A4City", id: "10736", type: "PDFTextField" },
      //         state: { value: "AL", id: "10735", type: "PDFDropdown" },
      //         zipCode: {
      //           value: "13A4Zip",
      //           id: "10733",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Antarctica",
      //           id: "10734",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "13A4Phone",
      //           id: "10732",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "13A4Ext",
      //           id: "10731",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10730",
      //           type: "PDFCheckBox",
      //         },
      //         day: { value: "Yes", id: "10729", type: "PDFCheckBox" },
      //         night: { value: "Yes", id: "10728", type: "PDFCheckBox" },
      //       },
      //       hasApoFpoAddress: {
      //         value: "YES ",
      //         id: "17136",
      //         type: "PDFRadioGroup",
      //       },
      //       aLocation: {
      //         street: {
      //           value: "a13A4Street",
      //           id: "10755",
      //           type: "PDFTextField",
      //         },
      //         city: { value: "a13A4City", id: "10754", type: "PDFTextField" },
      //         state: { value: "AR", id: "10753", type: "PDFDropdown" },
      //         zipCode: {
      //           value: "a13A4Zip",
      //           id: "10747",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Anguilla",
      //           id: "10752",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         dutyLocation: {
      //           value: "b13A4Street",
      //           id: "10751",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b13A4APO",
      //           id: "10750",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO Pacific",
      //           id: "10749",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b13A4Zip",
      //           id: "10748",
      //           type: "PDFTextField",
      //         },
      //       },

      //     },
      //   },

      //   section13A5: {
      //     reasonForLeaving: {
      //       value: "13A5ResonForLEaving",
      //       id: "10726",
      //       type: "PDFTextField",
      //     },
      //     incidentInLastSevenYears: {
      //       value: "NO (If NO, proceed to 13A.6)",
      //       id: "17131",
      //       type: "PDFRadioGroup",
      //     },
      //     incidentDetails: [
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "10723",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ReasonForBeingFired",
      //           id: "10716",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateFired",
      //           id: "10714",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "10715",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "10722",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ReasonForQuitting",
      //           id: "10717",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateQuit",
      //           id: "10713",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "10712",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "10721",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ChargesorAllegations",
      //           id: "10718",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateLeft",
      //           id: "10771",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "10772",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "10720",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ReasonforUnsatisfactory",
      //           id: "10719",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateLeftMutual",
      //           id: "10773",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "10770",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //     ],
      //   },

      //   section13A6: {
      //     warnedInLastSevenYears: {
      //       value: "YES",
      //       id: "17135",
      //       type: "PDFRadioGroup",
      //     },
      //     warningDetails: [
      //       {
      //         reason: {
      //           value: "13A6Reason1",
      //           id: "10768",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date1",
      //             id: "10766",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10767",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //       {
      //         reason: {
      //           value: "13A6Reason2",
      //           id: "10769",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date2",
      //             id: "10765",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10764",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //       {
      //         reason: {
      //           value: "13A6Reason3",
      //           id: "10762",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date3",
      //             id: "10760",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10761",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //       {
      //         reason: {
      //           value: "13A6Reason4",
      //           id: "10763",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date4",
      //             id: "10759",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10758",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //     ],
      //   },
      // },

      // {
      //   _id: 3,
      //   employmentActivity: {
      //     value:
      //       "Other (Provide explanation and complete 13A.2, 13A.5 and 13A.6)",
      //     id: "17129",
      //     type: "PDFRadioGroup",
      //   },
      //   otherExplanation: {
      //     value: "13OtherExplanation",
      //     id: "10779",
      //     type: "PDFTextField",
      //   },
      //   section13A1: {
      //     fromDate: {
      //       date: {
      //         value: "13A1StartDate",
      //         id: "10775",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10774",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     toDate: {
      //       date: {
      //         value: "13A1ToDate",
      //         id: "10833",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10778",
      //         type: "PDFCheckBox",
      //       },
      //       present: {
      //         value: "Yes",
      //         id: "10834",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     employmentStatus: {
      //       fullTime: {
      //         value: "Yes",
      //         id: "10777",
      //         type: "PDFCheckBox",
      //       },
      //       partTime: {
      //         value: "Yes",
      //         id: "10776",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     dutyStation: {
      //       value: "13A1DutyStation",
      //       id: "10831",
      //       type: "PDFTextField",
      //     },
      //     rankOrPosition: {
      //       value: "13A1RankTitle",
      //       id: "10832",
      //       type: "PDFTextField",
      //     },
      //     address: {
      //       street: {
      //         value: "13A1DutyStreet",
      //         id: "10792",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "13A1DutyCity",
      //         id: "10791",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "AL",
      //         id: "10790",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "13A1DutyZip",
      //         id: "10788",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Afghanistan",
      //         id: "10789",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     telephone: {
      //       number: {
      //         value: "13A1Phone",
      //         id: "10786",
      //         type: "PDFTextField",
      //       },
      //       extension: {
      //         value: "1",
      //         id: "10785",
      //         type: "PDFTextField",
      //       },
      //       internationalOrDsn: {
      //         value: "Yes",
      //         id: "10784",
      //         type: "PDFCheckBox",
      //       },
      //       day: {
      //         value: "Yes",
      //         id: "10783",
      //         type: "PDFCheckBox",
      //       },
      //       night: {
      //         value: "Yes",
      //         id: "10782",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     aLocation: {
      //       street: {
      //         value: "13A1SupervisorAddress",
      //         id: "10820",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "13A1SupervisorCity",
      //         id: "10819",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "DC",
      //         id: "10818",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "13A1Superviso",
      //         id: "10812",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Argentina",
      //         id: "10817",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     hasAPOFPOAddress: {
      //       value: "YES ",
      //       id: "17130",
      //       type: "PDFRadioGroup",
      //     },
      //     apoFPOAddress: {
      //       street: {
      //         value: "Address",
      //         id: "10816",
      //         type: "PDFTextField",
      //       },
      //       apoOrFpo: {
      //         value: "APO",
      //         id: "10815",
      //         type: "PDFTextField",
      //       },
      //       apoFpoStateCode: {
      //         value: "APO/FPO Europe",
      //         id: "10814",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "bZip",
      //         id: "10813",
      //         type: "PDFTextField",
      //       },
      //     },
      //     supervisor: {
      //       name: {
      //         value: "13A1SupervisorName",
      //         id: "10809",
      //         type: "PDFTextField",
      //       },
      //       rankOrPosition: {
      //         value: "13A1SupervisorRankTitle",
      //         id: "10808",
      //         type: "PDFTextField",
      //       },
      //       email: {
      //         value: "13A1SupervisorEmail",
      //         id: "10781",
      //         type: "PDFTextField",
      //       },
      //       emailUnknown: {
      //         value: "Yes",
      //         id: "10780",
      //         type: "PDFCheckBox",
      //       },
      //       phone: {
      //         number: {
      //           value: "13A1SupervisorPhone",
      //           id: "10807",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "13A1Sup",
      //           id: "10806",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10795",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10794",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10793",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       physicalWorkLocation: {
      //         street: {
      //           value: "13A1SupervisorAddress",
      //           id: "10805",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A1SupervisorCity",
      //           id: "10804",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "DC",
      //           id: "10803",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A1Superviso",
      //           id: "10801",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Argentina",
      //           id: "10802",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         street: {
      //           value: "a13A1Street",
      //           id: "10800",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "a13A1City",
      //           id: "10799",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AS",
      //           id: "10798",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "a13A1Zip",
      //           id: "10796",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Angola",
      //           id: "10797",
      //           type: "PDFDropdown",
      //         },
      //       },
      //     },
      //   },

      //   section13A2: {
      //     fromDate: {
      //       date: {
      //         value: "13A2FromDate",
      //         id: "10920",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10921",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     toDate: {
      //       date: {
      //         value: "13A2ToDate",
      //         id: "10922",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10924",
      //         type: "PDFCheckBox",
      //       },
      //       present: {
      //         value: "Yes",
      //         id: "10923",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     employmentStatus: {
      //       fullTime: {
      //         value: "Yes",
      //         id: "10835",
      //         type: "PDFCheckBox",
      //       },
      //       partTime: {
      //         value: "Yes",
      //         id: "10927",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     positionTitle: {
      //       value: "13A2RecentTitle",
      //       id: "10925",
      //       type: "PDFTextField",
      //     },
      //     employerName: {
      //       value: "13A2RecentEmployer",
      //       id: "10926",
      //       type: "PDFTextField",
      //     },
      //     employerAddress: {
      //       street: {
      //         value: "13A2Street",
      //         id: "10862",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "13A2City",
      //         id: "10861",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "AK",
      //         id: "10860",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "13A2Zip",
      //         id: "10858",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Afghanistan",
      //         id: "10859",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     telephone: {
      //       number: {
      //         value: "13A2Phone",
      //         id: "10852",
      //         type: "PDFTextField",
      //       },
      //       extension: {
      //         value: "1",
      //         id: "10851",
      //         type: "PDFTextField",
      //       },
      //       internationalOrDsn: {
      //         value: "Yes",
      //         id: "10850",
      //         type: "PDFCheckBox",
      //       },
      //       day: {
      //         value: "Yes",
      //         id: "10849",
      //         type: "PDFCheckBox",
      //       },
      //       night: {
      //         value: "Yes",
      //         id: "10848",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     periodsNotApplicable: {
      //       value: "Yes",
      //       id: "10919",
      //       type: "PDFCheckBox",
      //     },
      //     additionalPeriods: [
      //       {
      //         _id: 1,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate1",
      //             id: "10918",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10917",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate1",
      //             id: "10916",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10915",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle1",
      //           id: "10914",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor1",
      //           id: "10913",
      //           type: "PDFTextField",
      //         },
      //       },
      //       {
      //         _id: 2,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate2",
      //             id: "10912",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10911",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate2",
      //             id: "10910",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10909",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle2",
      //           id: "10908",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor2",
      //           id: "10907",
      //           type: "PDFTextField",
      //         },
      //       },
      //       {
      //         _id: 3,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate3",
      //             id: "10906",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10905",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate3",
      //             id: "10904",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10903",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle3",
      //           id: "10902",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor3",
      //           id: "10901",
      //           type: "PDFTextField",
      //         },
      //       },
      //       {
      //         _id: 4,
      //         fromDate: {
      //           date: {
      //             value: "13A2FromDate4",
      //             id: "10900",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10899",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         toDate: {
      //           date: {
      //             value: "13A2ToDate4",
      //             id: "10898",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "10897",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //         positionTitle: {
      //           value: "PositionTitle4",
      //           id: "10896",
      //           type: "PDFTextField",
      //         },
      //         supervisor: {
      //           value: "Supervisor4",
      //           id: "10895",
      //           type: "PDFTextField",
      //         },
      //       },
      //     ],
      //     physicalWorkAddress: {
      //       differentThanEmployer: {
      //         value: "NO (If NO, proceed to (b))",
      //         id: "17121",
      //         type: "PDFRadioGroup",
      //       },
      //       aLocation: {
      //         street: {
      //           value: "a13A2Street",
      //           id: "10844",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "a13A2City",
      //           id: "10843",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AL",
      //           id: "10842",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "a13A2Zip",
      //           id: "10840",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Albania",
      //           id: "10841",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "a13A2Phone",
      //           id: "10847",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "1",
      //           id: "10846",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10845",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10839",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10838",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       b1Location: {
      //         street: {
      //           value: "b1Street",
      //           id: "10887",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "b1City",
      //           id: "10886",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AK",
      //           id: "10885",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b1Zip",
      //           id: "10879",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Afghanistan",
      //           id: "10884",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         street: {
      //           value: "b2Street",
      //           id: "10883",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "b2Zip",
      //           id: "10881",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b2Zip",
      //           id: "10882",
      //           type: "PDFTextField",
      //         },
      //         zipCode: {
      //           value: "b2Zip",
      //           id: "10880",
      //           type: "PDFTextField",
      //         },
      //       },
      //       hasApoFpoAddress: {
      //         value: "NO",
      //         id: "17123",
      //         type: "PDFRadioGroup",
      //       },
      //     },
      //     supervisor: {
      //       name: {
      //         value: "13A2SupervisorName",
      //         id: "10864",
      //         type: "PDFTextField",
      //       },
      //       rankOrPosition: {
      //         value: "13A2SupervisorTitle",
      //         id: "10863",
      //         type: "PDFTextField",
      //       },
      //       email: {
      //         value: "13A2SupervisorEmail",
      //         id: "10889",
      //         type: "PDFTextField",
      //       },
      //       emailUnknown: {
      //         value: "Yes",
      //         id: "10888",
      //         type: "PDFCheckBox",
      //       },
      //       phone: {
      //         number: {
      //           value: "13A2SupervisorPhone",
      //           id: "10894",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "1",
      //           id: "10893",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10892",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10891",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10890",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       physicalWorkLocation: {
      //         street: {
      //           value: "13A2SupervisorStreet",
      //           id: "10857",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A2SupervisorCity",
      //           id: "10856",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "CA",
      //           id: "10855",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A2Supervisor",
      //           id: "10853",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Bahrain",
      //           id: "10854",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       hasAPOFPOAddress: {
      //         value: "NO",
      //         id: "17124",
      //         type: "PDFRadioGroup",
      //       },
      //       apoFPOAddress: {
      //         street: {
      //           value: "b13A2SupervisorAddress",
      //           id: "10872",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b13A2SupervisorAPO",
      //           id: "10871",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO Pacific",
      //           id: "10870",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b13A2SupervisorZip",
      //           id: "10869",
      //           type: "PDFTextField",
      //         },
      //       },
      //       aLocation: {
      //         street: {
      //           value: "13A2SupervisorStreet",
      //           id: "10876",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A2SupervisorCity",
      //           id: "10875",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "CA",
      //           id: "10874",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A2Supervisor",
      //           id: "10868",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Bahrain",
      //           id: "10873",
      //           type: "PDFDropdown",
      //         },
      //       },
      //     },
      //   },

      //   section13A3: {
      //     fromDate: {
      //       date: {
      //         value: "FromDate",
      //         id: "10950",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10951",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     toDate: {
      //       date: {
      //         value: "ToDate",
      //         id: "10952",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "10954",
      //         type: "PDFCheckBox",
      //       },
      //       present: {
      //         value: "Yes",
      //         id: "10953",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     employmentStatus: {
      //       fullTime: {
      //         value: "Yes",
      //         id: "10958",
      //         type: "PDFCheckBox",
      //       },
      //       partTime: {
      //         value: "Yes",
      //         id: "10957",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     positionTitle: {
      //       value: "RecentPositionTitle",
      //       id: "10955",
      //       type: "PDFTextField",
      //     },
      //     employmentName: {
      //       value: "NameOfEmployment",
      //       id: "10956",
      //       type: "PDFTextField",
      //     },
      //     employmentAddress: {
      //       street: {
      //         value: "EmploymentStreet",
      //         id: "10973",
      //         type: "PDFTextField",
      //       },
      //       city: {
      //         value: "EmploymentCity",
      //         id: "10972",
      //         type: "PDFTextField",
      //       },
      //       state: {
      //         value: "AK",
      //         id: "10971",
      //         type: "PDFDropdown",
      //       },
      //       zipCode: {
      //         value: "EmploymentZip",
      //         id: "10969",
      //         type: "PDFTextField",
      //       },
      //       country: {
      //         value: "Afghanistan",
      //         id: "10970",
      //         type: "PDFDropdown",
      //       },
      //     },
      //     telephone: {
      //       number: {
      //         value: "EmploymentPhone",
      //         id: "10968",
      //         type: "PDFTextField",
      //       },
      //       extension: {
      //         value: "EXT",
      //         id: "10967",
      //         type: "PDFTextField",
      //       },
      //       internationalOrDsn: {
      //         value: "Yes",
      //         id: "10966",
      //         type: "PDFCheckBox",
      //       },
      //       day: {
      //         value: "Yes",
      //         id: "10965",
      //         type: "PDFCheckBox",
      //       },
      //       night: {
      //         value: "Yes",
      //         id: "10964",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     physicalWorkAddress: {
      //       differentThanEmployer: {
      //         value: "NO (If NO, proceed to (b))",
      //         id: "17118",
      //         type: "PDFRadioGroup",
      //       },
      //       aLocation: {
      //         street: {
      //           value: "aWorkStreet",
      //           id: "10938",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "aWorkCity",
      //           id: "10937",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AR",
      //           id: "10936",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "aWorkZip",
      //           id: "10930",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Albania",
      //           id: "10935",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "aWorkPhone",
      //           id: "10963",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "aEXT",
      //           id: "10962",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "10976",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "10975",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "10974",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       hasApoFpoAddress: {
      //         value: "YES ",
      //         id: "17119",
      //         type: "PDFRadioGroup",
      //       },
      //       b1Location: {
      //         street: {
      //           value: "b1Street",
      //           id: "10949",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "b1City",
      //           id: "10948",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "DC",
      //           id: "10947",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b1Zip",
      //           id: "10941",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Bahrain",
      //           id: "10946",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         street: {
      //           value: "b2Street",
      //           id: "10945",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b2APO",
      //           id: "10944",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO America",
      //           id: "10943",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b2Zip",
      //           id: "10942",
      //           type: "PDFTextField",
      //         },
      //       },
      //     },
      //     selfEmploymentVerifier: {
      //       lastName: {
      //         value: "VerifyerLastName",
      //         id: "10992",
      //         type: "PDFTextField",
      //       },
      //       firstName: {
      //         value: "VerifyerFirstName",
      //         id: "10991",
      //         type: "PDFTextField",
      //       },
      //       address: {
      //         street: {
      //           value: "VerifyerStreet",
      //           id: "10990",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "VeryfierCity",
      //           id: "10989",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "CT",
      //           id: "10988",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "VeryfierZip",
      //           id: "10986",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Argentina",
      //           id: "10987",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "VeryfierPhone",
      //           id: "10978",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "VeryfierEX",
      //           id: "10977",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       aLocation: {
      //         street: {
      //           value: "13A3Street",
      //           id: "10983",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A3City",
      //           id: "10982",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "CT",
      //           id: "10981",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A3Zip",
      //           id: "10979",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Argentina",
      //           id: "10980",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       hasAPOFPOAddress: {
      //         value: "NO",
      //         id: "17120",
      //         type: "PDFRadioGroup",
      //       },
      //       apoFpoAddress: {
      //         street: {
      //           value: "b2Street",
      //           id: "10934",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b2APO",
      //           id: "10933",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO America",
      //           id: "10932",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b2Zip",
      //           id: "10931",
      //           type: "PDFTextField",
      //         },
      //       },
      //     },
      //   },

      //   section13A4: {
      //     fromDate: {
      //       date: {
      //         value: "13A4FromDate",
      //         id: "11048",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "11049",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     toDate: {
      //       date: {
      //         value: "13A4ToDate",
      //         id: "11050",
      //         type: "PDFTextField",
      //       },
      //       estimated: {
      //         value: "Yes",
      //         id: "11052",
      //         type: "PDFCheckBox",
      //       },
      //       present: {
      //         value: "Yes",
      //         id: "11051",
      //         type: "PDFCheckBox",
      //       },
      //     },
      //     verifier: {
      //       lastName: {
      //         value: "13A4LName",
      //         id: "11054",
      //         type: "PDFTextField",
      //       },
      //       firstName: {
      //         value: "13A4FName",
      //         id: "11053",
      //         type: "PDFTextField",
      //       },
      //       address: {
      //         street: {
      //           value: "13A4Street",
      //           id: "11047",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "13A4City",
      //           id: "11046",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AL",
      //           id: "11045",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "13A4Zip",
      //           id: "11043",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Antarctica",
      //           id: "11044",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       telephone: {
      //         number: {
      //           value: "13A4Phone",
      //           id: "11042",
      //           type: "PDFTextField",
      //         },
      //         extension: {
      //           value: "13A4Ext",
      //           id: "11041",
      //           type: "PDFTextField",
      //         },
      //         internationalOrDsn: {
      //           value: "Yes",
      //           id: "11040",
      //           type: "PDFCheckBox",
      //         },
      //         day: {
      //           value: "Yes",
      //           id: "11039",
      //           type: "PDFCheckBox",
      //         },
      //         night: {
      //           value: "Yes",
      //           id: "11038",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       hasApoFpoAddress: {
      //         value: "YES ",
      //         id: "17117",
      //         type: "PDFRadioGroup",
      //       },
      //       aLocation: {
      //         street: {
      //           value: "a13A4Street",
      //           id: "11003",
      //           type: "PDFTextField",
      //         },
      //         city: {
      //           value: "a13A4City",
      //           id: "11002",
      //           type: "PDFTextField",
      //         },
      //         state: {
      //           value: "AR",
      //           id: "11001",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "a13A4Zip",
      //           id: "10995",
      //           type: "PDFTextField",
      //         },
      //         country: {
      //           value: "Anguilla",
      //           id: "11000",
      //           type: "PDFDropdown",
      //         },
      //       },
      //       apoFpoAddress: {
      //         dutyLocation: {
      //           value: "b13A4Street",
      //           id: "10999",
      //           type: "PDFTextField",
      //         },
      //         apoOrFpo: {
      //           value: "b13A4APO",
      //           id: "10998",
      //           type: "PDFTextField",
      //         },
      //         apoFpoStateCode: {
      //           value: "APO/FPO Pacific",
      //           id: "10997",
      //           type: "PDFDropdown",
      //         },
      //         zipCode: {
      //           value: "b13A4Zip",
      //           id: "10996",
      //           type: "PDFTextField",
      //         },
      //       },
      //     },
      //   },

      //   section13A5: {
      //     reasonForLeaving: {
      //       value: "13A5ResonForLEaving",
      //       id: "11036",
      //       type: "PDFTextField",
      //     },
      //     incidentInLastSevenYears: {
      //       value: "NO (If NO, proceed to 13A.6)",
      //       id: "17112",
      //       type: "PDFRadioGroup",
      //     },
      //     incidentDetails: [
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "11033",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ReasonForBeingFired",
      //           id: "11026",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateFired",
      //           id: "11024",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "11025",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "11032",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ReasonForQuitting",
      //           id: "11027",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateQuit",
      //           id: "11023",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "11022",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "11031",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ChargesorAllegations",
      //           id: "11028",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateLeft",
      //           id: "11019",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "11018",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //       {
      //         type: {
      //           value: "Yes",
      //           id: "11030",
      //           type: "PDFCheckBox",
      //         },
      //         reason: {
      //           value: "13A5ReasonforUnsatisfactory",
      //           id: "11029",
      //           type: "PDFTextField",
      //         },
      //         departureDate: {
      //           value: "13A5DateLeftMutual",
      //           id: "11021",
      //           type: "PDFTextField",
      //         },
      //         estimated: {
      //           value: "Yes",
      //           id: "11020",
      //           type: "PDFCheckBox",
      //         },
      //       },
      //     ],
      //   },

      //   section13A6: {
      //     warnedInLastSevenYears: {
      //       value: "YES",
      //       id: "17116",
      //       type: "PDFRadioGroup",
      //     },
      //     warningDetails: [
      //       {
      //         reason: {
      //           value: "13A6Reason1",
      //           id: "11016",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date1",
      //             id: "11014",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "11015",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //       {
      //         reason: {
      //           value: "13A6Reason2",
      //           id: "11017",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date2",
      //             id: "11013",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "11012",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //       {
      //         reason: {
      //           value: "13A6Reason3",
      //           id: "11010",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date3",
      //             id: "11009",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "11009",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //       {
      //         reason: {
      //           value: "13A6Reason4",
      //           id: "11011",
      //           type: "PDFTextField",
      //         },
      //         date: {
      //           date: {
      //             value: "13A6Date4",
      //             id: "11007",
      //             type: "PDFTextField",
      //           },
      //           estimated: {
      //             value: "Yes",
      //             id: "11006",
      //             type: "PDFCheckBox",
      //           },
      //         },
      //       },
      //     ],
      //   },
      // },

      {
        _id: 4,
        // employmentActivity: {
        //   value:
        //     "Other (Provide explanation and complete 13A.2, 13A.5 and 13A.6)",
        //   id: "17110",
        //   type: "PDFRadioGroup",
        // },
        // otherExplanation: {
        //   value: "13OtherExplanation",
        //   id: "11086",
        //   type: "PDFTextField",
        // },

        // section13A1: {
        //   fromDate: {
        //     date: {
        //       value: "13A1StartDate",
        //       id: "11082",
        //       type: "PDFTextField",
        //     },
        //     estimated: {
        //       value: "Yes",
        //       id: "11081",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   toDate: {
        //     date: {
        //       value: "13A1ToDate",
        //       id: "11079",
        //       type: "PDFTextField",
        //     },
        //     estimated: {
        //       value: "Yes",
        //       id: "11085",
        //       type: "PDFCheckBox",
        //     },
        //     present: {
        //       value: "Yes",
        //       id: "11080",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   employmentStatus: {
        //     fullTime: {
        //       value: "Yes",
        //       id: "11084",
        //       type: "PDFCheckBox",
        //     },
        //     partTime: {
        //       value: "Yes",
        //       id: "11083",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   dutyStation: {
        //     value: "13A1DutyStation",
        //     id: "11077",
        //     type: "PDFTextField",
        //   },
        //   rankOrPosition: {
        //     value: "13A1RankTitle",
        //     id: "11078",
        //     type: "PDFTextField",
        //   },
        //   address: {
        //     street: {
        //       value: "13A1DutyStreet",
        //       id: "11099",
        //       type: "PDFTextField",
        //     },
        //     city: {
        //       value: "13A1DutyCity",
        //       id: "11098",
        //       type: "PDFTextField",
        //     },
        //     state: {
        //       value: "AL",
        //       id: "11097",
        //       type: "PDFDropdown",
        //     },
        //     zipCode: {
        //       value: "13A1DutyZip",
        //       id: "11095",
        //       type: "PDFTextField",
        //     },
        //     country: {
        //       value: "Afghanistan",
        //       id: "11096",
        //       type: "PDFDropdown",
        //     },
        //   },
        //   telephone: {
        //     number: {
        //       value: "13A1Phone",
        //       id: "11093",
        //       type: "PDFTextField",
        //     },
        //     extension: {
        //       value: "1",
        //       id: "11092",
        //       type: "PDFTextField",
        //     },
        //     internationalOrDsn: {
        //       value: "Yes",
        //       id: "11091",
        //       type: "PDFCheckBox",
        //     },
        //     day: {
        //       value: "Yes",
        //       id: "11090",
        //       type: "PDFCheckBox",
        //     },
        //     night: {
        //       value: "Yes",
        //       id: "11089",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   aLocation: {
        //     street: {
        //       value: "13A1SupervisorAddress",
        //       id: "11066",
        //       type: "PDFTextField",
        //     },
        //     city: {
        //       value: "13A1SupervisorCity",
        //       id: "11065",
        //       type: "PDFTextField",
        //     },
        //     state: {
        //       value: "DC",
        //       id: "11064",
        //       type: "PDFDropdown",
        //     },
        //     zipCode: {
        //       value: "13A1Superviso",
        //       id: "11058",
        //       type: "PDFTextField",
        //     },
        //     country: {
        //       value: "Argentina",
        //       id: "11063",
        //       type: "PDFDropdown",
        //     },
        //   },
        //   hasAPOFPOAddress: {
        //     value: "YES ",
        //     id: "17111",
        //     type: "PDFRadioGroup",
        //   },
        //   apoFPOAddress: {
        //     street: {
        //       value: "10512",
        //       id: "11062",
        //       type: "PDFTextField",
        //     },
        //     apoOrFpo: {
        //       value: "APO",
        //       id: "11061",
        //       type: "PDFTextField",
        //     },
        //     apoFpoStateCode: {
        //       value: "APO/FPO Europe",
        //       id: "11060",
        //       type: "PDFDropdown",
        //     },
        //     zipCode: {
        //       value: "bZip",
        //       id: "11059",
        //       type: "PDFTextField",
        //     },
        //   },
        //   supervisor: {
        //     name: {
        //       value: "13A1SupervisorName",
        //       id: "11116",
        //       type: "PDFTextField",
        //     },
        //     rankOrPosition: {
        //       value: "13A1SupervisorRankTitle",
        //       id: "11115",
        //       type: "PDFTextField",
        //     },
        //     email: {
        //       value: "13A1SupervisorEmail",
        //       id: "11088",
        //       type: "PDFTextField",
        //     },
        //     emailUnknown: {
        //       value: "Yes",
        //       id: "11087",
        //       type: "PDFCheckBox",
        //     },
        //     phone: {
        //       number: {
        //         value: "13A1SupervisorPhone",
        //         id: "11114",
        //         type: "PDFTextField",
        //       },
        //       extension: {
        //         value: "13A1Sup",
        //         id: "11113",
        //         type: "PDFTextField",
        //       },
        //       internationalOrDsn: {
        //         value: "Yes",
        //         id: "11102",
        //         type: "PDFCheckBox",
        //       },
        //       day: {
        //         value: "Yes",
        //         id: "11101",
        //         type: "PDFCheckBox",
        //       },
        //       night: {
        //         value: "Yes",
        //         id: "11100",
        //         type: "PDFCheckBox",
        //       },
        //     },
        //     physicalWorkLocation: {
        //       street: {
        //         value: "13A1SupervisorAddress",
        //         id: "11112",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "13A1SupervisorCity",
        //         id: "11111",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "DC",
        //         id: "11110",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "13A1Superviso",
        //         id: "11108",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Argentina",
        //         id: "11109",
        //         type: "PDFDropdown",
        //       },
        //     },
        //     apoFpoAddress: {
        //       street: {
        //         value: "a13A1Street",
        //         id: "11107",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "a13A1City",
        //         id: "11106",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "AS",
        //         id: "11105",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "a13A1Zip",
        //         id: "11103",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Angola",
        //         id: "11104",
        //         type: "PDFDropdown",
        //       },
        //     },
        //   },
        // },

        // section13A2: {
        //   fromDate: {
        //     date: {
        //       value: "13A2FromDate",
        //       id: "11171",
        //       type: "PDFTextField",
        //     },
        //     estimated: {
        //       value: "Yes",
        //       id: "11172",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   toDate: {
        //     date: {
        //       value: "13A2ToDate",
        //       id: "11173",
        //       type: "PDFTextField",
        //     },
        //     estimated: {
        //       value: "Yes",
        //       id: "11175",
        //       type: "PDFCheckBox",
        //     },
        //     present: {
        //       value: "Yes",
        //       id: "11174",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   employmentStatus: {
        //     fullTime: {
        //       value: "Yes",
        //       id: "11179",
        //       type: "PDFCheckBox",
        //     },
        //     partTime: {
        //       value: "Yes",
        //       id: "11178",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   positionTitle: {
        //     value: "13A2RecentTitle",
        //     id: "11176",
        //     type: "PDFTextField",
        //   },
        //   employerName: {
        //     value: "13A2RecentEmployer",
        //     id: "11177",
        //     type: "PDFTextField",
        //   },
        //   employerAddress: {
        //     street: {
        //       value: "13A2Street",
        //       id: "11206",
        //       type: "PDFTextField",
        //     },
        //     city: {
        //       value: "13A2City",
        //       id: "11205",
        //       type: "PDFTextField",
        //     },
        //     state: {
        //       value: "AK",
        //       id: "11204",
        //       type: "PDFDropdown",
        //     },
        //     zipCode: {
        //       value: "13A2Zip",
        //       id: "11202",
        //       type: "PDFTextField",
        //     },
        //     country: {
        //       value: "Afghanistan",
        //       id: "11203",
        //       type: "PDFDropdown",
        //     },
        //   },
        //   telephone: {
        //     number: {
        //       value: "13A2Phone",
        //       id: "11196",
        //       type: "PDFTextField",
        //     },
        //     extension: {
        //       value: "1",
        //       id: "11195",
        //       type: "PDFTextField",
        //     },
        //     internationalOrDsn: {
        //       value: "Yes",
        //       id: "11194",
        //       type: "PDFCheckBox",
        //     },
        //     day: {
        //       value: "Yes",
        //       id: "11193",
        //       type: "PDFCheckBox",
        //     },
        //     night: {
        //       value: "Yes",
        //       id: "11192",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   periodsNotApplicable: {
        //     value: "Yes",
        //     id: "11170",
        //     type: "PDFCheckBox",
        //   },
        //   additionalPeriods: [
        //     {
        //       _id: 1,
        //       fromDate: {
        //         date: {
        //           value: "13A2FromDate1",
        //           id: "11169",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "11168",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //       toDate: {
        //         date: {
        //           value: "13A2ToDate1",
        //           id: "11167",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "11166",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //       positionTitle: {
        //         value: "PositionTitle1",
        //         id: "11165",
        //         type: "PDFTextField",
        //       },
        //       supervisor: {
        //         value: "Supervisor1",
        //         id: "11164",
        //         type: "PDFTextField",
        //       },
        //     },
        //     {
        //       _id: 2,
        //       fromDate: {
        //         date: {
        //           value: "13A2FromDate2",
        //           id: "11163",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "11162",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //       toDate: {
        //         date: {
        //           value: "13A2ToDate2",
        //           id: "11161",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "11160",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //       positionTitle: {
        //         value: "PositionTitle2",
        //         id: "11159",
        //         type: "PDFTextField",
        //       },
        //       supervisor: {
        //         value: "Supervisor2",
        //         id: "11158",
        //         type: "PDFTextField",
        //       },
        //     },
        //     {
        //       _id: 3,
        //       fromDate: {
        //         date: {
        //           value: "13A2FromDate3",
        //           id: "11157",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "11156",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //       toDate: {
        //         date: {
        //           value: "13A2ToDate3",
        //           id: "11155",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "11154",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //       positionTitle: {
        //         value: "PositionTitle3",
        //         id: "11153",
        //         type: "PDFTextField",
        //       },
        //       supervisor: {
        //         value: "Supervisor3",
        //         id: "11152",
        //         type: "PDFTextField",
        //       },
        //     },
        //     {
        //       _id: 4,
        //       fromDate: {
        //         date: {
        //           value: "13A2FromDate4",
        //           id: "11151",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "11150",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //       toDate: {
        //         date: {
        //           value: "13A2ToDate4",
        //           id: "11149",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "11148",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //       positionTitle: {
        //         value: "PositionTitle4",
        //         id: "11147",
        //         type: "PDFTextField",
        //       },
        //       supervisor: {
        //         value: "Supervisor4",
        //         id: "11146",
        //         type: "PDFTextField",
        //       },
        //     },
        //   ],
        //   physicalWorkAddress: {
        //     differentThanEmployer: {
        //       value: "NO (If NO, proceed to (b))",
        //       id: "17102",
        //       type: "PDFRadioGroup",
        //     },
        //     aLocation: {
        //       street: {
        //         value: "a13A2Street",
        //         id: "11188",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "a13A2City",
        //         id: "11187",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "AL",
        //         id: "11186",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "a13A2Zip",
        //         id: "11184",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Albania",
        //         id: "11185",
        //         type: "PDFDropdown",
        //       },
        //     },
        //     telephone: {
        //       number: {
        //         value: "a13A2Phone",
        //         id: "11191",
        //         type: "PDFTextField",
        //       },
        //       extension: {
        //         value: "1",
        //         id: "11190",
        //         type: "PDFTextField",
        //       },
        //       internationalOrDsn: {
        //         value: "Yes",
        //         id: "11189",
        //         type: "PDFCheckBox",
        //       },
        //       day: {
        //         value: "Yes",
        //         id: "11183",
        //         type: "PDFCheckBox",
        //       },
        //       night: {
        //         value: "Yes",
        //         id: "11182",
        //         type: "PDFCheckBox",
        //       },
        //     },
        //     b1Location: {
        //       street: {
        //         value: "b1Street",
        //         id: "11138",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "b1City",
        //         id: "11137",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "AK",
        //         id: "11136",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "b1Zip",
        //         id: "11130",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Afghanistan",
        //         id: "11135",
        //         type: "PDFDropdown",
        //       },
        //     },
        //     apoFpoAddress: {
        //       street: {
        //         value: "b2Street",
        //         id: "11134",
        //         type: "PDFTextField",
        //       },
        //       apoFpoStateCode: {
        //         value: "b2Zip",
        //         id: "11132",
        //         type: "PDFTextField",
        //       },
        //       apoOrFpo: {
        //         value: "b2Zip",
        //         id: "11133",
        //         type: "PDFTextField",
        //       },
        //       zipCode: {
        //         value: "b2Zip",
        //         id: "11131",
        //         type: "PDFTextField",
        //       },
        //     },
        //     hasApoFpoAddress: {
        //       value: "NO",
        //       id: "17104",
        //       type: "PDFRadioGroup",
        //     },
        //   },
        //   supervisor: {
        //     name: {
        //       value: "13A2SupervisorName",
        //       id: "11208",
        //       type: "PDFTextField",
        //     },
        //     rankOrPosition: {
        //       value: "13A2SupervisorTitle",
        //       id: "11207",
        //       type: "PDFTextField",
        //     },
        //     email: {
        //       value: "13A2SupervisorEmail",
        //       id: "11140",
        //       type: "PDFTextField",
        //     },
        //     emailUnknown: {
        //       value: "Yes",
        //       id: "11139",
        //       type: "PDFCheckBox",
        //     },
        //     phone: {
        //       number: {
        //         value: "13A2SupervisorPhone",
        //         id: "11145",
        //         type: "PDFTextField",
        //       },
        //       extension: {
        //         value: "1",
        //         id: "11144",
        //         type: "PDFTextField",
        //       },
        //       internationalOrDsn: {
        //         value: "Yes",
        //         id: "11143",
        //         type: "PDFCheckBox",
        //       },
        //       day: {
        //         value: "Yes",
        //         id: "11142",
        //         type: "PDFCheckBox",
        //       },
        //       night: {
        //         value: "Yes",
        //         id: "11141",
        //         type: "PDFCheckBox",
        //       },
        //     },
        //     physicalWorkLocation: {
        //       street: {
        //         value: "13A2SupervisorStreet",
        //         id: "11201",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "13A2SupervisorCity",
        //         id: "11200",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "CA",
        //         id: "11199",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "13A2Supervisor",
        //         id: "11197",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Bahrain",
        //         id: "11198",
        //         type: "PDFDropdown",
        //       },
        //     },
        //     hasAPOFPOAddress: {
        //       value: "YES ",
        //       id: "17105",
        //       type: "PDFRadioGroup",
        //     },
        //     apoFPOAddress: {
        //       street: {
        //         value: "b13A2SupervisorAddress",
        //         id: "11123",
        //         type: "PDFTextField",
        //       },
        //       apoOrFpo: {
        //         value: "b13A2SupervisorAPO",
        //         id: "11122",
        //         type: "PDFTextField",
        //       },
        //       apoFpoStateCode: {
        //         value: "APO/FPO Pacific",
        //         id: "11121",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "b13A2SupervisorZip",
        //         id: "11120",
        //         type: "PDFTextField",
        //       },
        //     },
        //     aLocation: {
        //       street: {
        //         value: "13A2SupervisorStreet",
        //         id: "11127",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "13A2SupervisorCity",
        //         id: "11126",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "CA",
        //         id: "11125",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "13A2Supervisor",
        //         id: "11119",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Bahrain",
        //         id: "11124",
        //         type: "PDFDropdown",
        //       },
        //     },
        //   },
        // },

        // section13A3: {
        //   fromDate: {
        //     date: {
        //       value: "FromDate",
        //       id: "11262",
        //       type: "PDFTextField",
        //     },
        //     estimated: {
        //       value: "Yes",
        //       id: "11263",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   toDate: {
        //     date: {
        //       value: "ToDate",
        //       id: "11264",
        //       type: "PDFTextField",
        //     },
        //     estimated: {
        //       value: "Yes",
        //       id: "11266",
        //       type: "PDFCheckBox",
        //     },
        //     present: {
        //       value: "Yes",
        //       id: "11265",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   employmentStatus: {
        //     fullTime: {
        //       value: "Yes",
        //       id: "11270",
        //       type: "PDFCheckBox",
        //     },
        //     partTime: {
        //       value: "Yes",
        //       id: "11269",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   positionTitle: {
        //     value: "RecentPositionTitle",
        //     id: "11267",
        //     type: "PDFTextField",
        //   },
        //   employmentName: {
        //     value: "NameOfEmployment",
        //     id: "11268",
        //     type: "PDFTextField",
        //   },
        //   employmentAddress: {
        //     street: {
        //       value: "EmploymentStreet",
        //       id: "11219",
        //       type: "PDFTextField",
        //     },
        //     city: {
        //       value: "EmploymentCity",
        //       id: "11218",
        //       type: "PDFTextField",
        //     },
        //     state: {
        //       value: "AK",
        //       id: "11217",
        //       type: "PDFDropdown",
        //     },
        //     zipCode: {
        //       value: "EmploymentZip",
        //       id: "11215",
        //       type: "PDFTextField",
        //     },
        //     country: {
        //       value: "Afghanistan",
        //       id: "11216",
        //       type: "PDFDropdown",
        //     },
        //   },
        //   telephone: {
        //     number: {
        //       value: "EmploymentPhone",
        //       id: "11214",
        //       type: "PDFTextField",
        //     },
        //     extension: {
        //       value: "EXT",
        //       id: "11213",
        //       type: "PDFTextField",
        //     },
        //     internationalOrDsn: {
        //       value: "Yes",
        //       id: "11212",
        //       type: "PDFCheckBox",
        //     },
        //     day: {
        //       value: "Yes",
        //       id: "11211",
        //       type: "PDFCheckBox",
        //     },
        //     night: {
        //       value: "Yes",
        //       id: "11210",
        //       type: "PDFCheckBox",
        //     },
        //   },
        //   physicalWorkAddress: {
        //     differentThanEmployer: {
        //       value: "NO (If NO, proceed to (b))",
        //       id: "17099",
        //       type: "PDFRadioGroup",
        //     },
        //     aLocation: {
        //       street: {
        //         value: "aWorkStreet",
        //         id: "11229",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "aWorkCity",
        //         id: "11228",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "AR",
        //         id: "11227",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "aWorkZip",
        //         id: "11225",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Albania",
        //         id: "11226",
        //         type: "PDFDropdown",
        //       },
        //     },
        //     telephone: {
        //       number: {
        //         value: "aWorkPhone",
        //         id: "11224",
        //         type: "PDFTextField",
        //       },
        //       extension: {
        //         value: "aEXT",
        //         id: "11223",
        //         type: "PDFTextField",
        //       },
        //       internationalOrDsn: {
        //         value: "Yes",
        //         id: "11222",
        //         type: "PDFCheckBox",
        //       },
        //       day: {
        //         value: "Yes",
        //         id: "11221",
        //         type: "PDFCheckBox",
        //       },
        //       night: {
        //         value: "Yes",
        //         id: "11220",
        //         type: "PDFCheckBox",
        //       },
        //     },
        //     hasApoFpoAddress: {
        //       value: "YES ",
        //       id: "17100",
        //       type: "PDFRadioGroup",
        //     },
        //     b1Location: {
        //       street: {
        //         value: "b1Street",
        //         id: "11261",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "b1City",
        //         id: "11260",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "DC",
        //         id: "11259",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "b1Zip",
        //         id: "11253",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Bahrain",
        //         id: "11258",
        //         type: "PDFDropdown",
        //       },
        //     },
        //     apoFpoAddress: {
        //       street: {
        //         value: "b2Street",
        //         id: "11257",
        //         type: "PDFTextField",
        //       },
        //       apoOrFpo: {
        //         value: "b2APO",
        //         id: "11256",
        //         type: "PDFTextField",
        //       },
        //       apoFpoStateCode: {
        //         value: "APO/FPO America",
        //         id: "11255",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "b2Zip",
        //         id: "11254",
        //         type: "PDFTextField",
        //       },
        //     },
        //   },
        //   selfEmploymentVerifier: {
        //     lastName: {
        //       value: "VerifyerLastName",
        //       id: "11238",
        //       type: "PDFTextField",
        //     },
        //     firstName: {
        //       value: "VerifyerFirstName",
        //       id: "11237",
        //       type: "PDFTextField",
        //     },
        //     address: {
        //       street: {
        //         value: "VerifyerStreet",
        //         id: "11236",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "VeryfierCity",
        //         id: "11235",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "CT",
        //         id: "11234",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "VeryfierZip",
        //         id: "11232",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Argentina",
        //         id: "11233",
        //         type: "PDFDropdown",
        //       },
        //     },
        //     telephone: {
        //       number: {
        //         value: "VeryfierPhone",
        //         id: "11275",
        //         type: "PDFTextField",
        //       },
        //       extension: {
        //         value: "VeryfierEX",
        //         id: "11274",
        //         type: "PDFTextField",
        //       },
        //       internationalOrDsn: {
        //         value: "Yes",
        //         id: "11273",
        //         type: "PDFCheckBox",
        //       },
        //       day: {
        //         value: "Yes",
        //         id: "11272",
        //         type: "PDFCheckBox",
        //       },
        //       night: {
        //         value: "Yes",
        //         id: "11271",
        //         type: "PDFCheckBox",
        //       },
        //     },
        //     aLocation: {
        //       street: {
        //         value: "13A3Street",
        //         id: "11250",
        //         type: "PDFTextField",
        //       },
        //       city: {
        //         value: "13A3City",
        //         id: "11249",
        //         type: "PDFTextField",
        //       },
        //       state: {
        //         value: "CT",
        //         id: "11248",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "13A3Zip",
        //         id: "11242",
        //         type: "PDFTextField",
        //       },
        //       country: {
        //         value: "Argentina",
        //         id: "11247",
        //         type: "PDFDropdown",
        //       },
        //     },
        //     hasAPOFPOAddress: {
        //       value: "YES ",
        //       id: "17101",
        //       type: "PDFRadioGroup",
        //     },
        //     apoFpoAddress: {
        //       street: {
        //         value: "b2Street",
        //         id: "11246",
        //         type: "PDFTextField",
        //       },
        //       apoOrFpo: {
        //         value: "b2APO",
        //         id: "11245",
        //         type: "PDFTextField",
        //       },
        //       apoFpoStateCode: {
        //         value: "APO/FPO America",
        //         id: "11244",
        //         type: "PDFDropdown",
        //       },
        //       zipCode: {
        //         value: "b2Zip",
        //         id: "11243",
        //         type: "PDFTextField",
        //       },
        //     },
        //   },
        // },


        section13A4: {
          fromDate: {
            date: {
              value: "13A4FromDate",
              id: "11331",
              type: "PDFTextField",
            },
            estimated: {
              value: "Yes",
              id: "11332",
              type: "PDFCheckBox",
            },
          },
          toDate: {
            date: {
              value: "13A4ToDate",
              id: "11333",
              type: "PDFTextField",
            },
            estimated: {
              value: "Yes",
              id: "11335",
              type: "PDFCheckBox",
            },
            present: {
              value: "Yes",
              id: "11334",
              type: "PDFCheckBox",
            },
          },
          verifier: {
            lastName: {
              value: "13A4LName",
              id: "11337",
              type: "PDFTextField",
            },
            firstName: {
              value: "13A4FName",
              id: "11336",
              type: "PDFTextField",
            },
            address: {
              street: {
                value: "13A4Street",
                id: "11330",
                type: "PDFTextField",
              },
              city: {
                value: "13A4City",
                id: "11329",
                type: "PDFTextField",
              },
              state: {
                value: "AL",
                id: "11328",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "13A4Zip",
                id: "11326",
                type: "PDFTextField",
              },
              country: {
                value: "Antarctica",
                id: "11327",
                type: "PDFDropdown",
              },
            },
            telephone: {
              number: {
                value: "13A4Phone",
                id: "11325",
                type: "PDFTextField",
              },
              extension: {
                value: "13A4Ext",
                id: "11324",
                type: "PDFTextField",
              },
              internationalOrDsn: {
                value: "Yes",
                id: "11323",
                type: "PDFCheckBox",
              },
              day: {
                value: "Yes",
                id: "11322",
                type: "PDFCheckBox",
              },
              night: {
                value: "Yes",
                id: "11321",
                type: "PDFCheckBox",
              },
            },
            hasApoFpoAddress: {
              value: "YES ",
              id: "17098",
              type: "PDFRadioGroup",
            },
            aLocation: {
              street: {
                value: "a13A4Street",
                id: "11286",
                type: "PDFTextField",
              },
              city: {
                value: "a13A4City",
                id: "11285",
                type: "PDFTextField",
              },
              state: {
                value: "AR",
                id: "11284",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "a13A4Zip",
                id: "11278",
                type: "PDFTextField",
              },
              country: {
                value: "Anguilla",
                id: "11283",
                type: "PDFDropdown",
              },
            },
            apoFpoAddress: {
              dutyLocation: {
                value: "b13A4Street",
                id: "11282",
                type: "PDFTextField",
              },
              apoOrFpo: {
                value: "b13A4APO",
                id: "11281",
                type: "PDFTextField",
              },
              apoFpoStateCode: {
                value: "APO/FPO Pacific",
                id: "11280",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "b13A4Zip",
                id: "11279",
                type: "PDFTextField",
              },
            },
          },
        },


        // section13A5: {
        //   reasonForLeaving: {
        //     value: "13A5ResonForLEaving",
        //     id: "",
        //     type: "PDFTextField",
        //   },
        //   incidentInLastSevenYears: {
        //     value: "NO (If NO, proceed to 13A.6)",
        //     id: "",
        //     type: "PDFRadioGroup",
        //   },
        //   incidentDetails: [
        //     {
        //       type: {
        //         value: "Yes",
        //         id: "",
        //         type: "PDFCheckBox",
        //       },
        //       reason: {
        //         value: "13A5ReasonForBeingFired",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       departureDate: {
        //         value: "13A5DateFired",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       estimated: {
        //         value: "Yes",
        //         id: "",
        //         type: "PDFCheckBox",
        //       },
        //     },
        //     {
        //       type: {
        //         value: "Yes",
        //         id: "",
        //         type: "PDFCheckBox",
        //       },
        //       reason: {
        //         value: "13A5ReasonForQuitting",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       departureDate: {
        //         value: "13A5DateQuit",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       estimated: {
        //         value: "Yes",
        //         id: "",
        //         type: "PDFCheckBox",
        //       },
        //     },
        //     {
        //       type: {
        //         value: "Yes",
        //         id: "",
        //         type: "PDFCheckBox",
        //       },
        //       reason: {
        //         value: "13A5ChargesorAllegations",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       departureDate: {
        //         value: "13A5DateLeft",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       estimated: {
        //         value: "Yes",
        //         id: "",
        //         type: "PDFCheckBox",
        //       },
        //     },
        //     {
        //       type: {
        //         value: "Yes",
        //         id: "",
        //         type: "PDFCheckBox",
        //       },
        //       reason: {
        //         value: "13A5ReasonforUnsatisfactory",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       departureDate: {
        //         value: "13A5DateLeftMutual",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       estimated: {
        //         value: "Yes",
        //         id: "",
        //         type: "PDFCheckBox",
        //       },
        //     },
        //   ],
        // },
        // section13A6: {
        //   warnedInLastSevenYears: {
        //     value: "YES",
        //     id: "",
        //     type: "PDFRadioGroup",
        //   },
        //   warningDetails: [
        //     {
        //       reason: {
        //         value: "13A6Reason1",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       date: {
        //         date: {
        //           value: "13A6Date1",
        //           id: "",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //     },
        //     {
        //       reason: {
        //         value: "13A6Reason2",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       date: {
        //         date: {
        //           value: "13A6Date2",
        //           id: "",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //     },
        //     {
        //       reason: {
        //         value: "13A6Reason3",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       date: {
        //         date: {
        //           value: "13A6Date3",
        //           id: "",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //     },
        //     {
        //       reason: {
        //         value: "13A6Reason4",
        //         id: "",
        //         type: "PDFTextField",
        //       },
        //       date: {
        //         date: {
        //           value: "13A6Date4",
        //           id: "",
        //           type: "PDFTextField",
        //         },
        //         estimated: {
        //           value: "Yes",
        //           id: "",
        //           type: "PDFCheckBox",
        //         },
        //       },
        //     },
        //   ],
        // },
      },
    ],

    // section13B: {
    //   hasFormerFederalEmployment: {
    //     value: "Yes",
    //     id: "10442", // Example ID, please replace with actual ID if needed
    //     type: "PDFRadioButton",
    //   },
    //   employmentEntries: [
    //     {
    //       _id: 1, // Example ID, this can be dynamically generated or assigned
    //       fromDate: {
    //         value: "",
    //         id: "10485", // Example ID, please replace with actual ID if needed
    //         type: "PDFTextField",
    //       },
    //       toDate: {
    //         value: "",
    //         id: "10487", // Example ID, please replace with actual ID if needed
    //         type: "PDFTextField",
    //       },
    //       present: {
    //         value: "Yes",
    //         id: "10488", // Example ID, please replace with actual ID if needed
    //         type: "PDFCheckBox",
    //       },
    //       estimated: {
    //         value: "Yes",
    //         id: "10489", // Example ID, please replace with actual ID if needed
    //         type: "PDFCheckBox",
    //       },
    //       agencyName: {
    //         value: "",
    //         id: "agencyNameId", // Example ID, please replace with actual ID if needed
    //         type: "PDFTextField",
    //       },
    //       positionTitle: {
    //         value: "",
    //         id: "positionTitleId", // Example ID, please replace with actual ID if needed
    //         type: "PDFTextField",
    //       },
    //       location: {
    //         street: {
    //           value: "",
    //           id: "Section13EmploymentStreet_10440", // Example ID, please replace with actual ID if needed
    //           type: "PDFTextField",
    //         },
    //         city: {
    //           value: "",
    //           id: "Section13Employment_10439", // Example ID, please replace with actual ID if needed
    //           type: "PDFTextField",
    //         },
    //         state: {
    //           value: "",
    //           id: "Section13EmploymentState_10438", // Example ID, please replace with actual ID if needed
    //           type: "PDFSelect",
    //         },
    //         zipCode: {
    //           value: "",
    //           id: "Section13EmploymentZIP_10432", // Example ID, please replace with actual ID if needed
    //           type: "PDFTextField",
    //         },
    //         country: {
    //           value: "",
    //           id: "Section13EmploymentCountry_10437", // Example ID, please replace with actual ID if needed
    //           type: "PDFSelect",
    //         },
    //       },
    //     },
    //   ],
    // },

    // section13C: {
    //   employmentRecordIssues: { value: "Yes", id: "", type: "PDFRadioGroup" },
    //   employmentRecord: {
    //     fired: { value: "Yes", id: "11342", type: "PDFRadioGroup" },
    //     quitAfterToldWouldBeFired: {
    //       value: "Yes",
    //       id: "11342",
    //       type: "PDFRadioGroup",
    //     },
    //     leftByMutualAgreementMisconduct: {
    //       value: "Yes",
    //       id: "11342",
    //       type: "PDFRadioGroup",
    //     },
    //     leftByMutualAgreementPerformance: {
    //       value: "Yes",
    //       id: "11342",
    //       type: "PDFRadioGroup",
    //     },
    //     writtenWarning: { value: "Yes", id: "11342", type: "PDFRadioGroup" },
    //   },
    // },
  },

  // serviceInfo: {
  //   bornAfter1959: {
  //     value: "Yes",
  //     id: "11447",
  //     type: "PDFRadioGroup",
  //   },
  //   registeredWithSSS: {
  //     value: "dontKnow",
  //     id: "11408",
  //     type: "PDFRadioGroup",
  //   },
  // },
  // militaryHistoryInfo: {
  //   everServedInUSMilitary: {
  //     value: "Yes",
  //     id: "11402",
  //     type: "PDFRadioGroup",
  //   },
  //   disciplinaryProcedure: {
  //     value: "Yes",
  //     id: "11479",
  //     type: "PDFRadioGroup",
  //   },
  //   everServedInForeignMilitary: {
  //     value: "Yes",
  //     id: "11491",
  //     type: "PDFRadioGroup",
  //   },
  //   section15_1: [
  //     {
  //       _id: Math.random(),
  //       branch: { value: "Army", id: "11401", type: "PDFRadioGroup" },
  //       stateOfService: { value: "", id: "11394", type: "PDFDropdown" },
  //       status: { value: "ActiveDuty", id: "11446", type: "PDFRadioGroup" },
  //       officerOrEnlisted: {
  //         value: "NotApplicable",
  //         id: "11392",
  //         type: "PDFRadioGroup",
  //       },
  //       serviceNumber: { value: "", id: "11427", type: "PDFTextField" },
  //       serviceFromDate: { value: "", id: "11466", type: "PDFTextField" },
  //       serviceToDate: { value: "", id: "11464", type: "PDFTextField" },
  //       present: { value: "Yes", id: "11463", type: "PDFPDFCheckBox" },
  //       estimatedFromDate: {
  //         value: "Yes",
  //         id: "11465",
  //         type: "PDFPDFCheckBox",
  //       },
  //       estimatedToDate: { value: "Yes", id: "11462", type: "PDFPDFCheckBox" },
  //       discharged: { value: "Yes", id: "11443", type: "PDFRadioGroup" },
  //       typeOfDischarge: { value: "Other", id: "11457", type: "PDFRadioGroup" },
  //       dischargeTypeOther: { value: "", id: "11450", type: "PDFTextField" },
  //       dischargeDate: { value: "", id: "11452", type: "PDFTextField" },
  //       estimatedDischargeDate: {
  //         value: "Yes",
  //         id: "11451",
  //         type: "PDFPDFCheckBox",
  //       },
  //       dischargeReason: { value: "", id: "11449", type: "PDFTextField" },
  //     },
  //   ],
  //   section15_2: [
  //     {
  //       _id: Math.random(),
  //       date: { value: "", id: "11477", type: "PDFTextField" },
  //       estimatedDate: { value: "Yes", id: "11478", type: "PDFPDFCheckBox" },
  //       descriptionOfOffense: { value: "", id: "11476", type: "PDFTextField" },
  //       nameOfProcedure: { value: "", id: "11475", type: "PDFTextField" },
  //       courtDescription: { value: "", id: "11474", type: "PDFTextField" },
  //       outcomeDescription: { value: "", id: "11473", type: "PDFTextField" },
  //     },
  //   ],
  //   section15_3: [
  //     {
  //       _id: Math.random(),
  //       organizationType: {
  //         value: "Other",
  //         id: "11490",
  //         type: "PDFRadioGroup",
  //       },
  //       organizationTypeOther: { value: "", id: "11494", type: "PDFTextField" },
  //       organizationName: { value: "", id: "11534", type: "PDFTextField" },
  //       country: { value: "", id: "11533", type: "PDFDropdown" },
  //       periodOfServiceFrom: { value: "", id: "11483", type: "PDFTextField" },
  //       periodOfServiceTo: { value: "", id: "11537", type: "PDFTextField" },
  //       present: { value: "Yes", id: "11535", type: "PDFPDFCheckBox" },
  //       estimatedPeriodFrom: {
  //         value: "Yes",
  //         id: "11482",
  //         type: "PDFPDFCheckBox",
  //       },
  //       estimatedPeriodTo: {
  //         value: "Yes",
  //         id: "11536",
  //         type: "PDFPDFCheckBox",
  //       },
  //       highestRank: { value: "", id: "11532", type: "PDFTextField" },
  //       departmentOrOffice: { value: "", id: "11531", type: "PDFTextField" },
  //       associationDescription: {
  //         value: "",
  //         id: "11529",
  //         type: "PDFTextField",
  //       },
  //       reasonForLeaving: { value: "", id: "11530", type: "PDFTextField" },
  //       maintainsContact: { value: "Yes", id: "11514", type: "PDFRadioGroup" },
  //       contacts: [
  //         {
  //           _id: Math.random(),
  //           lastName: { value: "", id: "11522", type: "PDFTextField" },
  //           firstName: { value: "", id: "11521", type: "PDFTextField" },
  //           middleName: { value: "", id: "11523", type: "PDFTextField" },
  //           suffix: { value: "", id: "11520", type: "PDFDropdown" },
  //           address: {
  //             street: { value: "", id: "11528", type: "PDFTextField" },
  //             city: { value: "", id: "11527", type: "PDFTextField" },
  //             state: { value: "", id: "11526", type: "PDFDropdown" },
  //             zipCode: { value: "", id: "11524", type: "PDFTextField" },
  //             country: { value: "", id: "11525", type: "PDFDropdown" },
  //           },
  //           officialTitle: { value: "", id: "11511", type: "PDFTextField" },
  //           frequencyOfContact: {
  //             value: "",
  //             id: "11512",
  //             type: "PDFTextField",
  //           },
  //           associationFrom: { value: "", id: "11519", type: "PDFTextField" },
  //           associationTo: { value: "", id: "11517", type: "PDFTextField" },
  //           present: { value: "Yes", id: "11515", type: "PDFPDFCheckBox" },
  //           estimatedAssociationFrom: {
  //             value: "Yes",
  //             id: "11518",
  //             type: "PDFPDFCheckBox",
  //           },
  //           estimatedAssociationTo: {
  //             value: "Yes",
  //             id: "11516",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
  // peopleThatKnow: [
  //   {
  //     _id: Math.random(),
  //     knownFromDate: {
  //       value: "",
  //       id: "11612",
  //       type: "PDFTextField",
  //     },
  //     knownToDate: {
  //       value: "",
  //       id: "11610",
  //       type: "PDFTextField",
  //     },
  //     present: {
  //       value: "Yes",
  //       id: "11609",
  //       type: "PDFPDFCheckBox",
  //     },
  //     estimatedFromDate: {
  //       value: "Yes",
  //       id: "11608",
  //       type: "PDFPDFCheckBox",
  //     },
  //     estimatedToDate: {
  //       value: "Yes",
  //       id: "11611",
  //       type: "PDFPDFCheckBox",
  //     },
  //     lastName: {
  //       value: "",
  //       id: "11618",
  //       type: "PDFTextField",
  //     },
  //     firstName: {
  //       value: "",
  //       id: "11619",
  //       type: "PDFTextField",
  //     },
  //     middleName: {
  //       value: "",
  //       id: "11620",
  //       type: "PDFTextField",
  //     },
  //     suffix: {
  //       value: "",
  //       id: "11616",
  //       type: "PDFDropdown",
  //     },
  //     emailAddress: {
  //       value: "",
  //       id: "11617",
  //       type: "PDFTextField",
  //     },
  //     emailUnknown: {
  //       value: "Yes",
  //       id: "11593",
  //       type: "PDFPDFCheckBox",
  //     },
  //     rankOrTitle: {
  //       value: "",
  //       id: "11598",
  //       type: "PDFTextField",
  //     },
  //     rankOrTitleNotApplicable: {
  //       value: "Yes",
  //       id: "11594",
  //       type: "PDFPDFCheckBox",
  //     },
  //     relationshipToApplicant: {
  //       neighbor: {
  //         value: "Yes",
  //         id: "11596",
  //         type: "PDFPDFCheckBox",
  //       },
  //       workAssociate: {
  //         value: "Yes",
  //         id: "11592",
  //         type: "PDFPDFCheckBox",
  //       },
  //       friend: {
  //         value: "Yes",
  //         id: "11597",
  //         type: "PDFPDFCheckBox",
  //       },
  //       schoolmate: {
  //         value: "Yes",
  //         id: "11600",
  //         type: "PDFPDFCheckBox",
  //       },
  //       other: {
  //         value: "",
  //         id: "11599",
  //         type: "PDFPDFCheckBox",
  //       },
  //     },
  //     phoneNumber: {
  //       value: "",
  //       id: "11615",
  //       type: "PDFTextField",
  //     },
  //     phoneNumberUnknown: {
  //       value: "Yes",
  //       id: "11601",
  //       type: "PDFPDFCheckBox",
  //     },
  //     phoneExtension: {
  //       value: "",
  //       id: "11613",
  //       type: "PDFTextField",
  //     },
  //     phoneType: {
  //       value: "DSN",
  //       id: "11614",
  //       type: "PDFPDFCheckBox",
  //     },
  //     mobileNumber: {
  //       value: "",
  //       id: "11602",
  //       type: "PDFTextField",
  //     },
  //     preferredContactTime: {
  //       day: {
  //         value: "Yes",
  //         id: "11700",
  //         type: "PDFPDFCheckBox",
  //       },
  //       night: {
  //         value: "Yes",
  //         id: "11621",
  //         type: "PDFPDFCheckBox",
  //       },
  //     },
  //     address: {
  //       street: {
  //         value: "",
  //         id: "11606",
  //         type: "PDFTextField",
  //       },
  //       city: {
  //         value: "",
  //         id: "11607",
  //         type: "PDFTextField",
  //       },
  //       state: {
  //         value: "",
  //         id: "11605",
  //         type: "PDFDropdown",
  //       },
  //       zipCode: {
  //         value: "",
  //         id: "11603",
  //         type: "PDFTextField",
  //       },
  //       country: {
  //         value: "",
  //         id: "11604",
  //         type: "PDFDropdown",
  //       },
  //     },
  //   },
  //   {
  //     _id: Math.random(),
  //     knownFromDate: {
  //       value: "",
  //       id: "11685",
  //       type: "PDFTextField",
  //     },
  //     knownToDate: {
  //       value: "",
  //       id: "11683",
  //       type: "PDFTextField",
  //     },
  //     present: {
  //       value: "Yes",
  //       id: "11682",
  //       type: "PDFPDFCheckBox",
  //     },
  //     estimatedFromDate: {
  //       value: "Yes",
  //       id: "11681",
  //       type: "PDFPDFCheckBox",
  //     },
  //     estimatedToDate: {
  //       value: "Yes",
  //       id: "11684",
  //       type: "PDFPDFCheckBox",
  //     },
  //     lastName: {
  //       value: "",
  //       id: "11691",
  //       type: "PDFTextField",
  //     },
  //     firstName: {
  //       value: "",
  //       id: "11692",
  //       type: "PDFTextField",
  //     },
  //     middleName: {
  //       value: "",
  //       id: "11693",
  //       type: "PDFTextField",
  //     },
  //     suffix: {
  //       value: "",
  //       id: "11689",
  //       type: "PDFDropdown",
  //     },
  //     emailAddress: {
  //       value: "",
  //       id: "11690",
  //       type: "PDFTextField",
  //     },
  //     emailUnknown: {
  //       value: "Yes",
  //       id: "11669",
  //       type: "PDFPDFCheckBox",
  //     },
  //     rankOrTitle: {
  //       value: "",
  //       id: "11673",
  //       type: "PDFTextField",
  //     },
  //     rankOrTitleNotApplicable: {
  //       value: "Yes",
  //       id: "11670",
  //       type: "PDFPDFCheckBox",
  //     },
  //     relationshipToApplicant: {
  //       neighbor: {
  //         value: "Yes",
  //         id: "11671",
  //         type: "PDFPDFCheckBox",
  //       },
  //       workAssociate: {
  //         value: "Yes",
  //         id: "11668",
  //         type: "PDFPDFCheckBox",
  //       },
  //       friend: {
  //         value: "NO",
  //         id: "11672",
  //         type: "PDFPDFCheckBox",
  //       },
  //       schoolmate: {
  //         value: "NO",
  //         id: "11674",
  //         type: "PDFPDFCheckBox",
  //       },
  //       other: {
  //         value: "",
  //         id: "11626",
  //         type: "PDFPDFCheckBox",
  //       },
  //     },
  //     phoneNumber: {
  //       value: "",
  //       id: "11688",
  //       type: "PDFTextField",
  //     },
  //     phoneNumberUnknown: {
  //       value: "NO",
  //       id: "11675",
  //       type: "PDFPDFCheckBox",
  //     },
  //     phoneExtension: {
  //       value: "",
  //       id: "11663",
  //       type: "PDFTextField",
  //     },
  //     phoneType: {
  //       value: "DSN",
  //       id: "11687",
  //       type: "PDFPDFCheckBox",
  //     },
  //     mobileNumber: {
  //       value: "",
  //       id: "11676",
  //       type: "PDFTextField",
  //     },
  //     preferredContactTime: {
  //       day: {
  //         value: "NO",
  //         id: "11667",
  //         type: "PDFPDFCheckBox",
  //       },
  //       night: {
  //         value: "NO",
  //         id: "11694",
  //         type: "PDFPDFCheckBox",
  //       },
  //     },
  //     address: {
  //       street: {
  //         value: "",
  //         id: "11679",
  //         type: "PDFTextField",
  //       },
  //       city: {
  //         value: "",
  //         id: "11680",
  //         type: "PDFTextField",
  //       },
  //       state: {
  //         value: "",
  //         id: "11678",
  //         type: "PDFDropdown",
  //       },
  //       zipCode: {
  //         value: "",
  //         id: "11677",
  //         type: "PDFTextField",
  //       },
  //       country: {
  //         value: "",
  //         id: "11627",
  //         type: "PDFDropdown",
  //       },
  //     },
  //   },
  //   {
  //     _id: Math.random(),
  //     knownFromDate: {
  //       value: "",
  //       id: "11652",
  //       type: "PDFTextField",
  //     },
  //     knownToDate: {
  //       value: "",
  //       id: "11650",
  //       type: "PDFTextField",
  //     },
  //     present: {
  //       value: "NO",
  //       id: "11649",
  //       type: "PDFPDFCheckBox",
  //     },
  //     estimatedFromDate: {
  //       value: "NO",
  //       id: "11648",
  //       type: "PDFPDFCheckBox",
  //     },
  //     estimatedToDate: {
  //       value: "NO",
  //       id: "11651",
  //       type: "PDFPDFCheckBox",
  //     },
  //     lastName: {
  //       value: "",
  //       id: "11658",
  //       type: "PDFTextField",
  //     },
  //     firstName: {
  //       value: "",
  //       id: "11659",
  //       type: "PDFTextField",
  //     },
  //     middleName: {
  //       value: "",
  //       id: "11660",
  //       type: "PDFTextField",
  //     },
  //     suffix: {
  //       value: "",
  //       id: "11656",
  //       type: "PDFDropdown",
  //     },
  //     emailAddress: {
  //       value: "",
  //       id: "11657",
  //       type: "PDFTextField",
  //     },
  //     emailUnknown: {
  //       value: "NO",
  //       id: "11635",
  //       type: "PDFPDFCheckBox",
  //     },
  //     rankOrTitle: {
  //       value: "",
  //       id: "11639",
  //       type: "PDFTextField",
  //     },
  //     rankOrTitleNotApplicable: {
  //       value: "NO",
  //       id: "11636",
  //       type: "PDFPDFCheckBox",
  //     },
  //     relationshipToApplicant: {
  //       neighbor: {
  //         value: "NO",
  //         id: "11637",
  //         type: "PDFPDFCheckBox",
  //       },
  //       workAssociate: {
  //         value: "NO",
  //         id: "11634",
  //         type: "PDFPDFCheckBox",
  //       },
  //       friend: {
  //         value: "NO",
  //         id: "11638",
  //         type: "PDFPDFCheckBox",
  //       },
  //       schoolmate: {
  //         value: "NO",
  //         id: "11640",
  //         type: "PDFPDFCheckBox",
  //       },
  //       other: {
  //         value: "",
  //         id: "11624",
  //         type: "PDFPDFCheckBox",
  //       },
  //     },
  //     phoneNumber: {
  //       value: "",
  //       id: "11655",
  //       type: "PDFTextField",
  //     },
  //     phoneNumberUnknown: {
  //       value: "NO",
  //       id: "11641",
  //       type: "PDFPDFCheckBox",
  //     },
  //     phoneExtension: {
  //       value: "",
  //       id: "11653",
  //       type: "PDFTextField",
  //     },
  //     phoneType: {
  //       value: "DSN",
  //       id: "11654",
  //       type: "PDFPDFCheckBox",
  //     },
  //     mobileNumber: {
  //       value: "",
  //       id: "11642",
  //       type: "PDFTextField",
  //     },
  //     preferredContactTime: {
  //       day: {
  //         value: "NO",
  //         id: "11633",
  //         type: "PDFPDFCheckBox",
  //       },
  //       night: {
  //         value: "NO",
  //         id: "11661",
  //         type: "PDFPDFCheckBox",
  //       },
  //     },
  //     address: {
  //       street: {
  //         value: "",
  //         id: "11646",
  //         type: "PDFTextField",
  //       },
  //       city: {
  //         value: "",
  //         id: "11647",
  //         type: "PDFTextField",
  //       },
  //       state: {
  //         value: "",
  //         id: "11645",
  //         type: "PDFDropdown",
  //       },
  //       zipCode: {
  //         value: "",
  //         id: "11643",
  //         type: "PDFTextField",
  //       },
  //       country: {
  //         value: "",
  //         id: "11644",
  //         type: "PDFDropdown",
  //       },
  //     },
  //   },
  // ],
  // relationshipInfo: {
  //   _id: Math.random(),
  //   currentStatus: {
  //     value: "Never Entered",
  //     id: "11745",
  //     type: "PDFPDFCheckBox",
  //   },
  //   section17_1: {
  //     _id: Math.random(),
  //     fullName: {
  //       lastName: {
  //         value: "",
  //         id: "11741",
  //         type: "PDFTextField",
  //       },
  //       firstName: {
  //         value: "",
  //         id: "11740",
  //         type: "PDFTextField",
  //       },
  //       middleName: {
  //         value: "",
  //         id: "11743",
  //         type: "PDFTextField",
  //       },
  //       suffix: {
  //         value: "",
  //         id: "11742",
  //         type: "PDFDropdown",
  //       },
  //     },
  //     placeOfBirth: {
  //       city: {
  //         value: "",
  //         id: "11727",
  //         type: "PDFTextField",
  //       },
  //       county: {
  //         value: "",
  //         id: "11726",
  //         type: "PDFTextField",
  //       },
  //       state: {
  //         value: "",
  //         id: "11725",
  //         type: "PDFDropdown",
  //       },
  //       country: {
  //         value: "",
  //         id: "11724",
  //         type: "PDFDropdown",
  //       },
  //     },
  //     dateOfBirth: {
  //       date: {
  //         value: "",
  //         id: "11738",
  //         type: "date",
  //       },
  //       estimated: {
  //         value: "NO",
  //         id: "11739",
  //         type: "PDFPDFCheckBox",
  //       },
  //     },
  //     citizenship: [
  //       {
  //         _id: Math.random(),
  //         country: {
  //           value: "",
  //           id: "11774",
  //           type: "PDFDropdown",
  //         },
  //       },
  //     ],
  //     documentation: {
  //       type: {
  //         value: "Other",
  //         id: "11732",
  //         type: "PDFPDFCheckBox",
  //       },
  //       documentNumber: {
  //         value: "",
  //         id: "11730",
  //         type: "PDFTextField",
  //       },
  //       documentExpirationDate: {
  //         date: {
  //           value: "",
  //           id: "11778",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "11777",
  //           type: "PDFPDFCheckBox",
  //         },
  //       },
  //       otherExplanation: {
  //         value: "",
  //         id: "11728",
  //         type: "PDFTextField",
  //       },
  //     },
  //     notApplicable_OtherNames: {
  //       value: "NO",
  //       id: "",
  //       type: "PDFCheckbox",
  //     },
  //     notApplicable_SSN: {
  //       value: "NO",
  //       id: "",
  //       type: "PDFCheckbox",
  //     },

  //     usSocialSecurityNumber: {
  //       value: "",
  //       id: "11776",
  //       type: "PDFTextField",
  //     },
  //     otherNames: [
  //       {
  //         _id: Math.random(),
  //         lastName: {
  //           value: "",
  //           id: "11770",
  //           type: "PDFTextField",
  //         },
  //         firstName: {
  //           value: "",
  //           id: "11771",
  //           type: "PDFTextField",
  //         },
  //         middleName: {
  //           value: "",
  //           id: "11772",
  //           type: "PDFTextField",
  //         },
  //         suffix: {
  //           value: "",
  //           id: "11767",
  //           type: "PDFDropdown",
  //         },
  //         maidenName: {
  //           value: "NO",
  //           id: "11764",
  //           type: "PDFPDFCheckBox",
  //         },
  //         fromDate: {
  //           date: {
  //             value: "",
  //             id: "11769",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "11766",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         toDate: {
  //           date: {
  //             value: "",
  //             id: "11768",
  //             type: "PDFTextField",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "11765",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //       },
  //     ],
  //     relationshipStatus: {
  //       value: "Divorced",
  //       id: "11749",
  //       type: "PDFPDFCheckBox",
  //     },
  //     statusDetails: {
  //       location: {
  //         city: {
  //           value: "",
  //           id: "11801",
  //           type: "PDFTextField",
  //         },
  //         county: {
  //           value: "",
  //           id: "11815",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "11800",
  //           type: "PDFDropdown",
  //         },
  //         country: {
  //           value: "",
  //           id: "11799",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       date: {
  //         date: {
  //           value: "",
  //           id: "11802",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "11817",
  //           type: "PDFPDFCheckBox",
  //         },
  //       },
  //       recordLocation: {
  //         city: {
  //           value: "",
  //           id: "11840",
  //           type: "PDFTextField",
  //         },
  //         county: {
  //           value: "",
  //           id: "11846",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "11839",
  //           type: "PDFDropdown",
  //         },
  //         country: {
  //           value: "",
  //           id: "11838",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       deceased: {
  //         value: "NO",
  //         id: "11842",
  //         type: "PDFRadioGroup",
  //       },
  //       lastKnownAddress: {
  //         street: {
  //           value: "",
  //           id: "11836",
  //           type: "PDFTextField",
  //         },
  //         city: {
  //           value: "",
  //           id: "11835",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "11834",
  //           type: "PDFDropdown",
  //         },
  //         zipCode: {
  //           value: "",
  //           id: "11832",
  //           type: "PDFTextField",
  //         },
  //         country: {
  //           value: "",
  //           id: "11833",
  //           type: "PDFDropdown",
  //         },
  //       },
  //     },
  //   },
  //   section17_2: [
  //     {
  //       _id: Math.random(),
  //       marriageStatus: {
  //         value: "",
  //         id: "11875",
  //         type: "PDFRadioGroup",
  //       },
  //       dateOfMarriage: {
  //         date: {
  //           value: "",
  //           id: "11900",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "11899",
  //           type: "PDFPDFCheckBox",
  //         },
  //       },
  //       placeOfMarriage: {
  //         city: {
  //           value: "",
  //           id: "11879",
  //           type: "PDFTextField",
  //         },
  //         county: {
  //           value: "",
  //           id: "11815",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "11878",
  //           type: "PDFDropdown",
  //         },
  //         country: {
  //           value: "",
  //           id: "11877",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       spouseName: {
  //         lastName: {
  //           value: "",
  //           id: "11854",
  //           type: "PDFTextField",
  //         },
  //         firstName: {
  //           value: "",
  //           id: "11853",
  //           type: "PDFTextField",
  //         },
  //         middleName: {
  //           value: "",
  //           id: "11856",
  //           type: "PDFTextField",
  //         },
  //         suffix: {
  //           value: "",
  //           id: "11855",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       spousePlaceOfBirth: {
  //         city: {
  //           value: "",
  //           id: "11850",
  //           type: "PDFTextField",
  //         },
  //         county: {
  //           value: "",
  //           id: "11815",
  //           type: "PDFTextField",
  //         },
  //         state: {
  //           value: "",
  //           id: "11849",
  //           type: "PDFDropdown",
  //         },
  //         country: {
  //           value: "",
  //           id: "11848",
  //           type: "PDFDropdown",
  //         },
  //       },
  //       spouseDateOfBirth: {
  //         date: {
  //           value: "",
  //           id: "11851",
  //           type: "date",
  //         },
  //         estimated: {
  //           value: "NO",
  //           id: "11852",
  //           type: "PDFPDFCheckBox",
  //         },
  //       },
  //       spouseCitizenship: [
  //         {
  //           _id: Math.random(),
  //           country: {
  //             value: "",
  //             id: "11891",
  //             type: "PDFDropdown",
  //           },
  //         },
  //       ],
  //       spouseDocumentation: {
  //         type: {
  //           value: "Other",
  //           id: "11983",
  //           type: "PDFPDFCheckBox",
  //         },
  //         documentNumber: {
  //           value: "",
  //           id: "11993",
  //           type: "PDFTextField",
  //         },
  //         documentExpirationDate: {
  //           date: {
  //             value: "",
  //             id: "11991",
  //             type: "date",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "11990",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         otherExplanation: {
  //           value: "",
  //           id: "12043",
  //           type: "PDFTextField",
  //         },
  //       },
  //       spouseUsSocialSecurityNumber: {
  //         value: "",
  //         id: "12042",
  //         type: "PDFTextField",
  //       },
  //       spouseOtherNames: [
  //         {
  //           _id: Math.random(),
  //           lastName: {
  //             value: "",
  //             id: "12058",
  //             type: "PDFTextField",
  //           },
  //           firstName: {
  //             value: "",
  //             id: "12059",
  //             type: "PDFTextField",
  //           },
  //           middleName: {
  //             value: "",
  //             id: "12060",
  //             type: "PDFTextField",
  //           },
  //           suffix: {
  //             value: "",
  //             id: "12055",
  //             type: "PDFDropdown",
  //           },
  //           maidenName: {
  //             value: "NO",
  //             id: "12050",
  //             type: "PDFRadioGroup",
  //           },
  //           fromDate: {
  //             date: {
  //               value: "",
  //               id: "12057",
  //               type: "PDFTextField",
  //             },
  //             estimated: {
  //               value: "NO",
  //               id: "12054",
  //               type: "PDFPDFCheckBox",
  //             },
  //           },
  //           toDate: {
  //             date: {
  //               value: "",
  //               id: "12056",
  //               type: "PDFTextField",
  //             },
  //             estimated: {
  //               value: "NO",
  //               id: "12053",
  //               type: "PDFPDFCheckBox",
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   section17_3: {
  //     _id: Math.random(),
  //     hasCohabitant: {
  //       value: "NO",
  //       id: "11954",
  //       type: "PDFRadioGroup",
  //     },
  //     cohabitants: [
  //       {
  //         _id: Math.random(),
  //         fullName: {
  //           lastName: {
  //             value: "",
  //             id: "11926",
  //             type: "PDFTextField",
  //           },
  //           firstName: {
  //             value: "",
  //             id: "11925",
  //             type: "PDFTextField",
  //           },
  //           middleName: {
  //             value: "",
  //             id: "11928",
  //             type: "PDFTextField",
  //           },
  //           suffix: {
  //             value: "",
  //             id: "11927",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         placeOfBirth: {
  //           city: {
  //             value: "",
  //             id: "11922",
  //             type: "PDFTextField",
  //           },
  //           county: {
  //             value: "",
  //             id: "11921",
  //             type: "PDFDropdown",
  //           },
  //           state: {
  //             value: "",
  //             id: "11921",
  //             type: "PDFDropdown",
  //           },
  //           country: {
  //             value: "",
  //             id: "11920",
  //             type: "PDFDropdown",
  //           },
  //         },
  //         dateOfBirth: {
  //           date: {
  //             value: "",
  //             id: "11923",
  //             type: "date",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "11924",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         citizenship: [
  //           {
  //             _id: Math.random(),
  //             country: {
  //               value: "",
  //               id: "11931",
  //               type: "PDFDropdown",
  //             },
  //           },
  //         ],
  //         documentation: {
  //           type: {
  //             value: "Other",
  //             id: "11966",
  //             type: "PDFPDFCheckBox",
  //           },
  //           documentNumber: {
  //             value: "",
  //             id: "11976",
  //             type: "PDFTextField",
  //           },
  //           documentExpirationDate: {
  //             date: {
  //               value: "",
  //               id: "11973",
  //               type: "date",
  //             },
  //             estimated: {
  //               value: "NO",
  //               id: "11972",
  //               type: "PDFPDFCheckBox",
  //             },
  //           },
  //           otherExplanation: {
  //             value: "",
  //             id: "11965",
  //             type: "PDFTextField",
  //           },
  //         },
  //         usSocialSecurityNumber: {
  //           value: "",
  //           id: "11975",
  //           type: "PDFTextField",
  //         },
  //         otherNames: [
  //           {
  //             _id: Math.random(),
  //             lastName: {
  //               value: "",
  //               id: "11951",
  //               type: "PDFTextField",
  //             },
  //             firstName: {
  //               value: "",
  //               id: "11952",
  //               type: "PDFTextField",
  //             },
  //             middleName: {
  //               value: "",
  //               id: "11953",
  //               type: "PDFTextField",
  //             },
  //             suffix: {
  //               value: "",
  //               id: "11948",
  //               type: "PDFDropdown",
  //             },
  //             maidenName: {
  //               value: "NO",
  //               id: "11943",
  //               type: "PDFRadioGroup",
  //             },
  //             fromDate: {
  //               date: {
  //                 value: "",
  //                 id: "11950",
  //                 type: "PDFTextField",
  //               },
  //               estimated: {
  //                 value: "NO",
  //                 id: "11947",
  //                 type: "PDFPDFCheckBox",
  //               },
  //             },
  //             toDate: {
  //               date: {
  //                 value: "",
  //                 id: "11949",
  //                 type: "PDFTextField",
  //               },
  //               estimated: {
  //                 value: "NO",
  //                 id: "11946",
  //                 type: "PDFPDFCheckBox",
  //               },
  //             },
  //           },
  //         ],
  //         cohabitationStartDate: {
  //           date: {
  //             value: "",
  //             id: "11930",
  //             type: "date",
  //           },
  //           estimated: {
  //             value: "NO",
  //             id: "12022",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //       },
  //     ],
  //   },
  // },
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
  //               type: "PDFPDFCheckBox",
  //             },
  //             iDontKnow: {
  //               value: "NO",
  //               id: "12131",
  //               type: "PDFPDFCheckBox",
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
  //                 type: "PDFPDFCheckBox",
  //               },
  //               estimatedTo: {
  //                 value: "NO",
  //                 id: "12123",
  //                 type: "PDFPDFCheckBox",
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
  //               type: "PDFPDFCheckBox",
  //             },
  //             {
  //               value: "Telephone",
  //               id: "12249",
  //               type: "PDFPDFCheckBox",
  //             },
  //             {
  //               value: "Electronic",
  //               id: "12248",
  //               type: "PDFPDFCheckBox",
  //             },
  //             {
  //               value: "Written Correspondence",
  //               id: "12246",
  //               type: "PDFPDFCheckBox",
  //             },
  //             {
  //               value: "Other",
  //               id: "12245",
  //               type: "PDFPDFCheckBox",
  //             },
  //           ],
  //           contactFrequency: {
  //             frequency: {
  //               value: "Daily",
  //               id: "12242",
  //               type: "PDFPDFCheckBox",
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
  //               type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         {
  //           value: "Telephone",
  //           id: "13126",
  //           type: "PDFPDFCheckBox",
  //         },
  //         {
  //           value: "Electronic",
  //           id: "13125",
  //           type: "PDFPDFCheckBox",
  //         },
  //         {
  //           value: "Written Correspondence",
  //           id: "13123",
  //           type: "PDFPDFCheckBox",
  //         },
  //         {
  //           value: "Other",
  //           id: "13121",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         {
  //           value: "Personal",
  //           id: "13192",
  //           type: "PDFPDFCheckBox",
  //         },
  //         {
  //           value: "Obligation",
  //           id: "13189",
  //           type: "PDFPDFCheckBox",
  //         },
  //         {
  //           value: "Other",
  //           id: "13193",
  //           type: "PDFPDFCheckBox",
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
  //     type: "PDFPDFCheckBox",
  //   },
  //   hasForeignSupport: {
  //     value: "NO",
  //     id: "13470",
  //     type: "PDFPDFCheckBox",
  //   },
  //   providedForeignSupport: {
  //     value: "NO",
  //     id: "13471",
  //     type: "PDFPDFCheckBox",
  //   },
  //   providedForeignAdvice: {
  //     value: "NO",
  //     id: "13472",
  //     type: "PDFPDFCheckBox",
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
  //     type: "PDFPDFCheckBox",
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
  //     type: "PDFPDFCheckBox",
  //   },
  //   foreignPoliticalOffice: {
  //     value: "NO",
  //     id: "13467",
  //     type: "PDFTextField",
  //   },
  //   foreignVote: {
  //     value: "NO",
  //     id: "13464",
  //     type: "PDFPDFCheckBox",
  //   },
  //   traveledOutsideUSA: {
  //     value: "NO",
  //     id: "13462",
  //     type: "date",
  //   },
  //   traveledOutsideUSA_Government: {
  //     value: "NO",
  //     id: "13463",
  //     type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value:
  //               "Spouse or legally recognized civil union/domestic partner",
  //             id: "13747",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Cohabitant",
  //             id: "13702",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Dependent children",
  //             id: "13703",
  //             type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value:
  //               "Spouse or legally recognized civil union/domestic partner",
  //             id: "13747",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Cohabitant",
  //             id: "13702",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Dependent children",
  //             id: "13703",
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "13986",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //               type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "14130",
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "14306",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //         type: "PDFPDFCheckBox",
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
  //         type: "PDFPDFCheckBox",
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
  //         type: "PDFPDFCheckBox",
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
  //         type: "PDFPDFCheckBox",
  //       },
  //       estimatedFrom: {
  //         value: "NO",
  //         id: "14524",
  //         type: "PDFPDFCheckBox",
  //       },
  //       estimatedTo: {
  //         value: "NO",
  //         id: "14521",
  //         type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         estimatedFrom: {
  //           value: "NO",
  //           id: "14571",
  //           type: "PDFPDFCheckBox",
  //         },
  //         estimatedTo: {
  //           value: "NO",
  //           id: "14568",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         night: {
  //           value: "NO",
  //           id: "14566",
  //           type: "PDFPDFCheckBox",
  //         },
  //         internationalOrDsnPhoneFieldNumber: {
  //           value: "NO",
  //           id: "14563",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         night: {
  //           value: "NO",
  //           id: "14599",
  //           type: "PDFPDFCheckBox",
  //         },
  //         internationalOrDsnPhoneFieldNumber: {
  //           value: "NO",
  //           id: "14596",
  //           type: "PDFPDFCheckBox",
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
  //         estimated: { value: "NO", id: "14920", type: "PDFPDFCheckBox" },
  //       },
  //       description: { value: "", id: "14919", type: "PDFTextField" },
  //       involvedDomesticViolence: {
  //         value: "NO",
  //         id: "",
  //         type: "PDFRadioGroup",
  //       },
  //       involvedFirearms: { value: "NO", id: "14876", type: "PDFPDFCheckBox" },
  //       involvedAlcoholDrugs: {
  //         value: "NO",
  //         id: "14875",
  //         type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         present: { value: "NO", id: "14931", type: "PDFPDFCheckBox" },
  //       },
  //       probationParoleDates: {
  //         from: { value: "", id: "14944", type: "PDFTextField" },
  //         to: { value: "", id: "14942", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFPDFCheckBox",
  //         },
  //         present: { value: "NO", id: "14941", type: "PDFPDFCheckBox" },
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
  //       involvedFirearms: { value: "NO", id: "14999", type: "PDFPDFCheckBox" },
  //       involvedAlcoholDrugs: {
  //         value: "NO",
  //         id: "14998",
  //         type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         present: { value: "NO", id: "15011", type: "PDFPDFCheckBox" },
  //       },
  //       probationParoleDates: {
  //         from: { value: "", id: "15009", type: "PDFTextField" },
  //         to: { value: "", id: "15007", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFPDFCheckBox",
  //         },
  //         present: { value: "NO", id: "15006", type: "PDFPDFCheckBox" },
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
  //             estimated: { value: "NO", id: "15169", type: "PDFPDFCheckBox" },
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
  //         estimated: { value: "NO", id: "15183", type: "PDFPDFCheckBox" },
  //       },
  //       mostRecentUse: {
  //         date: { value: "", id: "15182", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15181", type: "PDFPDFCheckBox" },
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
  //         estimated: { value: "NO", id: "15269", type: "PDFPDFCheckBox" },
  //       },
  //       mostRecentInvolvement: {
  //         date: { value: "", id: "15268", type: "PDFTextField" },
  //         estimated: { value: "NO", id: "15267", type: "PDFPDFCheckBox" },
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
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //         international: { value: "NO", id: "15348", type: "PDFPDFCheckBox" },
  //         timeOfDay: { value: "Day", id: "15347", type: "PDFPDFCheckBox" },
  //       },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //         international: { value: "NO", id: "15424", type: "PDFPDFCheckBox" },
  //         timeOfDay: { value: "Day", id: "15423", type: "PDFPDFCheckBox" },
  //       },
  //       dateRange: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //         estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //       },
  //       datesOfInvolvement: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //         estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //       },
  //       datesOfInvolvement: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //         estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //       },
  //       datesOfInvolvement: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //         estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //       },
  //       datesOfInvolvement: {
  //         from: {
  //           date: { value: "", id: "15282", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //             estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //           },
  //           to: {
  //             date: { value: "", id: "15280", type: "PDFTextField" },
  //             estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //           },
  //           present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //             type: "PDFPDFCheckBox",
  //           },
  //           timeOfDay: {
  //             value: "Day",
  //             id: "15572",
  //             type: "PDFPDFCheckBox",
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
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         timeOfDay: {
  //           value: "Day",
  //           id: "15613",
  //           type: "PDFPDFCheckBox",
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
  //           estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
  //         },
  //         to: {
  //           date: { value: "", id: "15280", type: "PDFTextField" },
  //           estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
  //         },
  //         present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         unknown: {
  //           value: "NO",
  //           id: "15725",
  //           type: "PDFPDFCheckBox",
  //         },
  //       },

  //       clearanceEligibilityDate: {
  //         date: { value: "", id: "15724", type: "PDFTextField" },
  //         estimated: {
  //           value: "NO",
  //           id: "15723",
  //           type: "PDFPDFCheckBox",
  //         },
  //         unknown: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         notApplicable: {
  //           value: "NO",
  //           id: "15796",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "15859",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         timeOfDay: {
  //           value: "Day",
  //           id: "15877",
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Judgment entered against you",
  //             id: "15918",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Lien placed against your property",
  //             id: "15917",
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         {
  //           _id: Math.random(),
  //           type: {
  //             value: "Currently delinquent on any Federal debt",
  //             id: "15916",
  //             type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         notApplicable: {
  //           value: "NO",
  //           id: "15927",
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         notApplicable: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
  //         },
  //         notApplicable: {
  //           value: "NO",
  //           id: "",
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16125",
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16125",
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16150",
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16173",
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16208",
  //           type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
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
  //             type: "PDFPDFCheckBox",
  //           },
  //         },
  //         present: {
  //           value: "NO",
  //           id: "16245",
  //           type: "PDFPDFCheckBox",
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
