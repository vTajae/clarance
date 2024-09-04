import os

# Define the sections and their types
sections = {
    "personalInfo": "ApplicantPersonalInfo",
    "namesInfo": "NamesInfo",
    "aknowledgementInfo": "ApplicantAknowledgeInfo",
    "birthInfo": "ApplicantBirthInfo",
    "physicalAttributes": "ApplicantPhysicalAttributes",
    "contactInfo": "ApplicantContactInfo",
    "passportInfo": "ApplicantPassportInfo",
    "citizenshipInfo": "CitizenshipNaturalizationInfo",
    "dualCitizenshipInfo": "DualCitizenshipFormData",
    "residencyInfo": "ApplicantResidency[]",
    "employmentInfo": "EmploymentInfo",
    "schoolInfo": "SchoolInfo",
    "serviceInfo": "ServiceInfo",
    "militaryHistoryInfo": "MilitaryHistoryInfo",
    "peopleThatKnow": "PeopleThatKnow[]",
    "relationshipInfo": "RelationshipInfo",
    "relativesInfo": "RelativesInfo",
    "foreignContacts": "ForeignContacts",
    "foreignActivities": "ForeignActivities",
    "mentalHealth": "MentalHealth",
    "policeRecord": "PoliceRecord",
    "drugActivity": "DrugActivity",
    "alcoholUse": "AlcoholUse",
    "investigationsInfo": "InvestigationsInfo",
    "finances": "Finances",
    "technology": "Technology",
    "civil": "Civil",
    "association": "Association",
    "signature": "Signature",
    "print": 'Field<"YES" | "NO">'
}

# Define the output directory
output_dir = "../app/state/contexts/section1"

# Create the directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Generate a .tsx file for each section
for section_name, type_name in sections.items():
    content = f"export const {section_name}: ApplicantSectionName = {{}};\n"
    file_path = os.path.join(output_dir, f"{section_name}.tsx")
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content)

print("Files created successfully in ./section1")
