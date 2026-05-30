from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service

from webdriver_manager.chrome import ChromeDriverManager

import time
import uuid


def test_register():

    driver = webdriver.Chrome(
        service=Service(
            ChromeDriverManager().install()
        )
    )

    try:

        driver.get(
            "http://localhost:5173/register"
        )

        username = f"user_{uuid.uuid4().hex[:8]}"

        inputs = driver.find_elements(
            By.TAG_NAME,
            "input"
        )

        inputs[0].send_keys(username)
        inputs[1].send_keys(f"{username}@email.com")
        inputs[2].send_keys("Senha123")
        inputs[3].send_keys("Senha123")

        driver.find_element(
            By.TAG_NAME,
            "button"
        ).click()

        time.sleep(2)

        assert "/login" in driver.current_url

    finally:
        driver.quit()