"""
Reusable automated screenshot capture tool for Mohd Ansar Bux's Portfolio.
Uses Selenium with headless Chrome to capture responsive full-page or section screenshots
at standard breakpoints: 1440px (Desktop), 768px (Tablet), and 375px (Mobile).

Prerequisites:
  pip install selenium
  Google Chrome installed (automatically detected by Selenium 4.x)
  Dev server running at http://localhost:3000 (pnpm dev)

Usage:
  python scripts/capture-screenshots.py
  python scripts/capture-screenshots.py --out docs/walkthroughs/screenshots/MY_RUN
"""

import argparse
import sys
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

DEFAULT_OUT_DIR = Path("docs/walkthroughs/screenshots/LATEST")

ROUTES = [
    ("http://localhost:3000/", "home"),
    ("http://localhost:3000/about", "about"),
    ("http://localhost:3000/services", "services"),
    ("http://localhost:3000/experience", "experience"),
    ("http://localhost:3000/education", "education"),
    ("http://localhost:3000/projects", "projects"),
    ("http://localhost:3000/projects/apex-structure-platform", "project-apex"),
    ("http://localhost:3000/skills", "skills"),
    ("http://localhost:3000/contact", "contact"),
    ("http://localhost:3000/this-page-does-not-exist", "404"),
]

VIEWPORTS = [
    (1440, 900, "1440"),
    (768, 1024, "768"),
    (375, 812, "375"),
]

def create_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--hide-scrollbars")
    return webdriver.Chrome(options=options)

def main():
    parser = argparse.ArgumentParser(description="Capture portfolio screenshots across viewports.")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT_DIR, help="Destination directory for screenshots")
    args = parser.parse_args()

    out_dir: Path = args.out
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"[INFO] Output directory: {out_dir}")

    driver = create_driver()
    try:
        # Quick health check
        try:
            driver.get("http://localhost:3000/")
            time.sleep(1)
        except Exception as e:
            print(f"[ERROR] Could not connect to http://localhost:3000. Is the dev server running (`pnpm dev`)? Details: {e}")
            sys.exit(1)

        for width, height, prefix in VIEWPORTS:
            print(f"\n[INFO] --- Capturing {prefix}px Viewport ({width}x{height}) ---")
            driver.set_window_size(width, height)

            for url, name in ROUTES:
                driver.get(url)
                time.sleep(1.2)

                # Hero / Top of page
                driver.execute_script("window.scrollTo(0, 0);")
                time.sleep(0.3)
                shot_path = out_dir / f"{prefix}-{name}-hero.png"
                driver.save_screenshot(str(shot_path))
                print(f"  [OK] Saved: {shot_path.name}")

                # Scrolled state for Home (header + footer), Services, Experience
                if name == "home":
                    driver.execute_script("window.scrollTo(0, 400);")
                    time.sleep(0.4)
                    driver.save_screenshot(str(out_dir / f"{prefix}-header-scrolled.png"))

                    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(0.5)
                    driver.save_screenshot(str(out_dir / f"{prefix}-home-footer.png"))

                elif name == "services":
                    driver.execute_script("window.scrollTo(0, 450);")
                    time.sleep(0.4)
                    driver.save_screenshot(str(out_dir / f"{prefix}-services-scrolled.png"))

                elif name == "experience" and prefix == "375":
                    driver.execute_script("window.scrollTo(0, 150);")
                    time.sleep(0.3)
                    driver.save_screenshot(str(out_dir / f"{prefix}-experience-rail.png"))

        print("\n[SUCCESS] All screenshots captured successfully!")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
