import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

pages = [
    ("http://localhost:3002/", "home"),
    ("http://localhost:3002/about", "about"),
    ("http://localhost:3002/services", "services"),
    ("http://localhost:3002/experience", "experience"),
    ("http://localhost:3002/education", "education"),
    ("http://localhost:3002/skills", "skills"),
    ("http://localhost:3002/projects", "projects"),
    ("http://localhost:3002/projects/apex-structure-platform", "project-apex"),
    ("http://localhost:3002/projects/resume-shapeshifter", "project-resume"),
    ("http://localhost:3002/projects/alpha-way-v1", "project-alpha"),
    ("http://localhost:3002/contact", "contact")
]

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
driver = webdriver.Chrome(options=options)

try:
    for url, name in pages:
        driver.get(url)
        time.sleep(1)

        # Smoothly scroll down the page in chunks so lazy loaded images intersect
        total_height = driver.execute_script("return document.body.scrollHeight")
        step = 400
        for y in range(0, total_height, step):
            driver.execute_script(f"window.scrollTo(0, {y});")
            time.sleep(0.15)
        driver.execute_script(f"window.scrollTo(0, {total_height});")
        time.sleep(1.5)

        # Check all images on page
        results = driver.execute_script("""
            const imgs = Array.from(document.querySelectorAll('img'));
            return imgs.map(img => ({
                src: img.currentSrc || img.src,
                alt: img.alt,
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                visible: (img.offsetWidth > 0 && img.offsetHeight > 0)
            }));
        """)

        failed = [img for img in results if not img["complete"] or img["naturalWidth"] == 0]
        print(f"Page '{name}': {len(results)} images checked. Broken/empty: {len(failed)}")
        if failed:
            for f in failed:
                print(f"   BROKEN: src={f['src']}, complete={f['complete']}, nw={f['naturalWidth']}, alt={f['alt']}")

finally:
    driver.quit()
