import csv
import pandas as pd
import json

INPUT_CSV = "afvalbakken.csv"

def load_csv(filename):
    file = pd.read_csv(filename)
    return file

def make_json(filename):
    file.to_json("afvalbakken.json", orient="records")

if __name__ == "__main__":
    file = load_csv(INPUT_CSV)
    make_json(file)
