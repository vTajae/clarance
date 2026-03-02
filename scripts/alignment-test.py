"""
Alignment diagnosis: captures PDF Layout screenshots focusing on
radio circles and SSN page header fields to detect misalignment.
"""
from playwright.sync_api import sync_playwright
import time, json, os

APP = "http://localhost:3000"
OUT = "/tmp/alignment-diag"
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    ctx = browser.new_context(viewport={"width": 1400, "height": 1000})
    page = ctx.new_page()

    # 1. Register
    email = f"align-{int(time.time())}@test.dev"
    pw = "alignTest123"
    page.goto(f"{APP}/register", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_load_state("networkidle")
    page.screenshot(path=f"{OUT}/00-register-page.png")

    # Fill registration form
    page.fill('input#email', email)
    page.fill('input#password', pw)
    # Look for confirm password field
    confirm = page.locator('input#confirmPassword')
    if confirm.count() > 0:
        confirm.fill(pw)
    page.click('button[type="submit"]')
    page.wait_for_timeout(3000)
    page.screenshot(path=f"{OUT}/01-after-register.png")
    print(f"Registered: {email}")
    print(f"URL after register: {page.url}")

    # 2. Login if redirected
    if "login" in page.url:
        page.fill('input#email', email)
        page.fill('input#password', pw)
        page.click('button[type="submit"]')
        page.wait_for_timeout(3000)
        page.screenshot(path=f"{OUT}/02-after-login.png")
        print(f"URL after login: {page.url}")

    # 3. Create form
    page.goto(f"{APP}/new", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    page.screenshot(path=f"{OUT}/03-new-page.png")

    create_btn = page.locator('button:has-text("Create Form")')
    if create_btn.count() > 0:
        create_btn.click()
        page.wait_for_timeout(5000)
    page.screenshot(path=f"{OUT}/04-after-create.png")
    print(f"URL after create: {page.url}")

    # Extract submission ID from URL
    parts = page.url.split("/")
    sub_id = None
    for i, part in enumerate(parts):
        if len(part) == 36 and "-" in part:  # UUID
            sub_id = part
            break
    print(f"Submission ID: {sub_id}")

    if not sub_id:
        print("ERROR: Could not get submission ID")
        page.screenshot(path=f"{OUT}/ERROR-no-submission.png")
        browser.close()
        exit(1)

    # Helper: setup PDF Layout mode
    def setup_pdf_layout():
        pdf_btn = page.locator('button:has-text("PDF Layout")')
        if pdf_btn.count() > 0:
            pdf_btn.click()
            page.wait_for_timeout(2000)

        # Opacity 100%
        page.evaluate("""() => {
            const s = document.querySelector('input[type="range"]');
            if (s) {
                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
                    .set.call(s, '100');
                s.dispatchEvent(new Event('input', { bubbles: true }));
                s.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }""")

        # Show All
        sa = page.locator('label:has-text("Show All") input[type="checkbox"]')
        if sa.count() > 0 and not sa.is_checked():
            sa.check()
            page.wait_for_timeout(500)

        # Show fields
        sf = page.locator('label:has-text("Show fields") input[type="checkbox"]')
        if sf.count() > 0 and not sf.is_checked():
            sf.check()
            page.wait_for_timeout(500)

        page.wait_for_timeout(500)

    # ================================================================
    # TEST 1: RADIO ALIGNMENT — section8 (page 7)
    # ================================================================
    print("\n=== RADIO ALIGNMENT (section8) ===")
    page.goto(f"{APP}/{sub_id}/citizenship/section8",
              wait_until="domcontentloaded", timeout=60000)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3000)

    # Wait for Jotai
    page.wait_for_function(
        "() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__",
        timeout=30000
    )

    setup_pdf_layout()
    page.screenshot(path=f"{OUT}/10-section8-pdf-layout.png", full_page=True)

    # Get page frame info
    frame_info = page.evaluate("""() => {
        const frames = document.querySelectorAll('.relative.shadow-md');
        const results = [];
        for (const f of frames) {
            const box = f.getBoundingClientRect();
            results.push({ x: box.x, y: box.y, w: box.width, h: box.height });
        }
        return results;
    }""")
    print(f"Page frames: {len(frame_info)}")
    if frame_info:
        f = frame_info[0]
        scale = f["w"] / 612
        print(f"  Frame 0: {f['w']:.1f}x{f['h']:.1f} scale={scale:.4f}")

    # Get radio widget DOM positions
    radio_data = page.evaluate("""() => {
        const els = document.querySelectorAll('[data-field-key*="radio"]');
        const results = [];
        for (const el of els) {
            const box = el.getBoundingClientRect();
            results.push({
                key: el.getAttribute('data-field-key'),
                screenX: box.x, screenY: box.y,
                screenW: box.width, screenH: box.height,
                style: el.getAttribute('style')
            });
        }
        return results;
    }""")
    print(f"Radio widgets in DOM: {len(radio_data)}")
    for r in radio_data[:6]:
        print(f"  {r['key']}: screen=({r['screenX']:.1f},{r['screenY']:.1f}) "
              f"size={r['screenW']:.1f}x{r['screenH']:.1f}")
        print(f"    style: {r['style']}")

    # Scroll to see page 7 closely and take cropped screenshot
    page.evaluate("""() => {
        const headers = document.querySelectorAll('span.text-xs.font-mono');
        for (const h of headers) {
            if (h.textContent?.includes('Page 7')) {
                h.scrollIntoView({ behavior: 'instant', block: 'start' });
                break;
            }
        }
    }""")
    page.wait_for_timeout(500)
    page.screenshot(path=f"{OUT}/11-section8-page7-radios.png")

    # Get ALL field elements to check what's rendered
    all_fields = page.evaluate("""() => {
        const els = document.querySelectorAll('[data-field-key]');
        return Array.from(els).map(el => ({
            key: el.getAttribute('data-field-key'),
            tag: el.tagName,
            w: el.getBoundingClientRect().width,
            h: el.getBoundingClientRect().height
        }));
    }""")
    print(f"\nAll data-field-key elements: {len(all_fields)}")
    radio_els = [f for f in all_fields if "radio" in (f["key"] or "")]
    non_radio = [f for f in all_fields if "radio" not in (f["key"] or "")]
    print(f"  Radio: {len(radio_els)}")
    print(f"  Non-radio: {len(non_radio)}")
    if radio_els:
        for r in radio_els[:4]:
            print(f"    {r['key']}: {r['w']:.1f}x{r['h']:.1f}")

    # ================================================================
    # TEST 2: SSN PAGE HEADER — section1 (page 5 bottom)
    # ================================================================
    print("\n=== SSN HEADER ALIGNMENT (section1) ===")
    page.goto(f"{APP}/{sub_id}/identification/section1",
              wait_until="domcontentloaded", timeout=60000)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3000)

    page.wait_for_function(
        "() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__",
        timeout=30000
    )

    setup_pdf_layout()

    # Full page screenshot
    page.screenshot(path=f"{OUT}/20-section1-pdf-layout.png", full_page=True)

    # Get SSN field elements
    ssn_fields = page.evaluate("""() => {
        const els = document.querySelectorAll('[data-field-key]');
        return Array.from(els).filter(el => {
            const key = el.getAttribute('data-field-key') || '';
            return key.includes('yourSocialSecurity') || key.includes('autofill') || key.includes('Autofill');
        }).map(el => {
            const box = el.getBoundingClientRect();
            return {
                key: el.getAttribute('data-field-key'),
                style: el.getAttribute('style'),
                screenX: box.x, screenY: box.y,
                screenW: box.width, screenH: box.height
            };
        });
    }""")
    print(f"SSN header fields: {len(ssn_fields)}")
    for f in ssn_fields[:3]:
        print(f"  {f['key']}: screen=({f['screenX']:.1f},{f['screenY']:.1f}) "
              f"size={f['screenW']:.1f}x{f['screenH']:.1f}")

    # Scroll to bottom of page to see SSN area
    page.evaluate("""() => {
        const frame = document.querySelector('.relative.shadow-md');
        if (frame) {
            const box = frame.getBoundingClientRect();
            window.scrollTo(0, window.scrollY + box.bottom - 150);
        }
    }""")
    page.wait_for_timeout(500)
    page.screenshot(path=f"{OUT}/21-section1-page-bottom-ssn.png")

    # Get page frame for section1
    s1_frame = page.evaluate("""() => {
        const frame = document.querySelector('.relative.shadow-md');
        if (!frame) return null;
        const box = frame.getBoundingClientRect();
        return { x: box.x, y: box.y, w: box.width, h: box.height };
    }""")
    if s1_frame:
        scale = s1_frame["w"] / 612
        print(f"\nPage frame: {s1_frame['w']:.1f}x{s1_frame['h']:.1f} scale={scale:.4f}")
        ssn_expected_top = 739 * scale
        ssn_expected_bottom = (739 + 13.67) * scale
        print(f"SSN expected: top={ssn_expected_top:.1f}px bottom={ssn_expected_bottom:.1f}px")
        print(f"Page frame height: {s1_frame['h']:.1f}px (PDF_HEIGHT*scale={792*scale:.1f})")

    # Count all data-field-key elements in section1
    s1_fields = page.evaluate("""() => {
        const els = document.querySelectorAll('[data-field-key]');
        return els.length;
    }""")
    print(f"\nTotal data-field-key elements in section1: {s1_fields}")

    # ================================================================
    # TEST 3: section10 — radios + checkboxes + dates (known good from cropped proof)
    # ================================================================
    print("\n=== SECTION 10 ALIGNMENT (radios + mixed types) ===")
    page.goto(f"{APP}/{sub_id}/citizenship/section10",
              wait_until="domcontentloaded", timeout=60000)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(3000)

    page.wait_for_function(
        "() => window.__JOTAI_STORE__ && window.__FIELD_VALUE_ATOM_FAMILY__",
        timeout=30000
    )

    setup_pdf_layout()

    # Scroll to page 8 (first page with radios)
    page.evaluate("""() => {
        const headers = document.querySelectorAll('span.text-xs.font-mono');
        for (const h of headers) {
            if (h.textContent?.includes('Page 8')) {
                h.scrollIntoView({ behavior: 'instant', block: 'start' });
                break;
            }
        }
    }""")
    page.wait_for_timeout(500)
    page.screenshot(path=f"{OUT}/30-section10-page8.png")

    # Get radio data for section10
    s10_radios = page.evaluate("""() => {
        const els = document.querySelectorAll('[data-field-key*="radio"]');
        return Array.from(els).map(el => {
            const box = el.getBoundingClientRect();
            return {
                key: el.getAttribute('data-field-key'),
                style: el.getAttribute('style'),
                screenX: box.x, screenY: box.y,
                screenW: box.width, screenH: box.height
            };
        });
    }""")
    print(f"Section10 radio widgets: {len(s10_radios)}")
    for r in s10_radios[:8]:
        print(f"  {r['key']}: ({r['screenX']:.1f},{r['screenY']:.1f}) "
              f"{r['screenW']:.1f}x{r['screenH']:.1f}")
        # Parse CSS for comparison
        import re
        left = re.search(r'left:\s*([\d.]+)', r['style'] or '')
        top = re.search(r'top:\s*([\d.]+)', r['style'] or '')
        if left and top:
            print(f"    CSS: left={float(left.group(1)):.1f} top={float(top.group(1)):.1f}")

    browser.close()
    print(f"\nScreenshots saved to {OUT}/")
