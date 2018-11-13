import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import csv

INPUT_CSV = 'input.csv'

def load_csv(filename):
    file = pd.read_csv(filename)
    file = file.replace('unknown', np.nan)
    file = file.dropna()
    return file

def change_info(self):
    file['GDP ($ per capita) dollars'] = file['GDP ($ per capita) dollars'].str.
         replace('dollars', '')
    file['GDP ($ per capita) dollars'] = pd.to_numeric(file['GDP ($ per capita) '
         'dollars'])

    file['Pop. Density (per sq. mi.)'] = file['Pop. Density (per sq. mi.)'].str.
         replace(',', '.')
    file['Pop. Density (per sq. mi.)'] = pd.to_numeric(file['Pop. Density (per '
         'sq. mi.)'])

    file['Infant mortality (per 1000 births)'] = file['Infant mortality (per '
         '1000 births)'].str.replace(',', '.')
    file['Infant mortality (per 1000 births)'] = pd.to_numeric(file['Infant '
         'mortality (per 1000 births)'])

    return file

def central_tendency(column):
    mean = file[column].mean()
    median = file[column].median()
    mode = file[column].mode()
    stand = standard_deviation(column)

    return (mean, median, mode, stand)

def standard_deviation(column):
    std = np.std(file[column])
    return std

# def str_replace(file, column, string):

# def hist()
# file['GDP ($ per capita) dollars'] = file['GDP ($ per capita) dollars'].str.replace('dollars', '')
# file['GDP ($ per capita) dollars'] = file['GDP ($ per capita) dollars'].replace('unknown', 'NaN')
# file['GDP ($ per capita) dollars'] = pd.to_numeric(file['GDP ($ per capita) dollars'])
# # print(file['GDP ($ per capita) dollars'])
#
# # def change_dens(self):
# file['Pop. Density (per sq. mi.)'] = file['Pop. Density (per sq. mi.)'].str.replace(',', '.')
# file['Pop. Density (per sq. mi.)'] = file['Pop. Density (per sq. mi.)'].replace('unknown', 0)
# file['Pop. Density (per sq. mi.)'] = pd.to_numeric(file['Pop. Density (per sq. mi.)'])
# # print(file['Pop. Density (per sq. mi.)'])
#
# # def change_mort(self):
# file['Infant mortality (per 1000 births)'] = file['Infant mortality (per 1000 births)'].str.replace(',', '.')
# file['Infant mortality (per 1000 births)'] = file['Infant mortality (per 1000 births)'].replace('unknown', 0)
# file['Infant mortality (per 1000 births)'] = pd.to_numeric(file['Infant mortality (per 1000 births)'])
# # print(file['Infant mortality (per 1000 births)'])
#


if __name__ == "__main__":
    file = load_csv(INPUT_CSV)
    file = change_info(file)
    centr_tend = central_tendency('GDP ($ per capita) dollars')
    print(centr_tend)
    file.hist(column='GDP ($ per capita) dollars')
    plt.show()
