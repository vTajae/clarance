import json


def set_ids_to_empty(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if (key == 'id' or key == 'value'):
                data[key] = ""
            elif isinstance(value, dict):
                set_ids_to_empty(value)
            elif isinstance(value, list):
                for item in value:
                    set_ids_to_empty(item)


# Example data structure

data = {
    "_id": 1,
    "neverEntered": {
      "value": "Yes",
      "id": "11749",
      "type": "PDFCheckBox"
    },
    "currentlyIn": {
      "value": "Yes",
      "id": "11749",
      "type": "PDFCheckBox"
    },
    "separated": {
      "value": "Yes",
      "id": "11748",
      "type": "PDFCheckBox"
    },
    "annulled": {
      "value": "Yes",
      "id": "11747",
      "type": "PDFCheckBox"
    },
    "divorcedDissolved": {
      "value": "Yes",
      "id": "11745",
      "type": "PDFCheckBox"
    },
    "widowed": {
      "value": "Yes",
      "id": "11744",
      "type": "PDFCheckBox"
    },
    "section17_1": {
      "_id": 1,
      "fullName": {
        "lastName": {
          "value": "",
          "id": "11741",
          "type": "PDFTextField"
        },
        "firstName": {
          "value": "",
          "id": "11740",
          "type": "PDFTextField"
        },
        "middleName": {
          "value": "",
          "id": "11743",
          "type": "PDFTextField"
        },
        "suffix": {
          "value": "",
          "id": "11742",
          "type": "PDFDropdown"
        }
      },
      "placeOfBirth": {
        "city": {
          "value": "",
          "id": "11727",
          "type": "PDFTextField"
        },
        "county": {
          "value": "",
          "id": "11726",
          "type": "PDFTextField"
        },
        "state": {
          "value": "",
          "id": "11725",
          "type": "PDFDropdown"
        },
        "country": {
          "value": "",
          "id": "11724",
          "type": "PDFDropdown"
        }
      },
      "dateOfBirth": {
        "date": {
          "value": "",
          "id": "11738",
          "type": "date"
        },
        "estimated": {
          "value": "NO",
          "id": "11739",
          "type": "PDFCheckBox"
        }
      },
      "citizenship": [
        {
          "_id": 1,
          "country": {
            "value": "",
            "id": "11774",
            "type": "PDFDropdown"
          }
        }
      ],
      "documentation": {
        "type": {
          "value": "Other",
          "id": "11732",
          "type": "PDFCheckBox"
        },
        "documentNumber": {
          "value": "",
          "id": "11730",
          "type": "PDFTextField"
        },
        "documentExpirationDate": {
          "date": {
            "value": "",
            "id": "11778",
            "type": "date"
          },
          "estimated": {
            "value": "NO",
            "id": "11777",
            "type": "PDFCheckBox"
          }
        },
        "otherExplanation": {
          "value": "",
          "id": "11728",
          "type": "PDFTextField"
        }
      },
      "notApplicable_OtherNames": {
        "value": "NO",
        "id": "",
        "type": "PDFCheckbox"
      },
      "notApplicable_SSN": {
        "value": "NO",
        "id": "",
        "type": "PDFCheckbox"
      },
      "usSocialSecurityNumber": {
        "value": "",
        "id": "11776",
        "type": "PDFTextField"
      },
      "otherNames": [
        {
          "_id": 1,
          "lastName": {
            "value": "",
            "id": "11770",
            "type": "PDFTextField"
          },
          "firstName": {
            "value": "",
            "id": "11771",
            "type": "PDFTextField"
          },
          "middleName": {
            "value": "",
            "id": "11772",
            "type": "PDFTextField"
          },
          "suffix": {
            "value": "",
            "id": "11767",
            "type": "PDFDropdown"
          },
          "maidenName": {
            "value": "NO",
            "id": "11764",
            "type": "PDFCheckBox"
          },
          "fromDate": {
            "date": {
              "value": "",
              "id": "11769",
              "type": "PDFTextField"
            },
            "estimated": {
              "value": "NO",
              "id": "11766",
              "type": "PDFCheckBox"
            }
          },
          "toDate": {
            "date": {
              "value": "",
              "id": "11768",
              "type": "PDFTextField"
            },
            "estimated": {
              "value": "NO",
              "id": "11765",
              "type": "PDFCheckBox"
            }
          }
        }
      ],
      "relationshipStatus": {
        "value": "Divorced",
        "id": "11749",
        "type": "PDFCheckBox"
      },
      "statusDetails": {
        "location": {
          "city": {
            "value": "",
            "id": "11801",
            "type": "PDFTextField"
          },
          "county": {
            "value": "",
            "id": "11815",
            "type": "PDFTextField"
          },
          "state": {
            "value": "",
            "id": "11800",
            "type": "PDFDropdown"
          },
          "country": {
            "value": "",
            "id": "11799",
            "type": "PDFDropdown"
          }
        },
        "date": {
          "date": {
            "value": "",
            "id": "11802",
            "type": "date"
          },
          "estimated": {
            "value": "NO",
            "id": "11817",
            "type": "PDFCheckBox"
          }
        },
        "recordLocation": {
          "city": {
            "value": "",
            "id": "11840",
            "type": "PDFTextField"
          },
          "county": {
            "value": "",
            "id": "11846",
            "type": "PDFTextField"
          },
          "state": {
            "value": "",
            "id": "11839",
            "type": "PDFDropdown"
          },
          "country": {
            "value": "",
            "id": "11838",
            "type": "PDFDropdown"
          }
        },
        "deceased": {
          "value": "NO",
          "id": "11842",
          "type": "PDFRadioGroup"
        },
        "lastKnownAddress": {
          "street": {
            "value": "",
            "id": "11836",
            "type": "PDFTextField"
          },
          "city": {
            "value": "",
            "id": "11835",
            "type": "PDFTextField"
          },
          "state": {
            "value": "",
            "id": "11834",
            "type": "PDFDropdown"
          },
          "zipCode": {
            "value": "",
            "id": "11832",
            "type": "PDFTextField"
          },
          "country": {
            "value": "",
            "id": "11833",
            "type": "PDFDropdown"
          }
        }
      }
    }
  }


set_ids_to_empty(data)

# Save the updated data to a text file
with open('./updated_data.txt', 'w') as file:
    json.dump(data, file, indent=4)
