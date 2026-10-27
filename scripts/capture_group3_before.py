import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

out_dir = r"c:\Projects\ANSAR-PORTFOLIO\docs\walkthroughs\screenshots\POLISH_2026-10-27"
os.makedirs(out_dir, exist_ok=True)

viewports = [
    (1440, 900, "1440"),
    (375, 812, "375"),
]

for width, height, prefix in viewports:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument(f"--window-size={width},{height}")
    options.add_argument("--hide-scrollbars")
    driver = webdriver.Chrome(options=options)
    try:
        print(f"Capturing Group 3 BEFORE screenshots for {prefix}...")

        # A1: About hobbies
        driver.get("http://localhost:3002/about")
        time.sleep(1.2)
        try:
            hobbies_sec = driver.find_element(By.ID, "hobbies")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", hobbies_sec)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-a1-about-hobbies.png"))
        except Exception as e:
            print("Could not find hobbies section:", e)

        # S1: Services detail (process, faq, ideal for)
        driver.get("http://localhost:3002/services")
        time.sleep(1.2)
        try:
            # Scroll to full-stack service
            service_sec = driver.find_element(By.ID, "full-stack-web-development")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", service_sec)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-s1-services.png"))
        except Exception as e:
            print("Could not find services section:", e)

        # E1: Experience company rail
        driver.get("http://localhost:3002/experience")
        time.sleep(1.2)
        try:
            rail_sec = driver.find_element(By.CSS_SELECTOR, "nav[aria-label='Experience companies index']")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", rail_sec)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-e1-experience-rail.png"))
        except Exception as e:
            print("Could not find experience rail:", e)

        # K1: Skills category gaps
        driver.get("http://localhost:3002/skills")
        time.sleep(1.2)
        try:
            skills_sec = driver.find_element(By.ID, "skill-groups")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", skills_sec)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-k1-skills-gaps.png"))
        except Exception as e:
            print("Could not find skill-groups:", e)

        # C1: Contact hero
        driver.get("http://localhost:3002/contact")
        time.sleep(1.2)
        try:
            contact_hero = driver.find_element(By.ID, "contact-hero")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", contact_hero)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-c1-contact-hero.png"))
        except Exception as e:
            print("Could not find contact-hero:", e)

        # C2 & C3: Contact form
        try:
            form_sec = driver.find_element(By.ID, "contact-form")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", form_sec)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-c2-contact-form.png"))
            driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-c3-contact-cta.png"))
        except Exception as e:
            print("Could not find contact-form:", e)

        # P1: Project detail hero
        driver.get("http://localhost:3002/projects/apex-structure-platform")
        time.sleep(1.2)
        try:
            pd_hero = driver.find_element(By.ID, "pd-hero")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", pd_hero)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"before-{prefix}-p1-project-hero.png"))
        except Exception as e:
            print("Could not find pd-hero:", e)

    finally:
        driver.quit()

# Also capture 768px for P1 (tablet long title check)
options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=768,1024")
options.add_argument("--hide-scrollbars")
driver = webdriver.Chrome(options=options)
try:
    driver.get("http://localhost:3002/projects/apex-structure-platform")
    time.sleep(1.2)
    pd_hero = driver.find_element(By.ID, "pd-hero")
    driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", pd_hero)
    time.sleep(0.4)
    driver.save_screenshot(os.path.join(out_dir, "before-768-p1-project-hero.png"))
finally:
    driver.quit()

print("Group 3 BEFORE screenshots captured successfully!")
