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
    ("http://localhost:3000/about", "about"),
    ("http://localhost:3000/services", "services"),
    ("http://localhost:3000/experience", "experience"),
    ("http://localhost:3000/education", "education"),
    ("http://localhost:3000/skills", "skills"),
    ("http://localhost:3000/projects", "projects"),
    ("http://localhost:3000/projects/apex-structure-platform", "project-apex"),
    ("http://localhost:3000/contact", "contact")
]

for width, height, prefix in viewports:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument(f"--window-size={width},{height}")
    options.add_argument("--hide-scrollbars")
    driver = webdriver.Chrome(options=options)
    try:
        print(f"Capturing {prefix}...")
        for url, name in pages:
            driver.get(url)
            time.sleep(1.2)
            # Capture viewport top (hero area)
            driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(0.3)
            driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-{name}-hero.png"))

            if name == "contact":
                # Scroll to bottom to capture footer CTA band
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(0.5)
                driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-contact-footer.png"))

            if name == "about":
                # Also capture bottom footer bar
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(0.5)
                driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-footer-bar.png"))
    finally:
        driver.quit()

print("Group 1 BEFORE screenshots captured successfully!")
