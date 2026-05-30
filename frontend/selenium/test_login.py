from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service

from webdriver_manager.chrome import ChromeDriverManager

import time


def test_login():

    driver = webdriver.Chrome(
        service=Service(
            ChromeDriverManager().install()
        )
    )

    try:

        driver.get(
            "http://localhost:5173/login"
        )

        username = driver.find_element(
            By.ID,
            "username"
        )

        password = driver.find_element(
            By.ID,
            "password"
        )

        username.send_keys("gabriel")
        password.send_keys("Gabriel123@")

        driver.find_element(
            By.TAG_NAME,
            "button"
        ).click()

        time.sleep(2)

        assert "/dashboard" in driver.current_url

    finally:
        driver.quit()