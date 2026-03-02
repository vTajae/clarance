#!/usr/bin/env python3
"""
SF-86 Export Pipeline Audit — Full Chain Verification (stdlib only)

Tests the COMPLETE export chain:
  UI values → Next.js /api/pdf/export → value transformer → PDF service → filled PDF → extract → compare

Falls back to direct PDF service testing if Next.js isn't running.
Uses only Python stdlib (no pip dependencies).
"""

import json
import sys
import os
import re
import time
import tempfile
import urllib.request
import urllib.error
from collections import defaultdict

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
REGISTRY_PATH = os.path.join(PROJECT_DIR, "app", "src", "lib", "field-registry", "field-registry.json")

NEXTJS_URL = "http://localhost:3000"
PDF_SERVICE_URL = "http://localhost:8001"


def load_registry():
    with open(REGISTRY_PATH) as f:
        return json.load(f)


def post_json(url, data, timeout=120):
    """POST JSON and return (status, body_bytes)."""
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        url, data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except (urllib.error.URLError, OSError) as e:
        return None, str(e).encode()


def post_multipart(url, filepath, timeout=60):
    """POST a file as multipart/form-data."""
    boundary = "----FormBoundary7MA4YWxkTrZu0gW"
    filename = os.path.basename(filepath)

    with open(filepath, "rb") as f:
        file_data = f.read()

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: application/pdf\r\n\r\n"
    ).encode() + file_data + f"\r\n--{boundary}--\r\n".encode()

    req = urllib.request.Request(
        url, data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except (urllib.error.URLError, OSError) as e:
        return None, str(e).encode()


def generate_ui_values(registry):
    """Generate realistic UI-side values for each field type."""
    values = {}
    for field in registry:
        sk = field["semanticKey"]
        ft = field.get("pdfFieldType", "")
        vm = field.get("valueMap")
        opts = field.get("options", [])
        ui_type = field.get("uiFieldType", "text")

        if ft == "PDFTextField":
            if ui_type in ("date", "dateRange"):
                values[sk] = "2024-01-15"
            elif ui_type == "ssn":
                values[sk] = "123456789"
            elif ui_type == "phone":
                values[sk] = "+12025551234"
            else:
                label = field.get("label", "test")
                max_len = field.get("maxLength", 50)
                test_val = f"Test {label[:20]}"
                if max_len and max_len > 0:
                    test_val = test_val[:max_len]
                values[sk] = test_val

        elif ft == "PDFCheckBox":
            values[sk] = True

        elif ft == "PDFDropdown":
            if opts:
                values[sk] = opts[0]
            else:
                values[sk] = "United States"

        elif ft == "PDFRadioGroup":
            # The UI stores the OPTION LABEL (e.g., "YES"), not the numeric index.
            # RadioGroupField uses options[].value which comes from registry options[].
            # On export, forwardValueMap converts "YES" → "1" for the PDF service.
            if opts:
                values[sk] = opts[0]  # e.g., "YES", "Male", "Active Duty"
            elif vm:
                # Fallback: find a non-numeric key (the display label)
                label_keys = [k for k in vm.keys() if not k.isdigit()]
                if label_keys:
                    values[sk] = label_keys[0]

    return values


def simulate_ui_to_pdf(ui_val, field):
    """Replicate the TypeScript uiToPdf() transformer logic in Python."""
    ft = field.get("pdfFieldType", "")
    vm = field.get("valueMap")
    ui_type = field.get("uiFieldType", "text")

    if ui_val == "" or ui_val is None:
        return ""

    if ui_type in ("date", "dateRange") and isinstance(ui_val, str):
        m = re.match(r'^(\d{4})-(\d{2})-(\d{2})', ui_val)
        if m:
            return f"{m.group(2)}/{m.group(3)}/{m.group(1)}"
        return ui_val

    if ui_type in ("checkbox", "branch"):
        if isinstance(ui_val, bool):
            return "Yes" if ui_val else "No"
        if isinstance(ui_val, str):
            return "Yes" if ui_val.lower() in ("true", "yes", "on", "1") else "No"
        return "Yes" if ui_val else "No"

    if ui_type == "ssn" and isinstance(ui_val, str):
        clean = re.sub(r'\D', '', ui_val)
        if len(clean) == 9:
            return f"{clean[:3]}-{clean[3:5]}-{clean[5:]}"
        return clean

    if ui_type == "phone" and isinstance(ui_val, str):
        digits = re.sub(r'\D', '', ui_val)
        if len(digits) == 11 and digits.startswith("1"):
            digits = digits[1:]
        if len(digits) == 10:
            return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
        return digits

    # Default: valueMap or passthrough
    if vm and isinstance(ui_val, str):
        return vm.get(ui_val, ui_val)

    return str(ui_val) if ui_val is not None else ""


def main():
    print("=" * 70)
    print("SF-86 EXPORT PIPELINE AUDIT — Full Chain Verification")
    print("=" * 70)

    registry = load_registry()
    reg_by_sk = {f["semanticKey"]: f for f in registry}
    print(f"Registry loaded: {len(registry)} fields")

    ui_values = generate_ui_values(registry)
    print(f"Generated {len(ui_values)} test UI values\n")

    # -----------------------------------------------------------------------
    # Step 1: Try the Next.js export route
    # -----------------------------------------------------------------------
    print("[Step 1] POST to Next.js /api/pdf/export...")
    nextjs_pdf = None
    start = time.time()
    status, body = post_json(f"{NEXTJS_URL}/api/pdf/export", {"values": ui_values})
    elapsed = time.time() - start

    if status == 200 and len(body) > 1000:
        nextjs_pdf = body
        print(f"  ✔ Received {len(body):,} bytes in {elapsed:.1f}s")
    else:
        print(f"  ✗ Next.js not available (status={status})")
        print(f"    Falling back to direct PDF service...")

    # -----------------------------------------------------------------------
    # Step 2: Also do offline simulation for comparison
    # -----------------------------------------------------------------------
    print("\n[Step 2] Simulating value transformer + direct PDF service fill...")

    pdf_field_values = {}
    transform_log = {}

    for sk, ui_val in ui_values.items():
        field = reg_by_sk.get(sk)
        if not field:
            continue
        pdf_name = field["pdfFieldName"]
        pdf_val = simulate_ui_to_pdf(ui_val, field)
        if pdf_val:
            pdf_field_values[pdf_name] = pdf_val
            transform_log[sk] = {
                "pdfFieldName": pdf_name,
                "uiValue": str(ui_val),
                "pdfValue": pdf_val,
                "fieldType": field.get("pdfFieldType", ""),
            }

    print(f"  Transformed {len(pdf_field_values)} field values")

    start = time.time()
    status2, body2 = post_json(
        f"{PDF_SERVICE_URL}/fill-pdf",
        {"template_path": "sf861.pdf", "field_values": pdf_field_values},
    )
    elapsed2 = time.time() - start

    if status2 != 200:
        print(f"  ✗ PDF service fill failed: {status2}")
        return 1

    offline_pdf = body2
    print(f"  ✔ Received {len(body2):,} bytes in {elapsed2:.1f}s")

    # -----------------------------------------------------------------------
    # Step 3: Extract fields from both PDFs and compare
    # -----------------------------------------------------------------------
    pdfs_to_test = []
    if nextjs_pdf:
        pdfs_to_test.append(("Next.js Route", nextjs_pdf))
    pdfs_to_test.append(("Direct PDF Service", offline_pdf))

    for label, pdf_bytes in pdfs_to_test:
        print(f"\n[Step 3] Extracting & comparing: {label}")

        tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
        tmp.write(pdf_bytes)
        tmp.close()

        start = time.time()
        status3, body3 = post_multipart(f"{PDF_SERVICE_URL}/extract-fields", tmp.name)
        elapsed3 = time.time() - start
        os.unlink(tmp.name)

        if status3 != 200:
            print(f"  ✗ Extract failed: {status3}")
            continue

        extracted = json.loads(body3).get("fields", {})
        print(f"  Extracted {len(extracted)} fields in {elapsed3:.1f}s")

        # Compare
        results = {
            "TextField": {"sent": 0, "match": 0, "mismatch": []},
            "CheckBox":  {"sent": 0, "match": 0, "mismatch": []},
            "Dropdown":  {"sent": 0, "match": 0, "mismatch": []},
            "RadioGroup":{"sent": 0, "match": 0, "mismatch": []},
        }
        type_map = {
            "PDFTextField": "TextField",
            "PDFCheckBox": "CheckBox",
            "PDFDropdown": "Dropdown",
            "PDFRadioGroup": "RadioGroup",
        }

        for sk, ui_val in ui_values.items():
            field = reg_by_sk.get(sk)
            if not field:
                continue

            pdf_name = field["pdfFieldName"]
            ft = type_map.get(field.get("pdfFieldType", ""), "Unknown")
            if ft not in results:
                continue

            results[ft]["sent"] += 1
            expected_pdf = pdf_field_values.get(pdf_name, "")
            extracted_val = extracted.get(pdf_name, "")

            matched = False
            if extracted_val == expected_pdf:
                matched = True
            elif ft == "CheckBox":
                # Normalize: "Yes"/"1"/"2" etc. are all truthy
                ext_true = extracted_val not in ("", "Off", "No", None)
                exp_true = expected_pdf not in ("", "Off", "No", None)
                matched = ext_true == exp_true
            elif ft == "RadioGroup":
                # Radio: extracted value is 1-based index string
                matched = extracted_val == expected_pdf

            if matched:
                results[ft]["match"] += 1
            else:
                results[ft]["mismatch"].append({
                    "sk": sk,
                    "pdf": pdf_name,
                    "ui": str(ui_val),
                    "expected": expected_pdf,
                    "got": extracted_val,
                })

        # Print table
        print(f"\n  {'─'*60}")
        print(f"  {label} — VERIFICATION RESULTS")
        print(f"  {'─'*60}")
        print(f"  {'Type':<13} {'Sent':>6} {'Match':>6} {'Miss':>6} {'Rate':>8}")
        print(f"  {'─'*60}")

        total_sent = 0
        total_match = 0
        for ft in ("TextField", "CheckBox", "Dropdown", "RadioGroup"):
            r = results[ft]
            total_sent += r["sent"]
            total_match += r["match"]
            rate = 100 * r["match"] / r["sent"] if r["sent"] > 0 else 0
            icon = "✔" if rate == 100 else "⚠" if rate > 90 else "✗"
            print(f"  {ft:<13} {r['sent']:>6} {r['match']:>6} {len(r['mismatch']):>6} {rate:>7.1f}% {icon}")

        total_rate = 100 * total_match / total_sent if total_sent > 0 else 0
        print(f"  {'─'*60}")
        print(f"  {'TOTAL':<13} {total_sent:>6} {total_match:>6} {total_sent - total_match:>6} {total_rate:>7.1f}%")
        print(f"  {'='*60}")

        # Show mismatches
        for ft in ("TextField", "CheckBox", "Dropdown", "RadioGroup"):
            mm = results[ft]["mismatch"]
            if mm:
                print(f"\n  {ft} MISMATCHES ({len(mm)}):")
                for m in mm[:15]:
                    print(f"    {m['pdf']}: ui={m['ui']!r} expected={m['expected']!r} got={m['got']!r}")
                if len(mm) > 15:
                    print(f"    ... and {len(mm) - 15} more")

    # -----------------------------------------------------------------------
    # Step 4: If we tested both paths, compare them
    # -----------------------------------------------------------------------
    if nextjs_pdf and offline_pdf:
        print(f"\n{'='*70}")
        print(f"NEXT.JS vs DIRECT COMPARISON")
        print(f"{'='*70}")
        if nextjs_pdf == offline_pdf:
            print("  ✔ Both paths produce IDENTICAL PDF output (byte-for-byte)")
        else:
            print(f"  ⚠ PDFs differ: Next.js={len(nextjs_pdf)} bytes, Direct={len(offline_pdf)} bytes")
            print("    (This is expected — timestamps differ between fills)")
            print("    The field-by-field comparison above is what matters.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
