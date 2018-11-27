# Name: Xandra Vos
# Student number: 10731148
#
# Data Processing - Week 4
# convertCSV2JSON.py
#
# Converts a CSV file into a JSON file.

import csv
import pandas as pd
import json

INPUT_CSV = "data.csv"

def load_csv(filename):
    """
    Loads csv file into python.
    """
    file = pd.read_csv(filename, nrows = 57)
    file = file.drop(columns=["INDICATOR", "SUBJECT", "FREQUENCY", "Flag Codes", "MEASURE", "LOCATION"])

    return file


def make_json(filename):
    """
    Make a JSON file.
    """
    file = filename.set_index("TIME")
    file.to_json("data.json", orient="index")

if __name__ == "__main__":
    file = load_csv(INPUT_CSV)
    make_json(file)
