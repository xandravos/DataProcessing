# Name: Xandra Vos
# Student number: 10731148
#
# Data Processing
# Week 2
# eda.py

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import csv
import math
import json

def load_csv(filename):
    """
    Loads in csv file and cleans it for further use.
    """
    # read csv into DataFrame
    file = pd.read_csv(filename)

    # replace unknown with NaN
    file = file.replace('unknown', np.nan)

    # drop all columns that are not needed
    file = file.drop(columns=['Population', 'Area (sq. mi.)', 'Coastline '
           '(coast/area ratio)', 'Net migration', 'Literacy (%)', 'Phones (per '
           '1000)', 'Arable (%)', 'Crops (%)', 'Other (%)', 'Climate',
           'Birthrate', 'Deathrate', 'Agriculture', 'Industry', 'Service'])

    # drop rows with NaNs (see eda.txt for explanation)
    file = file.dropna()

    # use change_info function to adjust the file for further use
    file = change_info(file)

    # return cleaned file
    return file

def change_info(file):
    """
    Changes the needed info of file for further use.
    """
    # delete white space in region column
    file['Region'] = file['Region'].str.strip()

    # delete 'dollars' from GDP column and convert it to integer
    file['GDP ($ per capita) dollars'] = file['GDP ($ per capita) '
         'dollars'].str.replace('dollars', '')
    file['GDP ($ per capita) dollars'] = pd.to_numeric(file['GDP '
         '($ per capita) dollars'])

    # delete outlier from GDP column
    maximum_gdp = file['GDP ($ per capita) dollars'].idxmax()
    file['GDP ($ per capita) dollars'] = file['GDP ($ per capita) '
         'dollars'].drop([maximum_gdp])

    # convert Infant mortality and Pop. Density column to floats
    file['Pop. Density (per sq. mi.)'] = file['Pop. Density (per sq. '
         'mi.)'].str.replace(',', '.')
    file['Pop. Density (per sq. mi.)'] = pd.to_numeric(file['Pop. Density '
         '(per sq. mi.)'])
    file['Infant mortality (per 1000 births)'] = file['Infant mortality '
         '(per 1000 births)'].str.replace(',', '.')
    file['Infant mortality (per 1000 births)'] = pd.to_numeric(file['Infant '
         'mortality (per 1000 births)'])

    # return adjusted file
    return file

def central_tendency(column):
    """
    Calculate the Central Tendency for the given column.
    """
    mean = file[column].mean()
    median = file[column].median()
    mode = file[column].mode()[0]
    std = np.std(file[column])
    return f'mean: {mean}, median: {median}, mode: {mode}, std: {std}'

def make_histogram(column):
    """
    Makes a histogram of the information from the given column.
    """
    file[column].plot.hist()
    plt.title('Histogram of the GDP of 216 countries')
    plt.xlabel(column, fontsize=13)
    plt.ylabel('Frequency', fontsize=13)
    plt.axis([0, 60000, 0, 120])
    plt.show()

def five_number_sum(column):
    """
    Makes a Five Number Summary for the given column.
    """
    five_numb = file[column].describe()
    print(five_numb)

def make_boxplot(column):
    """
    Makes a boxplot with the information of the given column.
    """
    plt.style.use('seaborn-whitegrid')
    plt.boxplot(file[column])
    plt.axis([None, None, 0, 200])
    plt.ylabel(column, fontsize=13)
    plt.title('Infant mortality of 216 countries', fontsize=14)
    plt.show()

def make_json(filename):
    """
    Converts a csv file to a JSON file.
    """
    file = filename.set_index('Country')
    file.to_json('eda.json', orient='index')


if __name__ == "__main__":
    file = load_csv('input.csv')
    print(file['Infant mortality (per 1000 births)'])
    centr_tend = central_tendency('GDP ($ per capita) dollars')
    print(centr_tend)
    five_number_sum('Infant mortality (per 1000 births)')
    make_histogram('GDP ($ per capita) dollars')
    make_boxplot('Infant mortality (per 1000 births)')
    make_json(file)
