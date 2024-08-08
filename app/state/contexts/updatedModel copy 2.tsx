import { ApplicantFormValues } from "~/components/form86/lastTry/formDefinition copy 2";

const defaultFormData: ApplicantFormValues = {
  personalInfo: {
    lastName: {
      value: "Doe",
      id: "9449",
      type: "PDFTextField",
    },
    firstName: {
      value: "First Name",
      id: "9448",
      type: "PDFTextField",
    },
    middleName: {
      value: "Middle Name",
      id: "9447",
      type: "PDFTextField",
    },
    suffix: {
      value: "Suffix",
      id: "9435",
      type: "PDFDropdown",
    },
  },
  birthInfo: {
    birthDate: {
      value: "Date",
      id: "9432",
      type: "PDFTextField",
    },
    isBirthDateEstimate: {
      value: "YES",
      id: "9431",
      type: "PDFCheckBox",
    },
    birthCity: {
      value: "Jackson",
      id: "9446",
      type: "PDFTextField",
    },
    birthCounty: {
      value: "Peppers",
      id: "9445",
      type: "PDFTextField",
    },
    birthCountry: {
      value: "United States",
      id: "9444",
      type: "PDFDropdown",
    },
    birthState: {
      value: "Texas",
      id: "9443",
      type: "PDFDropdown",
    },
  },
  aknowledgementInfo: {
    aknowledge: {
      value: "YES",
      id: "17237",
      type: "PDFRadioGroup",
    },
    ssn: {
      value: "123456789",
      id: "9441",
      type: "PDFTextField",
    },
    notApplicable: {
      value: "YES",
      id: "9442",
      type: "PDFCheckBox",
    },
  },
  namesInfo: {
    hasNames: {
      value: "YES",
      id: "9489",
      type: "PDFRadioGroup",
    },
    names: [
      {
        _id: 1,
        lastName: {
          value: "Hi",
          id: "9486",
          type: "PDFTextField",
        },
        firstName: {
          value: "YES",
          id: "9487",
          type: "PDFTextField",
        },
        middleName: {
          value: "YES",
          id: "9488",
          type: "PDFTextField",
        },
        suffix: {
          value: "YES",
          id: "9494",
          type: "PDFTextField",
        },
        startDate: {
          date: {
            value: "",
            id: "9498",
            type: "PDFTextField",
          },
          estimated: {
            value: "YES",
            id: "",
            type: "PDFCheckBox",
          },
        },
        endDate: {
          date: {
            value: "",
            id: "9497",
            type: "PDFTextField",
          },
          estimated: {
            value: "YES",
            id: "",
            type: "PDFCheckBox",
          },
        },
        isMaidenName: {
          value: "YES",
          id: "17240",
          type: "PDFRadioGroup",
        },
        reasonChanged: {
          value: "",
          id: "9499",
          type: "PDFTextField",
        },
      },
      {
        _id: 2,
        lastName: {
          value: "Hi",
          id: "9486",
          type: "PDFTextField",
        },
        firstName: {
          value: "YES",
          id: "9487",
          type: "PDFTextField",
        },
        middleName: {
          value: "YES",
          id: "9488",
          type: "PDFTextField",
        },
        suffix: {
          value: "Si",
          id: "9480",
          type: "PDFDropdown",
        },
        startDate: {
          date: {
            value: "",
            id: "9484",
            type: "PDFTextField",
          },
          estimated: {
            value: "YES",
            id: "",
            type: "PDFCheckBox",
          },
        },
        endDate: {
          date: {
            value: "",
            id: "9483",
            type: "PDFTextField",
          },
          estimated: {
            value: "YES",
            id: "",
            type: "PDFCheckBox",
          },
        },
        isMaidenName: {
          value: "YES",
          id: "17240",
          type: "PDFRadioGroup",
        },
        reasonChanged: {
          value: "",
          id: "9485",
          type: "PDFTextField",
        },
      },
      {
        _id: 3,
        lastName: {
          value: "Hi",
          id: "9474",
          type: "PDFTextField",
        },
        firstName: {
          value: "YES",
          id: "9475",
          type: "PDFTextField",
        },
        middleName: {
          value: "YES",
          id: "9476",
          type: "PDFTextField",
        },
        suffix: {
          value: "II",
          id: "9468",
          type: "PDFDropdown",
        },
        startDate: {
          date: {
            value: "",
            id: "9472",
            type: "PDFTextField",
          },
          estimated: {
            value: "YES",
            id: "9467",
            type: "PDFCheckBox",
          },
        },
        endDate: {
          date: {
            value: "",
            id: "9471",
            type: "PDFTextField",
          },
          estimated: {
            value: "YES",
            id: "9466",
            type: "PDFCheckBox",
          },
          isNamePresent: {
            value: "NO",
            id: "9465",
            type: "PDFCheckBox",
          },
        },
        isMaidenName: {
          value: "YES",
          id: "17245",
          type: "PDFRadioGroup",
        },
        reasonChanged: {
          value: "",
          id: "9473",
          type: "PDFTextField",
        },
      },
      {
        _id: 4,
        lastName: {
          value: "Hi",
          id: "9463",
          type: "PDFTextField",
        },
        firstName: {
          value: "YES",
          id: "9463",
          type: "PDFTextField",
        },
        middleName: {
          value: "YES",
          id: "9464",
          type: "PDFTextField",
        },
        suffix: {
          value: "III",
          id: "9456",
          type: "PDFDropdown",
        },
        startDate: {
          date: {
            value: "",
            id: "9459",
            type: "PDFTextField",
          },
          estimated: {
            value: "YES",
            id: "9467",
            type: "PDFCheckBox",
          },
        },
        endDate: {
          date: {
            value: "",
            id: "9459",
            type: "PDFTextField",
          },
          estimated: {
            value: "YES",
            id: "9466",
            type: "PDFCheckBox",
          },
          isNamePresent: {
            value: "NO",
            id: "9465",
            type: "PDFCheckBox",
          },
        },
        isMaidenName: {
          value: "YES",
          id: "17245",
          type: "PDFRadioGroup",
        },
        reasonChanged: {
          value: "",
          id: "9461",
          type: "PDFTextField",
        },
      },
    ],
  },
  physicalAttributes: {
    heightFeet: {
      value: 0,
      id: "9434",
      type: "PDFDropdown",
    },
    heightInch: {
      value: 0,
      id: "9433",
      type: "PDFDropdown",
    },
    weight: {
      value: "",
      id: "9438",
      type: "PDFTextField",
    },
    hairColor: {
      value: "",
      id: "9437",
      type: "PDFDropdown",
    },
    eyeColor: {
      value: "",
      id: "9436",
      type: "PDFDropdown",
    },
    gender: {
      value: "",
      id: "17238",
      type: "PDFRadioGroup",
    },
  },

  contactInfo: {
    homeEmail: {
      value: "",
      id: "9513 ",
      type: "PDFTextField",
    },
    workEmail: {
      value: "",
      id: "9512 ",
      type: "PDFTextField",
    },
    contactNumbers: [
      {
        _id: 1,
        numberType: {
          value: "Home",
          id: "9511 ",
          type: "PDFTextField",
        },
        phoneNumber: {
          value: "",
          id: "9511 ",
          type: "PDFTextField",
        },
        phoneExtension: {
          value: "",
          id: "9510 ",
          type: "PDFTextField",
        },
        isUsableDay: {
          value: "NO",
          id: "9507 ",
          type: "PDFCheckBox",
        },
        isUsableNight: {
          value: "NO",
          id: "9508 ",
          type: "PDFCheckBox",
        },
        internationalOrDSN: {
          value: "NO",
          id: "9509 ",
          type: "PDFCheckBox",
        },
      },
      {
        _id: 2,
        numberType: {
          value: "Work",
          id: "9506 ",
          type: "PDFTextField",
        },
        phoneNumber: {
          value: "",
          id: "9506 ",
          type: "PDFTextField",
        },
        phoneExtension: {
          value: "",
          id: "9505 ",
          type: "PDFTextField",
        },
        isUsableDay: {
          value: "NO",
          id: "9562 ",
          type: "PDFCheckBox",
        },
        isUsableNight: {
          value: "NO",
          id: "9503 ",
          type: "PDFCheckBox",
        },
        internationalOrDSN: {
          value: "NO",
          id: "9504 ",
          type: "PDFCheckBox",
        },
      },
      {
        _id: 3,
        numberType: {
          value: "Cell",
          id: "9561 ",
          type: "PDFTextField",
        },
        phoneNumber: {
          value: "",
          id: "9561 ",
          type: "PDFTextField",
        },
        phoneExtension: {
          value: "",
          id: "9560 ",
          type: "PDFTextField",
        },
        isUsableDay: {
          value: "NO",
          id: "9557 ",
          type: "PDFCheckBox",
        },
        isUsableNight: {
          value: "NO",
          id: "9558 ",
          type: "PDFCheckBox",
        },
        internationalOrDSN: {
          value: "NO",
          id: "9559 ",
          type: "PDFCheckBox",
        },
      },
    ],
  },
  passportInfo: {
    hasPassport: {
      value: "NO",
      id: "",
      type: "PDFRadioGroup",
    },
    section8: {
      passportNum: {
        value: "",
        id: "9553 ",
        type: "PDFTextField",
      },
      issueDate: {
        value: "",
        id: "9551 ",
        type: "PDFTextField",
      },
      isIssuedEst: {
        value: "NO",
        id: "9523 ",
        type: "PDFCheckBox",
      },
      expirationDate: {
        value: "",
        id: "9550 ",
        type: "PDFTextField",
      },
      isExpirationEst: {
        value: "NO",
        id: "9549 ",
        type: "PDFCheckBox",
      },
      passportLName: {
        value: "",
        id: "9547 ",
        type: "PDFTextField",
      },
      passportFName: {
        value: "",
        id: "9546 ",
        type: "PDFTextField",
      },
      passportMName: {
        value: "",
        id: "9548 ",
        type: "PDFTextField",
      },
      passportSuffix: {
        value: "",
        id: "9545 ",
        type: "PDFDropdown",
      },
    },
  },
  citizenshipInfo: {
    citizenship_status_code: {
      value: "",
      id: "17233",
      type: "PDFRadioGroup",
    },
    section9_1: {
      doc_type: {
        value: "",
        id: "9625 ",
        type: "PDFTextField",
      },
      other_doc: {
        value: "",
        id: "9609 ",
        type: "PDFTextField",
      },
      doc_num: {
        value: "",
        id: "9624 ",
        type: "PDFTextField",
      },
      doc_issue_date: {
        value: "",
        id: "9619 ",
        type: "PDFTextField",
      },
      is_issue_date_est: {
        value: "NO",
        id: "9617 ",
        type: "PDFCheckBox",
      },
      issue_city: {
        value: "",
        id: "9623 ",
        type: "PDFTextField",
      },
      issued_state: {
        value: "",
        id: "9626 ",
        type: "PDFTextField",
      },
      issued_country: {
        value: "",
        id: "9582 ",
        type: "PDFTextField",
      },
      issued_fname: {
        value: "",
        id: "9611 ",
        type: "PDFTextField",
      },
      issued_lname: {
        value: "",
        id: "9612 ",
        type: "PDFTextField",
      },
      issued_mname: {
        value: "",
        id: "9613 ",
        type: "PDFTextField",
      },
      issued_suffix: {
        value: "",
        id: "9621 ",
        type: "PDFDropdown",
      },
      citizenship_num: {
        value: "",
        id: "9616 ",
        type: "PDFTextField",
      },
      certificate_issue_date: {
        value: "",
        id: "9614 ",
        type: "PDFTextField",
      },
      is_certificate_date_est: {
        value: "NO",
        id: "9615 ",
        type: "PDFCheckBox",
      },
      certificate_fname: {
        value: "",
        id: "9620 ",
        type: "PDFTextField",
      },
      certificate_lname: {
        value: "",
        id: "9622 ",
        type: "PDFTextField",
      },
      certificate_mname: {
        value: "",
        id: "9620 ",
        type: "PDFTextField",
      },
      certificate_suffix: {
        value: "",
        id: "9604 ",
        type: "PDFDropdown",
      },
      is_born_installation: {
        value: "NO",
        id: "9573 ",
        type: "PDFCheckBox",
      },
      base_name: {
        value: "",
        id: "9572 ",
        type: "PDFTextField",
      },
    },
    section9_2: {
      us_entry_date: {
        value: "",
        id: "9591 ",
        type: "PDFTextField",
      },
      is_us_entry_date_est: {
        value: "NO",
        id: "9590 ",
        type: "PDFCheckBox",
      },
      entry_city: {
        value: "",
        id: "9608 ",
        type: "PDFTextField",
      },
      entry_state: {
        value: "",
        id: "9607 ",
        type: "PDFTextField",
      },
      country_of_citizenship_1: {
        value: "",
        id: "9606 ",
        type: "PDFTextField",
      },
      country_of_citizenship_2: {
        value: "",
        id: "9605 ",
        type: "PDFTextField",
      },
      has_alien_registration: {
        value: "NO",
        id: "9604 ",
        type: "PDFCheckBox",
      },
      alien_registration_num: {
        value: "",
        id: "9610 ",
        type: "PDFTextField",
      },
      naturalization_num: {
        value: "",
        id: "9611 ",
        type: "PDFTextField",
      },
      naturalization_issue_date: {
        value: "",
        id: "9603 ",
        type: "PDFTextField",
      },
      is_natural_issue_est: {
        value: "NO",
        id: "9610 ",
        type: "PDFCheckBox",
      },
      court_issued_date: {
        value: "",
        id: "9593 ",
        type: "PDFTextField",
      },
      court_street: {
        value: "",
        id: "9592 ",
        type: "PDFTextField",
      },
      court_city: {
        value: "",
        id: "9586 ",
        type: "PDFTextField",
      },
      court_state: {
        value: "",
        id: "9582 ",
        type: "PDFTextField",
      },
      court_zip: {
        value: "",
        id: "9579 ",
        type: "PDFTextField",
      },
      court_issued_fname: {
        value: "",
        id: "9602 ",
        type: "PDFTextField",
      },
      court_issued_lname: {
        value: "",
        id: "9591 ",
        type: "PDFTextField",
      },
      court_issued_mname: {
        value: "",
        id: "9590 ",
        type: "PDFTextField",
      },
      court_issued_suffix: {
        value: "",
        id: "9589 ",
        type: "PDFDropdown",
      },
      basis_of_naturalization: {
        value: "",
        id: "9576 ",
        type: "PDFTextField",
      },
      other_basis_detail: {
        value: "",
        id: "9575 ",
        type: "PDFTextField",
      },
    },
    section9_3: {
      alien_registration_num: {
        value: "",
        id: "9574 ",
        type: "PDFTextField",
      },
      permanent_resident_num: {
        value: "",
        id: "9573 ",
        type: "PDFTextField",
      },
      certificate_of_citizenship_num: {
        value: "",
        id: "9572 ",
        type: "PDFTextField",
      },
      doc_fname: {
        value: "",
        id: "9571 ",
        type: "PDFTextField",
      },
      doc_lname: {
        value: "",
        id: "9570 ",
        type: "PDFTextField",
      },
      doc_mname: {
        value: "",
        id: "9569 ",
        type: "PDFTextField",
      },
      doc_suffix: {
        value: "",
        id: "9568 ",
        type: "PDFDropdown",
      },
      doc_issue_date: {
        value: "",
        id: "9567 ",
        type: "PDFTextField",
      },
      is_doc_date_est: {
        value: "NO",
        id: "9566 ",
        type: "PDFCheckBox",
      },
      basis_of_citizenship: {
        value: "other",
        id: "9570 ",
        type: "PDFTextField",
      },
      basis_of_citizenship_explanation: {
        value: "",
        id: "9571 ",
        type: "PDFTextField",
      },
    },
    section9_4: {
      residence_status: {
        value: "",
        id: "9565 ",
        type: "PDFTextField",
      },
      us_entry_date: {
        value: "",
        id: "9566 ",
        type: "PDFTextField",
      },
      is_entry_date_est: {
        value: "NO",
        id: "9565 ",
        type: "PDFCheckBox",
      },
      country_of_citizenship1: {
        value: "",
        id: "9566 ",
        type: "PDFTextField",
      },
      country_of_citizenship2: {
        value: "",
        id: "9565 ",
        type: "PDFTextField",
      },
      entry_city: {
        value: "",
        id: "9568 ",
        type: "PDFTextField",
      },
      entry_state: {
        value: "",
        id: "9567 ",
        type: "PDFTextField",
      },
      alien_registration_num: {
        value: "",
        id: "9566 ",
        type: "PDFTextField",
      },
      expiration_date: {
        value: "",
        id: "9565 ",
        type: "PDFTextField",
      },
      is_expiration_est: {
        value: "NO",
        id: "9566 ",
        type: "PDFCheckBox",
      },
      document_issued: {
        value: "I-94",
        id: "9565 ",
        type: "PDFTextField",
      },
      other_doc: {
        value: "",
        id: "9566 ",
        type: "PDFTextField",
      },
      doc_num: {
        value: "",
        id: "9565 ",
        type: "PDFTextField",
      },
      doc_issued_date: {
        value: "",
        id: "9566 ",
        type: "PDFTextField",
      },
      is_doc_date_est: {
        value: "NO",
        id: "9565 ",
        type: "PDFCheckBox",
      },
      doc_expire_date: {
        value: "",
        id: "9566 ",
        type: "PDFTextField",
      },
      is_doc_expiration_est: {
        value: "NO",
        id: "9565 ",
        type: "PDFCheckBox",
      },
      doc_fname: {
        value: "",
        id: "9570 ",
        type: "PDFTextField",
      },
      doc_lname: {
        value: "",
        id: "9569 ",
        type: "PDFTextField",
      },
      doc_mname: {
        value: "",
        id: "9568 ",
        type: "PDFTextField",
      },
      doc_suffix: {
        value: "",
        id: "9567 ",
        type: "PDFDropdown",
      },
    },
  },

  dualCitizenshipInfo: {
    heldMultipleCitizenships: {
      value: "NO",
      id: "9705 0 R",
      type: "PDFRadioGroup",
    },
    hadNonUSPassport: {
      value: "NO",
      id: "9704 0 R",
      type: "PDFRadioGroup",
    },
    citizenships: [
      {
        _id: 1,
        country: {
          value: "",
          id: "9705 0 R",
          type: "PDFDropdown",
        },
        howCitizenshipAcquired: {
          value: "",
          id: "9704 0 R",
          type: "PDFTextField",
        },
        citizenshipStart: {
          value: "",
          id: "9703 0 R",
          type: "PDFTextField",
        },
        isCitizenshipStartEstimated: {
          value: "NO",
          id: "9702 0 R",
          type: "PDFCheckBox",
        },
        citizenshipEnd: {
          value: "",
          id: "9701 0 R",
          type: "PDFTextField",
        },
        isCitizenshipEndPresent: {
          value: "NO",
          id: "9700 0 R",
          type: "PDFCheckBox",
        },
        isCitizenshipEndEstimated: {
          value: "NO",
          id: "9699 0 R",
          type: "PDFCheckBox",
        },
        isRenounced: {
          value: "NO",
          id: "9696 0 R",
          type: "PDFCheckBox",
        },
        renouncementDetails: {
          value: "",
          id: "9693 0 R",
          type: "PDFTextField",
        },
        isCitizenshipHeld: {
          value: "NO",
          id: "9692 0 R",
          type: "PDFCheckBox",
        },
        citizenshipExplanation: {
          value: "",
          id: "9691 0 R",
          type: "PDFTextField",
        },
      },
      {
        _id: 2,
        country: {
          value: "",
          id: "9725 0 R",
          type: "PDFDropdown",
        },
        howCitizenshipAcquired: {
          value: "",
          id: "9724 0 R",
          type: "PDFTextField",
        },
        citizenshipStart: {
          value: "",
          id: "9723 0 R",
          type: "PDFTextField",
        },
        isCitizenshipStartEstimated: {
          value: "NO",
          id: "9722 0 R",
          type: "PDFCheckBox",
        },
        citizenshipEnd: {
          value: "",
          id: "9721 0 R",
          type: "PDFTextField",
        },
        isCitizenshipEndPresent: {
          value: "NO",
          id: "9720 0 R",
          type: "PDFCheckBox",
        },
        isCitizenshipEndEstimated: {
          value: "NO",
          id: "9719 0 R",
          type: "PDFCheckBox",
        },
        isRenounced: {
          value: "NO",
          id: "9718 0 R",
          type: "PDFCheckBox",
        },
        renouncementDetails: {
          value: "",
          id: "9717 0 R",
          type: "PDFTextField",
        },
        isCitizenshipHeld: {
          value: "NO",
          id: "9716 0 R",
          type: "PDFCheckBox",
        },
        citizenshipExplanation: {
          value: "",
          id: "9715 0 R",
          type: "PDFTextField",
        },
      },
    ],
    passports: [
      {
        _id: 1,
        countryIssued: {
          value: "",
          id: "9704 0 R",
          type: "PDFDropdown",
        },
        passportDateIssued: {
          value: "",
          id: "9703 0 R",
          type: "PDFTextField",
        },
        isPassportDateEst: {
          value: "NO",
          id: "9702 0 R",
          type: "PDFCheckBox",
        },
        passportCity: {
          value: "",
          id: "9701 0 R",
          type: "PDFTextField",
        },
        passportCountry: {
          value: "",
          id: "9700 0 R",
          type: "PDFDropdown",
        },
        passportLName: {
          value: "",
          id: "9699 0 R",
          type: "PDFTextField",
        },
        passportFName: {
          value: "",
          id: "9696 0 R",
          type: "PDFTextField",
        },
        passportMName: {
          value: "",
          id: "9693 0 R",
          type: "PDFTextField",
        },
        passportSuffix: {
          value: "",
          id: "9669 0 R",
          type: "PDFDropdown",
        },
        passportNumber: {
          value: "",
          id: "9692 0 R",
          type: "PDFTextField",
        },
        passportExpiration: {
          value: "",
          id: "9691 0 R",
          type: "PDFTextField",
        },
        isExpirationEst: {
          value: "NO",
          id: "9690 0 R",
          type: "PDFCheckBox",
        },
        isPassportUsed: {
          value: "NO",
          id: "9689 0 R",
          type: "PDFCheckBox",
        },
        passportUses: [
          {
            _id: 1,
            passportCountry: {
              value: "",
              id: "9688 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9687 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9684 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9683 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9680 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9677 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 2,
            passportCountry: {
              value: "",
              id: "9676 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9675 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9674 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9673 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9672 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9671 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 3,
            passportCountry: {
              value: "",
              id: "9670 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9669 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9668 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9667 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9666 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9663 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 4,
            passportCountry: {
              value: "",
              id: "9662 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9661 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9660 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9659 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9658 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9657 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 5,
            passportCountry: {
              value: "",
              id: "9656 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9655 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9654 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9653 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9652 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9651 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 6,
            passportCountry: {
              value: "",
              id: "9650 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9649 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9648 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9647 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9646 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9645 0 R",
              type: "PDFCheckBox",
            },
          },
        ],
      },
      {
        _id: 2,
        countryIssued: {
          value: "",
          id: "9725 0 R",
          type: "PDFDropdown",
        },
        passportDateIssued: {
          value: "",
          id: "9724 0 R",
          type: "PDFTextField",
        },
        isPassportDateEst: {
          value: "NO",
          id: "9723 0 R",
          type: "PDFCheckBox",
        },
        passportCity: {
          value: "",
          id: "9722 0 R",
          type: "PDFTextField",
        },
        passportCountry: {
          value: "",
          id: "9721 0 R",
          type: "PDFDropdown",
        },
        passportLName: {
          value: "",
          id: "9720 0 R",
          type: "PDFTextField",
        },
        passportFName: {
          value: "",
          id: "9719 0 R",
          type: "PDFTextField",
        },
        passportMName: {
          value: "",
          id: "9718 0 R",
          type: "PDFTextField",
        },
        passportSuffix: {
          value: "",
          id: "9717 0 R",
          type: "PDFDropdown",
        },
        passportNumber: {
          value: "",
          id: "9716 0 R",
          type: "PDFTextField",
        },
        passportExpiration: {
          value: "",
          id: "9715 0 R",
          type: "PDFTextField",
        },
        isExpirationEst: {
          value: "NO",
          id: "9714 0 R",
          type: "PDFCheckBox",
        },
        isPassportUsed: {
          value: "NO",
          id: "9711 0 R",
          type: "PDFCheckBox",
        },
        passportUses: [
          {
            _id: 1,
            passportCountry: {
              value: "",
              id: "9711 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9710 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9709 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9708 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9708 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9708 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 2,
            passportCountry: {
              value: "",
              id: "9758 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9757 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9756 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9755 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9754 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9753 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 3,
            passportCountry: {
              value: "",
              id: "9752 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9751 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9750 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9749 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9748 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9747 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 4,
            passportCountry: {
              value: "",
              id: "9746 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9745 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9744 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9743 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9742 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9741 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 5,
            passportCountry: {
              value: "",
              id: "9740 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9739 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9738 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9737 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9736 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9735 0 R",
              type: "PDFCheckBox",
            },
          },
          {
            _id: 6,
            passportCountry: {
              value: "",
              id: "9734 0 R",
              type: "PDFDropdown",
            },
            fromDate: {
              value: "",
              id: "9733 0 R",
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "9732 0 R",
              type: "PDFTextField",
            },
            isFromDateEst: {
              value: "NO",
              id: "9731 0 R",
              type: "PDFCheckBox",
            },
            isToDateEst: {
              value: "NO",
              id: "9730 0 R",
              type: "PDFCheckBox",
            },
            isVisitCurrent: {
              value: "NO",
              id: "9729 0 R",
              type: "PDFCheckBox",
            },
          },
        ],
      },
    ],
  },

  residencyInfo: [
    {
      _id: Math.random(),
      residenceStartDate: {
        value: "",
        id: "9814",
        type: "PDFTextField",
      },
      isStartDateEst: {
        value: "NO",
        id: "9813",
        type: "PDFPDFCheckBox",
      },
      residenceEndDate: {
        value: "",
        id: "9812",
        type: "PDFTextField",
      },
      isResidenceEndEst: {
        value: "NO",
        id: "9810",
        type: "PDFPDFCheckBox",
      },
      isResidencePresent: {
        value: "NO",
        id: "9811",
        type: "PDFPDFCheckBox",
      },
      residenceStatus: {
        value: "Other",
        id: "9809",
        type: "PDFRadioGroup",
      },
      residenceOtherDetails: {
        value: "",
        id: "9805",
        type: "PDFTextField",
      },
      residenceAddress: {
        street: {
          value: "",
          id: "9804",
          type: "PDFTextField",
        },
        city: {
          value: "",
          id: "9803",
          type: "PDFTextField",
        },
        state: {
          value: "",
          id: "9802",
          type: "PDFDropdown",
        },
        zip: {
          value: "",
          id: "9800",
          type: "PDFTextField",
        },
        country: {
          value: "",
          id: "9777",
          type: "PDFDropdown",
        },
        hasAPOOrFPO: {
          value: "NO",
          id: "",
          type: "PDFCheckBox",
        },
        APOOrFPODetails: {
          addressUnitOrDutyLocation: {
            value: "",
            id: "9780",
            type: "PDFTextField",
          },
          cityOrPostName: {
            value: "",
            id: "9779",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "9778",
            type: "PDFDropdown",
          },
          zip: {
            value: "",
            id: "9772",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "9801",
            type: "PDFDropdown",
          },
          hadAPOFPOAddress: {
            value: "NO",
            id: "9776",
            type: "PDFPDFCheckBox",
          },
          APOFPOAddress: {
            value: "",
            id: "9776",
            type: "PDFTextField",
          },
          APOOrFPO: {
            value: "APO",
            id: "",
            type: "PDFTextField",
          },
          APOFPOStateCode: {
            value: "",
            id: "9775",
            type: "PDFTextField",
          },
          APOFPOZip: {
            value: "",
            id: "9773",
            type: "PDFTextField",
          },
        },
      },
      contact: {
        lastname: {
          value: "",
          id: "9798",
          type: "PDFTextField",
        },
        firstname: {
          value: "",
          id: "9797",
          type: "PDFTextField",
        },
        middlename: {
          value: "",
          id: "9799",
          type: "PDFTextField",
        },
        suffix: {
          value: "",
          id: "9796",
          type: "PDFDropdown",
        },
        lastContactDate: {
          value: "",
          id: "9782",
          type: "PDFMonth",
        },
        isLastContactEst: {
          value: "NO",
          id: "9781",
          type: "PDFPDFCheckBox",
        },
        relationship: {
          value: "Neighbor",
          id: "",
          type: "",
        },
        relationshipOtherDetail: {
          value: "",
          id: "9790",
          type: "PDFTextField",
        },
        phone: [
          {
            _id: Math.random(),
            type: {
              value: "Evening",
              id: "",
              type: "",
            },
            knowsNumber: {
              value: "NO",
              id: "9817",
              type: "PDFPDFCheckBox",
            },
            isInternationalOrDSN: {
              value: "NO",
              id: "9824",
              type: "PDFPDFCheckBox",
            },
            number: {
              value: "",
              id: "",
              type: "",
            },
            extension: {
              value: "",
              id: "9825",
              type: "PDFTextField",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "Daytime",
              id: "",
              type: "",
            },
            knowsNumber: {
              value: "NO",
              id: "9815",
              type: "PDFPDFCheckBox",
            },
            isInternationalOrDSN: {
              value: "NO",
              id: "9818",
              type: "PDFPDFCheckBox",
            },
            number: {
              value: "",
              id: "",
              type: "",
            },
            extension: {
              value: "",
              id: "9821",
              type: "PDFTextField",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "Cell/mobile",
              id: "",
              type: "",
            },
            knowsNumber: {
              value: "NO",
              id: "9823",
              type: "PDFPDFCheckBox",
            },
            isInternationalOrDSN: {
              value: "NO",
              id: "9816",
              type: "PDFPDFCheckBox",
            },
            number: {
              value: "",
              id: "",
              type: "",
            },
            extension: {
              value: "",
              id: "9819",
              type: "PDFTextField",
            },
          },
        ],
        email: {
          value: "",
          id: "9784",
          type: "PDFTextField",
        },
        contactAddress: {
          street: {
            value: "",
            id: "9789",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "9788",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "9787",
            type: "PDFDropdown",
          },
          zip: {
            value: "",
            id: "9785",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "9786",
            type: "PDFDropdown",
          },
          hasAPOOrFPO: {
            value: "NO",
            id: "9765",
            type: "PDFCheckBox",
          },
          APOOrFPODetails: {
            addressUnitOrDutyLocation: {
              value: "",
              id: "9771",
              type: "PDFTextField",
            },
            cityOrPostName: {
              value: "",
              id: "9770",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "9769",
              type: "PDFDropdown",
            },
            zip: {
              value: "",
              id: "9767",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "9768",
              type: "PDFDropdown",
            },
            hadAPOFPOAddress: {
              value: "NO",
              id: "9760",
              type: "PDFPDFCheckBox",
            },
            APOFPOAddress: {
              value: "",
              id: "9764",
              type: "PDFTextField",
            },
            APOOrFPO: {
              value: "APO",
              id: "9763",
              type: "PDFTextField",
            },
            APOFPOStateCode: {
              value: "",
              id: "9762",
              type: "PDFTextField",
            },
            APOFPOZip: {
              value: "",
              id: "9761",
              type: "PDFTextField",
            },
          },
        },
      },
    },
  ],

  schoolInfo: {
    hasAttendedSchool: {
      value: "NO",
      id: "10099",
      type: "radio",
    },
    hasReceivedDegree: {
      value: "NO",
      id: "10098",
      type: "radio",
    },
    schoolEntry: [
      {
        _id: Math.random(),
        fromDate: {
          value: "",
          id: "10095",
          type: "PDFTextField",
        },
        toDate: {
          value: "",
          id: "10056",
          type: "PDFTextField",
        },
        present: {
          value: "NO",
          id: "10093",
          type: "PDFPDFCheckBox",
        },
        est: {
          value: "NO",
          id: "10094",
          type: "PDFPDFCheckBox",
        },
        schoolName: {
          value: "",
          id: "10079",
          type: "PDFTextField",
        },
        schoolAddress: {
          street: {
            value: "",
            id: "10085",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "10084",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "10083",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "10080",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "10082",
            type: "PDFDropdown",
          },
        },
        schoolType: {
          value: "",
          id: "10091",
          type: "PDFRadioGroup",
        },
        knownPerson: {
          firstName: {
            value: "",
            id: "10077",
            type: "PDFTextField",
          },
          lastName: {
            value: "",
            id: "10078",
            type: "PDFTextField",
          },
          address: {
            street: {
              value: "",
              id: "10075",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "10074",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "10073",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "10071",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "10072",
              type: "PDFDropdown",
            },
          },
          phoneNumber: {
            _id: Math.random(),
            type: {
              value: "Evening",
              id: "10070",
              type: "PDFTextField",
            },
            knowsNumber: {
              value: "NO",
              id: "10067",
              type: "PDFPDFCheckBox",
            },
            isInternationalOrDSN: {
              value: "NO",
              id: "10068",
              type: "PDFPDFCheckBox",
            },
            number: {
              value: "",
              id: "10070",
              type: "PDFTextField",
            },
            extension: {
              value: "",
              id: "10069",
              type: "PDFTextField",
            },
          },
          email: {
            value: "",
            id: "10066",
            type: "PDFTextField",
          },
          unknown: {
            value: "NO",
            id: "10065",
            type: "PDFPDFCheckBox",
          },
        },
        degreeReceived: {
          value: "NO",
          id: "10087",
          type: "PDFRadioGroup",
        },
        degrees: [
          {
            _id: Math.random(),
            type: {
              value: "",
              id: "10064",
              type: "PDFDropdown",
            },
            dateAwarded: {
              value: "",
              id: "10062",
              type: "PDFTextField",
            },
            est: {
              value: "NO",
              id: "10061",
              type: "PDFPDFCheckBox",
            },
          },
        ],
      },
    ],
  },

  employmentInfo: [
    {
      _id: Math.random(),
      employmentActivity: {
        value: "other",
        id: "",
        type: "",
      },
      section13A1: {
        fromDate: {
          date: { value: "", id: "10236", type: "PDFTextField" },
          estimated: { value: "NO", id: "10235", type: "PDFPDFCheckBox" },
        },
        toDate: {
          date: { value: "", id: "10233", type: "PDFTextField" },
          estimated: { value: "NO", id: "10239", type: "PDFPDFCheckBox" },
        },
        present: { value: "NO", id: "10234", type: "PDFPDFCheckBox" },
        employmentStatus: {
          fullTime: {
            value: "NO",
            id: "10237",
            type: "PDFPDFCheckBox",
          },
          partTime: {
            value: "NO",
            id: "10238",
            type: "PDFPDFCheckBox",
          },
        },
        dutyStation: { value: "", id: "10231", type: "PDFTextField" },
        rankOrPosition: { value: "", id: "10232", type: "PDFTextField" },
        address: {
          street: { value: "", id: "10253", type: "PDFTextField" },
          city: { value: "", id: "10252", type: "PDFTextField" },
          state: { value: "", id: "10251", type: "PDFDropdown" },
          zipCode: { value: "", id: "10249", type: "PDFTextField" },
          country: { value: "", id: "10250", type: "PDFDropdown" },
        },
        telephone: {
          number: { value: "", id: "10247", type: "PDFTextField" },
          extension: { value: "", id: "10246", type: "PDFTextField" },
          internationalOrDsn: {
            value: "NO",
            id: "10245",
            type: "PDFPDFCheckBox",
          },
          day: { value: "NO", id: "10244", type: "PDFPDFCheckBox" },
          night: { value: "NO", id: "10243", type: "PDFPDFCheckBox" },
        },
        apoFpoAddress: {
          physicalLocationData: {
            street: { value: "", id: "10220", type: "PDFTextField" },
            city: { value: "", id: "10219", type: "PDFTextField" },
            state: { value: "", id: "10218", type: "PDFDropdown" },
            zipCode: { value: "", id: "10212", type: "PDFTextField" },
            country: { value: "", id: "10217", type: "PDFDropdown" },
          },
          physicalWorkLocation: {
            street: { value: "", id: "10261", type: "PDFTextField" },
            city: { value: "", id: "10260", type: "PDFTextField" },
            state: { value: "", id: "10259", type: "PDFDropdown" },
            zipCode: { value: "", id: "10257", type: "PDFTextField" },
            country: { value: "", id: "10258", type: "PDFDropdown" },
          },
          apoOrFpo: { value: "", id: "10215", type: "PDFTextField" },
          apoFpoStateCode: { value: "", id: "10214", type: "PDFDropdown" },
        },
        supervisor: {
          name: { value: "", id: "10270", type: "PDFTextField" },
          rankOrPosition: { value: "", id: "10269", type: "PDFTextField" },
          email: { value: "", id: "10242", type: "PDFTextField" },
          emailUnknown: { value: "NO", id: "10241", type: "PDFPDFCheckBox" },
          phone: {
            number: { value: "", id: "10268", type: "PDFTextField" },
            extension: { value: "", id: "10267", type: "PDFTextField" },
            internationalOrDsn: {
              value: "NO",
              id: "10254",
              type: "PDFPDFCheckBox",
            },
            day: { value: "NO", id: "10255", type: "PDFPDFCheckBox" },
            night: { value: "NO", id: "10256", type: "PDFPDFCheckBox" },
          },
          physicalWorkLocation: {
            street: { value: "", id: "10266", type: "PDFTextField" },
            city: { value: "", id: "10265", type: "PDFTextField" },
            state: { value: "", id: "10264", type: "PDFDropdown" },
            zipCode: { value: "", id: "10262", type: "PDFTextField" },
            country: { value: "", id: "10263", type: "PDFDropdown" },
          },
        },
      },
      section13A2: {
        fromDate: {
          date: { value: "", id: "10272", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "10273",
            type: "PDFPDFCheckBox",
          },
        },
        toDate: {
          date: { value: "", id: "10274", type: "PDFTextField" },
          estimated: { value: "NO", id: "10276", type: "PDFPDFCheckBox" },
        },
        present: { value: "NO", id: "10275", type: "PDFPDFCheckBox" },
        employmentStatus: {
          fullTime: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
          partTime: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        positionTitle: { value: "", id: "10277", type: "PDFTextField" },
        employerName: { value: "", id: "10278", type: "PDFTextField" },
        employerAddress: {
          street: { value: "", id: "10307", type: "PDFTextField" },
          city: { value: "", id: "10306", type: "PDFTextField" },
          state: { value: "", id: "10305", type: "PDFDropdown" },
          zipCode: { value: "", id: "10303", type: "PDFTextField" },
          country: { value: "", id: "10304", type: "PDFDropdown" },
        },
        telephone: {
          number: { value: "", id: "10297", type: "PDFTextField" },
          extension: { value: "", id: "10296", type: "PDFTextField" },
          internationalOrDsn: {
            value: "NO",
            id: "10295",
            type: "PDFPDFCheckBox",
          },
          day: { value: "NO", id: "10294", type: "PDFPDFCheckBox" },
          night: { value: "NO", id: "10293", type: "PDFPDFCheckBox" },
        },
        additionalPeriods: [
          {
            _id: Math.random(),
            fromDate: {
              date: { value: "", id: "", type: "PDFTextField" },
              estimated: {
                value: "NO",
                id: "",
                type: "PDFPDFCheckBox",
              },
            },
            toDate: {
              date: { value: "", id: "", type: "PDFTextField" },
              estimated: { value: "NO", id: "", type: "PDFPDFCheckBox" },
            },
            present: { value: "NO", id: "", type: "PDFPDFCheckBox" },
            positionTitle: { value: "", id: "10359", type: "PDFTextField" },
            supervisor: { value: "", id: "10358", type: "PDFTextField" },
          },
        ],
        physicalWorkAddress: {
          differentThanEmployer: {
            value: "NO",
            id: "10282",
            type: "PDFRadioGroup",
          },
          address: {
            street: { value: "", id: "10289", type: "PDFTextField" },
            city: { value: "", id: "10288", type: "PDFTextField" },
            state: { value: "", id: "10287", type: "PDFDropdown" },
            zipCode: { value: "", id: "10285", type: "PDFTextField" },
            country: { value: "", id: "10286", type: "PDFDropdown" },
          },
          telephone: {
            number: { value: "", id: "10292", type: "PDFTextField" },
            extension: { value: "", id: "10291", type: "PDFTextField" },
            internationalOrDsn: {
              value: "NO",
              id: "10290",
              type: "PDFPDFCheckBox",
            },
            day: { value: "NO", id: "10284", type: "PDFPDFCheckBox" },
            night: { value: "NO", id: "10283", type: "PDFPDFCheckBox" },
          },
        },
      },
      section13A3: {
        fromDate: {
          date: { value: "", id: "", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        toDate: {
          date: { value: "", id: "", type: "PDFTextField" },
          estimated: { value: "NO", id: "", type: "PDFPDFCheckBox" },
        },
        present: { value: "NO", id: "10407", type: "PDFPDFCheckBox" },
        employmentStatus: {
          fullTime: {
            value: "NO",
            id: "10237",
            type: "PDFPDFCheckBox",
          },
          partTime: {
            value: "NO",
            id: "10238",
            type: "PDFPDFCheckBox",
          },
        },
        positionTitle: { value: "", id: "10409", type: "PDFTextField" },
        employmentName: { value: "", id: "10410", type: "PDFTextField" },
        employmentAddress: {
          street: { value: "", id: "10427", type: "PDFTextField" },
          city: { value: "", id: "10426", type: "PDFTextField" },
          state: { value: "", id: "10425", type: "PDFDropdown" },
          zipCode: { value: "", id: "10423", type: "PDFTextField" },
          country: { value: "", id: "10424", type: "PDFDropdown" },
        },
        telephone: {
          number: { value: "", id: "10422", type: "PDFTextField" },
          extension: { value: "", id: "10421", type: "PDFTextField" },
          internationalOrDsn: {
            value: "NO",
            id: "10420",
            type: "PDFPDFCheckBox",
          },
          day: { value: "NO", id: "10419", type: "PDFPDFCheckBox" },
          night: { value: "NO", id: "10418", type: "PDFPDFCheckBox" },
        },
        physicalWorkAddress: {
          differentThanEmployer: {
            value: "NO",
            id: "",
            type: "PDFRadioGroup",
          },
          address: {
            street: { value: "", id: "10371", type: "PDFTextField" },
            city: { value: "", id: "10370", type: "PDFTextField" },
            state: { value: "", id: "10369", type: "PDFDropdown" },
            zipCode: { value: "", id: "10367", type: "PDFTextField" },
            country: { value: "", id: "10368", type: "PDFDropdown" },
          },
          telephone: {
            number: { value: "", id: "", type: "PDFTextField" },
            extension: { value: "", id: "", type: "PDFTextField" },
            internationalOrDsn: {
              value: "NO",
              id: "",
              type: "PDFPDFCheckBox",
            },
            day: { value: "NO", id: "", type: "PDFPDFCheckBox" },
            night: { value: "NO", id: "", type: "PDFPDFCheckBox" },
          },
        },
        apoFpoAddress: {
          physicalLocationData: {
            street: {
              value: "",
              id: "10403",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "10402",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "10401",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "10395",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "10400",
              type: "PDFDropdown",
            },
          },
          physicalWorkLocation: {
            street: {
              value: "",
              id: "10403",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "10402",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "10401",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "10395",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "10400",
              type: "PDFDropdown",
            },
          },
          apoOrFpo: {
            value: "",
            id: "10398",
            type: "PDFTextField",
          },
          apoFpoStateCode: {
            value: "",
            id: "10397",
            type: "PDFDropdown",
          },
        },
        selfEmploymentVerifier: {
          lastName: {
            value: "",
            id: "10380",
            type: "PDFTextField",
          },
          firstName: {
            value: "",
            id: "10379",
            type: "PDFTextField",
          },
          address: {
            street: {
              value: "",
              id: "10378",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "10377",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "10376",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "10374",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "10375",
              type: "PDFDropdown",
            },
          },
          telephone: {
            number: {
              value: "",
              id: "10417",
              type: "PDFTextField",
            },
            internationalOrDsn: {
              value: "NO",
              id: "10415",
              type: "PDFCheckBox",
            },
            day: {
              value: "NO",
              id: "10414",
              type: "PDFCheckBox",
            },
            night: {
              value: "NO",
              id: "10413",
              type: "PDFCheckBox",
            },
            extension: {
              value: "",
              id: "10416",
              type: "PDFTextField",
            },
          },
          apoFpoAddress: {
            physicalLocationData: {
              street: {
                value: "",
                id: "10403",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "10402",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "10401",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "10395",
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "10400",
                type: "PDFDropdown",
              },
            },
            physicalWorkLocation: {
              street: {
                value: "",
                id: "10403",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "10402",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "10401",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "10395",
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "10400",
                type: "PDFDropdown",
              },
            },
            apoOrFpo: {
              value: "",
              id: "10398",
              type: "PDFTextField",
            },
            apoFpoStateCode: {
              value: "",
              id: "10397",
              type: "PDFDropdown",
            },
          },
        },
      },

      section13A4: {
        fromDate: {
          date: { value: "", id: "", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        toDate: {
          date: { value: "", id: "", type: "PDFTextField" },
          estimated: { value: "NO", id: "", type: "PDFPDFCheckBox" },
        },
        present: { value: "NO", id: "10407", type: "PDFPDFCheckBox" },
        verifier: {
          lastName: {
            value: "",
            id: "10491",
            type: "PDFTextField",
          },
          firstName: {
            value: "",
            id: "10490",
            type: "PDFTextField",
          },
          address: {
            street: {
              value: "",
              id: "10484",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "10483",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "10482",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "10480",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "10481",
              type: "PDFDropdown",
            },
          },
          telephone: {
            number: {
              value: "",
              id: "10479",
              type: "PDFTextField",
            },
            internationalOrDsn: {
              value: "NO",
              id: "10477",
              type: "PDFCheckBox",
            },
            day: {
              value: "NO",
              id: "10476",
              type: "PDFCheckBox",
            },
            night: {
              value: "NO",
              id: "10475",
              type: "PDFCheckBox",
            },
            extension: {
              value: "",
              id: "10478",
              type: "PDFTextField",
            },
          },
          hasApoAddress: {
            value: "NO",
            id: "10431",
            type: "PDFRadioButton",
          },
          apoFpoAddress: {
            physicalLocationData: {
              street: {
                value: "",
                id: "10436",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "10435",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "10434",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "10433",
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "10432",
                type: "PDFDropdown",
              },
            },
            physicalWorkLocation: {
              street: {
                value: "",
                id: "10436",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "10435",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "10434",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "10433",
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "10432",
                type: "PDFDropdown",
              },
            },
            apoOrFpo: {
              value: "",
              id: "10436",
              type: "PDFTextField",
            },
            apoFpoStateCode: {
              value: "",
              id: "10434",
              type: "PDFDropdown",
            },
          },
        },
      },

      section13A5: {
        reasonForLeaving: {
          value: "",
          id: "10473",
          type: "PDFTextField",
        },
        incidentInLastSevenYears: {
          value: "NO",
          id: "10472",
          type: "PDFRadioButton",
        },
        incidentDetails: [
          {
            type: {
              value: "fired",
              id: "",
              type: "PDFRadioGroup",
            },
            reason: {
              value: "",
              id: "10463",
              type: "PDFTextField",
            },
            departureDate: {
              value: "",
              id: "10461",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "10462",
              type: "PDFCheckBox",
            },
          },
          {
            type: {
              value: "fired",
              id: "",
              type: "PDFRadioGroup",
            },
            reason: {
              value: "",
              id: "10464",
              type: "PDFTextField",
            },
            departureDate: {
              value: "",
              id: "10460",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "10459",
              type: "PDFCheckBox",
            },
          },
          {
            type: {
              value: "fired",
              id: "",
              type: "PDFRadioGroup",
            },
            reason: {
              value: "",
              id: "10465",
              type: "PDFTextField",
            },
            departureDate: {
              value: "",
              id: "10456",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "10455",
              type: "PDFCheckBox",
            },
          },
          {
            type: {
              value: "fired",
              id: "",
              type: "PDFRadioGroup",
            },
            reason: {
              value: "",
              id: "10466",
              type: "PDFTextField",
            },
            departureDate: {
              value: "",
              id: "10458",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "10457",
              type: "PDFCheckBox",
            },
          },
        ],
      },
      section13A6: {
        warnedInLastSevenYears: {
          value: "NO",
          id: "10442",
          type: "PDFRadioButton",
        },
        warningDetails: [
          {
            reason: {
              value: "",
              id: "10463",
              type: "PDFTextField",
            },
            date: {
              date: {
                value: "",
                id: "10461",
                type: "PDFTextField",
              },
              estimated: {
                value: "NO",
                id: "10462",
                type: "PDFCheckBox",
              },
            },
          },
        ],
      },
      section13B: {
        hasFormerFederalEmployment: {
          value: "NO",
          id: "10442", // Example ID, please replace with actual ID if needed
          type: "PDFRadioButton",
        },
        employmentEntries: [
          {
            _id: 1, // Example ID, this can be dynamically generated or assigned
            fromDate: {
              value: "",
              id: "10485", // Example ID, please replace with actual ID if needed
              type: "PDFTextField",
            },
            toDate: {
              value: "",
              id: "10487", // Example ID, please replace with actual ID if needed
              type: "PDFTextField",
            },
            present: {
              value: "NO",
              id: "10488", // Example ID, please replace with actual ID if needed
              type: "PDFCheckBox",
            },
            estimated: {
              value: "NO",
              id: "10489", // Example ID, please replace with actual ID if needed
              type: "PDFCheckBox",
            },
            agencyName: {
              value: "",
              id: "agencyNameId", // Example ID, please replace with actual ID if needed
              type: "PDFTextField",
            },
            positionTitle: {
              value: "",
              id: "positionTitleId", // Example ID, please replace with actual ID if needed
              type: "PDFTextField",
            },
            location: {
              street: {
                value: "",
                id: "Section13EmploymentStreet_10440", // Example ID, please replace with actual ID if needed
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "Section13Employment_10439", // Example ID, please replace with actual ID if needed
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "Section13EmploymentState_10438", // Example ID, please replace with actual ID if needed
                type: "PDFSelect",
              },
              zipCode: {
                value: "",
                id: "Section13EmploymentZIP_10432", // Example ID, please replace with actual ID if needed
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "Section13EmploymentCountry_10437", // Example ID, please replace with actual ID if needed
                type: "PDFSelect",
              },
            },
          },
        ],
      },
      section13C: {
        employmentRecordIssues: { value: "NO", id: "", type: "PDFRadioGroup" },
        employmentRecord: {
          fired: { value: "NO", id: "11342", type: "PDFRadioGroup" },
          quitAfterToldWouldBeFired: {
            value: "NO",
            id: "11342",
            type: "PDFRadioGroup",
          },
          leftByMutualAgreementMisconduct: {
            value: "NO",
            id: "11342",
            type: "PDFRadioGroup",
          },
          leftByMutualAgreementPerformance: {
            value: "NO",
            id: "11342",
            type: "PDFRadioGroup",
          },
          writtenWarning: { value: "NO", id: "11342", type: "PDFRadioGroup" },
        },
      },
    },
  ],
  serviceInfo: {
    bornAfter1959: {
      value: "NO",
      id: "11447",
      type: "PDFRadioGroup",
    },
    registeredWithSSS: {
      value: "dontKnow",
      id: "11408",
      type: "PDFRadioGroup",
    },
  },
  militaryHistoryInfo: {
    everServedInUSMilitary: {
      value: "NO",
      id: "11402",
      type: "PDFRadioGroup",
    },
    disciplinaryProcedure: {
      value: "NO",
      id: "11479",
      type: "PDFRadioGroup",
    },
    everServedInForeignMilitary: {
      value: "NO",
      id: "11491",
      type: "PDFRadioGroup",
    },
    section15_1: [
      {
        _id: Math.random(),
        branch: { value: "Army", id: "11401", type: "PDFRadioGroup" },
        stateOfService: { value: "", id: "11394", type: "PDFDropdown" },
        status: { value: "ActiveDuty", id: "11446", type: "PDFRadioGroup" },
        officerOrEnlisted: {
          value: "NotApplicable",
          id: "11392",
          type: "PDFRadioGroup",
        },
        serviceNumber: { value: "", id: "11427", type: "PDFTextField" },
        serviceFromDate: { value: "", id: "11466", type: "PDFTextField" },
        serviceToDate: { value: "", id: "11464", type: "PDFTextField" },
        present: { value: "NO", id: "11463", type: "PDFPDFCheckBox" },
        estimatedFromDate: {
          value: "NO",
          id: "11465",
          type: "PDFPDFCheckBox",
        },
        estimatedToDate: { value: "NO", id: "11462", type: "PDFPDFCheckBox" },
        discharged: { value: "NO", id: "11443", type: "PDFRadioGroup" },
        typeOfDischarge: { value: "Other", id: "11457", type: "PDFRadioGroup" },
        dischargeTypeOther: { value: "", id: "11450", type: "PDFTextField" },
        dischargeDate: { value: "", id: "11452", type: "PDFTextField" },
        estimatedDischargeDate: {
          value: "NO",
          id: "11451",
          type: "PDFPDFCheckBox",
        },
        dischargeReason: { value: "", id: "11449", type: "PDFTextField" },
      },
    ],
    section15_2: [
      {
        _id: Math.random(),
        date: { value: "", id: "11477", type: "PDFTextField" },
        estimatedDate: { value: "NO", id: "11478", type: "PDFPDFCheckBox" },
        descriptionOfOffense: { value: "", id: "11476", type: "PDFTextField" },
        nameOfProcedure: { value: "", id: "11475", type: "PDFTextField" },
        courtDescription: { value: "", id: "11474", type: "PDFTextField" },
        outcomeDescription: { value: "", id: "11473", type: "PDFTextField" },
      },
    ],
    section15_3: [
      {
        _id: Math.random(),
        organizationType: {
          value: "Other",
          id: "11490",
          type: "PDFRadioGroup",
        },
        organizationTypeOther: { value: "", id: "11494", type: "PDFTextField" },
        organizationName: { value: "", id: "11534", type: "PDFTextField" },
        country: { value: "", id: "11533", type: "PDFDropdown" },
        periodOfServiceFrom: { value: "", id: "11483", type: "PDFTextField" },
        periodOfServiceTo: { value: "", id: "11537", type: "PDFTextField" },
        present: { value: "NO", id: "11535", type: "PDFPDFCheckBox" },
        estimatedPeriodFrom: {
          value: "NO",
          id: "11482",
          type: "PDFPDFCheckBox",
        },
        estimatedPeriodTo: {
          value: "NO",
          id: "11536",
          type: "PDFPDFCheckBox",
        },
        highestRank: { value: "", id: "11532", type: "PDFTextField" },
        departmentOrOffice: { value: "", id: "11531", type: "PDFTextField" },
        associationDescription: {
          value: "",
          id: "11529",
          type: "PDFTextField",
        },
        reasonForLeaving: { value: "", id: "11530", type: "PDFTextField" },
        maintainsContact: { value: "NO", id: "11514", type: "PDFRadioGroup" },
        contacts: [
          {
            _id: Math.random(),
            lastName: { value: "", id: "11522", type: "PDFTextField" },
            firstName: { value: "", id: "11521", type: "PDFTextField" },
            middleName: { value: "", id: "11523", type: "PDFTextField" },
            suffix: { value: "", id: "11520", type: "PDFDropdown" },
            address: {
              street: { value: "", id: "11528", type: "PDFTextField" },
              city: { value: "", id: "11527", type: "PDFTextField" },
              state: { value: "", id: "11526", type: "PDFDropdown" },
              zipCode: { value: "", id: "11524", type: "PDFTextField" },
              country: { value: "", id: "11525", type: "PDFDropdown" },
            },
            officialTitle: { value: "", id: "11511", type: "PDFTextField" },
            frequencyOfContact: {
              value: "",
              id: "11512",
              type: "PDFTextField",
            },
            associationFrom: { value: "", id: "11519", type: "PDFTextField" },
            associationTo: { value: "", id: "11517", type: "PDFTextField" },
            present: { value: "NO", id: "11515", type: "PDFPDFCheckBox" },
            estimatedAssociationFrom: {
              value: "NO",
              id: "11518",
              type: "PDFPDFCheckBox",
            },
            estimatedAssociationTo: {
              value: "NO",
              id: "11516",
              type: "PDFPDFCheckBox",
            },
          },
        ],
      },
    ],
  },
  peopleThatKnow: [
    {
      _id: Math.random(),
      knownFromDate: {
        value: "",
        id: "11612",
        type: "PDFTextField",
      },
      knownToDate: {
        value: "",
        id: "11610",
        type: "PDFTextField",
      },
      present: {
        value: "NO",
        id: "11609",
        type: "PDFPDFCheckBox",
      },
      estimatedFromDate: {
        value: "NO",
        id: "11608",
        type: "PDFPDFCheckBox",
      },
      estimatedToDate: {
        value: "NO",
        id: "11611",
        type: "PDFPDFCheckBox",
      },
      lastName: {
        value: "",
        id: "11618",
        type: "PDFTextField",
      },
      firstName: {
        value: "",
        id: "11619",
        type: "PDFTextField",
      },
      middleName: {
        value: "",
        id: "11620",
        type: "PDFTextField",
      },
      suffix: {
        value: "",
        id: "11616",
        type: "PDFDropdown",
      },
      emailAddress: {
        value: "",
        id: "11617",
        type: "PDFTextField",
      },
      emailUnknown: {
        value: "NO",
        id: "11593",
        type: "PDFPDFCheckBox",
      },
      rankOrTitle: {
        value: "",
        id: "11598",
        type: "PDFTextField",
      },
      rankOrTitleNotApplicable: {
        value: "NO",
        id: "11594",
        type: "PDFPDFCheckBox",
      },
      relationshipToApplicant: {
        neighbor: {
          value: "NO",
          id: "11596",
          type: "PDFPDFCheckBox",
        },
        workAssociate: {
          value: "NO",
          id: "11592",
          type: "PDFPDFCheckBox",
        },
        friend: {
          value: "NO",
          id: "11597",
          type: "PDFPDFCheckBox",
        },
        schoolmate: {
          value: "NO",
          id: "11600",
          type: "PDFPDFCheckBox",
        },
        other: {
          value: "",
          id: "11599",
          type: "PDFPDFCheckBox",
        },
      },
      phoneNumber: {
        value: "",
        id: "11615",
        type: "PDFTextField",
      },
      phoneNumberUnknown: {
        value: "NO",
        id: "11601",
        type: "PDFPDFCheckBox",
      },
      phoneExtension: {
        value: "",
        id: "11613",
        type: "PDFTextField",
      },
      phoneType: {
        value: "DSN",
        id: "11614",
        type: "PDFPDFCheckBox",
      },
      mobileNumber: {
        value: "",
        id: "11602",
        type: "PDFTextField",
      },
      preferredContactTime: {
        day: {
          value: "NO",
          id: "11700",
          type: "PDFPDFCheckBox",
        },
        night: {
          value: "NO",
          id: "11621",
          type: "PDFPDFCheckBox",
        },
      },
      address: {
        street: {
          value: "",
          id: "11606",
          type: "PDFTextField",
        },
        city: {
          value: "",
          id: "11607",
          type: "PDFTextField",
        },
        state: {
          value: "",
          id: "11605",
          type: "PDFDropdown",
        },
        zipCode: {
          value: "",
          id: "11603",
          type: "PDFTextField",
        },
        country: {
          value: "",
          id: "11604",
          type: "PDFDropdown",
        },
      },
    },
    {
      _id: Math.random(),
      knownFromDate: {
        value: "",
        id: "11685",
        type: "PDFTextField",
      },
      knownToDate: {
        value: "",
        id: "11683",
        type: "PDFTextField",
      },
      present: {
        value: "NO",
        id: "11682",
        type: "PDFPDFCheckBox",
      },
      estimatedFromDate: {
        value: "NO",
        id: "11681",
        type: "PDFPDFCheckBox",
      },
      estimatedToDate: {
        value: "NO",
        id: "11684",
        type: "PDFPDFCheckBox",
      },
      lastName: {
        value: "",
        id: "11691",
        type: "PDFTextField",
      },
      firstName: {
        value: "",
        id: "11692",
        type: "PDFTextField",
      },
      middleName: {
        value: "",
        id: "11693",
        type: "PDFTextField",
      },
      suffix: {
        value: "",
        id: "11689",
        type: "PDFDropdown",
      },
      emailAddress: {
        value: "",
        id: "11690",
        type: "PDFTextField",
      },
      emailUnknown: {
        value: "NO",
        id: "11669",
        type: "PDFPDFCheckBox",
      },
      rankOrTitle: {
        value: "",
        id: "11673",
        type: "PDFTextField",
      },
      rankOrTitleNotApplicable: {
        value: "NO",
        id: "11670",
        type: "PDFPDFCheckBox",
      },
      relationshipToApplicant: {
        neighbor: {
          value: "NO",
          id: "11671",
          type: "PDFPDFCheckBox",
        },
        workAssociate: {
          value: "NO",
          id: "11668",
          type: "PDFPDFCheckBox",
        },
        friend: {
          value: "NO",
          id: "11672",
          type: "PDFPDFCheckBox",
        },
        schoolmate: {
          value: "NO",
          id: "11674",
          type: "PDFPDFCheckBox",
        },
        other: {
          value: "",
          id: "11626",
          type: "PDFPDFCheckBox",
        },
      },
      phoneNumber: {
        value: "",
        id: "11688",
        type: "PDFTextField",
      },
      phoneNumberUnknown: {
        value: "NO",
        id: "11675",
        type: "PDFPDFCheckBox",
      },
      phoneExtension: {
        value: "",
        id: "11663",
        type: "PDFTextField",
      },
      phoneType: {
        value: "DSN",
        id: "11687",
        type: "PDFPDFCheckBox",
      },
      mobileNumber: {
        value: "",
        id: "11676",
        type: "PDFTextField",
      },
      preferredContactTime: {
        day: {
          value: "NO",
          id: "11667",
          type: "PDFPDFCheckBox",
        },
        night: {
          value: "NO",
          id: "11694",
          type: "PDFPDFCheckBox",
        },
      },
      address: {
        street: {
          value: "",
          id: "11679",
          type: "PDFTextField",
        },
        city: {
          value: "",
          id: "11680",
          type: "PDFTextField",
        },
        state: {
          value: "",
          id: "11678",
          type: "PDFDropdown",
        },
        zipCode: {
          value: "",
          id: "11677",
          type: "PDFTextField",
        },
        country: {
          value: "",
          id: "11627",
          type: "PDFDropdown",
        },
      },
    },
    {
      _id: Math.random(),
      knownFromDate: {
        value: "",
        id: "11652",
        type: "PDFTextField",
      },
      knownToDate: {
        value: "",
        id: "11650",
        type: "PDFTextField",
      },
      present: {
        value: "NO",
        id: "11649",
        type: "PDFPDFCheckBox",
      },
      estimatedFromDate: {
        value: "NO",
        id: "11648",
        type: "PDFPDFCheckBox",
      },
      estimatedToDate: {
        value: "NO",
        id: "11651",
        type: "PDFPDFCheckBox",
      },
      lastName: {
        value: "",
        id: "11658",
        type: "PDFTextField",
      },
      firstName: {
        value: "",
        id: "11659",
        type: "PDFTextField",
      },
      middleName: {
        value: "",
        id: "11660",
        type: "PDFTextField",
      },
      suffix: {
        value: "",
        id: "11656",
        type: "PDFDropdown",
      },
      emailAddress: {
        value: "",
        id: "11657",
        type: "PDFTextField",
      },
      emailUnknown: {
        value: "NO",
        id: "11635",
        type: "PDFPDFCheckBox",
      },
      rankOrTitle: {
        value: "",
        id: "11639",
        type: "PDFTextField",
      },
      rankOrTitleNotApplicable: {
        value: "NO",
        id: "11636",
        type: "PDFPDFCheckBox",
      },
      relationshipToApplicant: {
        neighbor: {
          value: "NO",
          id: "11637",
          type: "PDFPDFCheckBox",
        },
        workAssociate: {
          value: "NO",
          id: "11634",
          type: "PDFPDFCheckBox",
        },
        friend: {
          value: "NO",
          id: "11638",
          type: "PDFPDFCheckBox",
        },
        schoolmate: {
          value: "NO",
          id: "11640",
          type: "PDFPDFCheckBox",
        },
        other: {
          value: "",
          id: "11624",
          type: "PDFPDFCheckBox",
        },
      },
      phoneNumber: {
        value: "",
        id: "11655",
        type: "PDFTextField",
      },
      phoneNumberUnknown: {
        value: "NO",
        id: "11641",
        type: "PDFPDFCheckBox",
      },
      phoneExtension: {
        value: "",
        id: "11653",
        type: "PDFTextField",
      },
      phoneType: {
        value: "DSN",
        id: "11654",
        type: "PDFPDFCheckBox",
      },
      mobileNumber: {
        value: "",
        id: "11642",
        type: "PDFTextField",
      },
      preferredContactTime: {
        day: {
          value: "NO",
          id: "11633",
          type: "PDFPDFCheckBox",
        },
        night: {
          value: "NO",
          id: "11661",
          type: "PDFPDFCheckBox",
        },
      },
      address: {
        street: {
          value: "",
          id: "11646",
          type: "PDFTextField",
        },
        city: {
          value: "",
          id: "11647",
          type: "PDFTextField",
        },
        state: {
          value: "",
          id: "11645",
          type: "PDFDropdown",
        },
        zipCode: {
          value: "",
          id: "11643",
          type: "PDFTextField",
        },
        country: {
          value: "",
          id: "11644",
          type: "PDFDropdown",
        },
      },
    },
  ],
  relationshipInfo: {
    _id: Math.random(),
    currentStatus: {
      value: "Never Entered",
      id: "11745",
      type: "PDFPDFCheckBox",
    },
    section17_1: {
      _id: Math.random(),
      fullName: {
        lastName: {
          value: "",
          id: "11741",
          type: "PDFTextField",
        },
        firstName: {
          value: "",
          id: "11740",
          type: "PDFTextField",
        },
        middleName: {
          value: "",
          id: "11743",
          type: "PDFTextField",
        },
        suffix: {
          value: "",
          id: "11742",
          type: "PDFDropdown",
        },
      },
      placeOfBirth: {
        city: {
          value: "",
          id: "11727",
          type: "PDFTextField",
        },
        county: {
          value: "",
          id: "11726",
          type: "PDFTextField",
        },
        state: {
          value: "",
          id: "11725",
          type: "PDFDropdown",
        },
        country: {
          value: "",
          id: "11724",
          type: "PDFDropdown",
        },
      },
      dateOfBirth: {
        date: {
          value: "",
          id: "11738",
          type: "date",
        },
        estimated: {
          value: "NO",
          id: "11739",
          type: "PDFPDFCheckBox",
        },
      },
      citizenship: [
        {
          _id: Math.random(),
          country: {
            value: "",
            id: "11774",
            type: "PDFDropdown",
          },
        },
      ],
      documentation: {
        type: {
          value: "Other",
          id: "11732",
          type: "PDFPDFCheckBox",
        },
        documentNumber: {
          value: "",
          id: "11730",
          type: "PDFTextField",
        },
        documentExpirationDate: {
          date: {
            value: "",
            id: "11778",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "11777",
            type: "PDFPDFCheckBox",
          },
        },
        otherExplanation: {
          value: "",
          id: "11728",
          type: "PDFTextField",
        },
      },
      notApplicable_OtherNames: {
        value: "NO",
        id: "",
        type: "PDFCheckbox",
      },
      notApplicable_SSN: {
        value: "NO",
        id: "",
        type: "PDFCheckbox",
      },

      usSocialSecurityNumber: {
        value: "",
        id: "11776",
        type: "PDFTextField",
      },
      otherNames: [
        {
          _id: Math.random(),
          lastName: {
            value: "",
            id: "11770",
            type: "PDFTextField",
          },
          firstName: {
            value: "",
            id: "11771",
            type: "PDFTextField",
          },
          middleName: {
            value: "",
            id: "11772",
            type: "PDFTextField",
          },
          suffix: {
            value: "",
            id: "11767",
            type: "PDFDropdown",
          },
          maidenName: {
            value: "NO",
            id: "11764",
            type: "PDFPDFCheckBox",
          },
          fromDate: {
            date: {
              value: "",
              id: "11769",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "11766",
              type: "PDFPDFCheckBox",
            },
          },
          toDate: {
            date: {
              value: "",
              id: "11768",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "11765",
              type: "PDFPDFCheckBox",
            },
          },
        },
      ],
      relationshipStatus: {
        value: "Divorced",
        id: "11749",
        type: "PDFPDFCheckBox",
      },
      statusDetails: {
        location: {
          city: {
            value: "",
            id: "11801",
            type: "PDFTextField",
          },
          county: {
            value: "",
            id: "11815",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "11800",
            type: "PDFDropdown",
          },
          country: {
            value: "",
            id: "11799",
            type: "PDFDropdown",
          },
        },
        date: {
          date: {
            value: "",
            id: "11802",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "11817",
            type: "PDFPDFCheckBox",
          },
        },
        recordLocation: {
          city: {
            value: "",
            id: "11840",
            type: "PDFTextField",
          },
          county: {
            value: "",
            id: "11846",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "11839",
            type: "PDFDropdown",
          },
          country: {
            value: "",
            id: "11838",
            type: "PDFDropdown",
          },
        },
        deceased: {
          value: "NO",
          id: "11842",
          type: "PDFRadioGroup",
        },
        lastKnownAddress: {
          street: {
            value: "",
            id: "11836",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "11835",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "11834",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "11832",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "11833",
            type: "PDFDropdown",
          },
        },
      },
    },
    section17_2: [
      {
        _id: Math.random(),
        marriageStatus: {
          value: "",
          id: "11875",
          type: "PDFRadioGroup",
        },
        dateOfMarriage: {
          date: {
            value: "",
            id: "11900",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "11899",
            type: "PDFPDFCheckBox",
          },
        },
        placeOfMarriage: {
          city: {
            value: "",
            id: "11879",
            type: "PDFTextField",
          },
          county: {
            value: "",
            id: "11815",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "11878",
            type: "PDFDropdown",
          },
          country: {
            value: "",
            id: "11877",
            type: "PDFDropdown",
          },
        },
        spouseName: {
          lastName: {
            value: "",
            id: "11854",
            type: "PDFTextField",
          },
          firstName: {
            value: "",
            id: "11853",
            type: "PDFTextField",
          },
          middleName: {
            value: "",
            id: "11856",
            type: "PDFTextField",
          },
          suffix: {
            value: "",
            id: "11855",
            type: "PDFDropdown",
          },
        },
        spousePlaceOfBirth: {
          city: {
            value: "",
            id: "11850",
            type: "PDFTextField",
          },
          county: {
            value: "",
            id: "11815",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "11849",
            type: "PDFDropdown",
          },
          country: {
            value: "",
            id: "11848",
            type: "PDFDropdown",
          },
        },
        spouseDateOfBirth: {
          date: {
            value: "",
            id: "11851",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "11852",
            type: "PDFPDFCheckBox",
          },
        },
        spouseCitizenship: [
          {
            _id: Math.random(),
            country: {
              value: "",
              id: "11891",
              type: "PDFDropdown",
            },
          },
        ],
        spouseDocumentation: {
          type: {
            value: "Other",
            id: "11983",
            type: "PDFPDFCheckBox",
          },
          documentNumber: {
            value: "",
            id: "11993",
            type: "PDFTextField",
          },
          documentExpirationDate: {
            date: {
              value: "",
              id: "11991",
              type: "date",
            },
            estimated: {
              value: "NO",
              id: "11990",
              type: "PDFPDFCheckBox",
            },
          },
          otherExplanation: {
            value: "",
            id: "12043",
            type: "PDFTextField",
          },
        },
        spouseUsSocialSecurityNumber: {
          value: "",
          id: "12042",
          type: "PDFTextField",
        },
        spouseOtherNames: [
          {
            _id: Math.random(),
            lastName: {
              value: "",
              id: "12058",
              type: "PDFTextField",
            },
            firstName: {
              value: "",
              id: "12059",
              type: "PDFTextField",
            },
            middleName: {
              value: "",
              id: "12060",
              type: "PDFTextField",
            },
            suffix: {
              value: "",
              id: "12055",
              type: "PDFDropdown",
            },
            maidenName: {
              value: "NO",
              id: "12050",
              type: "PDFRadioGroup",
            },
            fromDate: {
              date: {
                value: "",
                id: "12057",
                type: "PDFTextField",
              },
              estimated: {
                value: "NO",
                id: "12054",
                type: "PDFPDFCheckBox",
              },
            },
            toDate: {
              date: {
                value: "",
                id: "12056",
                type: "PDFTextField",
              },
              estimated: {
                value: "NO",
                id: "12053",
                type: "PDFPDFCheckBox",
              },
            },
          },
        ],
      },
    ],
    section17_3: {
      _id: Math.random(),
      hasCohabitant: {
        value: "NO",
        id: "11954",
        type: "PDFRadioGroup",
      },
      cohabitants: [
        {
          _id: Math.random(),
          fullName: {
            lastName: {
              value: "",
              id: "11926",
              type: "PDFTextField",
            },
            firstName: {
              value: "",
              id: "11925",
              type: "PDFTextField",
            },
            middleName: {
              value: "",
              id: "11928",
              type: "PDFTextField",
            },
            suffix: {
              value: "",
              id: "11927",
              type: "PDFDropdown",
            },
          },
          placeOfBirth: {
            city: {
              value: "",
              id: "11922",
              type: "PDFTextField",
            },
            county: {
              value: "",
              id: "11921",
              type: "PDFDropdown",
            },
            state: {
              value: "",
              id: "11921",
              type: "PDFDropdown",
            },
            country: {
              value: "",
              id: "11920",
              type: "PDFDropdown",
            },
          },
          dateOfBirth: {
            date: {
              value: "",
              id: "11923",
              type: "date",
            },
            estimated: {
              value: "NO",
              id: "11924",
              type: "PDFPDFCheckBox",
            },
          },
          citizenship: [
            {
              _id: Math.random(),
              country: {
                value: "",
                id: "11931",
                type: "PDFDropdown",
              },
            },
          ],
          documentation: {
            type: {
              value: "Other",
              id: "11966",
              type: "PDFPDFCheckBox",
            },
            documentNumber: {
              value: "",
              id: "11976",
              type: "PDFTextField",
            },
            documentExpirationDate: {
              date: {
                value: "",
                id: "11973",
                type: "date",
              },
              estimated: {
                value: "NO",
                id: "11972",
                type: "PDFPDFCheckBox",
              },
            },
            otherExplanation: {
              value: "",
              id: "11965",
              type: "PDFTextField",
            },
          },
          usSocialSecurityNumber: {
            value: "",
            id: "11975",
            type: "PDFTextField",
          },
          otherNames: [
            {
              _id: Math.random(),
              lastName: {
                value: "",
                id: "11951",
                type: "PDFTextField",
              },
              firstName: {
                value: "",
                id: "11952",
                type: "PDFTextField",
              },
              middleName: {
                value: "",
                id: "11953",
                type: "PDFTextField",
              },
              suffix: {
                value: "",
                id: "11948",
                type: "PDFDropdown",
              },
              maidenName: {
                value: "NO",
                id: "11943",
                type: "PDFRadioGroup",
              },
              fromDate: {
                date: {
                  value: "",
                  id: "11950",
                  type: "PDFTextField",
                },
                estimated: {
                  value: "NO",
                  id: "11947",
                  type: "PDFPDFCheckBox",
                },
              },
              toDate: {
                date: {
                  value: "",
                  id: "11949",
                  type: "PDFTextField",
                },
                estimated: {
                  value: "NO",
                  id: "11946",
                  type: "PDFPDFCheckBox",
                },
              },
            },
          ],
          cohabitationStartDate: {
            date: {
              value: "",
              id: "11930",
              type: "date",
            },
            estimated: {
              value: "NO",
              id: "12022",
              type: "PDFPDFCheckBox",
            },
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
        type: {
          value: "Mother",
          id: "",
          type: "PDFDropdown",
        },
        fullName: {
          firstName: {
            value: "",
            id: "12137",
            type: "PDFTextField",
          },
          middleName: {
            value: "",
            id: "12140",
            type: "PDFTextField",
          },
          lastName: {
            value: "",
            id: "12139",
            type: "PDFTextField",
          },
          suffix: {
            value: "",
            id: "12138",
            type: "PDFDropdown",
          },
        },
        dateOfBirth: {
          value: "",
          id: "12078",
          type: "date",
        },
        placeOfBirth: {
          city: {
            value: "",
            id: "12143",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "12142",
            type: "PDFDropdown",
          },
          country: {
            value: "",
            id: "12141",
            type: "PDFDropdown",
          },
        },
        countriesOfCitizenship: [
          {
            _id: Math.random(),
            country: {
              value: "",
              id: "12081",
              type: "PDFDropdown",
            },
          },
          {
            _id: Math.random(),
            country: {
              value: "",
              id: "12081",
              type: "PDFDropdown",
            },
          },
        ],
        isDeceased: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        isUSCitizen: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        hasForeignAddress: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        hasUSAddress: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        details: {
          section18_1: {
            ifMother: {
              lastName: {
                value: "",
                id: "12134",
                type: "PDFTextField",
              },
              firstName: {
                value: "",
                id: "12133",
                type: "PDFTextField",
              },
              middleName: {
                value: "",
                id: "12135",
                type: "PDFTextField",
              },
              suffix: {
                value: "",
                id: "12136",
                type: "PDFDropdown",
              },
              sameAsListed: {
                value: "NO",
                id: "12132",
                type: "PDFPDFCheckBox",
              },
              iDontKnow: {
                value: "NO",
                id: "12131",
                type: "PDFPDFCheckBox",
              },
            },
            hasOtherNames: {
              value: "NO",
              id: "12145",
              type: "PDFRadioGroup",
            },
            otherNamesUsed: [
              {
                _id: Math.random(),
                lastName: {
                  value: "",
                  id: "12128",
                  type: "PDFTextField",
                },
                firstName: {
                  value: "",
                  id: "12129",
                  type: "PDFTextField",
                },
                middleName: {
                  value: "",
                  id: "12130",
                  type: "PDFTextField",
                },
                suffix: {
                  value: "",
                  id: "12125",
                  type: "PDFDropdown",
                },
                maidenName: {
                  value: "NO",
                  id: "12121",
                  type: "PDFRadioGroup",
                },
                from: {
                  value: "",
                  id: "12127",
                  type: "PDFTextField",
                },
                to: {
                  value: "",
                  id: "12126",
                  type: "PDFTextField",
                },
                estimatedFrom: {
                  value: "NO",
                  id: "12124",
                  type: "PDFPDFCheckBox",
                },
                estimatedTo: {
                  value: "NO",
                  id: "12123",
                  type: "PDFPDFCheckBox",
                },
                reasonForChange: {
                  value: "",
                  id: "12086",
                  type: "PDFTextField",
                },
              },
            ],
          },
          section18_2: {
            _id: Math.random(),
            street: {
              value: "",
              id: "12167",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "12166",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "12165",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "12163",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "12164",
              type: "PDFDropdown",
            },
            hasAPOFPOAddress: {
              value: "NO",
              id: "12176",
              type: "PDFRadioGroup",
            },
            apofpoAddress: {
              address: {
                value: "",
                id: "12170",
                type: "PDFTextField",
              },
              apofpoStateCode: {
                value: "",
                id: "12168",
                type: "PDFDropdown",
              },
              apofpoZipCode: {
                value: "",
                id: "12171",
                type: "PDFTextField",
              },
            },
            dontKnowAPOFPO: {
              value: "NO",
              id: "12174",
              type: "PDFRadioGroup",
            },
          },
          section18_3: {
            citizenshipDocuments: [
              {
                type: "FS240or545",
                documentNumber: {
                  value: "",
                  id: "12152",
                  type: "PDFTextField",
                },
              },
            ],
            courtDetails: {
              street: {
                value: "",
                id: "12178",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "12148",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "12149",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "12177",
                type: "PDFTextField",
              },
            },
          },
          section18_4: {
            usDocumentation: [
              {
                type: {
                  value: "I551PermanentResident",
                  id: "12218",
                  type: "PDFCheckBox",
                },
              },
              {
                type: {
                  value: "I94ArrivalDepartureRecord",
                  id: "12213",
                  type: "PDFCheckBox",
                },
              },
              {
                type: {
                  value: "I20CertificateEligibilityF1Student",
                  id: "12215",
                  type: "PDFCheckBox",
                },
              },
              {
                type: {
                  value: "DS2019CertificateEligibilityJ1Status",
                  id: "12214",
                  type: "PDFCheckBox",
                },
              },
              {
                type: {
                  value: "Other",
                  id: "12217",
                  type: "PDFCheckBox",
                },
              },
              {
                type: {
                  value: "I766EmploymentAuthorization",
                  id: "12219",
                  type: "PDFCheckBox",
                },
              },
              {
                type: {
                  value: "Other",
                  id: "12216",
                  type: "PDFCheckBox",
                },
              },
            ],
            documentFieldNumber: {
              value: "",
              id: "12212",
              type: "PDFTextField",
            },
            documentExpirationDate: {
              value: "",
              id: "12179",
              type: "PDFTextField",
            },
            firstContactDate: {
              value: "",
              id: "12186",
              type: "PDFTextField",
            },
            lastContactDate: {
              value: "",
              id: "12182",
              type: "PDFTextField",
            },
            contactMethods: [
              {
                value: "In Person",
                id: "12209",
                type: "PDFCheckBox",
              },
              {
                value: "Telephone",
                id: "12211",
                type: "PDFCheckBox",
              },
              {
                value: "Electronic",
                id: "12210",
                type: "PDFCheckBox",
              },
              {
                value: "Written Correspondence",
                id: "12208",
                type: "PDFCheckBox",
              },
              {
                value: "Other",
                id: "12207",
                type: "PDFCheckBox",
              },
            ],
            contactFrequency: {
              frequency: {
                value: "Daily",
                id: "12204",
                type: "PDFCheckBox",
              },
            },
            currentEmployer: {
              name: {
                value: "",
                id: "12199",
                type: "PDFTextField",
              },
              address: {
                street: {
                  value: "",
                  id: "12197",
                  type: "PDFTextField",
                },
                city: {
                  value: "",
                  id: "12196",
                  type: "PDFTextField",
                },
                state: {
                  value: "",
                  id: "12195",
                  type: "PDFSelect",
                },
                zipCode: {
                  value: "",
                  id: "12193",
                  type: "PDFTextField",
                },
                country: {
                  value: "",
                  id: "12194",
                  type: "PDFSelect",
                },
              },
              unknown: {
                value: "NO",
                id: "12198",
                type: "PDFCheckBox",
              },
            },
            recentEmployer: {
              name: {
                value: "",
                id: "12199",
                type: "PDFTextField",
              },
              address: {
                street: {
                  value: "",
                  id: "12197",
                  type: "PDFTextField",
                },
                city: {
                  value: "",
                  id: "12196",
                  type: "PDFTextField",
                },
                state: {
                  value: "",
                  id: "12195",
                  type: "PDFSelect",
                },
                zipCode: {
                  value: "",
                  id: "12193",
                  type: "PDFTextField",
                },
                country: {
                  value: "",
                  id: "12194",
                  type: "PDFSelect",
                },
              },
              unknown: {
                value: "NO",
                id: "12198",
                type: "PDFCheckBox",
              },
            },
            foreignGovernmentAffiliation: {
              affiliation: {
                value: "NO",
                id: "12188",
                type: "PDFRadioButton",
              },
              description: {
                value: "",
                id: "12187",
                type: "PDFTextField",
              },
            },
          },
          section18_5: {
            firstContactDate: {
              value: "",
              id: "12224",
              type: "PDFTextField",
            },
            lastContactDate: {
              value: "",
              id: "12222",
              type: "PDFTextField",
            },
            contactMethods: [
              {
                value: "In Person",
                id: "12247",
                type: "PDFPDFCheckBox",
              },
              {
                value: "Telephone",
                id: "12249",
                type: "PDFPDFCheckBox",
              },
              {
                value: "Electronic",
                id: "12248",
                type: "PDFPDFCheckBox",
              },
              {
                value: "Written Correspondence",
                id: "12246",
                type: "PDFPDFCheckBox",
              },
              {
                value: "Other",
                id: "12245",
                type: "PDFPDFCheckBox",
              },
            ],
            contactFrequency: {
              frequency: {
                value: "Daily",
                id: "12242",
                type: "PDFPDFCheckBox",
              },
              explanation: {
                value: "",
                id: "12240",
                type: "PDFTextField",
              },
            },
            employerDetails: {
              name: {
                value: "",
                id: "12237",
                type: "PDFTextField",
              },
              address: {
                street: {
                  value: "",
                  id: "12235",
                  type: "PDFTextField",
                },
                city: {
                  value: "",
                  id: "12234",
                  type: "PDFTextField",
                },
                state: {
                  value: "",
                  id: "12233",
                  type: "PDFDropdown",
                },
                zipCode: {
                  value: "",
                  id: "12231",
                  type: "PDFTextField",
                },
                country: {
                  value: "",
                  id: "12232",
                  type: "PDFDropdown",
                },
              },
              unknown: {
                value: "NO",
                id: "12230",
                type: "PDFPDFCheckBox",
              },
            },
            foreignGovernmentAffiliation: {
              affiliation: {
                value: "NO",
                id: "",
                type: "PDFRadioButton",
              },

              description: {
                value: "",
                id: "12225",
                type: "PDFTextField",
              },
            },
          },
        },
      },
    ],
  },
  foreignContacts: {
    _id: Math.random(),
    hasForeignContact: {
      value: "NO",
      id: "",
      type: "PDFRadioGroup",
    },
    entries: [
      {
        _id: Math.random(),
        lastName: {
          value: "",
          id: "13133",
          type: "PDFTextField",
        },
        firstName: {
          value: "",
          id: "13132",
          type: "PDFTextField",
        },
        middleName: {
          value: "",
          id: "13134",
          type: "PDFTextField",
        },
        suffix: {
          value: "",
          id: "13135",
          type: "PDFDropdown",
        },
        approximateFirstContactDate: {
          value: "",
          id: "13130",
          type: "PDFTextField",
        },
        approximateLastContactDate: {
          value: "",
          id: "13128",
          type: "PDFTextField",
        },
        contactMethods: [
          {
            value: "In Person",
            id: "13124",
            type: "PDFPDFCheckBox",
          },
          {
            value: "Telephone",
            id: "13126",
            type: "PDFPDFCheckBox",
          },
          {
            value: "Electronic",
            id: "13125",
            type: "PDFPDFCheckBox",
          },
          {
            value: "Written Correspondence",
            id: "13123",
            type: "PDFPDFCheckBox",
          },
          {
            value: "Other",
            id: "13121",
            type: "PDFPDFCheckBox",
          },
        ],
        contactFrequency: [
          {
            value: "Daily",
            id: "13120",
            type: "PDFRadioGroup",
          },
          {
            value: "Weekly",
            id: "13119",
            type: "PDFRadioGroup",
          },
          {
            value: "Monthly",
            id: "13118",
            type: "PDFRadioGroup",
          },
          {
            value: "Quarterly",
            id: "13117",
            type: "PDFRadioGroup",
          },
          {
            value: "Annually",
            id: "13116",
            type: "PDFRadioGroup",
          },
          {
            value: "Other",
            id: "13196",
            type: "PDFRadioGroup",
          },
        ],
        relationshipNature: [
          {
            value: "Professional or Business",
            id: "13191",
            type: "PDFPDFCheckBox",
          },
          {
            value: "Personal",
            id: "13192",
            type: "PDFPDFCheckBox",
          },
          {
            value: "Obligation",
            id: "13189",
            type: "PDFPDFCheckBox",
          },
          {
            value: "Other",
            id: "13193",
            type: "PDFPDFCheckBox",
          },
        ],
        otherNames: [
          {
            lastName: {
              value: "",
              id: "13188",
              type: "PDFTextField",
            },
            firstName: {
              value: "",
              id: "13187",
              type: "PDFTextField",
            },
            middleName: {
              value: "",
              id: "13186",
              type: "PDFTextField",
            },
            suffix: {
              value: "",
              id: "13185",
              type: "PDFDropdown",
            },
          },
        ],
        citizenships: [
          {
            _id: Math.random(),
            country: {
              value: "",
              id: "13138",
              type: "PDFDropdown",
            },
          },
          {
            _id: Math.random(),
            country: {
              value: "",
              id: "13137",
              type: "PDFDropdown",
            },
          },
        ],
        dateOfBirth: {
          value: "",
          id: "13171",
          type: "date",
        },
        placeOfBirth: {
          city: {
            value: "",
            id: "13143",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "13144",
            type: "PDFDropdown",
          },
        },
        currentAddress: {
          street: {
            value: "",
            id: "13169",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "13168",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "13167",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "13165",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "13166",
            type: "PDFDropdown",
          },
        },
        apoFpoAddress: {
          address: {
            value: "",
            id: "13147",
            type: "PDFTextField",
          },
          stateCode: {
            value: "",
            id: "13146",
            type: "PDFTextField",
          },
          zipCode: {
            value: "",
            id: "13151",
            type: "PDFTextField",
          },
        },
        currentEmployer: {
          name: {
            value: "",
            id: "13163",
            type: "PDFTextField",
          },
          address: {
            street: {
              value: "",
              id: "13161",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "13160",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "13159",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "13157",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "13158",
              type: "PDFDropdown",
            },
          },
        },
        affiliatedWithForeignGov: {
          value: "NO",
          id: "13155",
          type: "PDFRadioGroup",
        },
        foreignGovAffiliationDetails: {
          value: "",
          id: "13152",
          type: "PDFTextField",
        },
      },
    ],
  },

  foreignActivities: {
    _id: Math.random(),
    hasForeignFinancialInterest: {
      value: "NO",
      id: "13459",
      type: "PDFRadioGroup",
    },
    hasForeignInterestOnBehalf: {
      value: "NO",
      id: "13458",
      type: "PDFRadioGroup",
    },
    wantForeignRealEstate: {
      value: "NO",
      id: "13469",
      type: "PDFPDFCheckBox",
    },
    hasForeignSupport: {
      value: "NO",
      id: "13470",
      type: "PDFPDFCheckBox",
    },
    providedForeignSupport: {
      value: "NO",
      id: "13471",
      type: "PDFPDFCheckBox",
    },
    providedForeignAdvice: {
      value: "NO",
      id: "13472",
      type: "PDFPDFCheckBox",
    },
    familyProvidedForeignAdvice: {
      value: "NO",
      id: "13468",
      type: "PDFTextField",
    },
    offeredForeignJob: {
      value: "NO",
      id: "13447",
      type: "date",
    },
    offeredBuisnessVenture: {
      value: "NO",
      id: "13446",
      type: "PDFPDFCheckBox",
    },
    foreignConferences: {
      value: "NO",
      id: "13442",
      type: "PDFTextField",
    },
    contactForeignGovernment: {
      value: "NO",
      id: "13465",
      type: "PDFTextField",
    },
    sponsoredForeignNational: {
      value: "NO",
      id: "13466",
      type: "PDFPDFCheckBox",
    },
    foreignPoliticalOffice: {
      value: "NO",
      id: "13467",
      type: "PDFTextField",
    },
    foreignVote: {
      value: "NO",
      id: "13464",
      type: "PDFPDFCheckBox",
    },
    traveledOutsideUSA: {
      value: "NO",
      id: "13462",
      type: "date",
    },
    traveledOutsideUSA_Government: {
      value: "NO",
      id: "13463",
      type: "PDFPDFCheckBox",
    },
    section20A1: [
      {
        id_: Math.random(),
        ownershipType: [
          {
            _id: Math.random(),
            type: {
              value: "Yourself",
              id: "13523",
              type: "PDFTextField",
            },
          },
        ],
        financialInterestType: {
          value: "",
          id: "13545",
          type: "PDFTextField",
        },
        dateAcquired: {
          date: {
            value: "",
            id: "13566",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "13543",
            type: "PDFPDFCheckBox",
          },
        },
        howAcquired: {
          value: "",
          id: "13564",
          type: "PDFTextField",
        },
        costAtAcquisition: {
          value: {
            value: 0,
            id: "13821",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13565",
            type: "PDFPDFCheckBox",
          },
        },
        currentValue: {
          value: {
            value: 0,
            id: "",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13528",
            type: "PDFPDFCheckBox",
          },
        },
        dateControlRelinquished: {
          date: {
            value: "",
            id: "13527",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "13529",
            type: "PDFPDFCheckBox",
          },
        },
        disposalExplanation: {
          value: "",
          id: "13525",
          type: "PDFTextField",
        },
        hasCoOwners: {
          value: "NO",
          id: "13568",
          type: "PDFRadioGroup",
        },
        coOwners: [
          {
            _id: Math.random(),
            lastName: {
              value: "",
              id: "13539",
              type: "PDFTextField",
            },
            firstName: {
              value: "",
              id: "13538",
              type: "PDFTextField",
            },
            middleName: {
              value: "",
              id: "13540",
              type: "PDFTextField",
            },
            suffix: {
              value: "",
              id: "13541",
              type: "PDFDropdown",
            },
            address: {
              street: {
                value: "",
                id: "13537",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "13536",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "13535",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "13533",
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "13534",
                type: "PDFDropdown",
              },
            },
            citizenships: [
              {
                _id: Math.random(),
                type: {
                  value: "",
                  id: "13532",
                  type: "PDFDropdown",
                },
              },
            ],
            relationship: {
              value: "",
              id: "13542",
              type: "PDFTextField",
            },
          },
        ],
      },
    ],
    section20A2: [
      {
        id_: Math.random(),
        ownershipType: [
          {
            _id: Math.random(),
            type: {
              value: "Yourself",
              id: "13579",
              type: "PDFTextField",
            },
          },
        ],
        financialInterestType: {
          value: "",
          id: "13602",
          type: "PDFTextField",
        },
        controllerInfo: {
          lastName: {
            value: "",
            id: "13571",
            type: "PDFTextField",
          },
          firstName: {
            value: "",
            id: "13572",
            type: "PDFTextField",
          },
          middleName: {
            value: "",
            id: "13573",
            type: "PDFTextField",
          },
          suffix: {
            value: "",
            id: "13574",
            type: "PDFDropdown",
          },
          relationship: {
            value: "",
            id: "13570",
            type: "PDFTextField",
          },
        },
        dateAcquired: {
          date: {
            value: "",
            id: "13575",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "13574",
            type: "PDFPDFCheckBox",
          },
        },
        costAtAcquisition: {
          value: {
            value: 0,
            id: "",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13600",
            type: "PDFPDFCheckBox",
          },
        },
        currentValue: {
          value: {
            value: 0,
            id: "13821",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13585",
            type: "PDFPDFCheckBox",
          },
        },
        dateDisposed: {
          date: {
            value: "",
            id: "13584",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "13586",
            type: "PDFPDFCheckBox",
          },
        },
        disposalExplanation: {
          value: "",
          id: "13582",
          type: "PDFTextField",
        },
        hasCoOwners: {
          value: "NO",
          id: "13577",
          type: "PDFRadioGroup",
        },
        coOwners: [
          {
            _id: Math.random(),
            lastName: {
              value: "",
              id: "13596",
              type: "PDFTextField",
            },
            firstName: {
              value: "",
              id: "13595",
              type: "PDFTextField",
            },
            middleName: {
              value: "",
              id: "13597",
              type: "PDFTextField",
            },
            suffix: {
              value: "",
              id: "13598",
              type: "PDFDropdown",
            },
            address: {
              street: {
                value: "",
                id: "13594",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "13593",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "13592",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "13590",
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "13591",
                type: "PDFDropdown",
              },
            },
            citizenships: [
              {
                _id: Math.random(),
                type: {
                  value: "",
                  id: "13589",
                  type: "PDFDropdown",
                },
              },
            ],
            relationship: {
              value: "",
              id: "13599",
              type: "PDFTextField",
            },
          },
          {
            _id: Math.random(),
            lastName: {
              value: "",
              id: "13612",
              type: "PDFTextField",
            },
            firstName: {
              value: "",
              id: "13611",
              type: "PDFTextField",
            },
            middleName: {
              value: "",
              id: "13613",
              type: "PDFTextField",
            },
            suffix: {
              value: "",
              id: "13614",
              type: "PDFDropdown",
            },
            address: {
              street: {
                value: "",
                id: "13610",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "13609",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "13608",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "13606",
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "13607",
                type: "PDFDropdown",
              },
            },
            citizenships: [
              {
                _id: Math.random(),
                type: {
                  value: "",
                  id: "13605",
                  type: "PDFDropdown",
                },
              },
            ],
            relationship: {
              value: "",
              id: "13615",
              type: "PDFTextField",
            },
          },
        ],
      },
    ],
    section20A3: [
      {
        id_: Math.random(),
        ownershipType: [
          {
            _id: Math.random(),
            type: {
              value: "Yourself",
              id: "13755",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value:
                "Spouse or legally recognized civil union/domestic partner",
              id: "13747",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "Cohabitant",
              id: "13702",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "Dependent children",
              id: "13703",
              type: "PDFPDFCheckBox",
            },
          },
        ],
        realEstateType: {
          value: "",
          id: "13708",
          type: "PDFRadioGroup",
        },
        location: {
          street: {
            value: "",
            id: "13832",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "13831",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "13830",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "13828",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "13829",
            type: "PDFDropdown",
          },
        },
        dateOfPurchase: {
          date: {
            value: "",
            id: "13746",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "13745",
            type: "PDFPDFCheckBox",
          },
        },
        howAcquired: {
          value: "",
          id: "13753",
          type: "PDFTextField",
        },
        dateSold: {
          date: {
            value: "",
            id: "13736",
            type: "date",
          },
          estimated: {
            value: "NO",
            id: "13733",
            type: "PDFPDFCheckBox",
          },
        },
        costAtAcquisition: {
          value: {
            value: 0,
            id: "",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13803",
            type: "PDFPDFCheckBox",
          },
        },
        hasCoOwners: {
          value: "NO",
          id: "13836",
          type: "PDFRadioGroup",
        },
        coOwners: [
          {
            _id: Math.random(),
            lastName: {
              value: "",
              id: "13825",
              type: "PDFTextField",
            },
            firstName: {
              value: "",
              id: "13824",
              type: "PDFTextField",
            },
            middleName: {
              value: "",
              id: "13826",
              type: "PDFTextField",
            },
            suffix: {
              value: "",
              id: "13827",
              type: "PDFDropdown",
            },
            address: {
              street: {
                value: "",
                id: "13832",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "13831",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "13830",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "13828",
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "13829",
                type: "PDFDropdown",
              },
            },
            citizenships: [
              {
                _id: Math.random(),
                type: {
                  value: "",
                  id: "13819",
                  type: "PDFDropdown",
                },
              },
            ],
            relationship: {
              value: "",
              id: "13823",
              type: "PDFTextField",
            },
          },
          {
            _id: Math.random(),
            lastName: {
              value: "",
              id: "13842",
              type: "PDFTextField",
            },
            firstName: {
              value: "",
              id: "13841",
              type: "PDFTextField",
            },
            middleName: {
              value: "",
              id: "13843",
              type: "PDFTextField",
            },
            suffix: {
              value: "",
              id: "13844",
              type: "PDFDropdown",
            },
            address: {
              street: {
                value: "",
                id: "13849",
                type: "PDFTextField",
              },
              city: {
                value: "",
                id: "13848",
                type: "PDFTextField",
              },
              state: {
                value: "",
                id: "13847",
                type: "PDFDropdown",
              },
              zipCode: {
                value: "",
                id: "13845",
                type: "PDFTextField",
              },
              country: {
                value: "",
                id: "13846",
                type: "PDFDropdown",
              },
            },
            citizenships: [
              {
                _id: Math.random(),
                type: {
                  value: "",
                  id: "13834",
                  type: "PDFDropdown",
                },
              },
            ],
            relationship: {
              value: "",
              id: "13840",
              type: "PDFTextField",
            },
          },
        ],
      },
    ],
    section20A4: [
      {
        id_: Math.random(),
        ownershipType: [
          {
            _id: Math.random(),
            type: {
              value: "Yourself",
              id: "13755",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value:
                "Spouse or legally recognized civil union/domestic partner",
              id: "13747",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "Cohabitant",
              id: "13702",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "Dependent children",
              id: "13703",
              type: "PDFPDFCheckBox",
            },
          },
        ],
        benefitType: {
          _id: Math.random(),
          type: "Educational",
          other: {
            value: "",
            id: "13704",
            type: "PDFTextField",
          },
        },
        benefitFrequency: {
          type: "Onetime benefit",
          other: {
            value: "",
            id: "13749",
            type: "PDFTextField",
          },
        },
        oneTimeBenefit: {
          dateReceived: {
            date: {
              value: "",
              id: "13746",
              type: "date",
            },
            estimated: {
              value: "NO",
              id: "13745",
              type: "PDFPDFCheckBox",
            },
          },
          countryProviding: {
            value: "",
            id: "13741",
            type: "PDFDropdown",
          },
          totalValue: {
            value: {
              value: 0,
              id: "",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "13743",
              type: "PDFPDFCheckBox",
            },
          },
          reason: {
            value: "",
            id: "13742",
            type: "PDFTextField",
          },
          obligatedToForeignCountry: {
            value: "NO",
            id: "13759",
            type: "PDFRadioGroup",
          },
          explanation: {
            value: "",
            id: "13754",
            type: "PDFTextField",
          },
          frequency: {
            _id: Math.random(),
            type: {
              value: "Annually",
              id: "",
              type: "PDFRadioGroup",
            },
            other: {
              value: "",
              id: "13728",
              type: "PDFTextField",
            },
          },
        },
        futureBenefit: {
          dateReceived: {
            date: {
              value: "",
              id: "13736",
              type: "date",
            },
            estimated: {
              value: "NO",
              id: "13733",
              type: "PDFPDFCheckBox",
            },
          },
          countryProviding: {
            value: "",
            id: "13740",
            type: "PDFDropdown",
          },
          totalValue: {
            value: {
              value: 0,
              id: "",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "13743",
              type: "PDFPDFCheckBox",
            },
          },
          reason: {
            value: "",
            id: "13732",
            type: "PDFTextField",
          },
          obligatedToForeignCountry: {
            value: "NO",
            id: "13759",
            type: "PDFRadioGroup",
          },
          explanation: {
            value: "",
            id: "13754",
            type: "PDFTextField",
          },
          frequency: {
            _id: Math.random(),
            type: {
              value: "Annually",
              id: "",
              type: "PDFRadioGroup",
            },
            other: {
              value: "",
              id: "13728",
              type: "PDFTextField",
            },
          },
        },
        continuingBenefit: {
          dateReceived: {
            date: {
              value: "",
              id: "13781",
              type: "date",
            },
            estimated: {
              value: "NO",
              id: "13780",
              type: "PDFPDFCheckBox",
            },
          },
          countryProviding: {
            value: "",
            id: "13785",
            type: "PDFDropdown",
          },
          totalValue: {
            value: {
              value: 0,
              id: "",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "13718",
              type: "PDFPDFCheckBox",
            },
          },
          reason: {
            value: "",
            id: "13717",
            type: "PDFTextField",
          },
          obligatedToForeignCountry: {
            value: "NO",
            id: "13783",
            type: "PDFRadioGroup",
          },
          explanation: {
            value: "",
            id: "13784",
            type: "PDFTextField",
          },
          frequency: {
            _id: Math.random(),
            type: {
              value: "Annually",
              id: "",
              type: "PDFRadioGroup",
            },
            other: {
              value: "",
              id: "13714",
              type: "PDFTextField",
            },
          },
        },
      },
    ],
    section20A5: [
      {
        id_: Math.random(),
        lastName: {
          value: "",
          id: "13825",
          type: "PDFTextField",
        },
        firstName: {
          value: "",
          id: "13824",
          type: "PDFTextField",
        },
        middleName: {
          value: "",
          id: "13826",
          type: "PDFTextField",
        },
        suffix: {
          value: "",
          id: "13827",
          type: "PDFDropdown",
        },
        address: {
          street: {
            value: "",
            id: "13832",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "13831",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "13830",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "13828",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "13829",
            type: "PDFDropdown",
          },
        },
        relationship: {
          value: "",
          id: "13823",
          type: "PDFTextField",
        },
        amountProvided: {
          value: {
            value: 0,
            id: "13821",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13822",
            type: "PDFPDFCheckBox",
          },
        },
        citizenships: [
          {
            _id: Math.random(),
            type: {
              value: "",
              id: "13819",
              type: "PDFDropdown",
            },
            notApplicable: {
              value: "NO",
              id: "13818",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "",
              id: "13818",
              type: "PDFDropdown",
            },
            notApplicable: {
              value: "NO",
              id: "13818",
              type: "PDFPDFCheckBox",
            },
          },
        ],
        frequency: {
          _id: Math.random(),
          type: {
            value: "Annually",
            id: "13811",
            type: "PDFRadioGroup",
          },
          other: {
            value: "",
            id: "13808",
            type: "PDFTextField",
          },
        },
      },
    ],
    section20B1: [
      {
        id_: Math.random(),
        description: {
          value: "",
          id: "13892",
          type: "PDFTextField",
        },
        individual: {
          lastName: {
            value: "",
            id: "13898",
            type: "PDFTextField",
          },
          firstName: {
            value: "",
            id: "13897",
            type: "PDFTextField",
          },
          middleName: {
            value: "",
            id: "13896",
            type: "PDFTextField",
          },
          suffix: {
            value: "",
            id: "13895",
            type: "PDFDropdown",
          },
          relationship: {
            value: "",
            id: "13933",
            type: "PDFTextField",
          },
        },
        organization: {
          value: "",
          id: "13894",
          type: "PDFTextField",
        },
        organizationCountry: {
          value: "",
          id: "13893",
          type: "PDFDropdown",
        },
        dateFrom: {
          date: {
            value: "",
            id: "13891",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13890",
            type: "PDFPDFCheckBox",
          },
        },
        dateTo: {
          date: {
            value: "",
            id: "13889",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13887",
            type: "PDFPDFCheckBox",
          },
        },
        compensation: {
          value: "",
          id: "13886",
          type: "PDFTextField",
        },
      },
    ],
    section20B2: [
      {
        id_: Math.random(),
        lastName: {
          value: "",
          id: "13866",
          type: "PDFTextField",
        },
        firstName: {
          value: "",
          id: "13865",
          type: "PDFTextField",
        },
        middleName: {
          value: "",
          id: "13867",
          type: "PDFTextField",
        },
        suffix: {
          value: "",
          id: "13868",
          type: "PDFDropdown",
        },
        agency: {
          value: "",
          id: "13864",
          type: "PDFTextField",
        },
        country: {
          value: "",
          id: "13863",
          type: "PDFDropdown",
        },
        dateOfRequest: {
          date: {
            value: "",
            id: "13861",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13860",
            type: "PDFPDFCheckBox",
          },
        },
        circumstances: {
          value: "",
          id: "13862",
          type: "PDFTextField",
        },
      },
    ],
    section20B3: [
      {
        id_: Math.random(),
        lastName: {
          value: "",
          id: "13913",
          type: "PDFTextField",
        },
        firstName: {
          value: "",
          id: "13912",
          type: "PDFTextField",
        },
        middleName: {
          value: "",
          id: "13914",
          type: "PDFTextField",
        },
        suffix: {
          value: "",
          id: "13915",
          type: "PDFDropdown",
        },
        positionDescription: {
          value: "",
          id: "13911",
          type: "PDFTextField",
        },
        dateOffered: {
          date: {
            value: "",
            id: "13909",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13910",
            type: "PDFPDFCheckBox",
          },
        },
        accepted: {
          value: "NO",
          id: "13908",
          type: "PDFRadioGroup",
        },
        explanation: {
          value: "",
          id: "13901",
          type: "PDFTextField",
        },
        location: {
          street: {
            value: "",
            id: "13905",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "13905",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "13904",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "13902",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "13903",
            type: "PDFDropdown",
          },
        },
      },
    ],
    section20B4: [
      {
        id_: Math.random(),
        lastName: {
          value: "",
          id: "13937",
          type: "PDFTextField",
        },
        firstName: {
          value: "",
          id: "13936",
          type: "PDFTextField",
        },
        middleName: {
          value: "",
          id: "13938",
          type: "PDFTextField",
        },
        suffix: {
          value: "",
          id: "13939",
          type: "PDFDropdown",
        },
        address: {
          street: {
            value: "",
            id: "13944",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "13943",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "13942",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "13940",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "13941",
            type: "PDFDropdown",
          },
        },
        citizenships: [
          {
            _id: Math.random(),
            type: {
              value: "",
              id: "13950",
              type: "PDFDropdown",
            },
            notApplicable: {
              value: "NO",
              id: "13950",
              type: "PDFDropdown",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "",
              id: "13949",
              type: "PDFDropdown",
            },
            notApplicable: {
              value: "NO",
              id: "13949",
              type: "PDFDropdown",
            },
          },
        ],
        ventureDescription: {
          value: "",
          id: "13934",
          type: "PDFTextField",
        },
        dateFrom: {
          date: {
            value: "",
            id: "13981",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13980",
            type: "PDFPDFCheckBox",
          },
        },
        dateTo: {
          date: {
            value: "",
            id: "13979",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "13977",
            type: "PDFPDFCheckBox",
          },
        },
        natureOfAssociation: {
          value: "",
          id: "13935",
          type: "PDFTextField",
        },
        positionHeld: {
          value: "",
          id: "13973",
          type: "PDFTextField",
        },
        financialSupport: {
          value: {
            value: 0,
            id: "13972",
            type: "number",
          },
          estimated: {
            value: "NO",
            id: "13972",
            type: "PDFPDFCheckBox",
          },
        },
        compensationDescription: {
          value: "",
          id: "13975",
          type: "PDFTextField",
        },
      },
    ],
    section20B5: [
      {
        id_: Math.random(),
        eventDescription: {
          value: "",
          id: "13993",
          type: "PDFTextField",
        },
        eventDates: {
          fromDate: {
            date: {
              value: "",
              id: "13989",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "13988",
              type: "PDFPDFCheckBox",
            },
          },
          toDate: {
            date: {
              value: "",
              id: "13987",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "13985",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "13986",
            type: "PDFPDFCheckBox",
          },
        },
        purpose: {
          value: "",
          id: "13991",
          type: "PDFTextField",
        },
        sponsoringOrganization: {
          value: "",
          id: "13990",
          type: "PDFTextField",
        },
        eventLocation: {
          street: {
            value: "",
            id: "13984",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "13984",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "13984",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "13984",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "13992",
            type: "PDFDropdown",
          },
        },
        hasContacts: {
          value: "NO",
          id: "13983",
          type: "PDFRadioGroup",
        },
        subsequentContacts: [
          {
            _id: Math.random(),
            contactExplanation: {
              value: "",
              id: "14016",
              type: "PDFTextField",
            },
          },
          {
            _id: Math.random(),
            contactExplanation: {
              value: "",
              id: "14015",
              type: "PDFTextField",
            },
          },
        ],
      },
    ],
    section20B6: [
      {
        id_: Math.random(),
        individual: {
          lastName: {
            value: "",
            id: "14043",
            type: "PDFTextField",
          },
          firstName: {
            value: "",
            id: "14042",
            type: "PDFTextField",
          },
          middleName: {
            value: "",
            id: "14044",
            type: "PDFTextField",
          },
          suffix: {
            value: "",
            id: "14045",
            type: "PDFDropdown",
          },
          relationship: {
            value: "",
            id: "14076",
            type: "PDFTextField",
          },
        },
        contactLocation: {
          street: {
            value: "",
            id: "14049",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "14049",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "14048",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "14046",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "14047",
            type: "PDFDropdown",
          },
        },
        contactDate: {
          date: {
            value: "",
            id: "14041",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "14040",
            type: "PDFPDFCheckBox",
          },
        },
        establishmentType: {
          value: "",
          id: "14074",
          type: "PDFTextField",
        },
        foreignRepresentatives: {
          value: "",
          id: "14018",
          type: "PDFTextField",
        },
        purposeCircumstances: {
          value: "",
          id: "14017",
          type: "PDFTextField",
        },
        hasContact: {
          value: "NO",
          id: "14039",
          type: "PDFRadioGroup",
        },
        subsequentContact: [
          {
            _id: Math.random(),
            purpose: {
              value: "",
              id: "14037",
              type: "PDFTextField",
            },
            dateOfMostRecentContact: {
              date: {
                value: "",
                id: "14036",
                type: "PDFTextField",
              },
              estimated: {
                value: "NO",
                id: "14036",
                type: "PDFPDFCheckBox",
              },
            },
            plansForFutureContact: {
              value: "",
              id: "14035",
              type: "PDFTextField",
            },
          },
        ],
      },
    ],
    section20B7: [
      {
        id_: Math.random(),
        lastName: {
          value: "",
          id: "14101",
          type: "PDFTextField",
        },
        firstName: {
          value: "",
          id: "14102",
          type: "PDFTextField",
        },
        middleName: {
          value: "",
          id: "14103",
          type: "PDFTextField",
        },
        suffix: {
          value: "",
          id: "14104",
          type: "PDFDropdown",
        },
        dateOfBirth: {
          date: {
            value: "",
            id: "14105",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "14106",
            type: "PDFPDFCheckBox",
          },
        },
        placeOfBirth: {
          street: {
            value: "",
            id: "14107",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "14108",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "14109",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "14110",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "14111",
            type: "PDFDropdown",
          },
        },
        currentAddress: {
          street: {
            value: "",
            id: "14112",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "14113",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "14114",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "14115",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "14116",
            type: "PDFDropdown",
          },
        },
        citizenships: [
          {
            _id: Math.random(),
            type: {
              value: "",
              id: "14118",
              type: "PDFTextField",
            },
            notApplicable: {
              value: "NO",
              id: "14119",
              type: "PDFPDFCheckBox",
            },
          },
        ],
        sponsoringOrganization: {
          name: {
            value: "",
            id: "14120",
            type: "PDFTextField",
          },
          address: {
            street: {
              value: "",
              id: "14121",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "14122",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "14123",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "14124",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "14125",
              type: "PDFDropdown",
            },
          },
          notApplicable: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        datesOfStay: {
          fromDate: {
            date: {
              value: "",
              id: "14126",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "14127",
              type: "PDFPDFCheckBox",
            },
          },
          toDate: {
            date: {
              value: "",
              id: "14128",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "14129",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "14130",
            type: "PDFPDFCheckBox",
          },
        },
        addressDuringStay: {
          street: {
            value: "",
            id: "14131",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "14132",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "14133",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "14134",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "14135",
            type: "PDFDropdown",
          },
        },
        purposeOfStay: {
          value: "",
          id: "14136",
          type: "PDFTextField",
        },
        purposeOfSponsorship: {
          value: "",
          id: "14137",
          type: "PDFTextField",
        },
      },
    ],
    section20B8: [
      {
        id_: Math.random(),
        positionHeld: {
          value: "",
          id: "14301",
          type: "PDFTextField",
        },
        datesHeld: {
          fromDate: {
            date: {
              value: "",
              id: "14302",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "14303",
              type: "PDFPDFCheckBox",
            },
          },
          toDate: {
            date: {
              value: "",
              id: "14304",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "14305",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "14306",
            type: "PDFPDFCheckBox",
          },
        },
        reasonForActivities: {
          value: "",
          id: "14307",
          type: "PDFTextField",
        },
        currentEligibility: {
          value: "",
          id: "14308",
          type: "PDFTextField",
        },
        countryInvolved: {
          value: "",
          id: "14309",
          type: "PDFDropdown",
        },
      },
    ],
    section20B9: [
      {
        id_: Math.random(),
        dateVoted: {
          date: {
            value: "",
            id: "14301",
            type: "month-day-year",
          },
          estimated: {
            value: "NO",
            id: "14302",
            type: "PDFPDFCheckBox",
          },
        },
        countryInvolved: {
          value: "",
          id: "14303",
          type: "PDFTextField",
        },
        reasons: {
          value: "",
          id: "14304",
          type: "PDFTextField",
        },
        currentEligibility: {
          value: "",
          id: "14305",
          type: "PDFTextField",
        },
      },
    ],
    section20C: [
      {
        _id: Math.random(),
        countryVisited: {
          value: "",
          id: "13642",
          type: "PDFTextField",
        },
        travelDates: {
          fromDate: {
            date: {
              value: "",
              id: "13575",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "13574",
              type: "PDFCheckBox",
            },
          },
          toDate: {
            date: {
              value: "",
              id: "13584",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "13586",
              type: "PDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "13585",
            type: "PDFCheckBox",
          },
        },
        numberOfDays: [
          {
            _id: Math.random(),
            option: {
              value: "1-5",
              id: "13626",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            option: {
              value: "6-10",
              id: "13625",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),

            option: {
              value: "11-20",
              id: "13627",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            option: {
              value: "21-30",
              id: "13637",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            option: {
              value: "More than 30",
              id: "13636",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            option: {
              value: "Many short trips",
              id: "13638",
              type: "PDFCheckBox",
            },
          },
        ],
        purposeOfTravel: [
          {
            _id: Math.random(),
            reason: {
              value: "Visit family or friends",
              id: "13639",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            reason: {
              value: "Trade shows, conferences, and seminars",
              id: "13640",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            reason: {
              value: "Education Tourism",
              id: "13641",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            reason: {
              value: "Volunteer activities",
              id: "13642",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            reason: {
              value: "Business/Professional conference",
              id: "13643",
              type: "PDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            reason: {
              value: "Other",
              id: "13644",
              type: "PDFCheckBox",
            },
          },
        ],
        questionedOrSearched: {
          value: "NO",
          id: "13549",
          type: "PDFRadioButton",
        },
        questionedOrSearchedExplanation: {
          value: "",
          id: "13550",
          type: "PDFTextField",
        },
        encounterWithPolice: {
          value: "NO",
          id: "13577",
          type: "PDFRadioButton",
        },
        encounterWithPoliceExplanation: {
          value: "",
          id: "13576",
          type: "PDFTextField",
        },
        contactWithForeignIntelligence: {
          value: "NO",
          id: "13645",
          type: "PDFRadioButton",
        },
        contactWithForeignIntelligenceExplanation: {
          value: "",
          id: "13644",
          type: "PDFTextField",
        },
        counterintelligenceIssues: {
          value: "NO",
          id: "13652",
          type: "PDFRadioButton",
        },
        counterintelligenceIssuesExplanation: {
          value: "",
          id: "13651",
          type: "PDFTextField",
        },
        contactExhibitingInterest: {
          value: "NO",
          id: "13650",
          type: "PDFRadioButton",
        },
        contactExhibitingInterestExplanation: {
          value: "",
          id: "13649",
          type: "PDFTextField",
        },
        contactAttemptingToObtainInfo: {
          value: "NO",
          id: "13648",
          type: "PDFRadioButton",
        },
        contactAttemptingToObtainInfoExplanation: {
          value: "",
          id: "13647",
          type: "PDFTextField",
        },
        threatenedOrCoerced: {
          value: "NO",
          id: "13646",
          type: "PDFRadioButton",
        },
        threatenedOrCoercedExplanation: {
          value: "",
          id: "13633",
          type: "PDFTextField",
        },
      },
    ],
  },
  mentalHealth: {
    _id: Math.random(),
    declaredMentallyIncompetent: {
      value: "NO",
      id: "14351",
      type: "PDFRadioGroup",
    },
    consultMentalHealth: {
      value: "NO",
      id: "14352",
      type: "PDFRadioGroup",
    },
    hospitalizedMentalHealth: {
      value: "NO",
      id: "14353",
      type: "PDFRadioGroup",
    },
    beenDiagnosed: {
      value: "NO",
      id: "14354",
      type: "PDFRadioGroup",
    },
    delayedTreatment: {
      value: "NO",
      id: "14355",
      type: "PDFRadioGroup",
    },
    currentlyInTreatment: {
      value: "NO",
      id: "14356",
      type: "PDFRadioGroup",
    },
    substantialAffects: {
      value: "NO",
      id: "14357",
      type: "PDFRadioGroup",
    },
    counseling: {
      value: "NO",
      id: "14358",
      type: "PDFRadioGroup",
    },
    section21A: [
      {
        dateOccurred: {
          value: "",
          id: "14378",
          type: "PDFTextField",
        },
        estimated: {
          value: "NO",
          id: "14377",
          type: "PDFPDFCheckBox",
        },
        courtAgency: {
          name: {
            value: "",
            id: "14376",
            type: "PDFTextField",
          },
          address: {
            street: {
              value: "",
              id: "14375",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "14374",
              type: "PDFTextField",
            },
            zipCode: {
              value: "",
              id: "14371",
              type: "PDFTextField",
            },
            country: {
              value: "United States",
              id: "14372",
              type: "PDFDropdown",
            },
            state: {
              value: "",
              id: "14373",
              type: "PDFDropdown",
            },
          },
        },
        appealed: {
          value: "NO",
          id: "14380",
          type: "PDFRadioGroup",
        },
        appeals: [
          {
            _id: Math.random(),
            courtAgency: {
              name: {
                value: "",
                id: "14370",
                type: "PDFTextField",
              },
              address: {
                street: {
                  value: "",
                  id: "14369",
                  type: "PDFTextField",
                },
                city: {
                  value: "",
                  id: "14368",
                  type: "PDFTextField",
                },
                zipCode: {
                  value: "",
                  id: "14365",
                  type: "PDFTextField",
                },
                country: {
                  value: "United States",
                  id: "14366",
                  type: "PDFDropdown",
                },
                state: {
                  value: "",
                  id: "14367",
                  type: "PDFDropdown",
                },
              },
            },
            finalDisposition: {
              value: "",
              id: "14364",
              type: "PDFTextField",
            },
          },
        ],
      },
    ],
    section21B: [
      {
        dateOccurred: {
          value: "",
          id: "14455",
          type: "PDFTextField",
        },
        estimated: {
          value: "NO",
          id: "14454",
          type: "PDFPDFCheckBox",
        },
        courtAgency: {
          name: {
            value: "",
            id: "14453",
            type: "PDFTextField",
          },
          address: {
            street: {
              value: "",
              id: "14452",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "14451",
              type: "PDFTextField",
            },
            zipCode: {
              value: "",
              id: "14448",
              type: "PDFTextField",
            },
            country: {
              value: "United States",
              id: "14449",
              type: "PDFDropdown",
            },
            state: {
              value: "",
              id: "14450",
              type: "PDFDropdown",
            },
          },
        },
        finalDisposition: {
          value: "",
          id: "14433",
          type: "PDFTextField",
        },
        appealed: {
          value: "NO",
          id: "14457",
          type: "PDFRadioGroup",
        },
        appeals: [
          {
            _id: Math.random(),
            courtAgency: {
              name: {
                value: "",
                id: "14447",
                type: "PDFTextField",
              },
              address: {
                street: {
                  value: "",
                  id: "14446",
                  type: "PDFTextField",
                },
                city: {
                  value: "",
                  id: "14445",
                  type: "PDFTextField",
                },
                zipCode: {
                  value: "",
                  id: "14442",
                  type: "PDFTextField",
                },
                country: {
                  value: "United States",
                  id: "14443",
                  type: "PDFDropdown",
                },
                state: {
                  value: "",
                  id: "14444",
                  type: "PDFDropdown",
                },
              },
            },
            finalDisposition: {
              value: "",
              id: "14441",
              type: "PDFTextField",
            },
          },
        ],
      },
    ],
    section21C: [
      {
        voluntary: {
          value: "NO",
          id: "14520",
          type: "PDFPDFCheckBox",
        },
        explanation: {
          value: "",
          id: "14518",
          type: "PDFTextField",
        },
        facility: {
          name: {
            value: "",
            id: "14531",
            type: "PDFTextField",
          },
          address: {
            street: {
              value: "",
              id: "14530",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "14529",
              type: "PDFTextField",
            },
            zipCode: {
              value: "",
              id: "14526",
              type: "PDFTextField",
            },
            country: {
              value: "United States",
              id: "14527",
              type: "PDFDropdown",
            },
            state: {
              value: "",
              id: "14528",
              type: "PDFDropdown",
            },
          },
        },
        fromDate: {
          value: "",
          id: "14525",
          type: "PDFTextField",
        },
        toDate: {
          value: "",
          id: "14523",
          type: "PDFTextField",
        },
        present: {
          value: "NO",
          id: "14522",
          type: "PDFPDFCheckBox",
        },
        estimatedFrom: {
          value: "NO",
          id: "14524",
          type: "PDFPDFCheckBox",
        },
        estimatedTo: {
          value: "NO",
          id: "14521",
          type: "PDFPDFCheckBox",
        },
      },
    ],
    section21D: [
      {
        diagnosis: {
          value: "",
          id: "14562",
          type: "PDFTextField",
        },
        datesOfDiagnosis: {
          fromDate: {
            value: "",
            id: "14572",
            type: "PDFTextField",
          },
          toDate: {
            value: "",
            id: "14570",
            type: "PDFTextField",
          },
          present: {
            value: "NO",
            id: "14569",
            type: "PDFPDFCheckBox",
          },
          estimatedFrom: {
            value: "NO",
            id: "14571",
            type: "PDFPDFCheckBox",
          },
          estimatedTo: {
            value: "NO",
            id: "14568",
            type: "PDFPDFCheckBox",
          },
        },
        healthCareProfessional: {
          name: {
            value: "",
            id: "14573",
            type: "PDFTextField",
          },
          telephoneFieldNumber: {
            value: "",
            id: "14565",
            type: "PDFTextField",
          },
          extension: {
            value: "",
            id: "14564",
            type: "PDFTextField",
          },
          day: {
            value: "NO",
            id: "14567",
            type: "PDFPDFCheckBox",
          },
          night: {
            value: "NO",
            id: "14566",
            type: "PDFPDFCheckBox",
          },
          internationalOrDsnPhoneFieldNumber: {
            value: "NO",
            id: "14563",
            type: "PDFPDFCheckBox",
          },
          address: {
            street: {
              value: "",
              id: "14617",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "14616",
              type: "PDFTextField",
            },
            zipCode: {
              value: "",
              id: "14613",
              type: "PDFTextField",
            },
            country: {
              value: "United States",
              id: "14614",
              type: "PDFDropdown",
            },
            state: {
              value: "",
              id: "14615",
              type: "PDFDropdown",
            },
          },
        },
        agencyOrFacility: {
          name: {
            value: "",
            id: "14601",
            type: "PDFTextField",
          },
          address: {
            street: {
              value: "",
              id: "14611",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "14610",
              type: "PDFTextField",
            },
            zipCode: {
              value: "",
              id: "14607",
              type: "PDFTextField",
            },
            country: {
              value: "United States",
              id: "14608",
              type: "PDFDropdown",
            },
            state: {
              value: "",
              id: "14609",
              type: "PDFDropdown",
            },
          },
          telephoneFieldNumber: {
            value: "",
            id: "14598",
            type: "PDFTextField",
          },
          extension: {
            value: "",
            id: "14597",
            type: "PDFTextField",
          },
          day: {
            value: "NO",
            id: "14600",
            type: "PDFPDFCheckBox",
          },
          night: {
            value: "NO",
            id: "14599",
            type: "PDFPDFCheckBox",
          },
          internationalOrDsnPhoneFieldNumber: {
            value: "NO",
            id: "14596",
            type: "PDFPDFCheckBox",
          },
        },
        counselingEffective: {
          value: "NO",
          id: "14605",
          type: "PDFRadioGroup",
        },
        counselingExplanation: {
          value: "",
          id: "14603",
          type: "PDFTextField",
        },
      },
    ],
  },
  policeRecord: {
    _id: Math.random(),
    part1Questions: {
      value: "NO",
      id: "14873",
      type: "PDFRadioGroup",
    },
    part2Questions: {
      value: "NO",
      id: "14925",
      type: "PDFRadioGroup",
    },
    restrainingOrder: {
      value: "NO",
      id: "",
      type: "PDFRadioGroup",
    },
    section22_1: [
      {
        dateOfOffense: {
          date: {
            value: "",
            id: "",
            type: "PDFTextField",
          },
          estimated: { value: "NO", id: "14920", type: "PDFPDFCheckBox" },
        },
        description: { value: "", id: "14919", type: "PDFTextField" },
        involvedDomesticViolence: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        involvedFirearms: { value: "NO", id: "14876", type: "PDFPDFCheckBox" },
        involvedAlcoholDrugs: {
          value: "NO",
          id: "14875",
          type: "PDFPDFCheckBox",
        },
        offenseLocation: {
          city: { value: "", id: "14918", type: "PDFTextField" },
          county: { value: "", id: "14878", type: "PDFTextField" },
          state: { value: "", id: "14917", type: "PDFDropdown" },
          zip: { value: "", id: "14915", type: "PDFTextField" },
          country: { value: "", id: "14916", type: "PDFDropdown" },
        },
        arrestedSummonedCited: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        lawEnforcementAgencyName: {
          value: "",
          id: "14912",
          type: "PDFTextField",
        },
        lawEnforcementLocation: {
          city: { value: "", id: "14911", type: "PDFTextField" },
          county: { value: "", id: "14879", type: "PDFTextField" },
          state: { value: "", id: "14910", type: "PDFDropdown" },
          zip: { value: "", id: "14908", type: "PDFTextField" },
          country: { value: "", id: "14909", type: "PDFDropdown" },
        },
        chargedConvicted: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        courtName: { value: "", id: "14922", type: "PDFTextField" },
        courtLocation: {
          city: { value: "", id: "14905", type: "PDFTextField" },
          county: { value: "", id: "14880", type: "PDFTextField" },
          state: { value: "", id: "14904", type: "PDFDropdown" },
          zip: { value: "", id: "14902", type: "PDFTextField" },
          country: { value: "", id: "14903", type: "PDFDropdown" },
        },
        charges: [
          {
            _id: Math.random(),
            felonyMisdemeanor: {
              value: "Felony",
              id: "14900",
              type: "PDFDropdown",
            },
            charge: { value: "", id: "14899", type: "PDFTextField" },
            outcome: { value: "", id: "14898", type: "PDFTextField" },
            dateInfo: {
              date: {
                value: "",
                id: "",
                type: "PDFTextField",
              },
              estimated: { value: "NO", id: "14897", type: "PDFTextField" },
            },
          },
        ],
        sentenced: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        sentenceDescription: { value: "", id: "14928", type: "PDFTextField" },
        imprisonmentTermExceeding1Year: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        imprisonmentLessThan1Year: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        imprisonmentDates: {
          from: { value: "", id: "14946", type: "PDFTextField" },
          to: { value: "", id: "14932", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
          present: { value: "NO", id: "14931", type: "PDFPDFCheckBox" },
        },
        probationParoleDates: {
          from: { value: "", id: "14944", type: "PDFTextField" },
          to: { value: "", id: "14942", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
          present: { value: "NO", id: "14941", type: "PDFPDFCheckBox" },
        },
        awaitingTrial: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        awaitingTrialExplanation: {
          value: "",
          id: "14936",
          type: "PDFTextField",
        },
      },
    ],
    section22_2: [
      {
        dateOfOffense: {
          date: {
            value: "",
            id: "",
            type: "PDFTextField",
          },
          estimated: { value: "NO", id: "14996", type: "PDFRadioGroup" },
        },
        description: { value: "", id: "14991", type: "PDFTextField" },
        involvedDomesticViolence: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        involvedFirearms: { value: "NO", id: "14999", type: "PDFPDFCheckBox" },
        involvedAlcoholDrugs: {
          value: "NO",
          id: "14998",
          type: "PDFPDFCheckBox",
        },
        courtName: { value: "", id: "14994", type: "PDFTextField" },
        courtLocation: {
          city: { value: "", id: "14977", type: "PDFTextField" },
          county: { value: "", id: "14952", type: "PDFTextField" },
          state: { value: "", id: "14976", type: "PDFDropdown" },
          zip: { value: "", id: "14974", type: "PDFTextField" },
          country: { value: "", id: "14975", type: "PDFDropdown" },
        },
        charges: [
          {
            _id: Math.random(),
            felonyMisdemeanor: {
              value: "Felony",
              id: "14972",
              type: "PDFDropdown",
            },
            charge: { value: "", id: "14971", type: "PDFTextField" },
            outcome: { value: "", id: "14970", type: "PDFTextField" },
            dateInfo: {
              date: {
                value: "",
                id: "",
                type: "PDFTextField",
              },
              estimated: { value: "NO", id: "14969", type: "PDFTextField" },
            },
          },
        ],
        sentenced: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        sentenceDescription: { value: "", id: "15019", type: "PDFTextField" },
        imprisonmentTermExceeding1Year: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        imprisonmentLessThan1Year: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        imprisonmentDates: {
          from: { value: "", id: "15014", type: "PDFTextField" },
          to: { value: "", id: "15012", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
          present: { value: "NO", id: "15011", type: "PDFPDFCheckBox" },
        },
        probationParoleDates: {
          from: { value: "", id: "15009", type: "PDFTextField" },
          to: { value: "", id: "15007", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
          present: { value: "NO", id: "15006", type: "PDFPDFCheckBox" },
        },
        awaitingTrial: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        awaitingTrialExplanation: {
          value: "",
          id: "15000",
          type: "PDFTextField",
        },
      },
    ],
    section22_3: [
      {
        hasRestrainingOrder: {
          value: "NO",
          id: "",
          type: "PDFRadioGroup",
        },
        orders: [
          {
            explanation: { value: "", id: "15168", type: "PDFTextField" },
            dateIssued: {
              date: {
                value: "",
                id: "",
                type: "PDFTextField",
              },
              estimated: { value: "NO", id: "15169", type: "PDFPDFCheckBox" },
            },
            courtAgencyName: { value: "", id: "15167", type: "PDFTextField" },
            courtAgencyLocation: {
              city: { value: "", id: "15166", type: "PDFTextField" },
              county: { value: "", id: "", type: "PDFTextField" },
              state: { value: "", id: "15165", type: "PDFDropdown" },
              zip: { value: "", id: "15163", type: "PDFTextField" },
              country: { value: "", id: "15164", type: "PDFDropdown" },
            },
          },
        ],
      },
    ],
  },
  drugActivity: {
    _id: Math.random(),
    hasUsed: {
      value: "NO",
      id: "15186",
      type: "PDFRadioGroup",
    },
    hasInvolvement: {
      value: "NO",
      id: "15185",
      type: "PDFRadioGroup",
    },
    illegalWhileProcessing: {
      value: "NO",
      id: "15256",
      type: "PDFRadioGroup",
    },
    usedWhilePublicSaftey: {
      value: "NO",
      id: "15255",
      type: "PDFRadioGroup",
    },
    usedNotPerscribed: {
      value: "NO",
      id: "15284",
      type: "PDFRadioGroup",
    },
    suggestedCounsoling: {
      value: "NO",
      id: "15283",
      type: "PDFRadioGroup",
    },
    voluntaryCounsoling: {
      value: "NO",
      id: "15288",
      type: "PDFRadioGroup",
    },
    section23_1: [
      {
        typeOfDrug: [
          {
            value: "Cocaine or crack cocaine (Such as rock, freebase, etc.)",
            id: "15174",
            type: "PDFCheckBox",
          },
          {
            value: "THC (Such as marijuana, weed, pot, hashish, etc.)",
            id: "15222",
            type: "PDFCheckBox",
          },
          {
            value: "Ketamine (Such as special K, jet, etc.)",
            id: "15221",
            type: "PDFCheckBox",
          },
          {
            value: "Narcotics (Such as opium, morphine, codeine, heroin, etc.)",
            id: "15220",
            type: "PDFCheckBox",
          },
          {
            value:
              "Stimulants (Such as amphetamines, speed, crystal meth, ecstasy, etc.)",
            id: "15219",
            type: "PDFCheckBox",
          },
          {
            value:
              "Depressants (Such as barbiturates, methaqualone, tranquilizers, etc.)",
            id: "15218",
            type: "PDFCheckBox",
          },
          {
            value: "Hallucinogenic (Such as LSD, PCP, mushrooms, etc.)",
            id: "15217",
            type: "PDFCheckBox",
          },
          {
            value: "Steroids (Such as the clear, juice, etc.)",
            id: "15216",
            type: "PDFCheckBox",
          },
          {
            value: "Inhalants (Such as toluene, amyl nitrate, etc.)",
            id: "15215",
            type: "PDFCheckBox",
          },
          {
            value: "Other",
            id: "15214",
            type: "PDFCheckBox",
          },
        ],
        otherDrugExplanation: { value: "", id: "15213", type: "PDFTextField" },
        firstUse: {
          date: { value: "", id: "15184", type: "PDFTextField" },
          estimated: { value: "NO", id: "15183", type: "PDFPDFCheckBox" },
        },
        mostRecentUse: {
          date: { value: "", id: "15182", type: "PDFTextField" },
          estimated: { value: "NO", id: "15181", type: "PDFPDFCheckBox" },
        },
        natureOfUseFrequencyTimes: {
          value: "",
          id: "15180",
          type: "PDFTextField",
        },
        useWhileEmployedInPublicSafety: {
          value: "NO",
          id: "15201",
          type: "PDFRadioGroup",
        },
        useWhilePossessingSecurityClearance: {
          value: "NO",
          id: "15179",
          type: "PDFRadioGroup",
        },
        intendToUseInFuture: {
          value: "NO",
          id: "15177",
          type: "PDFRadioGroup",
        },
        futureUseExplanation: { value: "", id: "15175", type: "PDFTextField" },
      },
    ],
    section23_2: [
      {
        typeOfDrug: [
          {
            value: "Cocaine or crack cocaine (Such as rock, freebase, etc.)",
            id: "15242",
            type: "PDFCheckBox",
          },
          {
            value: "THC (Such as marijuana, weed, pot, hashish, etc.)",
            id: "15241",
            type: "PDFCheckBox",
          },
          {
            value: "Ketamine (Such as special K, jet, etc.)",
            id: "15240",
            type: "PDFCheckBox",
          },
          {
            value: "Narcotics (Such as opium, morphine, codeine, heroin, etc.)",
            id: "15239",
            type: "PDFCheckBox",
          },
          {
            value:
              "Stimulants (Such as amphetamines, speed, crystal meth, ecstasy, etc.)",
            id: "15238",
            type: "PDFCheckBox",
          },
          {
            value:
              "Depressants (Such as barbiturates, methaqualone, tranquilizers, etc.)",
            id: "15237",
            type: "PDFCheckBox",
          },
          {
            value: "Hallucinogenic (Such as LSD, PCP, mushrooms, etc.)",
            id: "15236",
            type: "PDFCheckBox",
          },
          {
            value: "Steroids (Such as the clear, juice, etc.)",
            id: "15235",
            type: "PDFCheckBox",
          },
          {
            value: "Inhalants (Such as toluene, amyl nitrate, etc.)",
            id: "15234",
            type: "PDFCheckBox",
          },
          {
            value: "Other",
            id: "15233",
            type: "PDFCheckBox",
          },
        ],
        otherDrugExplanation: { value: "", id: "15272", type: "PDFTextField" },
        firstInvolvement: {
          date: { value: "", id: "15270", type: "PDFTextField" },
          estimated: { value: "NO", id: "15269", type: "PDFPDFCheckBox" },
        },
        mostRecentInvolvement: {
          date: { value: "", id: "15268", type: "PDFTextField" },
          estimated: { value: "NO", id: "15267", type: "PDFPDFCheckBox" },
        },
        natureAndFrequencyOfActivity: {
          value: "",
          id: "15271",
          type: "PDFTextField",
        },
        reasonsForActivity: { value: "", id: "15248", type: "PDFTextField" },
        involvementWhileEmployedInPublicSafety: {
          value: "NO",
          id: "15254",
          type: "PDFRadioGroup",
        },
        involvementWhilePossessingSecurityClearance: {
          value: "NO",
          id: "15252",
          type: "PDFRadioGroup",
        },
        intendToEngageInFuture: {
          value: "NO",
          id: "15250",
          type: "PDFRadioGroup",
        },
        futureEngagementExplanation: {
          value: "",
          id: "15266",
          type: "PDFTextField",
        },
      },
    ],
    section23_3: [
      {
        descriptionOfInvolvement: {
          value: "",
          id: "15277",
          type: "PDFTextField",
        },
        NumberOfTimesInvolved: { value: "", id: "15278", type: "PDFTextField" },
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
      },
      {
        descriptionOfInvolvement: {
          value: "",
          id: "15301",
          type: "PDFTextField",
        },
        NumberOfTimesInvolved: { value: "", id: "15302", type: "PDFTextField" },
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
      },
    ],
    section23_4: [
      {
        descriptionOfInvolvement: {
          value: "",
          id: "15285",
          type: "PDFTextField",
        },
        NumberOfTimesInvolved: { value: "", id: "15286", type: "PDFTextField" },
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
      },
      {
        descriptionOfInvolvement: {
          value: "",
          id: "15289",
          type: "PDFTextField",
        },
        NumberOfTimesInvolved: { value: "", id: "15290", type: "PDFTextField" },
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
      },
    ],
    section23_5: [
      {
        nameOfPrescriptionDrug: {
          value: "",
          id: "15310",
          type: "PDFTextField",
        },
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        reasonsForMisuse: { value: "", id: "15311", type: "PDFTextField" },
        involvementWhileEmployedInPublicSafety: {
          value: "NO",
          id: "15309",
          type: "PDFRadioGroup",
        },
        involvementWhilePossessingSecurityClearance: {
          value: "NO",
          id: "15331",
          type: "PDFRadioGroup",
        },
      },
      {
        nameOfPrescriptionDrug: {
          value: "",
          id: "15329",
          type: "PDFTextField",
        },
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        reasonsForMisuse: { value: "", id: "15330", type: "PDFTextField" },
        involvementWhileEmployedInPublicSafety: {
          value: "NO",
          id: "15328",
          type: "PDFRadioGroup",
        },
        involvementWhilePossessingSecurityClearance: {
          value: "NO",
          id: "15325",
          type: "PDFRadioGroup",
        },
      },
    ],
    section23_6: [
      {
        orderedBy: [
          {
            value:
              "An employer, military commander, or employee assistance program",
            id: "15366",
            type: "PDFRadioGroup",
          },
          {
            value: "A court official / judge",
            id: "15363",
            type: "PDFRadioGroup",
          },
          {
            value: "A medical professional",
            id: "15365",
            type: "PDFRadioGroup",
          },
          {
            value:
              "I have not been ordered, advised, or asked to seek counseling or treatment by any of the above.",
            id: "15362",
            type: "PDFRadioGroup",
          },
          {
            value: "A mental health professional",
            id: "15364",
            type: "PDFRadioGroup",
          },
        ],
        orderedExplanation: { value: "", id: "15361", type: "PDFTextField" },
        receivedTreatment: { value: "NO", id: "15359", type: "PDFRadioGroup" },
        noTreatmentExplanation: {
          value: "",
          id: "15358",
          type: "PDFTextField",
        },
        typeOfDrug: [
          {
            value: "Cocaine or crack cocaine (Such as rock, freebase, etc.)",
            id: "15341",
            type: "PDFRadioGroup",
          },
          {
            value: "THC (Such as marijuana, weed, pot, hashish, etc.)",
            id: "15340",
            type: "PDFRadioGroup",
          },
          {
            value: "Ketamine (Such as special K, jet, etc.)",
            id: "15339",
            type: "PDFRadioGroup",
          },
          {
            value: "Narcotics (Such as opium, morphine, codeine, heroin, etc.)",
            id: "15338",
            type: "PDFRadioGroup",
          },
          {
            value:
              "Stimulants (Such as amphetamines, speed, crystal meth, ecstasy, etc.)",
            id: "15337",
            type: "PDFRadioGroup",
          },
          {
            value:
              "Depressants (Such as barbiturates, methaqualone, tranquilizers, etc.)",
            id: "15336",
            type: "PDFRadioGroup",
          },
          {
            value: "Hallucinogenic (Such as LSD, PCP, mushrooms, etc.)",
            id: "15335",
            type: "PDFRadioGroup",
          },
          {
            value: "Steroids (Such as the clear, juice, etc.)",
            id: "15334",
            type: "PDFRadioGroup",
          },
          {
            value: "Inhalants (Such as toluene, amyl nitrate, etc.)",
            id: "15333",
            type: "PDFRadioGroup",
          },
          { value: "Other", id: "15332", type: "PDFRadioGroup" },
        ],
        otherDrugExplanation: { value: "", id: "15342", type: "PDFTextField" },
        treatmentProviderName: {
          lastName: { value: "", id: "15352", type: "PDFTextField" },
          firstName: { value: "", id: "15351", type: "PDFTextField" },
        },
        treatmentProviderAddress: {
          street: { value: "", id: "15357", type: "PDFTextField" },
          city: { value: "", id: "15356", type: "PDFTextField" },
          state: { value: "", id: "15355", type: "PDFDropdown" },
          zipCode: { value: "", id: "15353", type: "PDFTextField" },
          country: { value: "", id: "15354", type: "PDFDropdown" },
        },
        treatmentProviderPhone: {
          number: { value: "", id: "15350", type: "PDFTextField" },
          international: { value: "NO", id: "15348", type: "PDFPDFCheckBox" },
          timeOfDay: { value: "Day", id: "15347", type: "PDFPDFCheckBox" },
        },
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        successfullyCompleted: {
          value: "NO",
          id: "15345",
          type: "PDFRadioGroup",
        },
        completionExplanation: { value: "", id: "15343", type: "PDFTextField" },
      },
    ],
    section23_7: [
      {
        typeOfDrug: [
          {
            value: "Cocaine or crack cocaine (Such as rock, freebase, etc.)",
            id: "15480",
            type: "PDFRadioGroup",
          },
          {
            value: "THC (Such as marijuana, weed, pot, hashish, etc.)",
            id: "15479",
            type: "PDFRadioGroup",
          },
          {
            value: "Ketamine (Such as special K, jet, etc.)",
            id: "15478",
            type: "PDFRadioGroup",
          },
          {
            value: "Narcotics (Such as opium, morphine, codeine, heroin, etc.)",
            id: "15477",
            type: "PDFRadioGroup",
          },
          {
            value:
              "Stimulants (Such as amphetamines, speed, crystal meth, ecstasy, etc.)",
            id: "15476",
            type: "PDFRadioGroup",
          },
          {
            value:
              "Depressants (Such as barbiturates, methaqualone, tranquilizers, etc.)",
            id: "15475",
            type: "PDFRadioGroup",
          },
          {
            value: "Hallucinogenic (Such as LSD, PCP, mushrooms, etc.)",
            id: "15474",
            type: "PDFRadioGroup",
          },
          {
            value: "Steroids (Such as the clear, juice, etc.)",
            id: "15473",
            type: "PDFRadioGroup",
          },
          {
            value: "Inhalants (Such as toluene, amyl nitrate, etc.)",
            id: "15472",
            type: "PDFRadioGroup",
          },
          { value: "Other", id: "15471", type: "PDFRadioGroup" },
        ],
        otherDrugExplanation: { value: "", id: "15470", type: "PDFTextField" },
        treatmentProviderName: {
          lastName: { value: "", id: "15421", type: "PDFTextField" },
          firstName: { value: "", id: "15420", type: "PDFTextField" },
        },
        treatmentProviderAddress: {
          street: { value: "", id: "15436", type: "PDFTextField" },
          city: { value: "", id: "15435", type: "PDFTextField" },
          state: { value: "", id: "15434", type: "PDFDropdown" },
          zipCode: { value: "", id: "15432", type: "PDFTextField" },
          country: { value: "", id: "15433", type: "PDFDropdown" },
        },
        treatmentProviderPhone: {
          number: { value: "", id: "15426", type: "PDFTextField" },
          international: { value: "NO", id: "15424", type: "PDFPDFCheckBox" },
          timeOfDay: { value: "Day", id: "15423", type: "PDFPDFCheckBox" },
        },
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        successfullyCompleted: {
          value: "NO",
          id: "15419",
          type: "PDFRadioGroup",
        },
        completionExplanation: { value: "", id: "15417", type: "PDFTextField" },
      },
    ],
  },
  alcoholUse: {
    _id: Math.random(),
    negativeImpact: {
      value: "NO",
      id: "15504",
      type: "PDFRadioGroup",
    },
    suggestedCounseling: {
      value: "NO",
      id: "15570",
      type: "PDFRadioGroup",
    },
    voluntaryCounseling: {
      value: "NO",
      id: "15582",
      type: "PDFRadioGroup",
    },
    additionalCounseling: {
      value: "NO",
      id: "15641",
      type: "PDFRadioGroup",
    },
    section24_1: [
      {
        _id: Math.random(),
        negativeImpactDate: {
          date: { value: "", id: "15282", type: "PDFTextField" },
          estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
        },
        datesOfInvolvement: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        circumstances: {
          value: "",
          id: "15500",
          type: "PDFTextField",
        },
        negativeImpact: {
          value: "",
          id: "15499",
          type: "PDFTextField",
        },
      },
      {
        _id: Math.random(),
        negativeImpactDate: {
          date: { value: "", id: "15282", type: "PDFTextField" },
          estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
        },
        datesOfInvolvement: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        circumstances: {
          value: "",
          id: "15491",
          type: "PDFTextField",
        },
        negativeImpact: {
          value: "",
          id: "15490",
          type: "PDFTextField",
        },
      },
      {
        _id: Math.random(),
        negativeImpactDate: {
          date: { value: "", id: "15282", type: "PDFTextField" },
          estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
        },
        datesOfInvolvement: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        circumstances: {
          value: "",
          id: "15482",
          type: "PDFTextField",
        },
        negativeImpact: {
          value: "",
          id: "15481",
          type: "PDFTextField",
        },
      },
      {
        _id: Math.random(),
        negativeImpactDate: {
          date: { value: "", id: "15282", type: "PDFTextField" },
          estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
        },
        datesOfInvolvement: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        circumstances: {
          value: "",
          id: "15512",
          type: "PDFTextField",
        },
        negativeImpact: {
          value: "",
          id: "15511",
          type: "PDFTextField",
        },
      },
    ],
    section24_2: [
      {
        _id: Math.random(),
        orderedBy: {
          value:
            "An employer, military commander, or employee assistance program",
          id: "15579",
          type: "PDFRadioGroup",
        },
        actionTaken: { value: "NO", id: "15564", type: "PDFRadioGroup" },
        noActionExplanation: {
          value: "",
          id: "15563",
          type: "PDFTextField",
        },
        actionDetails: {
          dateRange: {
            from: {
              date: { value: "", id: "15282", type: "PDFTextField" },
              estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
            },
            to: {
              date: { value: "", id: "15280", type: "PDFTextField" },
              estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
            },
            present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
          },
          providerName: {
            value: "",
            id: "15557",
            type: "PDFTextField",
          },
          providerAddress: {
            street: {
              value: "",
              id: "15562",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "15561",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "15560",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "15558",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "15559",
              type: "PDFDropdown",
            },
          },
          providerPhone: {
            number: {
              value: "",
              id: "15567",
              type: "PDFTextField",
            },
            isInternationalOrDSN: {
              value: "NO",
              id: "15573",
              type: "PDFPDFCheckBox",
            },
            timeOfDay: {
              value: "Day",
              id: "15572",
              type: "PDFPDFCheckBox",
            },
            extension: {
              value: "",
              id: "15568",
              type: "PDFTextField",
            },
          },

          treatmentCompletion: {
            value: "NO",
            id: "15556",
            type: "PDFRadioGroup",
          },
          completionExplanation: {
            value: "",
            id: "15554",
            type: "PDFTextField",
          },
        },
      },
    ],
    section24_3: [
      {
        _id: Math.random(),
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        providerName: {
          value: "",
          id: "15611",
          type: "PDFTextField",
        },
        providerAddress: {
          street: {
            value: "",
            id: "15621",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "15620",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "15619",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "15617",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "15618",
            type: "PDFDropdown",
          },
        },
        providerPhone: {
          number: {
            value: "",
            id: "15616",
            type: "PDFTextField",
          },
          isInternationalOrDSN: {
            value: "NO",
            id: "15614",
            type: "PDFPDFCheckBox",
          },
          timeOfDay: {
            value: "Day",
            id: "15613",
            type: "PDFPDFCheckBox",
          },
          extension: {
            value: "",
            id: "15615",
            type: "PDFTextField",
          },
        },
        treatmentCompletion: {
          value: "NO",
          id: "15605",
          type: "PDFRadioGroup",
        },
        completionExplanation: {
          value: "",
          id: "15603",
          type: "PDFTextField",
        },
      },
    ],
    section24_4: [
      {
        _id: Math.random(),
        counselorName: {
          value: "",
          id: "15591",
          type: "PDFTextField",
        },
        counselorAddress: {
          street: {
            value: "",
            id: "15601",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "15600",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "15599",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "15597",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "15598",
            type: "PDFDropdown",
          },
        },
        agencyName: {
          value: "",
          id: "15622",
          type: "PDFTextField",
        },
        agencyAddress: {
          street: {
            value: "",
            id: "15633",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "15632",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "15631",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "15629",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "15630",
            type: "PDFDropdown",
          },
        },
        dateRange: {
          from: {
            date: { value: "", id: "15282", type: "PDFTextField" },
            estimated: { value: "NO", id: "15279", type: "PDFPDFCheckBox" },
          },
          to: {
            date: { value: "", id: "15280", type: "PDFTextField" },
            estimated: { value: "NO", id: "15281", type: "PDFPDFCheckBox" },
          },
          present: { value: "NO", id: "15275", type: "PDFPDFCheckBox" },
        },
        treatmentCompletion: {
          value: "NO",
          id: "15665",
          type: "PDFRadioGroup",
        },
        completionExplanation: {
          value: "",
          id: "15663",
          type: "PDFTextField",
        },
      },
    ],
  },
  investigationsInfo: {
    _id: Math.random(),
    governmentInvestigated: {
      value: "NO",
      id: "15692",
      type: "PDFRadioGroup",
    },
    revocation: {
      value: "NO",
      id: "15736",
      type: "PDFRadioGroup",
    },
    debarred: {
      value: "NO",
      id: "15730",
      type: "PDFRadioGroup",
    },
    section25_1: [
      {
        _id: Math.random(),
        investigatingAgency: {
          _id: Math.random(),
          agency: {
            value: "U.S. Department of Defense",
            id: "15690",
            type: "PDFRadioGroup",
          },
          explanation: { value: "", id: "", type: "PDFTextField" },
        },
        otherAgency: {
          value: "",
          id: "15728",
          type: "PDFTextField",
        },
        issuedAgency: {
          value: "",
          id: "15680",
          type: "PDFTextField",
        },
        investigationCompletionDate: {
          date: {
            value: "",
            id: "15727",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15726",
            type: "PDFPDFCheckBox",
          },
          unknown: {
            value: "NO",
            id: "15725",
            type: "PDFPDFCheckBox",
          },
        },

        clearanceEligibilityDate: {
          date: { value: "", id: "15724", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "15723",
            type: "PDFPDFCheckBox",
          },
          unknown: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        levelOfClearance: [
          {
            _id: Math.random(),
            level: {
              value: "None",
              id: "15679",
              type: "PDFTextField",
            },
            explanation: {
              value: "NO",
              id: "",
              type: "PDFTextField",
            },
          },
        ],
      },
    ],
    section25_2: [
      {
        denialDate: {
          date: { value: "", id: "15734", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "15733",
            type: "PDFPDFCheckBox",
          },
        },
        agency: {
          value: "",
          id: "15732",
          type: "PDFTextField",
        },
        explanation: {
          value: "",
          id: "15732",
          type: "PDFTextField",
        },
      },
    ],
    section25_3: [
      {
        debarmentDate: {
          date: { value: "", id: "15741", type: "PDFTextField" },
          estimated: {
            value: "NO",
            id: "15742",
            type: "PDFPDFCheckBox",
          },
        },
        agency: {
          value: "",
          id: "15743",
          type: "PDFTextField",
        },
        explanation: {
          value: "",
          id: "15737",
          type: "PDFTextField",
        },
      },
    ],
  },
  finances: {
    _id: Math.random(),
    filedBankruptcy: {
      value: "NO",
      id: "15803",
      type: "PDFRadioGroup",
    },
    gamblingProblem: {
      value: "NO",
      id: "15862",
      type: "PDFRadioGroup",
    },
    missedTaxes: {
      value: "NO",
      id: "15843",
      type: "PDFRadioGroup",
    },
    companyViolation: {
      value: "NO",
      id: "15911",
      type: "PDFRadioGroup",
    },
    counseling: {
      value: "NO",
      id: "15885",
      type: "PDFRadioGroup",
    },
    delinquent: {
      value: "NO",
      id: "15939",
      type: "PDFRadioGroup",
    },
    reposessions: {
      value: "NO",
      id: "",
      type: "",
    },
    section26_1: [
      {
        _id: Math.random(),
        bankruptcyPetitionType: {
          value: "Chapter 7",
          id: "",
          type: "PDFRadioGroup",
        },
        courtDocketNumber: {
          value: "",
          id: "15808",
          type: "PDFTextField",
        },
        dateFiled: {
          date: {
            value: "",
            id: "15807",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15798",
            type: "PDFPDFCheckBox",
          },
        },
        dateDischarged: {
          date: {
            value: "",
            id: "15797",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15806",
            type: "PDFPDFCheckBox",
          },
          notApplicable: {
            value: "NO",
            id: "15796",
            type: "PDFPDFCheckBox",
          },
        },
        amountInvolved: {
          amount: {
            value: 0,
            id: "15795",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15794",
            type: "PDFPDFCheckBox",
          },
        },
        debtRecordedUnder: {
          lastName: {
            value: "",
            id: "15786",
            type: "PDFTextField",
          },
          firstName: {
            value: "",
            id: "15785",
            type: "PDFTextField",
          },
          middleName: {
            value: "",
            id: "15787",
            type: "PDFTextField",
          },
          suffix: {
            value: "",
            id: "15788",
            type: "PDFDropdown",
          },
        },
        courtName: {
          value: "",
          id: "15777",
          type: "PDFTextField",
        },
        courtAddress: {
          street: {
            value: "",
            id: "15793",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "15792",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "15791",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "15789",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "15790",
            type: "PDFDropdown",
          },
        },
        chapter13Details: {
          trusteeName: {
            value: "",
            id: "15779",
            type: "PDFTextField",
          },
          trusteeAddress: {
            street: {
              value: "",
              id: "15784",
              type: "PDFTextField",
            },
            city: {
              value: "",
              id: "15783",
              type: "PDFTextField",
            },
            state: {
              value: "",
              id: "15782",
              type: "PDFDropdown",
            },
            zipCode: {
              value: "",
              id: "15780",
              type: "PDFTextField",
            },
            country: {
              value: "",
              id: "15781",
              type: "PDFDropdown",
            },
          },
        },
        dischargedOfAllDebts: {
          value: "NO",
          id: "15776",
          type: "PDFRadioGroup",
        },
        dischargeExplanation: {
          value: "",
          id: "15778",
          type: "PDFTextField",
        },
      },
    ],
    section26_2: [
      {
        _id: Math.random(),
        financialProblemsDueToGambling: {
          value: "NO",
          id: "15862",
          type: "PDFRadioGroup",
        },
        dateRange: {
          from: {
            date: {
              value: "",
              id: "15858",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "15857",
              type: "PDFPDFCheckBox",
            },
          },
          to: {
            date: {
              value: "",
              id: "15856",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "15855",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "15859",
            type: "PDFPDFCheckBox",
          },
        },
        gamblingLosses: {
          amount: {
            value: 0,
            id: "15860",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        descriptionOfFinancialProblems: {
          value: "",
          id: "15861",
          type: "PDFTextField",
        },
        actionsTaken: {
          value: "",
          id: "15854",
          type: "PDFTextField",
        },
      },
    ],
    section26_3: [
      {
        _id: Math.random(),
        failedToFileOrPay: {
          value: "File",
          id: "15842",
          type: "PDFRadioGroup",
        },
        yearFailed: {
          date: {
            value: "",
            id: "15845",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFCheckbox",
          },
        },
        failureReason: {
          value: "",
          id: "15834",
          type: "PDFTextField",
        },
        agencyName: {
          value: "",
          id: "15836",
          type: "PDFTextField",
        },
        taxType: {
          value: "",
          id: "15833",
          type: "PDFTextField",
        },
        amountInvolved: {
          amount: {
            value: 0,
            id: "15832",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15831",
            type: "PDFPDFCheckBox",
          },
        },
        dateSatisfied: {
          date: {
            value: "",
            id: "15838",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15839",
            type: "PDFPDFCheckBox",
          },
        },
        actionsTaken: {
          value: "",
          id: "15835",
          type: "PDFTextField",
        },
      },
    ],
    section26_4: [
      {
        _id: Math.random(),
        agencyOrCompanyName: {
          value: "",
          id: "15907",
          type: "PDFTextField",
        },
        agencyOrCompanyAddress: {
          street: {
            value: "",
            id: "15906",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "15905",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "15904",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "15902",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "15903",
            type: "PDFDropdown",
          },
        },
        counselingWarningDisciplinaryDate: {
          date: {
            value: "",
            id: "15909",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15908",
            type: "PDFPDFCheckBox",
          },
        },
        counselingWarningDisciplinaryReason: {
          value: "",
          id: "15901",
          type: "PDFTextField",
        },
        violationAmount: {
          amount: {
            value: 0,
            id: "15899",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        rectifyingActions: {
          value: "",
          id: "15910",
          type: "PDFTextField",
        },
      },
    ],
    section26_5: [
      {
        _id: Math.random(),
        explanation: {
          value: "",
          id: "15883",
          type: "PDFTextField",
        },
        creditCounselingOrganizationName: {
          value: "",
          id: "15875",
          type: "PDFTextField",
        },
        creditCounselingOrganizationPhoneNumber: {
          number: {
            value: "",
            id: "15880",
            type: "PDFTextField",
          },
          extension: {
            value: "",
            id: "15879",
            type: "PDFTextField",
          },
          isInternationalOrDSN: {
            value: "NO",
            id: "15878",
            type: "PDFPDFCheckBox",
          },
          timeOfDay: {
            value: "Day",
            id: "15877",
            type: "PDFPDFCheckBox",
          },
        },
        creditCounselingOrganizationLocation: {
          street: {
            value: "",
            id: "15882",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "15882",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "15881",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "15882",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "15881",
            type: "PDFDropdown",
          },
        },
        counselingActions: {
          value: "",
          id: "15884",
          type: "PDFTextField",
        },
      },
    ],
    section26_6: [
      {
        _id: Math.random(),
        agencyName: {
          value: "",
          id: "15921",
          type: "PDFTextField",
        },
        doesInclude: {
          value: "NO",
          id: "15914",
          type: "PDFRadioGroup",
        },
        financialIssueTypes: [
          {
            _id: Math.random(),
            type: {
              value: "Delinquent on alimony or child support payments",
              id: "15919",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "Judgment entered against you",
              id: "15918",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "Lien placed against your property",
              id: "15917",
              type: "PDFPDFCheckBox",
            },
          },
          {
            _id: Math.random(),
            type: {
              value: "Currently delinquent on any Federal debt",
              id: "15916",
              type: "PDFPDFCheckBox",
            },
          },
        ],
        loanAccountNumbers: {
          value: "",
          id: "15937",
          type: "PDFTextField",
        },
        propertyInvolved: {
          value: "",
          id: "15934",
          type: "PDFTextField",
        },
        amountInvolved: {
          amount: {
            value: 0,
            id: "15935",
            type: "PDFTextField",
          },

          estimated: {
            value: "NO",
            id: "15936",
            type: "PDFPDFCheckBox",
          },
        },
        issueReason: {
          value: "",
          id: "15933",
          type: "PDFTextField",
        },
        currentStatus: {
          value: "",
          id: "15932",
          type: "PDFTextField",
        },
        issueDate: {
          date: {
            value: "",
            id: "15931",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15930",
            type: "PDFPDFCheckBox",
          },
        },
        resolutionDate: {
          date: {
            value: "",
            id: "15929",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15928",
            type: "PDFPDFCheckBox",
          },
          notApplicable: {
            value: "NO",
            id: "15927",
            type: "PDFPDFCheckBox",
          },
        },
        courtName: {
          value: "",
          id: "15927",
          type: "PDFTextField",
        },
        courtAddress: {
          street: {
            value: "",
            id: "15926",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "15925",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "15924",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "15922",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "15923",
            type: "PDFDropdown",
          },
        },
        actionsTaken: {
          value: "",
          id: "15938",
          type: "PDFTextField",
        },
      },
    ],
    section26_7: [
      {
        _id: Math.random(),
        agencyName: {
          value: "",
          id: "15949",
          type: "PDFTextField",
        },
        doesInclude: {
          value: "NO",
          id: "15942",
          type: "PDFRadioGroup",
        },
        financialIssueTypes: [
          {
            _id: Math.random(),
            type: {
              value: "Repossessed or foreclosed property",
              id: "15947",
              type: "PDFPDFCheckBox",
            },
          },
        ],

        loanAccountNumbers: {
          value: "",
          id: "15965",
          type: "PDFTextField",
        },
        propertyInvolved: {
          value: "",
          id: "15962",
          type: "PDFTextField",
        },
        amountInvolved: {
          amount: {
            value: 0,
            id: "15963",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "15964",
            type: "PDFPDFCheckBox",
          },
        },
        issueReason: {
          value: "",
          id: "15961",
          type: "PDFTextField",
        },
        currentStatus: {
          value: "",
          id: "15960",
          type: "PDFTextField",
        },
        issueDate: {
          date: {
            value: "",
            id: "15959",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
          notApplicable: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        resolutionDate: {
          date: {
            value: "",
            id: "15957",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
          notApplicable: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        courtName: {
          value: "",
          id: "15955",
          type: "PDFTextField",
        },
        courtAddress: {
          street: {
            value: "",
            id: "15954",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "15953",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "15952",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "15950",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "15951",
            type: "PDFDropdown",
          },
        },
        actionsTaken: {
          value: "",
          id: "15966",
          type: "PDFTextField",
        },
      },
    ],
  },
  technology: {
    _id: Math.random(),
    illegalAccess: {
      value: "NO",
      id: "16027",
      type: "PDFRadioGroup",
    },
    illegalModification: {
      value: "NO",
      id: "16029",
      type: "PDFRadioGroup",
    },
    unauthorizedUse: {
      value: "NO",
      id: "16059",
      type: "PDFRadioGroup",
    },
    section27_1: [
      {
        _id: Math.random(),
        incidentDate: {
          date: {
            value: "",
            id: "16019",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "16020",
            type: "PDFPDFCheckBox",
          },
        },
        description: {
          value: "",
          id: "16018",
          type: "PDFTextField",
        },
        location: {
          street: {
            value: "",
            id: "16026",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16025",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16024",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16022",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16023",
            type: "PDFDropdown",
          },
        },
        actionDescription: {
          value: "",
          id: "16021",
          type: "PDFTextField",
        },
      },
      {
        _id: Math.random(),
        incidentDate: {
          date: {
            value: "",
            id: "16019",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "16020",
            type: "PDFPDFCheckBox",
          },
        },
        description: {
          value: "",
          id: "16049",
          type: "PDFTextField",
        },
        location: {
          street: {
            value: "",
            id: "16057",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16056",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16055",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16053",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16054",
            type: "PDFDropdown",
          },
        },
        actionDescription: {
          value: "",
          id: "16052",
          type: "PDFTextField",
        },
      },
    ],
    section27_2: [
      {
        _id: Math.random(),
        incidentDate: {
          date: {
            value: "",
            id: "16019",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "16020",
            type: "PDFPDFCheckBox",
          },
        },
        description: {
          value: "",
          id: "16040",
          type: "PDFTextField",
        },
        location: {
          street: {
            value: "",
            id: "16048",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16047",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16046",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16044",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16045",
            type: "PDFDropdown",
          },
        },
        actionDescription: {
          value: "",
          id: "16043",
          type: "PDFTextField",
        },
      },
      {
        _id: Math.random(),
        incidentDate: {
          date: {
            value: "",
            id: "",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "",
            type: "PDFPDFCheckBox",
          },
        },
        description: {
          value: "",
          id: "16031",
          type: "PDFTextField",
        },
        location: {
          street: {
            value: "",
            id: "16039",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16038",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16037",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16035",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16036",
            type: "PDFDropdown",
          },
        },
        actionDescription: {
          value: "",
          id: "16034",
          type: "PDFTextField",
        },
      },
    ],
    section27_3: [
      {
        _id: Math.random(),
        incidentDate: {
          date: {
            value: "",
            id: "16019",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "16020",
            type: "PDFPDFCheckBox",
          },
        },
        description: {
          value: "",
          id: "16070",
          type: "PDFTextField",
        },
        location: {
          street: {
            value: "",
            id: "16078",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16077",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16076",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16074",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16075",
            type: "PDFDropdown",
          },
        },
        actionDescription: {
          value: "",
          id: "16073",
          type: "PDFTextField",
        },
      },
      {
        _id: Math.random(),
        incidentDate: {
          date: {
            value: "",
            id: "16019",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "16020",
            type: "PDFPDFCheckBox",
          },
        },
        description: {
          value: "",
          id: "16061",
          type: "PDFTextField",
        },
        location: {
          street: {
            value: "",
            id: "16069",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16068",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16067",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16065",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16066",
            type: "PDFDropdown",
          },
        },
        actionDescription: {
          value: "",
          id: "16064",
          type: "PDFTextField",
        },
      },
    ],
  },
  civil: {
    _id: Math.random(),
    civilCourt: {
      value: "NO",
      id: "16098",
      type: "PDFRadioGroup",
    },
    section28_1: [
      {
        dateOfAction: {
          date: {
            value: "",
            id: "16019",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "16020",
            type: "PDFPDFCheckBox",
          },
        },
        courtName: {
          value: "",
          id: "16095",
          type: "PDFTextField",
        },
        courtAddress: {
          street: {
            value: "",
            id: "16092",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16091",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16090",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16088",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16089",
            type: "PDFDropdown",
          },
        },
        description: {
          value: "",
          id: "",
          type: "PDFTextField",
        },
        details: {
          value: "",
          id: "",
          type: "PDFTextField",
        },
        principalParties: [
          {
            _id: Math.random(),
            name: {
              value: "",
              id: "16093",
              type: "PDFTextField",
            },
          },
        ],
      },
      {
        dateOfAction: {
          date: {
            value: "",
            id: "16019",
            type: "PDFTextField",
          },
          estimated: {
            value: "NO",
            id: "16020",
            type: "PDFPDFCheckBox",
          },
        },
        courtName: {
          value: "",
          id: "16084",
          type: "PDFTextField",
        },
        courtAddress: {
          street: {
            value: "",
            id: "16081",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16080",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16104",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16102",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16103",
            type: "PDFDropdown",
          },
        },
        description: {
          value: "",
          id: "",
          type: "PDFTextField",
        },
        details: {
          value: "",
          id: "",
          type: "PDFTextField",
        },
        principalParties: [
          {
            _id: Math.random(),
            name: {
              value: "",
              id: "16082",
              type: "PDFTextField",
            },
          },
        ],
      },
    ],
  },
  association: {
    _id: Math.random(),
    terrorismMember: {
      value: "NO",
      id: "16137",
      type: "PDFRadioGroup",
    },
    actsOfTerrorism: {
      value: "NO",
      id: "16164",
      type: "PDFRadioGroup",
    },
    overthrowByForce: {
      value: "NO",
      id: "16157",
      type: "PDFRadioGroup",
    },
    dedicatedViolent: {
      value: "NO",
      id: "16225",
      type: "PDFRadioGroup",
    },
    advocatesViolence: {
      value: "NO",
      id: "",
      type: "",
    },
    engagedInOverthrow: {
      value: "NO",
      id: "16240",
      type: "PDFRadioGroup",
    },
    terrorismAssociate: {
      value: "NO",
      id: "16284",
      type: "PDFRadioGroup",
    },
    section29_1: [
      {
        activityDescription: {
          value: "",
          id: "16133",
          type: "PDFTextField",
        },
        dateRange: {
          from: {
            date: {
              value: "",
              id: "16124",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16123",
              type: "PDFPDFCheckBox",
            },
          },
          to: {
            date: {
              value: "",
              id: "16122",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16121",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "16125",
            type: "PDFPDFCheckBox",
          },
        },
      },
    ],
    section29_2: [
      {
        organizationName: {
          value: "",
          id: "16135",
          type: "PDFTextField",
        },
        organizationAddress: {
          street: {
            value: "",
            id: "16130",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16129",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16128",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16126",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16127",
            type: "PDFDropdown",
          },
        },
        involvementDateRange: {
          from: {
            date: {
              value: "",
              id: "16124",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16123",
              type: "PDFPDFCheckBox",
            },
          },
          to: {
            date: {
              value: "",
              id: "16122",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16121",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "16125",
            type: "PDFPDFCheckBox",
          },
        },
        positionsHeld: {
          value: "",
          id: "16136",
          type: "PDFTextField",
        },
        contributions: {
          value: "",
          id: "16134",
          type: "PDFTextField",
        },
        natureOfInvolvement: {
          value: "",
          id: "16133",
          type: "PDFTextField",
        },
      },
    ],
    section29_3: [
      {
        reasonsForAdvocacy: {
          value: "",
          id: "16166",
          type: "PDFTextField",
        },
        dateRange: {
          from: {
            date: {
              value: "",
              id: "16149",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16148",
              type: "PDFPDFCheckBox",
            },
          },
          to: {
            date: {
              value: "",
              id: "16147",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16146",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "16150",
            type: "PDFPDFCheckBox",
          },
        },
      },
    ],
    section29_4: [
      {
        organizationName: {
          value: "",
          id: "16183",
          type: "PDFTextField",
        },
        organizationAddress: {
          street: {
            value: "",
            id: "16178",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16177",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16176",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16174",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16175",
            type: "PDFDropdown",
          },
        },
        involvementDateRange: {
          from: {
            date: {
              value: "",
              id: "16172",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16171",
              type: "PDFPDFCheckBox",
            },
          },
          to: {
            date: {
              value: "",
              id: "16170",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16169",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "16173",
            type: "PDFPDFCheckBox",
          },
        },
        positionsHeld: {
          value: "",
          id: "16184",
          type: "PDFTextField",
        },
        contributions: {
          value: "",
          id: "16182",
          type: "PDFTextField",
        },
        natureOfInvolvement: {
          value: "",
          id: "16181",
          type: "PDFTextField",
        },
      },
    ],
    section29_5: [
      {
        organizationName: {
          value: "",
          id: "16218",
          type: "PDFTextField",
        },
        organizationAddress: {
          street: {
            value: "",
            id: "16213",
            type: "PDFTextField",
          },
          city: {
            value: "",
            id: "16212",
            type: "PDFTextField",
          },
          state: {
            value: "",
            id: "16211",
            type: "PDFDropdown",
          },
          zipCode: {
            value: "",
            id: "16209",
            type: "PDFTextField",
          },
          country: {
            value: "",
            id: "16210",
            type: "PDFDropdown",
          },
        },
        involvementDateRange: {
          from: {
            date: {
              value: "",
              id: "16207",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16206",
              type: "PDFPDFCheckBox",
            },
          },
          to: {
            date: {
              value: "",
              id: "16205",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16204",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "16208",
            type: "PDFPDFCheckBox",
          },
        },
        positionsHeld: {
          value: "",
          id: "16219",
          type: "PDFTextField",
        },
        contributions: {
          value: "",
          id: "16217",
          type: "PDFTextField",
        },
        natureOfInvolvement: {
          value: "",
          id: "16216",
          type: "PDFTextField",
        },
      },
    ],
    section29_6: [
      {
        activityDescription: {
          value: "",
          id: "16246",
          type: "PDFTextField",
        },
        dateRange: {
          from: {
            date: {
              value: "",
              id: "16244",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16243",
              type: "PDFPDFCheckBox",
            },
          },
          to: {
            date: {
              value: "",
              id: "16242",
              type: "PDFTextField",
            },
            estimated: {
              value: "NO",
              id: "16241",
              type: "PDFPDFCheckBox",
            },
          },
          present: {
            value: "NO",
            id: "16245",
            type: "PDFPDFCheckBox",
          },
        },
      },
    ],
    section29_7: [
      {
        explanation: {
          value: "",
          id: "16255",
          type: "PDFTextField",
        },
      },
      {
        explanation: {
          value: "",
          id: "16254",
          type: "PDFTextField",
        },
      },
    ],
  },
  signature: {
    _id: Math.random(),
    information: {
      value: "NO",
      id: "",
      type: "",
    },
    medical: {
      value: "NO",
      id: "",
      type: "",
    },
    credit: {
      value: "NO",
      id: "",
      type: "",
    },
  },
  print: {
    value: "NO",
    id: "",
    type: "",
  },
};

export default defaultFormData;
