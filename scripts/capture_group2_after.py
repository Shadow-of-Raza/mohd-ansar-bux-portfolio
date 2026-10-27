import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

out_dir = r"c:\Projects\ANSAR-PORTFOLIO\docs\walkthroughs\screenshots\POLISH_2026-10-27"
os.makedirs(out_dir, exist_ok=True)

viewports = [
    (1440, 900, "1440"),
    (375, 812, "375")
]

for width, height, prefix in viewports:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument(f"--window-size={width},{height}")
    options.add_argument("--hide-scrollbars")
    driver = webdriver.Chrome(options=options)
    try:
        print(f"Capturing Group 2 AFTER screenshots for {prefix}...")
        driver.get("http://localhost:3002/")
        time.sleep(1.5)

        # H1: Hero above the fold (first viewport)
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(0.3)
        driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-h1-hero.png"))

        # H2: Services section
        services_sec = driver.find_element(By.ID, "services")
        driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", services_sec)
        time.sleep(0.5)
        driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-h2-services.png"))

        # H3: Experience preview section
        exp_sec = driver.find_element(By.ID, "experience")
        driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", exp_sec)
        time.sleep(0.5)
        driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-h3-experience.png"))

        # H4: Education section
        edu_sec = driver.find_element(By.ID, "education")
        driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", edu_sec)
        time.sleep(0.5)
        driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-h4-education.png"))

        # H5: Projects preview section
        proj_sec = driver.find_element(By.ID, "projects")
        driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", proj_sec)
        time.sleep(0.5)
        driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-h5-projects.png"))

        # H6: Skills popover on mobile
        skills_sec = driver.find_element(By.ID, "skills")
        driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", skills_sec)
        time.sleep(0.5)
        try:
            skill_btn = skills_sec.find_element(By.CSS_SELECTOR, "[role='button'][aria-haspopup='dialog']")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", skill_btn)
            time.sleep(0.3)
            skill_btn.click()
            time.sleep(0.5)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-h6-skills-popover.png"))
        except Exception as e:
            print("Could not click skill button on home:", e)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-h6-skills.png"))

        if prefix == "375":
            # Also test /skills popover on 375
            driver.get("http://localhost:3002/skills")
            time.sleep(1.2)
            try:
                skill_btn = driver.find_element(By.CSS_SELECTOR, "[role='button'][aria-haspopup='dialog']")
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", skill_btn)
                time.sleep(0.3)
                skill_btn.click()
                time.sleep(0.5)
                driver.save_screenshot(os.path.join(out_dir, "after-375-h6-skills-page-popover.png"))
            except Exception as e:
                print("Could not click skill button on /skills:", e)

    finally:
        driver.quit()

print("Group 2 AFTER screenshots captured successfully!")
