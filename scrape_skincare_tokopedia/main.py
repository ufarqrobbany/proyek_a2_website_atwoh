# import tkinter as tk
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import TimeoutException
# import time
# import datetime
# import sklearn
# import flask
# import numpy as np
# import matplotlib.pyplot as plt
# import google.generativeai
# import cv2 as cv


import pandas as pd

chrome_options = Options()
# chrome_options.add_argument("--headless") # Run Chrome in headless mode
# chrome_options.add_argument("--start-minimized")  # Minimize the window

driver = webdriver.Chrome(options=chrome_options)

# Set implicit wait to 10 seconds
driver.implicitly_wait(10)

driver.get("https://www.tokopedia.com/p/kecantikan/perawatan-wajah")
# print(driver.title)

# driver.find_element(By.XPATH, '//*[@id="header-main-wrapper"]/div[2]/div[2]/div/div/div/div/input').send_keys(
#     "skincare\n")


# print(driver.current_url)

def createDataset():
    dataset = {
        "img_url": [],
        "url": [],
        "title": [],
        "price": [],
        "slash_price": [],
        "disc": [],
        "pelayan": [],
        "rating": [],
        "terjual": []
    }
    return dataset


# 9 pg pertama
for i in range(9):
    dataset = createDataset()
    # baris 1 (3 kolom)
    baris1 = driver.find_element(By.CLASS_NAME, "css-1nod7cp")
    kolom_b1 = baris1.find_elements(By.CLASS_NAME, "css-kkkpmy")
    print(len(kolom_b1))
    for kolom in kolom_b1:
        img_url = kolom.find_element(By.TAG_NAME, "img").get_attribute("src")

        data_baris1 = kolom.find_element(By.CLASS_NAME, "css-1asz3by")
        object_url = data_baris1.find_element(By.TAG_NAME, 'a').get_attribute("href")

        object_datas = data_baris1.find_element(By.TAG_NAME, 'a').text
        datas = object_datas.split("\n")

        print(datas)

        try:
            dataset["url"].append(object_url)
            dataset["img_url"].append(img_url)
            dataset["title"].append(datas[0])
            dataset["price"].append(datas[1])
            dataset["slash_price"].append(datas[2])
            dataset["disc"].append(datas[3])
            dataset["pelayan"].append(datas[4])
            dataset["rating"].append(datas[5])
            dataset["terjual"].append(datas[6])

            # dataset = pd.DataFrame(dataset)
            print("------------------------------")
            print(dataset)
            dataset = createDataset()
            print()
        except IndexError:
            # print("*********************")
            pass

    # baris 2, 3
    dataset = createDataset()

    baris2 = driver.find_element(By.CLASS_NAME, "css-jza1fo")
    baris2 = baris2.find_elements(By.CLASS_NAME, "css-llwpbs")
    for kolom in baris2:
        img_url = kolom.find_element(By.TAG_NAME, 'a').get_attribute("href")
        url = kolom.find_element(By.TAG_NAME, 'img').get_attribute("src")
        datas = kolom.find_element(By.CLASS_NAME, "css-1asz3by")
        datas = datas.find_element(By.TAG_NAME, 'a').text
        datas = datas.split("\n")

        print(datas)
        print()

        if len(datas) >= 7:
            dataset["img_url"].append(img_url)
            dataset["url"].append(url)
            dataset["title"].append(datas[1])
            dataset["price"].append(datas[2])
            dataset["slash_price"].append(datas[3])  # salah krn tiap produk len(datas) nya beda
            dataset["disc"].append(datas[4])
            # dataset["pelayan"].append()
            dataset["rating"].append(datas[-2])
            dataset["terjual"].append(datas[-1])

        dataset = createDataset()

    driver.get(
        f"https://www.tokopedia.com/search?navsource=home&page={2 + i}&q=skincare&source=universe&srp_component_id=01.02.01.01&st=product")
    driver.implicitly_wait(10)
    print()
    print(2 + i)
    print()

while True:
    pass