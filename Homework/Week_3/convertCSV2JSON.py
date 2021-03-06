# Name: Xandra Vos
# Student number: 10731148
#
# Data Processing - Week 3
# convertCSV2JSON.py
#
# Converts a csv file into a JSON file.

import csv
import pandas as pd
import json

INPUT_CSV = "01.ingeschrevenen-wo-2017.csv"
SBI = 1047

def load_csv(filename):
    """
    Loads csv file into python.
    """
    file = pd.read_csv(filename, sep=";", encoding="ISO-8859-1")
    file = file.iloc[SBI]

    return file

def file_to_data(filename):
    """
    Make a dictionary of the useful data.
    """
    data = {}
    data[2013] = filename["2013 VROUW"]
    data[2014] = filename["2014 VROUW"]
    data[2015] = filename["2015 VROUW"]
    data[2016] = filename["2016 VROUW"]
    data[2017] = filename["2017 VROUW"]

    return data

def make_json(filename):
    """
    Make a JSON file.
    """
    with open("data.json", "w") as f:
        json.dump(data, f)

if __name__ == "__main__":
    file = load_csv(INPUT_CSV)
    data = file_to_data(file)
    make_json(data)
