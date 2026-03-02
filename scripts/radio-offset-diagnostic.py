#!/usr/bin/env python3
"""
Precise diagnostic: measure radio vs checkbox alignment offset
against the PDF background image in the live browser.
"""
from playwright.sync_api import sync_playwright
import json, time

APP = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 1800, "height": 1200}, device_scale_factor=3)
    page = ctx.new_page()

    # Auth
    email = f"diag-{int(time.time())}@test.dev"
    pw = "diagCheck1234"
    import urllib.request
    req = urllib.request.Request(
        f"{APP}/api/auth/register",
        data=json.dumps({"email": email, "password": pw}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    urllib.request.urlopen(req, timeout=10)

    page.goto(f"{APP}/login", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(2000)
    page.fill("input#email", email)
    page.fill("input#password", pw)
    page.click('button[type="submit"]')
    for _ in range(30):
        page.wait_for_timeout(500)
        if "/login" not in page.url:
            break

    # Create form
    page.goto(f"{APP}/new", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(3000)
    page.click('button:has-text("Create Form")')
    for _ in range(30):
        page.wait_for_timeout(500)
        if "/identification/section1" in page.url:
            break
    sub_id = page.url.split("/")[3]
    print(f"Form: {sub_id}")

    def setup_pdf_layout():
        btn = page.locator('button:has-text("PDF Layout")')
        if btn.count() > 0:
            btn.click()
            page.wait_for_timeout(2000)
        # Set opacity 100%
        page.evaluate("""() => {
            const s = document.querySelector('input[type="range"]');
            if (s) {
                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, '100');
                s.dispatchEvent(new Event('input', { bubbles: true }));
                s.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }""")
        # Show All + Show fields
        sa = page.locator('label:has-text("Show All") input[type="checkbox"]')
        if sa.count() > 0 and not sa.is_checked():
            sa.check()
        sf = page.locator('label:has-text("Show fields") input[type="checkbox"]')
        if sf.count() > 0 and not sf.is_checked():
            sf.check()
        page.wait_for_timeout(3000)
        # Wait for images
        page.evaluate("""async () => {
            const imgs = document.querySelectorAll('.relative.shadow-md img');
            await Promise.all(Array.from(imgs).map(img =>
                img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
            ));
        }""")
        page.wait_for_timeout(1000)

    # Go to section 5 (page 5 0-indexed = 4, which has both radios and checkboxes)
    page.goto(f"{APP}/{sub_id}/identification/section5", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(5000)
    try:
        page.wait_for_function(
            "() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__",
            timeout=15000,
        )
    except:
        pass
    setup_pdf_layout()

    # Diagnostic: inject colored debug markers directly on the page
    # Measure the positions of radio and checkbox elements vs the image
    info = page.evaluate("""() => {
        const results = [];

        // Get all field elements with data-field-key
        const fields = document.querySelectorAll('[data-field-key]');

        // Get the first PDF page frame
        const frames = document.querySelectorAll('.relative.shadow-md');
        if (frames.length === 0) return { error: 'No PDF frames found' };

        const frameRect = frames[0].getBoundingClientRect();
        const img = frames[0].querySelector('img');
        const imgRect = img ? img.getBoundingClientRect() : null;

        const frameInfo = {
            frameX: frameRect.x, frameY: frameRect.y,
            frameW: frameRect.width, frameH: frameRect.height,
            imgX: imgRect?.x, imgY: imgRect?.y,
            imgW: imgRect?.width, imgH: imgRect?.height,
            imgNaturalW: img?.naturalWidth, imgNaturalH: img?.naturalHeight,
        };

        // Get radio and checkbox elements on this frame
        for (const el of fields) {
            const key = el.getAttribute('data-field-key');
            const rect = el.getBoundingClientRect();
            const style = el.getAttribute('style') || '';

            // Check if it's within the first frame
            if (rect.y < frameRect.y || rect.y > frameRect.y + frameRect.height) continue;

            const isRadio = key.includes('radio');
            const child = el.firstElementChild;
            const childTag = child ? child.tagName : 'none';
            const childRect = child ? child.getBoundingClientRect() : null;

            // Compute position relative to frame
            const relX = rect.x - frameRect.x;
            const relY = rect.y - frameRect.y;

            results.push({
                key: key.substring(0, 60),
                isRadio,
                childTag,
                // Container (absolute div) position
                containerX: rect.x,
                containerY: rect.y,
                containerW: rect.width,
                containerH: rect.height,
                // Position relative to frame
                relX, relY,
                // CSS style values
                cssLeft: parseFloat(style.match(/left:\\s*([\\d.]+)px/)?.[1] || '0'),
                cssTop: parseFloat(style.match(/top:\\s*([\\d.]+)px/)?.[1] || '0'),
                // Child element position
                childX: childRect?.x,
                childY: childRect?.y,
                childW: childRect?.width,
                childH: childRect?.height,
                // Offset between container and child
                childOffsetX: childRect ? childRect.x - rect.x : null,
                childOffsetY: childRect ? childRect.y - rect.y : null,
            });
        }

        return { frameInfo, fields: results.slice(0, 30) };
    }""")

    print(f"\n=== Frame Info ===")
    fi = info.get("frameInfo", {})
    print(f"Frame: ({fi.get('frameX'):.1f}, {fi.get('frameY'):.1f}) {fi.get('frameW'):.1f}x{fi.get('frameH'):.1f}")
    print(f"Image: ({fi.get('imgX'):.1f}, {fi.get('imgY'):.1f}) {fi.get('imgW'):.1f}x{fi.get('imgH'):.1f}")
    print(f"Image natural: {fi.get('imgNaturalW')}x{fi.get('imgNaturalH')}")
    print(f"Frame-Image offset: dx={fi.get('imgX', 0) - fi.get('frameX', 0):.2f}, dy={fi.get('imgY', 0) - fi.get('frameY', 0):.2f}")

    print(f"\n=== Field Positions (first 30) ===")
    print(f"{'Key':40} {'Type':8} {'Tag':8} {'relX':>8} {'relY':>8} {'cssL':>8} {'cssT':>8} {'cW':>6} {'cH':>6} {'childOffX':>9} {'childOffY':>9}")
    for f in info.get("fields", []):
        ftype = "RADIO" if f["isRadio"] else "OTHER"
        print(f"{f['key']:40} {ftype:8} {f['childTag']:8} {f['relX']:8.2f} {f['relY']:8.2f} {f['cssLeft']:8.2f} {f['cssTop']:8.2f} {f['containerW']:6.1f} {f['containerH']:6.1f} {f.get('childOffsetX', 0) or 0:9.2f} {f.get('childOffsetY', 0) or 0:9.2f}")

    # Take crops
    # Find a radio element and take tight crop
    radios = [f for f in info.get("fields", []) if f["isRadio"]]
    others = [f for f in info.get("fields", []) if not f["isRadio"]]

    if radios:
        r = radios[0]
        pad = 15
        page.screenshot(
            path="/tmp/diag_radio_crop.png",
            clip={
                "x": max(0, r["containerX"] - pad),
                "y": max(0, r["containerY"] - pad),
                "width": r["containerW"] + pad * 2,
                "height": r["containerH"] + pad * 2,
            },
        )
        print(f"\nRadio crop saved: /tmp/diag_radio_crop.png")

    if others:
        o = others[0]
        pad = 15
        page.screenshot(
            path="/tmp/diag_other_crop.png",
            clip={
                "x": max(0, o["containerX"] - pad),
                "y": max(0, o["containerY"] - pad),
                "width": o["containerW"] + pad * 2,
                "height": o["containerH"] + pad * 2,
            },
        )
        print(f"Other crop saved: /tmp/diag_other_crop.png")

    # Take a big crop showing both types
    if radios and others:
        all_fields = radios[:3] + others[:3]
        min_x = min(f["containerX"] for f in all_fields)
        min_y = min(f["containerY"] for f in all_fields)
        max_x = max(f["containerX"] + f["containerW"] for f in all_fields)
        max_y = max(f["containerY"] + f["containerH"] for f in all_fields)
        page.screenshot(
            path="/tmp/diag_combo_crop.png",
            clip={
                "x": max(0, min_x - 30),
                "y": max(0, min_y - 20),
                "width": max_x - min_x + 60,
                "height": max_y - min_y + 40,
            },
        )
        print(f"Combo crop saved: /tmp/diag_combo_crop.png")

    # Now let's try section 9 which had the most visible issues
    print("\n\n=== Section 9 ===")
    page.goto(f"{APP}/{sub_id}/citizenship/section9", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(5000)
    try:
        page.wait_for_function(
            "() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__",
            timeout=15000,
        )
    except:
        pass
    setup_pdf_layout()

    s9_info = page.evaluate("""() => {
        const results = [];
        const fields = document.querySelectorAll('[data-field-key]');
        const frames = document.querySelectorAll('.relative.shadow-md');
        if (frames.length === 0) return { error: 'No frames' };

        const frameRect = frames[0].getBoundingClientRect();

        for (const el of fields) {
            const key = el.getAttribute('data-field-key');
            const rect = el.getBoundingClientRect();
            if (rect.y < frameRect.y || rect.y > frameRect.y + frameRect.height) continue;

            const isRadio = key.includes('radio');
            const child = el.firstElementChild;
            const childRect = child ? child.getBoundingClientRect() : null;

            results.push({
                key: key.substring(0, 60),
                isRadio,
                childTag: child ? child.tagName : 'none',
                relX: rect.x - frameRect.x,
                relY: rect.y - frameRect.y,
                containerW: rect.width,
                containerH: rect.height,
                childOffsetX: childRect ? childRect.x - rect.x : null,
                childOffsetY: childRect ? childRect.y - rect.y : null,
                childW: childRect?.width,
                childH: childRect?.height,
            });
        }
        return { frameW: frameRect.width, frameH: frameRect.height, fields: results };
    }""")

    print(f"Frame: {s9_info.get('frameW', 0):.1f}x{s9_info.get('frameH', 0):.1f}")
    print(f"\n{'Key':50} {'Type':6} {'Tag':8} {'relX':>7} {'relY':>7} {'cW':>5} {'cH':>5} {'chOffX':>7} {'chOffY':>7} {'chW':>5} {'chH':>5}")
    for f in s9_info.get("fields", [])[:20]:
        ftype = "RADIO" if f["isRadio"] else "OTHER"
        print(f"{f['key']:50} {ftype:6} {f['childTag']:8} {f['relX']:7.2f} {f['relY']:7.2f} {f['containerW']:5.1f} {f['containerH']:5.1f} {f.get('childOffsetX', 0) or 0:7.2f} {f.get('childOffsetY', 0) or 0:7.2f} {f.get('childW', 0) or 0:5.1f} {f.get('childH', 0) or 0:5.1f}")

    # Take s9 radio crops at 3x
    s9_radios = [f for f in s9_info.get("fields", []) if f["isRadio"]]
    if s9_radios:
        for i, r in enumerate(s9_radios[:4]):
            el = page.locator(f'[data-field-key="{r["key"]}"]').first
            el.scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            box = el.bounding_box()
            if box:
                page.screenshot(
                    path=f"/tmp/s9_radio_{i}.png",
                    clip={
                        "x": max(0, box["x"] - 12),
                        "y": max(0, box["y"] - 12),
                        "width": box["width"] + 24,
                        "height": box["height"] + 24,
                    },
                )
        print(f"\nSaved s9 radio crops")

    browser.close()
    print("\nDone!")
