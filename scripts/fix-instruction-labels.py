#!/usr/bin/env python3
"""Fix remaining 426 empty-type instruction-block labels in field-registry.json.

These are PDF instruction paragraphs captured as fields with no type.
They render as text inputs in the wizard with truncated labels.
This script assigns concise, meaningful labels based on pattern matching.
"""

import json
import re
import sys

REGISTRY_PATH = "app/src/lib/field-registry/field-registry.json"

# ── Exact-match mapping (label starts with) ─────────────────────────────────
# Maps label prefix → replacement label
STARTS_WITH_MAP = [
    # APO/FPO address instructions (various spacings)
    ("If you have indicated an APO/FPO address", "APO/FPO address details"),
    ("If you have indicated an A P O / F P O address", "APO/FPO address details"),
    ("If you have indicated an A P O / F  P O address", "APO/FPO address details"),
    ("If you have indicated an A P O / F P O  address", "APO/FPO address details"),
    ("(b) If you have indicated an APO/FPO address", "APO/FPO address details (b)"),
    ("(b) If you have indicated an A P O / F P  O address", "APO/FPO address details (b)"),
    ("(b) If you have indicated an A P O / F P O address", "APO/FPO address details (b)"),
    ("b. If you have indicated an A P O / F P O", "APO/FPO address details (b)"),
    ("b. If you have indicated an APO/FPO", "APO/FPO address details (b)"),

    # Physical location data
    ("(a) Provide physical location data with street address", "Physical location data"),
    ("(a). Provide physical location data with street address", "Physical location data"),

    # Citizenship documentation types
    ("Derived: Alien Registration", "Alien registration number (derived)"),
    ("Naturalized: Alien Registration", "Alien registration number (naturalized)"),
    ("Born Abroad: Certificate of Birth", "Certificate of birth abroad"),
    ("Born Abroad to U.S. Parents:", "Certificate of birth abroad"),

    # School-related
    ("For schools you attended in the last 3 years, list a person", "School contact person"),
    ("Provide type of degrees(s)/diploma(s) received", "Degree/diploma details"),

    # Employment subsection headers
    ("13A.1  Complete the following if employment type is Active Duty", "Active duty/reserve details"),
    ("13A.1 Complete the following if employment type is Active Duty", "Active duty/reserve details"),
    ("13A.2  Complete the following if employment type is other federal", "Federal/contractor employment details"),
    ("13A.2 Complete the following if employment type is other federal", "Federal/contractor employment details"),
    ("13A.3  Complete the following if employment type is", "Employment verification details"),
    ("13A.3 Complete the following if employment type is", "Employment verification details"),
    ("13A.4  Complete the following if employment type is", "Employment reprimand details"),
    ("13A.4 Complete the following if employment type is", "Employment reprimand details"),
    ("13A.5  Complete the following if employment type is", "Employment departure details"),
    ("13A.5 Complete the following if employment type is", "Employment departure details"),
    ("Additional Periods of Activity with this Employer", "Additional activity periods"),

    # Disciplinary reasons
    ("#1 Provide the reason(s) for being warned", "Reason #1 for disciplinary action"),
    ("#2 Provide the reason(s) for being warned", "Reason #2 for disciplinary action"),
    ("#3 Provide the reason(s) for being warned", "Reason #3 for disciplinary action"),
    ("#4 Provide the reason(s) for being warned", "Reason #4 for disciplinary action"),

    # Relative subsection headers (section 18)
    ("18.1  Complete the following if the relative listed", "Relative details (18.1)"),
    ("18.1 Complete the following if the relative listed", "Relative details (18.1)"),
    ("18.2  Complete the following if the relative listed", "Relative citizenship details (18.2)"),
    ("18.2 Complete the following if the relative listed", "Relative citizenship details (18.2)"),
    ("18.3 Complete the following if the relative listed", "Relative address details (18.3)"),
    ("18.4 Complete the following if the relative listed", "Relative employer details (18.4)"),
    ("18.5 Complete the following if the relative listed", "Relative foreign affiliation (18.5)"),
    ("Describe the relative's relationship with the foreign", "Relative's foreign relationship description"),
    ("Provide the address of current employer, or provide", "Current employer address"),

    # Foreign contacts (section 19)
    ("Provide the name of the foreign national's current employer", "Foreign contact employer name"),
    ("Provide the address of the foreign national's current employer", "Foreign contact employer address"),
    ("Describe the contact's relationship with the foreign", "Foreign contact relationship description"),
    ("Complete the following if you responded 'Yes' to have, or have had, close", "Foreign contact details"),

    # Foreign activities (section 20A/B/C)
    ("Complete the following if you responded 'YES' that as a U.S. citizen", "Foreign financial benefit details"),
    ("Complete the following if you responded 'YES' to you, your spouse", "Foreign financial interest details"),
    ("Complete the following if you responded 'Yes' to you, your spouse", "Foreign financial interest details"),
    ("Provide details regarding how the financial interest was acquired", "Financial interest acquisition details"),
    ("(a). If you have indicated that you, your spouse", "One-time benefit details (a)"),
    ("(b). If you have indicated that you, your spouse", "Expected future benefit details (b)"),
    ("(c). If have indicated that you, your spouse", "Continuing benefit details (c)"),
    ("Complete the following if you responded 'Yes' to having traveled outside", "Foreign travel details"),
    ("Complete the following if you responded 'Yes' to providing financial support", "Foreign financial support details"),

    # Foreign business (section 20B)
    ("Complete the following if you responded 'Yes' to having had, or currently", "Foreign business details"),
    ("Complete the following if you responded 'Yes' to having in the last seven (7) years had any contact", "Foreign government contact details"),
    ("Complete the following if you responded 'Yes' to having in the last seven (7) ye", "Foreign contact details"),
    ("Complete the following if you responded 'Yes' to having EVER been asked to", "Foreign intelligence solicitation details"),
    ("Complete the following if you responded 'Yes' to having been involved", "Foreign political involvement details"),

    # Mental health (section 21)
    ("Provide the name of the court or administrative agency that declared", "Court/agency name"),
    ("Provide the address of the court or administrative agency", "Court/agency address"),
    ("Complete the following if you responded 'Yes' to this matter was appealed", "Appeal court/agency name"),
    ("Complete the following if you responded 'Yes' to the matter was appealed", "Appeal court/agency name"),
    ("Provide the name of the health care professional who diagnosed", "Health care professional name"),
    ("Provide the address of the health care professional who diagnosed", "Health care professional address"),
    ("Provide the name of the health care professional", "Health care professional name"),
    ("Provide the address of the health care professional", "Health care professional address"),
    ("Provide the name of any agency/organization/facility\nwhere counseling", "Counseling facility name"),
    ("Provide the name of any agency/organization/facility where counseling", "Counseling facility name"),
    ("Provide the address of agency/organization/facility where counseling", "Counseling facility address"),
    ("Provide the address of agency/organization/facility\nwhere counseling", "Counseling facility address"),
    ("Complete the following if you responded 'Yes' to having been ordered, advised", "Counseling/treatment details"),
    ("Complete the following if you responded 'Yes' to having ever voluntarily", "Voluntary counseling details"),
    ("Complete the following if you responded 'Yes' to having a court or administrative", "Court action details"),
    ("Provide the name of the court or administrative agency that ordered you", "Court/agency name"),

    # Police record (section 22)
    ("Provide all the charges brought against you for this offense", "Charges and outcomes"),
    ("Complete the following if you responded 'Yes' to having EVER been charged with", "Offense details"),
    ("Complete the following if you responded 'Yes' to having EVER had any of the following happen to you", "Sentencing details"),

    # Drug activity (section 23)
    ("Complete the following if you responded 'Yes' to having EVER illegally used", "Drug use details"),
    ("Complete the following if you responded 'Yes' to having EVER been involved in", "Drug involvement details"),
    ("Complete the following if you responded 'Yes' to having EVER illegally possessed", "Drug possession details"),

    # Alcohol (section 24)
    ("Complete the following if you responded 'Yes' to your alcohol use having had", "Alcohol impact details"),
    ("Complete the following if you responded 'Yes' to having been ordered, advised, or asked to seek counseling", "Alcohol counseling details"),
    ("Complete the following if you responded 'Yes' to having received counseling or treatment", "Alcohol treatment details"),
    ("Complete the following if you responded 'Yes' to having ever voluntarily sought counseling or treatment", "Voluntary alcohol treatment details"),

    # Investigations (section 25)
    ("Complete the following if you responded 'Yes' to having EVER had a clearance", "Clearance action details"),
    ("Complete the following if the U.S. Government (or a foreign government)", "Government investigation details"),

    # Financial (section 26)
    ("Provide a description of any action(s) you have taken to satisfy this debt", "Actions to satisfy debt"),
    ("Complete the following if you answered 'Yes' to having experienced one or more", "Financial issue details"),
    ("Complete the following if you responded 'Yes' to being currently utilizing", "Credit counseling details"),
    ("Complete the following if you responded 'Yes' to having EVER experienced financial problems due to gambling", "Gambling financial details"),
    ("Complete the following if you responded 'Yes' to having been counseled, warned, or disciplined for violating", "Card/charge violation details"),
    ("Complete the following if you responded 'Yes' to having been delinquent on alimony", "Alimony/child support details"),
    ("As a result of this counseling, provide a description", "Counseling result description"),
    ("If you have taken any action(s) to rectify your financial problems due to gambling", "Actions to address gambling"),
    ("(a)  If Chapter 13 previously selected: Provide the name of the trustee", "Bankruptcy trustee name"),
    ("(a) If Chapter 13 previously selected: Provide the name of the trustee", "Bankruptcy trustee name"),

    # IT systems (section 27)
    ("Provide a description of the action (administrative, criminal or other)", "Action taken description"),
    ("Complete the following if you responded 'Yes' to having EVER illegally or without proper authorization entered", "Unauthorized access details"),
    ("Complete the following if you responded 'Yes' to having EVER illegally or without proper authorization modified", "Unauthorized modification details"),
    ("Complete the following if you responded 'Yes' to having EVER introduced", "Malicious code details"),

    # Civil court (section 28)
    ("Complete the following if you responded 'Yes' to having been a party to any public record civil court action", "Civil court action details"),

    # Association (section 29)
    ("Provide a description of the nature of and reasons for your involvement", "Nature of involvement"),
    ("Complete the following if you responded 'Yes' to having EVER been an officer", "Organization involvement details"),
    ("Complete the following if you responded 'Yes' to having EVER been a member of", "Organization membership details"),

    # Section 30 (signatures)
    ("I have read the instructions for this questionnaire, and I understand", "Certification acknowledgment"),
    ("Use the space below to continue answers or a blank sheet", "Continuation space"),
    ("If so, describe the nature of the condition", "Condition description"),

    # Military (section 15)
    ("Provide a description of the Uniform Code of Military Justice", "UCMJ offense description"),
    ("Provide the name of the disciplinary procedure", "Disciplinary procedure name"),
    ("Complete the following if you responded 'Yes' to having ever been subject", "Disciplinary action details"),
    ("Complete the following if you responded 'Yes' to having received other", "Other discharge details"),
    ("Provide the result of the disciplinary procedure", "Disciplinary result"),
    ("15.2 Complete the following if you responded 'Yes'", "Military disciplinary details (15.2)"),
    ("15.2 Entry #2", "Disciplinary procedure #2"),
    ("Provide the description of the military court", "Military court description"),
    ("Provide the description of the final outcome", "Final outcome description"),

    # Marital (section 17)
    ("17.1  Complete the following if you selected 'Married' or 'Separated.'", "Marriage details (17.1)"),
    ("17.1  Complete the following if you selected \"currently in a civil marriage\"", "Marriage/partnership details (17.1)"),
    ("17.2 Complete the following if you selected \"divorced", "Divorce/annulment details (17.2)"),
    ("17.3 Complete the following if you selected", "Cohabitant details (17.3)"),
    ("17.4 Complete the following about your current and former spouse", "Former spouse details (17.4)"),
    ("Currently in a civil marriage, legally recognized civil union", "Marriage/partnership type"),
    ("(a) For divorced or annulled marriage provide last known address", "Former spouse address"),
    ("(a) Provide last known address of the person from whom you are divorced", "Former spouse/partner address"),
    ("For your foreign born cohabitant, indicate one type of documentation", "Foreign cohabitant documentation"),
    ("For your foreign born spouse or legally recognized", "Foreign spouse documentation"),
    ("For your foreign born former spouse", "Foreign former spouse documentation"),
    ("If the person is foreign born, provide one type of documentation", "Foreign-born documentation"),
    ("Provide date when you entered into your civil marriage", "Marriage/partnership date"),
    ("Section 17-Marital/Relationship Status", "Marital/relationship status"),
    ("Provide the date your civil marriage, civil union", "Partnership recognition date"),

    # People who know you (section 16)
    ("Provide the address for the person who knows you the best in your neighborhood", "Neighbor contact address"),
    ("Section 16-People Who Know You Well", "People who know you"),

    # Section 18 (relatives)
    ("Section 18-Relatives", "Relatives"),

    # Section 13B
    ("Complete the following about federal agency that employed you", "Federal employer details"),
    ("Entry #1. Complete the following if you selected", "Former federal employment details"),

    # Military (section 15) additional
    ("Provide a description of the circumstances of your association", "Association circumstances"),

    # Foreign activities (section 20A additional)
    ("Provide the current value (in U.S. dollars) or the value at the time control", "Value at disposal"),
    ("Provide the current value (in U.S. dollars) or  value at the time interest", "Value at disposal"),
    ("Provide explanation of how interest control or ownership was sold", "Disposal explanation"),
    ("Provide the date interest was sold, lost", "Interest disposal date"),
    ("Provide how the foreign real estate was or is to be acquired", "Real estate acquisition method"),

    # Foreign business (section 20B additional)
    ("Provide the type of establishment (such as embassy", "Establishment type"),
    ("Provide the address of the organization through which sponsorship", "Sponsorship organization address"),
    ("Provide the country(ies) of citizenship for the sponsored", "Sponsored national citizenship"),
    ("Provide the name of the organization through which sponsorship", "Sponsorship organization name"),
    ("Provide the name of the foreign organization or foreign business", "Foreign organization/business name"),
    ("Complete the following if you responded 'Yes' to any foreign national having", "Foreign job offer details"),
    ("Complete the following if you responded 'Yes' to in the last seven (7) years having attended", "Foreign conference details"),
    ("Complete the following if you responded 'Yes' to you or any member of your immediate family having", "Foreign government contact details"),
    ("Complete the following if you responded 'Yes' to in the last seven (7) years having sponsored", "Foreign sponsorship details"),

    # Mental health (section 21E additional)
    ("If you responded 'Yes' to having ever received or you are currently receiving", "Counseling/treatment details"),

    # Police record (section 22 additional)
    ("Domestic violence or a crime of violence", "Domestic violence offense"),
    ("Check all that apply.", "Applicable offense types"),
    ("Complete the following if you responded 'YES' to one of the following", "Criminal proceeding details"),
    ("Complete the following if you responded 'Yes' to one of the following", "Criminal proceeding details"),

    # Drug activity (section 23 additional)
    ("Provide explanation of why you intend or do not intend", "Future use intention explanation"),
    ("Provide an estimate of the month and year of most recent involvement", "Most recent involvement date"),
    ("Provide an estimate of the number of times you used", "Usage frequency estimate"),
    ("Entry #2. Provide a description of the drugs", "Drug involvement #2"),
    ("Provide the reason(s) for and circumstances of the misuse", "Prescription misuse reasons"),
    ("Complete the following if you responded 'Yes' to in the last seven (7) years having intentionally engaged in the misuse", "Prescription drug misuse details"),

    # Alcohol (section 24 additional)
    ("(a) You responded 'No' to having taken action to seek counseling", "Reason for not seeking treatment"),
    ("Entry #2. Provide the name of the individual counselor", "Counselor/provider #2"),
    ("Provide the name of agency/organization where counseling", "Counseling agency name"),
    ("Complete the following if you responded 'Yes' to having EVER received counseling or treatment as a result of your use of alcohol", "Alcohol treatment details"),

    # Investigations (section 25 additional)
    ("Provide the date clearance eligibility/access was granted", "Clearance grant date"),
    ("Provide the name of agency that issued the clearance", "Clearance issuing agency"),
    ("Entry #2. Provide the date security clearance", "Clearance action #2 date"),
    ("Provide an explanation of the circumstances of the denial", "Denial/revocation explanation"),
    ("Complete the following if you responded 'Yes' to the U.S. Government", "Investigation/clearance details"),

    # Financial (section 26 additional)
    ("Provide the Federal, state, or other agency to which you failed", "Tax agency"),
    ("Provide the type of taxes you failed to file or pay", "Tax type"),
    ("In the last seven (7) years, you have been delinquent on alimony", "Alimony/child support delinquency"),
    ("In the last seven (7) years, you had a judgment entered against you", "Judgment entered against you"),
    ("In the last seven (7) years, you had a lien placed against your property", "Tax/debt lien on property"),
    ("You are currently delinquent on any Federal debt", "Federal debt delinquency"),
    ("In the last seven (7) years, you had any possessions or property voluntarily", "Repossession/foreclosure"),
    ("In the last seven (7) years, you defaulted on any type of loan", "Loan default"),
    ("In the last seven (7) years, you had wages, benefits, or assets garnished", "Wage garnishment"),
    ("In the last seven (7) years, you were over 120 days delinquent on any debt", "120+ day debt delinquency"),
    ("You are currently over 120 days delinquent on any debt", "Current 120+ day delinquency"),
    ("In the last seven (7) years, you had bills or debts turned over to a collection", "Collection agency referral"),
    ("In the last seven (7) years, you had any account or credit card suspended", "Account suspension/charge-off"),

    # Association (section 29 additional)
    ("Complete the following if you responded 'YES' to being or ever having been a member", "Terrorism-related organization details"),
    ("Complete the following if you responded 'Yes' to being or EVER having been a member", "Violent organization details"),
]


def apply_starts_with(label: str) -> str | None:
    """Try to match label against starts-with patterns."""
    for prefix, replacement in STARTS_WITH_MAP:
        if label.startswith(prefix):
            return replacement
    return None


# ── Regex-based patterns ────────────────────────────────────────────────────

REGEX_PATTERNS = [
    # "Complete the following if you responded 'Yes' to ..." → extract key phrase
    (r"^Complete the following if you responded '(?:Yes|YES|NO)' to (.{10,60}?)(?:\.|Entry)",
     lambda m: m.group(1).strip()[:55]),

    # "N.N Complete the following if ..." → "Section N.N details"
    (r"^(\d+[A-E]?\.\d+)\s+Complete the following",
     lambda m: f"Section {m.group(1)} details"),

    # "Provide the [noun phrase]." at start
    (r"^Provide (?:the |your |a |an )(.{10,60}?)(?:\.|(?:\s*\())",
     lambda m: m.group(1).strip()[:55].rstrip()),

    # "Describe [noun phrase]." at start
    (r"^Describe (?:the |your |a |an )(.{10,60}?)(?:\.|(?:\s*\())",
     lambda m: m.group(1).strip()[:55].rstrip()),

    # Appeal #N pattern
    (r"Appeal #(\d+)\s+Provide the name of the court",
     lambda m: f"Appeal #{m.group(1)} court/agency name"),

    # Entry #N pattern
    (r"Entry #(\d+)[\.\s]+(.{10,50}?)(?:\.|$)",
     lambda m: f"Entry #{m.group(1)} - {m.group(2).strip()[:40]}"),
]


def apply_regex(label: str) -> str | None:
    """Try regex patterns. Returns None if no match or result too long/short."""
    for pattern, extractor in REGEX_PATTERNS:
        m = re.search(pattern, label)
        if m:
            result = extractor(m)
            if result and 4 <= len(result) <= 60:
                # Capitalize first letter
                result = result[0].upper() + result[1:]
                # Reject if it looks like a truncated sentence
                if re.search(r'\b(the|and|or|of|for|in|to|a|an|at|by|if|your|you)$', result, re.I):
                    continue
                return result
    return None


def main():
    with open(REGISTRY_PATH) as f:
        data = json.load(f)

    fixes = []
    skipped = 0
    for i, field in enumerate(data):
        label = field.get('label', '')
        section = field.get('section', '')
        field_type = field.get('type', '')

        sec_num = re.match(r'section(\d+)', section)
        if not sec_num:
            continue
        num = int(sec_num.group(1))
        if num < 11:
            continue
        if len(label) <= 80:
            continue
        if field_type:  # Only fix empty-type fields
            continue

        sk = field.get('semanticKey', '')

        # Try starts-with map first
        new_label = apply_starts_with(label)

        # Then try regex patterns
        if not new_label:
            new_label = apply_regex(label)

        if new_label and new_label != label and len(new_label) < len(label):
            fixes.append({
                'index': i,
                'semanticKey': sk,
                'section': section,
                'old': label[:120],
                'new': new_label,
            })
        else:
            skipped += 1

    if '--dry-run' in sys.argv or '-n' in sys.argv:
        print(f"Would fix {len(fixes)} labels ({skipped} skipped):")
        for fix in fixes:
            print(f"\n  [{fix['section']}] {fix['semanticKey']}:")
            print(f"    OLD: \"{fix['old']}\"")
            print(f"    NEW: \"{fix['new']}\"")
        return

    # Apply fixes
    for fix in fixes:
        data[fix['index']]['label'] = fix['new']

    with open(REGISTRY_PATH, 'w') as f:
        json.dump(data, f, indent=2)
        f.write('\n')

    print(f"Fixed {len(fixes)} labels ({skipped} skipped)")

    from collections import Counter
    by_section = Counter(fix['section'] for fix in fixes)
    for sec, count in sorted(by_section.items(), key=lambda x: x[0]):
        print(f"  {sec}: {count} labels")


if __name__ == '__main__':
    main()
