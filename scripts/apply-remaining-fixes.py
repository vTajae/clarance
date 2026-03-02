#!/usr/bin/env python3
"""
Apply the remaining ~80 label corrections (generic radios + section-instruction labels).

Run: python3 scripts/apply-remaining-fixes.py
"""

import json
from pathlib import Path

# ---------------------------------------------------------------------------
# Corrections for 38 remaining generic RadioButtonList fields
# These need the QUESTION text above them, not the YES/NO option text
# ---------------------------------------------------------------------------

RADIO_FIXES = {
    # Foreign Activities - Section 20A
    "form1[0].#subform[70].RadioButtonList[4]":
        "Have you, your spouse, or legally recognized civil partner, cohabitant, or dependent children EVER owned, or do you anticipate owning, real estate in a foreign country?",
    "form1[0].#subform[72].RadioButtonList[7]":
        "As a U.S. citizen, have you, your spouse, or dependent children EVER received a foreign benefit?",
    "form1[0].#subform[72].RadioButtonList[13]":
        "Frequency of foreign benefit (one-time or continuing)",
    "form1[0].#subform[74].RadioButtonList[20]":
        "Frequency of foreign benefit (one-time or continuing)",
    "form1[0].#subform[76].RadioButtonList[21]":
        "Have you EVER provided financial support for any foreign national?",
    "form1[0].#subform[77].RadioButtonList[22]":
        "Have you provided advice or support to any foreign national in the last seven (7) years?",
    "form1[0].#subform[80].RadioButtonList[28]":
        "Have you EVER attended or participated in any conferences, seminars, or meetings outside the U.S.?",
    "form1[0].#subform[92].RadioButtonList[33]":
        "Has your travel in the last seven (7) years been solely for U.S. Government business/military overseas duty?",

    # Section 20A - Foreign financial interests
    "form1[0].Section20a[0].RadioButtonList[0]":
        "Have you EVER had any foreign financial interests?",

    # Dual citizenship
    "form1[0].Section10\\.1-10\\.2[0].RadioButtonList[0]":
        "Are you now or have you EVER been a citizen of a country other than the U.S.?",

    # Drug activity - Section 23
    "form1[0].Section_23_3[0].RadioButtonList[1]":
        "Have you EVER illegally used or been involved with a drug while possessing a security clearance?",
    "form1[0].Section_23_4[0].RadioButtonList[0]":
        "In the last seven (7) years have you intentionally engaged in the misuse of prescription drugs?",
    "form1[0].Section_23_5[0].#area[0].RadioButtonList[0]":
        "Have you EVER been ordered, advised, or asked to seek counseling or treatment as a result of your illegal use of drugs?",
    "form1[0].Section_23_6[0].RadioButtonList[3]":
        "Have you EVER voluntarily sought counseling or treatment as a result of your use of a drug?",
    "form1[0].Section_23_6[0].RadioButtonList[0]":
        "Type of drug or controlled substance involved in counseling/treatment",

    # Police record
    "form1[0].Section22_5[0].RadioButtonList[0]":
        "Have you EVER been convicted of a crime, sentenced to imprisonment, or on probation or parole?",
    "form1[0].Section22_3_1[0].RadioButtonList[0]":
        "Do you currently have a domestic violence protective order issued against you?",

    # Military/Service
    "form1[0].Section15_2[0].#area[0].RadioButtonList[0]":
        "Have you EVER been subject to court martial or other disciplinary procedure under the UCMJ?",
    "form1[0].Section15_3[0].RadioButtonList[0]":
        "Have you EVER served in a foreign country's military, intelligence, or security service?",

    # Relationships
    "form1[0].Section17_3[0].RadioButtonList[0]":
        "Do you have a person with whom you live for reasons of convenience (e.g. a roommate)?",

    # Relatives - Section 18 (repeating)
    "form1[0].Section18_2[0].RadioButtonList[1]":
        "Is this relative deceased?",
    "form1[0].Section18_2[1].RadioButtonList[1]":
        "Is this relative deceased?",
    "form1[0].Section18_2[2].RadioButtonList[1]":
        "Is this relative deceased?",
    "form1[0].Section18_2[3].RadioButtonList[1]":
        "Is this relative deceased?",
    "form1[0].Section18_2[4].RadioButtonList[1]":
        "Is this relative deceased?",
    "form1[0].Section18_2[5].RadioButtonList[1]":
        "Is this relative deceased?",

    # Psychological - Section 21
    "form1[0].Section21b[0].RadioButtonList[0]":
        "Have you EVER consulted a mental health professional about a mental health condition?",
    "form1[0].Section21c[0].RadioButtonList[0]":
        "Have you EVER been hospitalized for a mental health condition?",

    # Drug section continued
    "form1[0].Section23_1[0].RadioButtonList[7]":
        "Provide the month and year of last use",
    "form1[0].Section23_2[0].RadioButtonList[3]":
        "Have you EVER been involved in the illegal purchase, manufacture, trafficking, or sale of any drug?",
    "form1[0].Section23_2[0].RadioButtonList[7]":
        "Type of drug or controlled substance",

    # Alcohol - Section 24
    "form1[0].Section24[0].RadioButtonList[0]":
        "In the last seven (7) years has your use of alcohol had a negative impact on your work performance, professional or personal relationships, finances, or resulted in intervention by law enforcement/public safety personnel?",
    "form1[0].Section24_2[0].RadioButtonList[1]":
        "Have you been ordered, advised, or asked to seek counseling or treatment as a result of your use of alcohol?",
    "form1[0].Section24_3[0].RadioButtonList[1]":
        "Have you EVER voluntarily sought counseling or treatment as a result of your use of alcohol?",
    "form1[0].Section24_4[0].RadioButtonList[2]":
        "Have you EVER received counseling or treatment as a result of your use of alcohol in addition to what is listed?",

    # Investigations - Section 25
    "form1[0].Section25[0].RadioButtonList[0]":
        "Has the U.S. Government EVER investigated your background and/or granted you a security clearance?",
    "form1[0].Section25_2[0].RadioButtonList[0]":
        "Has your eligibility for access to classified information ever been denied, suspended, or revoked?",

    # Financial - Section 26
    "form1[0].Section26[0].RadioButtonList[0]":
        "In the last seven (7) years have you filed a petition under any chapter of the bankruptcy code?",
    "form1[0].Section26[0].RadioButtonList[1]":
        "Type of bankruptcy petition filed",
    "form1[0].Section26_2[0].RadioButtonList[0]":
        "Have you EVER experienced financial problems due to gambling?",
    "form1[0].Section26_3[0].RadioButtonList[0]":
        "Have you been counseled, warned, or disciplined for violating terms of a financial agreement?",
    "form1[0].Section26_8[0].RadioButtonList[0]":
        "Have you had any possessions or property voluntarily or involuntarily repossessed or foreclosed?",

    # Technology - Section 27
    "form1[0].Section27_2[0].RadioButtonList[0]":
        "Have you EVER illegally accessed or attempted to access any information technology system?",

    # Civil court - Section 28
    "form1[0].Section28[0].RadioButtonList[0]":
        "In the last ten (10) years have you been a party to any public record civil court action?",

    # Association - Section 29
    "form1[0].Section29_2[0].RadioButtonList[0]":
        "Have you EVER knowingly engaged in any acts of terrorism?",
    "form1[0].Section29_3[0].RadioButtonList[0]":
        "Have you EVER been a member of an organization dedicated to the use of violence or force to overthrow the U.S. Government?",
    "form1[0].Section29_4[0].RadioButtonList[0]":
        "Have you EVER been a member of an organization that advocates or practices acts of force or violence?",
    "form1[0].Section29_5[0].RadioButtonList[0]":
        "Have you EVER knowingly engaged in activities designed to overthrow the U.S. Government by force?",
}

# ---------------------------------------------------------------------------
# Corrections for section-instruction labels → specific field labels
# These fields had "Complete the following if..." as their label
# ---------------------------------------------------------------------------

INSTRUCTION_FIXES = {
    # Foreign activities - Section 20A financial interests
    "form1[0].#subform[68].#field[20]":
        "Specify type of financial interest (Check all that apply)",
    "form1[0].#subform[69].#field[65]":
        "Specify type of financial interest (Check all that apply)",
    "form1[0].#subform[70].#field[118]":
        "Type of real estate property",
    "form1[0].#subform[71].#field[159]":
        "Type of real estate property",
    "form1[0].#subform[72].#field[174]":
        "Specify type of benefit (Check all that apply)",
    "form1[0].#subform[74].#field[207]":
        "Specify type of benefit (Check all that apply)",

    # Foreign support
    "form1[0].#subform[77].TextField11[113]":
        "Description of advice/support provided",
    "form1[0].#subform[77].TextField11[122]":
        "Name of the agency",
    "form1[0].#subform[78].TextField11[139]":
        "Description of the position offered",
    "form1[0].#subform[79].TextField11[151]":
        "Full name of the foreign national",

    # Foreign contacts
    "form1[0].#subform[83].#subform[84].TextField113[0]":
        "Name of the individual involved in the contact",
    "form1[0].#subform[87].TextField11[197]":
        "Last name",

    # Foreign travel
    "form1[0].#subform[92].DropDownList141[0]":
        "Country visited",
    "form1[0].#subform[93].DropDownList141[1]":
        "Country visited",
    "form1[0].#subform[94].DropDownList141[2]":
        "Country visited",
    "form1[0].#subform[95].DropDownList141[3]":
        "Country visited",

    # Foreign financial
    "form1[0].Section20a[0].#field[20]":
        "Type of financial interest",
    "form1[0].Section20a2[0].#field[20]":
        "Type of financial interest",

    # Drug activity
    "form1[0].Section_23_3[0].TextField11[5]":
        "Description of drugs or controlled substances used",
    "form1[0].Section_23_3[0].TextField11[7]":
        "Description of involvement",
    "form1[0].Section_23_4[0].TextField11[1]":
        "Name of the prescription drug misused",

    # Psychological
    "form1[0].Section21b[0].RadioButtonList[0]":
        None,  # Already fixed in radio section above
    "form1[0].Section21c[0].RadioButtonList[0]":
        None,  # Already fixed in radio section above

    # Drug section continued
    "form1[0].Section23_1[0].RadioButtonList[7]":
        None,  # Already in radio fixes
    "form1[0].Section23_2[0].RadioButtonList[3]":
        None,  # Already in radio fixes
    "form1[0].Section23_2[0].RadioButtonList[7]":
        None,  # Already in radio fixes

    # Alcohol
    "form1[0].Section24[0].From_Datefield_Name_2[0]":
        "Month/year of negative alcohol impact",
    "form1[0].Section24[0].From_Datefield_Name_2[3]":
        "Month/year of negative alcohol impact",
    "form1[0].Section24[0].From_Datefield_Name_2[6]":
        "Month/year of negative alcohol impact",
    "form1[0].Section24[0].From_Datefield_Name_2[9]":
        "Month/year of negative alcohol impact",
    "form1[0].Section24_2[0].RadioButtonList[1]":
        None,  # Already in radio fixes
    "form1[0].Section24_3[0].RadioButtonList[1]":
        None,  # Already in radio fixes

    # Investigations
    "form1[0].Section25[0].#field[38]":
        "Agency that investigated/granted clearance",
    "form1[0].Section25[0].RadioButtonList[0]":
        None,  # Already in radio fixes

    # Financial
    "form1[0].Section26[0].RadioButtonList[1]":
        None,  # Already in radio fixes

    # Technology
    "form1[0].Section27[0].From_Datefield_Name_2[1]":
        "Date of the incident",
    "form1[0].Section27_2[0].From_Datefield_Name_2[0]":
        "Date of the incident",

    # Association
    "form1[0].Section29[0].TextField11[1]":
        "Full name of the organization",
    "form1[0].Section29_3[0].TextField11[1]":
        "Full name of the organization",
    "form1[0].Section29_4[0].TextField11[1]":
        "Full name of the organization",
    "form1[0].Section29_5[0].TextField11[1]":
        "Full name of the organization",
}


def main():
    registry_path = Path("app/src/lib/field-registry/field-registry.json")
    registry = json.loads(registry_path.read_text())
    reg_map = {f["pdfFieldName"]: f for f in registry}

    applied = 0
    skipped = 0
    kept = 0

    # Combine both fix sets
    all_fixes = {}
    all_fixes.update(RADIO_FIXES)
    for k, v in INSTRUCTION_FIXES.items():
        if v is not None and k not in all_fixes:
            all_fixes[k] = v

    for field_name, new_label in all_fixes.items():
        field = reg_map.get(field_name)
        if not field:
            # Try without escaped dots
            field = reg_map.get(field_name.replace("\\.", "."))
        if not field:
            print(f"  NOT FOUND: {field_name}")
            skipped += 1
            continue

        old_label = field.get("label", "")
        if old_label == new_label:
            kept += 1
            continue

        field["label"] = new_label
        # Boost confidence since we manually verified
        if field.get("classificationConfidence", 0) < 0.8:
            field["classificationConfidence"] = 0.8
        field["manuallyVerified"] = True
        applied += 1
        print(f"  FIXED: {field_name[:60]}")
        print(f"    {old_label[:55]} → {new_label[:55]}")

    # Save
    registry_path.write_text(json.dumps(registry, indent=2))

    print(f"\n=== Summary ===")
    print(f"Applied: {applied}")
    print(f"Kept current: {kept}")
    print(f"Not found: {skipped}")
    print(f"Registry saved to: {registry_path}")


if __name__ == "__main__":
    main()
