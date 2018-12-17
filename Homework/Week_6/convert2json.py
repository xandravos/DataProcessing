# Name: Xandra Vos
# Student number: 10731148
#
# Data Processing - Week 6
# convert2json.py
#
# Converts a csv file into a JSON file.

import csv
import pandas as pd
import json

INPUT_CSV = "01.ingeschrevenen-wo-2017.csv"
SBI_ROW = 1047
ECO_ROW = 1029
BA_ROW = 1026
PSY_ROW = 1035

def load_csv(filename):
    """
    Loads csv file into python.
    """
    file = pd.read_csv(filename, sep=";", encoding="ISO-8859-1")


    return file

def file_to_data(filename):
    """
    Make a dictionary of the useful data.
    """
    data = {}
    # data[2013] = filename["2013 VROUW"], filename["2013 MAN"]
    # data[2013] = sum(data[2013]), data[2013]
    # data[2014] = filename["2014 VROUW"], filename["2014 MAN"]
    # data[2014] = sum(data[2014]), data[2014]
    # data[2015] = filename["2015 VROUW"], filename["2015 MAN"]
    # data[2015] = sum(data[2015]), data[2015]
    # data[2016] = filename["2016 VROUW"], filename["2016 MAN"]
    # data[2016] = sum(data[2016]), data[2016]

    file_sbi = file.iloc[SBI_ROW]

    data["SBI"] = file_sbi["2017 VROUW"], file_sbi["2017 MAN"]
    data["SBI"] = sum(data["SBI"]), data["SBI"]

    file_eco = file.iloc[ECO_ROW]

    data["ECO"] = file_eco["2017 VROUW"], file_eco["2017 MAN"]
    data["ECO"] = sum(data["ECO"]), data["ECO"]

    file_ba = file.iloc[BA_ROW]

    data["BA"] = file_ba["2017 VROUW"], file_ba["2017 MAN"]
    data["BA"] = sum(data["BA"]), data["BA"]

    file_psy = file.iloc[PSY_ROW]

    data["PSY"] = file_psy["2017 VROUW"], file_psy["2017 MAN"]
    data["PSY"] = sum(data["PSY"]), data["PSY"]

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
