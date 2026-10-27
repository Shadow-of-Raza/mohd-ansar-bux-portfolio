import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

out_dir = r"c:\Projects\ANSAR-PORTFOLIO\docs\walkthroughs\screenshots\POLISH_2026-10-27"

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=768,1024")
options.add_argument("--hide-scrollbars")
driver = webdriver.Chrome(options=options)
try:
    driver.get("http://localhost:3002/projects/apex-structure-platform")
    time.sleep(1.2)
    pd_hero = driver.find_element(By.ID, "pd-hero")
    driver.execute_script("arguments[0].scrollIntoView();", pd_hero)
    time.sleep(0.4)
    driver.save_screenshot(os.path.join(out_dir, "before-768-p1-project-hero.png"))
finally:
    driver.quit()

# Contact form at 1440 and 375
for width, height, prefix in [(1440, 900, "1440"), (375, 812, "375")]:
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument(f"--window-size={width},{height}")
    opts.add_argument("--hide-scrollbars")
    d = webdriver.Chrome(options=opts)
    try:
        d.get("http://localhost:3002/contact")
        time.sleep(1.2)
        form = d.find_element(By.TAG_NAME, "form")
        d.execute_script("arguments[0].scrollIntoView();", form)
        time.sleep(0.4)
        d.save_screenshot(os.path.join(out_dir, f"before-{prefix}-c2-contact-form.png"))
        d.save_screenshot(os.path.join(out_dir, f"before-{prefix}-c3-contact-cta.png"))
    finally:
        d.quit()

print("Group 3 missing before screenshots saved successfully!")
