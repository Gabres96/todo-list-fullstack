from selenium import webdriver

from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service

from webdriver_manager.chrome import ChromeDriverManager

import time


def test_create_task():

    driver = webdriver.Chrome(
        service=Service(
            ChromeDriverManager().install()
        )
    )

    try:

        driver.get(
            "http://localhost:5173/login"
        )

        driver.find_element(
            By.ID,
            "username"
        ).send_keys("gabriel")

        driver.find_element(
            By.ID,
            "password"
        ).send_keys("Gabriel123@")

        driver.find_element(
            By.TAG_NAME,
            "button"
        ).click()

        time.sleep(2)

        title = driver.find_element(
            By.XPATH,
            "//input[@placeholder='Título da tarefa']"
        )

        title.send_keys(
            "Tarefa Selenium"
        )

        driver.find_element(
            By.XPATH,
            "//button[contains(text(),'Criar Tarefa')]"
        ).click()

        time.sleep(2)

        assert "Tarefa Selenium" in driver.page_source

    finally:
        driver.quit()