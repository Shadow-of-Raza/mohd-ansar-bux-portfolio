import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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
        print(f"Capturing Group 3 AFTER screenshots for {prefix}...")

        # A1: About hobbies (intentional editorial split)
        driver.get("http://localhost:3002/about")
        time.sleep(1.2)
        try:
            hobbies_sec = driver.find_element(By.ID, "hobbies")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", hobbies_sec)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-a1-about-hobbies.png"))
        except Exception as e:
            print("Could not find hobbies section:", e)

        # S1: Services detail (process, faq, ideal for)
        driver.get("http://localhost:3002/services")
        time.sleep(1.2)
        try:
            service_sec = driver.find_element(By.ID, "full-stack-web-development")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", service_sec)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-s1-services.png"))

            if prefix == "375":
                # On mobile, test expanding the toggle button
                try:
                    toggle_btn = service_sec.find_element(By.CSS_SELECTOR, "button[aria-expanded='false']")
                    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", toggle_btn)
                    time.sleep(0.3)
                    toggle_btn.click()
                    time.sleep(0.4)
                    driver.save_screenshot(os.path.join(out_dir, "after-375-s1-services-expanded.png"))
                except Exception as ex:
                    print("Could not click mobile toggle:", ex)
        except Exception as e:
            print("Could not find services section:", e)

        # E1: Experience company rail
        driver.get("http://localhost:3002/experience")
        time.sleep(1.2)
        try:
            rail_sec = driver.find_element(By.CSS_SELECTOR, "nav[aria-label='Experience companies index']")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", rail_sec)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-e1-experience-rail.png"))
        except Exception as e:
            print("Could not find experience rail:", e)

        # K1: Skills category gaps
        driver.get("http://localhost:3002/skills")
        time.sleep(1.2)
        try:
            skills_sec = driver.find_element(By.ID, "skill-groups")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", skills_sec)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-k1-skills-gaps.png"))
        except Exception as e:
            print("Could not find skill-groups:", e)

        # C1: Contact hero (wider column)
        driver.get("http://localhost:3002/contact")
        time.sleep(1.2)
        try:
            contact_hero = driver.find_element(By.ID, "contact-hero")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", contact_hero)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-c1-contact-hero.png"))
        except Exception as e:
            print("Could not find contact-hero:", e)

        # C2 & C3: Contact form & details CTA
        try:
            time.sleep(1.5) # Wait for client hydration
            form = driver.find_element(By.ID, "contact-form")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", form)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-c2-contact-form.png"))

            # Details CTA title
            details = driver.find_element(By.CSS_SELECTOR, ".lg\\:col-span-5")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", details)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-c3-contact-cta.png"))

            # C2: Trigger inline validation errors by submitting empty form
            submit_btn = form.find_element(By.CSS_SELECTOR, "button[type='submit']")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_btn)
            time.sleep(0.2)
            submit_btn.click()
            time.sleep(0.5)
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", form)
            time.sleep(0.3)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-c2-contact-errors.png"))

            if prefix == "1440":
                # Keyboard focus on first invalid field
                name_input = driver.find_element(By.ID, "contact-name")
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", name_input)
                time.sleep(0.3)
                driver.save_screenshot(os.path.join(out_dir, "after-1440-c2-contact-focus.png"))
        except Exception as e:
            print("Could not test contact form interactions:", e)

        # P1: Project detail hero
        driver.get("http://localhost:3002/projects/apex-structure-platform")
        time.sleep(1.2)
        try:
            pd_hero = driver.find_element(By.ID, "pd-hero")
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", pd_hero)
            time.sleep(0.4)
            driver.save_screenshot(os.path.join(out_dir, f"after-{prefix}-p1-project-hero.png"))
        except Exception as e:
            print("Could not find pd-hero:", e)

    finally:
        driver.quit()

# P1: Tablet 768px check for long title
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
    driver.save_screenshot(os.path.join(out_dir, "after-768-p1-project-hero.png"))
finally:
    driver.quit()

# K1: Deep link test from project tech chip to /skills#nextjs
driver = webdriver.Chrome(options=options)
try:
    driver.get("http://localhost:3002/projects/apex-structure-platform")
    time.sleep(1.2)
    chip = driver.find_element(By.CSS_SELECTOR, "a[href*='/skills#']")
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", chip)
    time.sleep(0.3)
    target_url = chip.get_attribute("href")
    driver.get(target_url)
    time.sleep(1.5)
    driver.save_screenshot(os.path.join(out_dir, "after-1440-k1-skills-deep-link.png"))
except Exception as e:
    print("Could not test deep link:", e)
finally:
    driver.quit()

# C2: Loading state capture
options_load = Options()
options_load.add_argument("--headless=new")
options_load.add_argument("--window-size=1440,900")
options_load.add_argument("--hide-scrollbars")
driver_load = webdriver.Chrome(options=options_load)
try:
    driver_load.get("http://localhost:3002/contact")
    time.sleep(2.0)
    # Fill in valid fields
    name = driver_load.find_element(By.ID, "contact-name")
    name.send_keys("Test User")
    email = driver_load.find_element(By.ID, "contact-email")
    email.send_keys("test@example.com")
    service_sel = driver_load.find_element(By.ID, "contact-service")
    driver_load.execute_script("arguments[0].value = 'full-stack-web-development'; arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", service_sel)
    msg = driver_load.find_element(By.ID, "contact-message")
    msg.send_keys("Testing submission loading state.")
    
    submit_btn = driver_load.find_element(By.CSS_SELECTOR, "button[type='submit']")
    driver_load.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_btn)
    time.sleep(0.2)
    # Click submit and immediately snap loading screenshot
    submit_btn.click()
    time.sleep(0.15)
    driver_load.save_screenshot(os.path.join(out_dir, "after-1440-c2-contact-loading.png"))
except Exception as e:
    print("Could not capture loading state:", e)
finally:
    driver_load.quit()

print("Group 3 AFTER screenshots captured successfully!")
