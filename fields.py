import json


def set_ids_to_empty(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if key == 'id':
                data[key] = ""
            elif isinstance(value, dict):
                set_ids_to_empty(value)
            elif isinstance(value, list):
                for item in value:
                    set_ids_to_empty(item)


# Example data structure

data = {
        "_id": 2,
        "employmentActivity": {
          "value":
            "Other (Provide explanation and complete 13A.2, 13A.5 and 13A.6)",
          "id": "17148",
          "type": "PDFRadioGroup",
        },
        "otherExplanation": {
          "value": "13OtherExplanation",
          "id": "10536",
          "type": "PDFTextField",
        },
        "section13A1": {
          "fromDate": {
            "date": {
              "value": "13A1StartDate",
              "id": "10532",
              "type": "PDFTextField",
            },
            "estimated": {
              "value": "Yes",
              "id": "10535",
              "type": "PDFCheckBox",
            },
          },
          "toDate": {
            "date": {
              "value": "13A1ToDate",
              "id": "10529",
              "type": "PDFTextField",
            },
            "estimated": {
              "value": "Yes",
              "id": "10534",
              "type": "PDFCheckBox",
            },
            "present": {
              "value": "Yes",
              "id": "10533",
              "type": "PDFCheckBox",
            },
          },
          "employmentStatus": {
            "fullTime": {
              "value": "Yes",
              "id": "10531",
              "type": "PDFCheckBox",
            },
            "partTime": {
              "value": "Yes",
              "id": "10530",
              "type": "PDFCheckBox",
            },
          },
          "dutyStation": {
            "value": "13A1DutyStation",
            "id": "10527",
            "type": "PDFTextField",
          },
          "rankOrPosition": {
            "value": "13A1RankTitle",
            "id": "10528",
            "type": "PDFTextField",
          },
          "address": {
            "street": {
              "value": "13A1DutyStreet",
              "id": "10549",
              "type": "PDFTextField",
            },
            "city": {
              "value": "13A1DutyCity",
              "id": "10548",
              "type": "PDFTextField",
            },
            "state": {
              "value": "AL",
              "id": "10547",
              "type": "PDFDropdown",
            },
            "zipCode": {
              "value": "13A1DutyZip",
              "id": "10545",
              "type": "PDFTextField",
            },
            "country": {
              "value": "Afghanistan",
              "id": "10546",
              "type": "PDFDropdown",
            },
          },
          "telephone": {
            "number": {
              "value": "13A1Phone",
              "id": "10543",
              "type": "PDFTextField",
            },
            "extension": {
              "value": "1",
              "id": "10542",
              "type": "PDFTextField",
            },
            "internationalOrDsn": {
              "value": "Yes",
              "id": "10541",
              "type": "PDFCheckBox",
            },
            "day": {
              "value": "Yes",
              "id": "10540",
              "type": "PDFCheckBox",
            },
            "night": {
              "value": "Yes",
              "id": "10539",
              "type": "PDFCheckBox",
            },
          },
          "aLocation": {
            "street": {
              "value": "13A1SupervisorAddress",
              "id": "10516",
              "type": "PDFTextField",
            },
            "city": {
              "value": "13A1SupervisorCity",
              "id": "10515",
              "type": "PDFTextField",
            },
            "state": {
              "value": "DC",
              "id": "10514",
              "type": "PDFDropdown",
            },
            "zipCode": {
              "value": "13A1Superviso",
              "id": "10508",
              "type": "PDFTextField",
            },
            "country": {
              "value": "Argentina",
              "id": "10513",
              "type": "PDFDropdown",
            },
          },
          "hasAPOFPOAddress": {
            "value": "YES ",
            "id": "17149",
            "type": "PDFRadioGroup",
          },
          "apoFPOAddress": {
            "street": {
              "value": "10512",
              "id": "10512",
              "type": "PDFTextField",
            },
            "apoOrFpo": {
              "value": "APO",
              "id": "10511",
              "type": "PDFTextField",
            },
            "apoFpoStateCode": {
              "value": "APO/FPO Europe",
              "id": "10510",
              "type": "PDFDropdown",
            },
            "zipCode": {
              "value": "bZip",
              "id": "10509",
              "type": "PDFTextField",
            },
          },
          "supervisor": {
            "name": {
              "value": "13A1SupervisorName",
              "id": "10505",
              "type": "PDFTextField",
            },
            "rankOrPosition": {
              "value": "13A1SupervisorRankTitle",
              "id": "10504",
              "type": "PDFTextField",
            },
            "email": {
              "value": "13A1SupervisorEmail",
              "id": "10538",
              "type": "PDFTextField",
            },
            "emailUnknown": {
              "value": "Yes",
              "id": "10537",
              "type": "PDFCheckBox",
            },
            "phone": {
              "number": {
                "value": "13A1SupervisorPhone",
                "id": "10503",
                "type": "PDFTextField",
              },
              "extension": {
                "value": "13A1Sup",
                "id": "10502",
                "type": "PDFTextField",
              },
              "internationalOrDsn": {
                "value": "Yes",
                "id": "10552",
                "type": "PDFCheckBox",
              },
              "day": {
                "value": "Yes",
                "id": "10551",
                "type": "PDFCheckBox",
              },
              "night": {
                "value": "Yes",
                "id": "10550",
                "type": "PDFCheckBox",
              },
            },
            "physicalWorkLocation": {
              "street": {
                "value": "13A1SupervisorAddress",
                "id": "10501",
                "type": "PDFTextField",
              },
              "city": {
                "value": "13A1SupervisorCity",
                "id": "10500",
                "type": "PDFTextField",
              },
              "state": {
                "value": "DC",
                "id": "10499",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "13A1Superviso",
                "id": "10497",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Argentina",
                "id": "10498",
                "type": "PDFDropdown",
              },
            },
            "apoFpoAddress": {
              "street": {
                "value": "a13A1Street",
                "id": "10496",
                "type": "PDFTextField",
              },
              "city": {
                "value": "a13A1City",
                "id": "10495",
                "type": "PDFTextField",
              },
              "state": {
                "value": "AS",
                "id": "10494",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "a13A1Zip",
                "id": "10492",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Angola",
                "id": "10493",
                "type": "PDFDropdown",
              },
            },
          },
        },
        "section13A2": {
          "fromDate": {
            "date": {
              "value": "13A2FromDate",
              "id": "10613",
              "type": "PDFTextField",
            },
            "estimated": {
              "value": "Yes",
              "id": "10614",
              "type": "PDFCheckBox",
            },
          },
          "toDate": {
            "date": {
              "value": "13A2ToDate",
              "id": "10615",
              "type": "PDFTextField",
            },
            "estimated": {
              "value": "Yes",
              "id": "10612",
              "type": "PDFCheckBox",
            },
            "present": {
              "value": "Yes",
              "id": "10617",
              "type": "PDFCheckBox",
            },
          },
          "employmentStatus": {
            "fullTime": {
              "value": "Yes",
              "id": "10620",
              "type": "PDFCheckBox",
            },
            "partTime": {
              "value": "Yes",
              "id": "10616",
              "type": "PDFCheckBox",
            },
          },
          "positionTitle": {
            "value": "13A2RecentTitle",
            "id": "10618",
            "type": "PDFTextField",
          },
          "employerName": {
            "value": "13A2RecentEmployer",
            "id": "10619",
            "type": "PDFTextField",
          },
          "employerAddress": {
            "street": {
              "value": "13A2Street",
              "id": "10555",
              "type": "PDFTextField",
            },
            "city": {
              "value": "13A2City",
              "id": "10554",
              "type": "PDFTextField",
            },
            "state": {
              "value": "AK",
              "id": "10553",
              "type": "PDFDropdown",
            },
            "zipCode": {
              "value": "13A2Zip",
              "id": "10644",
              "type": "PDFTextField",
            },
            "country": {
              "value": "Afghanistan",
              "id": "10645",
              "type": "PDFDropdown",
            },
          },
          "telephone": {
            "number": {
              "value": "13A2Phone",
              "id": "10638",
              "type": "PDFTextField",
            },
            "extension": {
              "value": "1",
              "id": "10637",
              "type": "PDFTextField",
            },
            "internationalOrDsn": {
              "value": "Yes",
              "id": "10636",
              "type": "PDFCheckBox",
            },
            "day": {
              "value": "Yes",
              "id": "10635",
              "type": "PDFCheckBox",
            },
            "night": {
              "value": "Yes",
              "id": "10634",
              "type": "PDFCheckBox",
            },
          },
          "periodsNotApplicable": {
            "value": "Yes",
            "id": "10621",
            "type": "PDFCheckBox",
          },
          "additionalPeriods": [
            {
              "_id": 1,
              "fromDate": {
                "date": {
                  "value": "13A2FromDate1",
                  "id": "10611",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10610",
                  "type": "PDFCheckBox",
                },
              },
              "toDate": {
                "date": {
                  "value": "13A2ToDate1",
                  "id": "10609",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10608",
                  "type": "PDFCheckBox",
                },
              },
              "positionTitle": {
                "value": "PositionTitle1",
                "id": "10607",
                "type": "PDFTextField",
              },
              "supervisor": {
                "value": "Supervisor1",
                "id": "10606",
                "type": "PDFTextField",
              },
            },
            {
              "_id": 2,
              "fromDate": {
                "date": {
                  "value": "13A2FromDate2",
                  "id": "10605",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10604",
                  "type": "PDFCheckBox",
                },
              },
              "toDate": {
                "date": {
                  "value": "13A2ToDate2",
                  "id": "10603",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10602",
                  "type": "PDFCheckBox",
                },
              },
              "positionTitle": {
                "value": "PositionTitle2",
                "id": "10601",
                "type": "PDFTextField",
              },
              "supervisor": {
                "value": "Supervisor2",
                "id": "10600",
                "type": "PDFTextField",
              },
            },
            {
              "_id": 3,
              "fromDate": {
                "date": {
                  "value": "13A2FromDate3",
                  "id": "10599",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10598",
                  "type": "PDFCheckBox",
                },
              },
              "toDate": {
                "date": {
                  "value": "13A2ToDate3",
                  "id": "10597",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10596",
                  "type": "PDFCheckBox",
                },
              },
              "positionTitle": {
                "value": "PositionTitle3",
                "id": "10595",
                "type": "PDFTextField",
              },
              "supervisor": {
                "value": "Supervisor3",
                "id": "10594",
                "type": "PDFTextField",
              },
            },
            {
              "_id": 4,
              "fromDate": {
                "date": {
                  "value": "13A2FromDate4",
                  "id": "10593",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10592",
                  "type": "PDFCheckBox",
                },
              },
              "toDate": {
                "date": {
                  "value": "13A2ToDate4",
                  "id": "10591",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10590",
                  "type": "PDFCheckBox",
                },
              },
              "positionTitle": {
                "value": "PositionTitle4",
                "id": "10589",
                "type": "PDFTextField",
              },
              "supervisor": {
                "value": "Supervisor4",
                "id": "10588",
                "type": "PDFTextField",
              },
            },
          ],
          "physicalWorkAddress": {
            "differentThanEmployer": {
              "value": "NO (If NO, proceed to (b))",
              "id": "17140",
              "type": "PDFRadioGroup",
            },
            "aLocation": {
              "street": {
                "value": "a13A2Street",
                "id": "10630",
                "type": "PDFTextField",
              },
              "city": {
                "value": "a13A2City",
                "id": "10629",
                "type": "PDFTextField",
              },
              "state": {
                "value": "AL",
                "id": "10628",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "a13A2Zip",
                "id": "10626",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Albania",
                "id": "10627",
                "type": "PDFDropdown",
              },
            },
            "telephone": {
              "number": {
                "value": "a13A2Phone",
                "id": "10633",
                "type": "PDFTextField",
              },
              "extension": {
                "value": "1",
                "id": "10632",
                "type": "PDFTextField",
              },
              "internationalOrDsn": {
                "value": "Yes",
                "id": "10631",
                "type": "PDFCheckBox",
              },
              "day": {
                "value": "Yes",
                "id": "10625",
                "type": "PDFCheckBox",
              },
              "night": {
                "value": "Yes",
                "id": "10624",
                "type": "PDFCheckBox",
              },
            },
            "b1Location": {
              "street": {
                "value": "b1Street",
                "id": "10580",
                "type": "PDFTextField",
              },
              "city": {
                "value": "b1City",
                "id": "10579",
                "type": "PDFTextField",
              },
              "state": {
                "value": "AK",
                "id": "10578",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "b1Zip",
                "id": "10572",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Afghanistan",
                "id": "10577",
                "type": "PDFDropdown",
              },
            },
            "apoFpoAddress": {
              "street": {
                "value": "b2Street",
                "id": "10576",
                "type": "PDFTextField",
              },

              "apoFpoStateCode": {
                "value": "b2Zip",
                "id": "10574",
                "type": "PDFTextField",
              },
              "apoOrFpo": {
                "value": "b2Zip",
                "id": "10575",
                "type": "PDFTextField",
              },
              "zipCode": {
                "value": "b2Zip",
                "id": "10573",
                "type": "PDFTextField",
              },

            },
            "hasApoFpoAddress": {
              "value": "NO",
              "id": "17142",
              "type": "PDFRadioGroup",
            },
          },
          "supervisor": {
                  "name": {
                    "value": "13A2SupervisorName",
                    "id": "10557",
                    "type": "PDFTextField",
                  },
                  "rankOrPosition": {
                    "value": "13A2SupervisorTitle",
                    "id": "10556",
                    "type": "PDFTextField",
                  },
                  "email": {
                    "value": "13A2SupervisorEmail",
                    "id": "10582",
                    "type": "PDFTextField",
                  },
                  "emailUnknown": {
                    "value": "Yes",
                    "id": "10581",
                    "type": "PDFCheckBox",
                  },
                  "phone": {
                    "number": {
                      "value": "13A2SupervisorPhone",
                      "id": "10587",
                      "type": "PDFTextField",
                    },
                    "extension": {
                      "value": "1",
                      "id": "10586",
                      "type": "PDFTextField",
                    },
                    "internationalOrDsn": {
                      "value": "Yes",
                      "id": "10585",
                      "type": "PDFCheckBox",
                    },
                    "day": {
                      "value": "Yes",
                      "id": "10584",
                      "type": "PDFCheckBox",
                    },
                    "night": {
                      "value": "Yes",
                      "id": "10583",
                      "type": "PDFCheckBox",
                    },
                  },
                  "physicalWorkLocation": {
                    "street": {
                      "value": "13A2SupervisorStreet",
                      "id": "10643",
                      "type": "PDFTextField",
                    },
                    "city": {
                      "value": "13A2SupervisorCity",
                      "id": "10642",
                      "type": "PDFTextField",
                    },
                    "state": {
                      "value": "CA",
                      "id": "10641",
                      "type": "PDFDropdown",
                    },
                    "zipCode": {
                      "value": "13A2Supervisor",
                      "id": "10639",
                      "type": "PDFTextField",
                    },
                    "country": {
                      "value": "Bahrain",
                      "id": "10640",
                      "type": "PDFDropdown",
                    },
                  },
                  "hasAPOFPOAddress": {
                    "value": "YES ",
                    "id": "17143",
                    "type": "PDFRadioGroup",
                  },
                  "apoFPOAddress": {
                    "street": {
                      "value": "b13A2SupervisorAddress",
                      "id": "10565",
                      "type": "PDFTextField",
                    },
                    "apoOrFpo": {
                      "value": "b13A2SupervisorAPO",
                      "id": "10564",
                      "type": "PDFTextField",
                    },
                    "apoFpoStateCode": {
                      "value": "APO/FPO Pacific",
                      "id": "10563",
                      "type": "PDFDropdown",
                    },
                    "zipCode": {
                      "value": "b13A2SupervisorZip",
                      "id": "10562",
                      "type": "PDFTextField",
                    },
                  },
                  "aLocation": {
                    "street": {
                      "value": "13A2SupervisorStreet",
                      "id": "10569",
                      "type": "PDFTextField",
                    },
                    "city": {
                      "value": "13A2SupervisorCity",
                      "id": "10568",
                      "type": "PDFTextField",
                    },
                    "state": {
                      "value": "CA",
                      "id": "10567",
                      "type": "PDFDropdown",
                    },
                    "zipCode": {
                      "value": "13A2Supervisor",
                      "id": "10561",
                      "type": "PDFTextField",
                    },
                    "country": {
                      "value": "Bahrain",
                      "id": "10566",
                      "type": "PDFDropdown",
                    },
                  },

          }
        },

        "section13A3": {
          "fromDate": {
            "date": {
              "value": "FromDate",
              "id": "10668",
              "type": "PDFTextField",
            },
            "estimated": {
              "value": "Yes",
              "id": "10669",
              "type": "PDFCheckBox",
            },
          },
          "toDate": {
            "date": {
              "value": "ToDate",
              "id": "10670",
              "type": "PDFTextField",
            },
            "estimated": {
              "value": "Yes",
              "id": "10672",
              "type": "PDFCheckBox",
            },
            "present": {
              "value": "Yes",
              "id": "10671",
              "type": "PDFCheckBox",
            },
          },
          "employmentStatus": {
            "fullTime": {
              "value": "Yes",
              "id": "10676",
              "type": "PDFCheckBox",
            },
            "partTime": {
              "value": "Yes",
              "id": "10675",
              "type": "PDFCheckBox",
            },
          },
          "positionTitle": {
            "value": "RecentPositionTitle",
            "id": "10673",
            "type": "PDFTextField",
          },
          "employmentName": {
            "value": "NameOfEmployment",
            "id": "10674",
            "type": "PDFTextField",
          },
          "employmentAddress": {
            "street": {
              "value": "EmploymentStreet",
              "id": "10691",
              "type": "PDFTextField",
            },
            "city": {
              "value": "EmploymentCity",
              "id": "10690",
              "type": "PDFTextField",
            },
            "state": {
              "value": "AK",
              "id": "10689",
              "type": "PDFDropdown",
            },
            "zipCode": {
              "value": "EmploymentZip",
              "id": "10687",
              "type": "PDFTextField",
            },
            "country": {
              "value": "Afghanistan",
              "id": "10688",
              "type": "PDFDropdown",
            },
          },
          "telephone": {
            "number": {
              "value": "EmploymentPhone",
              "id": "10686",
              "type": "PDFTextField",
            },
            "extension": {
              "value": "EXT",
              "id": "10685",
              "type": "PDFTextField",
            },
            "internationalOrDsn": {
              "value": "Yes",
              "id": "10684",
              "type": "PDFCheckBox",
            },
            "day": {
              "value": "Yes",
              "id": "10683",
              "type": "PDFCheckBox",
            },
            "night": {
              "value": "Yes",
              "id": "10682",
              "type": "PDFCheckBox",
            },
          },
          "physicalWorkAddress": {
            "differentThanEmployer": {
              "value": "YES",
              "id": "17137",
              "type": "PDFRadioGroup",
            },
            "aLocation": {
              "street": {
                "value": "aWorkStreet",
                "id": "10701",
                "type": "PDFTextField",
              },
              "city": {
                "value": "aWorkCity",
                "id": "10700",
                "type": "PDFTextField",
              },
              "state": {
                "value": "AR",
                "id": "10699",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "aWorkZip",
                "id": "10697",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Albania",
                "id": "10698",
                "type": "PDFDropdown",
              },
            },
            "telephone": {
              "number": {
                "value": "aWorkPhone",
                "id": "10696",
                "type": "PDFTextField",
              },
              "extension": {
                "value": "aEXT",
                "id": "10695",
                "type": "PDFTextField",
              },
              "internationalOrDsn": {
                "value": "Yes",
                "id": "10694",
                "type": "PDFCheckBox",
              },
              "day": {
                "value": "Yes",
                "id": "10693",
                "type": "PDFCheckBox",
              },
              "night": {
                "value": "Yes",
                "id": "10692",
                "type": "PDFCheckBox",
              },
            },
            "hasApoFpoAddress": {
              "value": "YES ",
              "id": "17138",
              "type": "PDFRadioGroup",
            },
            "b1Location": {
              "street": {
                "value": "b1Street",
                "id": "10667",
                "type": "PDFTextField",
              },
              "city": {
                "value": "b1City",
                "id": "10666",
                "type": "PDFTextField",
              },
              "state": {
                "value": "DC",
                "id": "10665",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "b1Zip",
                "id": "10620",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Bahrain",
                "id": "10664",
                "type": "PDFDropdown",
              },
            },
            "apoFpoAddress": {
              "street": {
                "value": "b2Street",
                "id": "10663",
                "type": "PDFTextField",
              },
              "apoOrFpo": {
                "value": "b2APO",
                "id": "10662",
                "type": "PDFTextField",
              },
              "apoFpoStateCode": {
                "value": "APO/FPO America",
                "id": "10661",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "b2Zip",
                "id": "10660",
                "type": "PDFTextField",
              },
            },
          },
          "selfEmploymentVerifier": {
            "lastName": {
              "value": "VerifyerLastName",
              "id": "10710",
              "type": "PDFTextField",
            },
            "firstName": {
              "value": "VerifyerFirstName",
              "id": "10709",
              "type": "PDFTextField",
            },
            "address": {
              "street": {
                "value": "VerifyerStreet",
                "id": "10708",
                "type": "PDFTextField",
              },
              "city": {
                "value": "VeryfierCity",
                "id": "10707",
                "type": "PDFTextField",
              },
              "state": {
                "value": "CT",
                "id": "10706",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "VeryfierZip",
                "id": "10704",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Argentina",
                "id": "10705",
                "type": "PDFDropdown",
              },
            },
            "telephone": {
              "number": {
                "value": "VeryfierPhone",
                "id": "10681",
                "type": "PDFTextField",
              },
              "extension": {
                "value": "VeryfierEX",
                "id": "10680",
                "type": "PDFTextField",
              },
              "internationalOrDsn": {
                "value": "Yes",
                "id": "10679",
                "type": "PDFCheckBox",
              },
              "day": {
                "value": "Yes",
                "id": "10678",
                "type": "PDFCheckBox",
              },
              "night": {
                "value": "Yes",
                "id": "10677",
                "type": "PDFCheckBox",
              },
            },
            "aLocation": {
              "street": {
                "value": "13A3Street",
                "id": "10656",
                "type": "PDFTextField",
              },
              "city": {
                "value": "13A3City",
                "id": "10655",
                "type": "PDFTextField",
              },
              "state": {
                "value": "CT",
                "id": "10654",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "13A3Zip",
                "id": "10648",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Argentina",
                "id": "10653",
                "type": "PDFDropdown",
              },
            },
            "hasAPOFPOAddress": {
              "value": "YES ",
              "id": "17139",
              "type": "PDFRadioGroup",
            },   
            "apoFpoAddress": {
              "street": {
                "value": "b2Street",
                "id": "10652",
                "type": "PDFTextField",
              },
              "apoOrFpo": {
                "value": "b2APO",
                "id": "10651",
                "type": "PDFTextField",
              },
              "apoFpoStateCode": {
                "value": "APO/FPO America",
                "id": "10650",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "b2Zip",
                "id": "10649",
                "type": "PDFTextField",
              },
            }       
          },
        },

        "section13A4": {
          "fromDate": {
            "date": {
              "value": "13A4FromDate",
              "id": "10738",
              "type": "PDFTextField",
            },
            "estimated": { "value": "Yes", "id": "10739", "type": "PDFCheckBox" },
          },
          "toDate": {
            "date": { "value": "13A4ToDate", "id": "10740", "type": "PDFTextField" },
            "estimated": { "value": "Yes", "id": "10742", "type": "PDFCheckBox" },
            "present": { "value": "Yes", "id": "10741", "type": "PDFCheckBox" },
          },
          "verifier": {
            "lastName": {
              "value": "13A4LName",
              "id": "10744",
              "type": "PDFTextField",
            },
            "firstName": {
              "value": "13A4FName",
              "id": "10743",
              "type": "PDFTextField",
            },
            "address": {
              "street": {
                "value": "13A4Street",
                "id": "10737",
                "type": "PDFTextField",
              },
              "city": { "value": "13A4City", "id": "10736", "type": "PDFTextField" },
              "state": { "value": "AL", "id": "10735", "type": "PDFDropdown" },
              "zipCode": {
                "value": "13A4Zip",
                "id": "10733",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Antarctica",
                "id": "10734",
                "type": "PDFDropdown",
              },
            },
            "telephone": {
              "number": {
                "value": "13A4Phone",
                "id": "10732",
                "type": "PDFTextField",
              },
              "extension": {
                "value": "13A4Ext",
                "id": "10731",
                "type": "PDFTextField",
              },
              "internationalOrDsn": {
                "value": "Yes",
                "id": "10730",
                "type": "PDFCheckBox",
              },
              "day": { "value": "Yes", "id": "10729", "type": "PDFCheckBox" },
              "night": { "value": "Yes", "id": "10728", "type": "PDFCheckBox" },
            },
            "hasApoFpoAddress": {
              "value": "YES ",
              "id": "17136",
              "type": "PDFRadioGroup",
            },
            "aLocation": {
              "street": {
                "value": "a13A4Street",
                "id": "10755",
                "type": "PDFTextField",
              },
              "city": { "value": "a13A4City", "id": "10754", "type": "PDFTextField" },
              "state": { "value": "AR", "id": "10753", "type": "PDFDropdown" },
              "zipCode": {
                "value": "a13A4Zip",
                "id": "10747",
                "type": "PDFTextField",
              },
              "country": {
                "value": "Anguilla",
                "id": "10752",
                "type": "PDFDropdown",
              },
            },
            "apoFpoAddress": {
              "dutyLocation": {
                "value": "b13A4Street",
                "id": "10751",
                "type": "PDFTextField",
              },
              "apoOrFpo": {
                "value": "b13A4APO",
                "id": "10750",
                "type": "PDFTextField",
              },
              "apoFpoStateCode": {
                "value": "APO/FPO Pacific",
                "id": "10749",
                "type": "PDFDropdown",
              },
              "zipCode": {
                "value": "b13A4Zip",
                "id": "10748",
                "type": "PDFTextField",
              },
            },
            
          },
        },

        "section13A5": {
          "reasonForLeaving": {
            "value": "13A5ResonForLEaving",
            "id": "10726",
            "type": "PDFTextField",
          },
          "incidentInLastSevenYears": {
            "value": "NO (If NO, proceed to 13A.6)",
            "id": "17131",
            "type": "PDFRadioGroup",
          },
          "incidentDetails": [
            {
              "type": {
                "value": "Yes",
                "id": "10723",
                "type": "PDFCheckBox",
              },
              "reason": {
                "value": "13A5ReasonForBeingFired",
                "id": "10716",
                "type": "PDFTextField",
              },
              "departureDate": {
                "value": "13A5DateFired",
                "id": "10714",
                "type": "PDFTextField",
              },
              "estimated": {
                "value": "Yes",
                "id": "10715",
                "type": "PDFCheckBox",
              },
            },
            {
              "type": {
                "value": "Yes",
                "id": "10722",
                "type": "PDFCheckBox",
              },
              "reason": {
                "value": "13A5ReasonForQuitting",
                "id": "10717",
                "type": "PDFTextField",
              },
              "departureDate": {
                "value": "13A5DateQuit",
                "id": "10713",
                "type": "PDFTextField",
              },
              "estimated": {
                "value": "Yes",
                "id": "10712",
                "type": "PDFCheckBox",
              },
            },
            {
              "type": {
                "value": "Yes",
                "id": "10721",
                "type": "PDFCheckBox",
              },
              "reason": {
                "value": "13A5ChargesorAllegations",
                "id": "10718",
                "type": "PDFTextField",
              },
              "departureDate": {
                "value": "13A5DateLeft",
                "id": "10771",
                "type": "PDFTextField",
              },
              "estimated": {
                "value": "Yes",
                "id": "10772",
                "type": "PDFCheckBox",
              },
            },
            {
              "type": {
                "value": "Yes",
                "id": "10720",
                "type": "PDFCheckBox",
              },
              "reason": {
                "value": "13A5ReasonforUnsatisfactory",
                "id": "10719",
                "type": "PDFTextField",
              },
              "departureDate": {
                "value": "13A5DateLeftMutual",
                "id": "10773",
                "type": "PDFTextField",
              },
              "estimated": {
                "value": "Yes",
                "id": "10770",
                "type": "PDFCheckBox",
              },
            },
          ],
        },

        "section13A6": {
          "warnedInLastSevenYears": {
            "value": "YES",
            "id": "17135",
            "type": "PDFRadioGroup",
          },
          "warningDetails": [
            {
              "reason": {
                "value": "13A6Reason1",
                "id": "10768",
                "type": "PDFTextField",
              },
              "date": {
                "date": {
                  "value": "13A6Date1",
                  "id": "10766",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10767",
                  "type": "PDFCheckBox",
                },
              },
            },
            {
              "reason": {
                "value": "13A6Reason2",
                "id": "10769",
                "type": "PDFTextField",
              },
              "date": {
                "date": {
                  "value": "13A6Date2",
                  "id": "10765",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10764",
                  "type": "PDFCheckBox",
                },
              },
            },
            {
              "reason": {
                "value": "13A6Reason3",
                "id": "10762",
                "type": "PDFTextField",
              },
              "date": {
                "date": {
                  "value": "13A6Date3",
                  "id": "10760",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10761",
                  "type": "PDFCheckBox",
                },
              },
            },
            {
              "reason": {
                "value": "13A6Reason4",
                "id": "10763",
                "type": "PDFTextField",
              },
              "date": {
                "date": {
                  "value": "13A6Date4",
                  "id": "10759",
                  "type": "PDFTextField",
                },
                "estimated": {
                  "value": "Yes",
                  "id": "10758",
                  "type": "PDFCheckBox",
                },
              },
            },
          ],
        },
      }

set_ids_to_empty(data)

# Save the updated data to a text file
with open('updated_data.txt', 'w') as file:
    json.dump(data, file, indent=4)
