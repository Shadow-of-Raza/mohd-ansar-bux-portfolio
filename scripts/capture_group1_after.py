import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

out_dir = r"c:\Projects\ANSAR-PORTFOLIO\docs\walkthroughs\screenshots\POLISH_2026-10-27"
os.makedirs(out_dir, exist_ok=True)

viewports = [
    (1440, 900, "1440"),
    (375, 812, "375")
]

pages = [
    ("http://localhost:3002/about", "about"),
    ("http://localhost:3002/services", "services"),
    ("http://localhost:3002/experience", "experience"),
    ("http://localhost:3002/education", "education"),
    ("http://localhost:3002/skills", "skills"),
    ("http://localhost:3002/projects", "projects"),
    ("http://localhost:3002/projects/apex-structure-platform", "project-apex"),
    ("http://localhost:3002/contact", "contact")
]

all_images_status = []

for width, height, prefix in viewports:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument(f"--window-size={width},{height}")
    options.add_argument("--hide-scrollbars")
    driver = webdriver.Chrome(options=options)
    try:
        print(f"Capturing Group 1 AFTER screenshots for {prefix}...")
        for url, name in pages:
            driver.get(url)
            time.sleep(1.2)

            # Check G7: verify every image loads properly
            img_results = driver.execute_script("""
                const imgs = Array.from(document.querySelectorAll('img'));
                return imgs.map(img => ({
                    src: img.src,
                    currentSrc: img.currentSrc,
                    alt: img.alt,
                    complete: img.complete,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight
                }));
            """)
            for img in img_results:
                is_loaded = img["complete"] and img["naturalWidth"] > 0
                all_images_status.append({
                    "page": name,
                    "viewport": prefix,
                    "src": img["src"],
                    "loaded": is_loaded,
                    "naturalWidth": img["naturalWidth"]
                })

            # Capture viewport top (hero area)
            driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(0.3)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-{name}-hero.png"))

            if name == "contact":
                # Scroll to bottom to capture footer CTA band (should be hidden per G6)
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(0.5)
                driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-contact-footer.png"))

            if name == "about":
                # Also capture bottom footer bar
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(0.5)
                driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-footer-bar.png"))
    finally:
        driver.quit()

print(f"\n--- G7 Image Verification Results ---")
broken_images = [img for img in all_images_status if not img["loaded"]]
if broken_images:
    print(f"FAILED: {len(broken_images)} broken images detected:")
    for b in broken_images:
        print(f"  [{b['viewport']}] {b['page']}: {b['src']}")
else:
    print(f"PASSED: All {len(all_images_status)} checked images loaded successfully with naturalWidth > 0!")

print("Group 1 AFTER screenshots captured successfully!")
