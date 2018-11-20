# Name: Xandra Vos
# Student number: 10731148
#
# Data Processing
# Week 3
# convertCSV2JSON.py

import csv
import pandas as pd
import json

INPUT_CSV = "afvalbakken.csv"

def load_csv(filename):
    """
    Loads csv file into python.
    """
    file = pd.read_csv(filename)
    return file

def make_json(filename):
    """
    Make a JSON file.
    """
    file.to_json("afvalbakken.json", orient="records")

if __name__ == "__main__":
    file = load_csv(INPUT_CSV)
    make_json(file)
