#!/usr/bin/env python
# Name: Xandra Vos
# Student number: 10731148
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
import numpy as np

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# open cvs file and append year and rating to dictionary
with open(INPUT_CSV, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        year = row['Year']
        rating = row['Rating']
        data_dict[year].append(rating)

# create empty list for rating averages
averages = []

# append average ratings per year to list
for dict in data_dict:
    ratings = data_dict[dict]
    average = sum(map(float, ratings)) / float(len(ratings))
    averages.append(average)

# plot graph to visualize the average ratings per year
years = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]
plt.plot(years, averages, linewidth=2.0)
plt.axis([START_YEAR, END_YEAR - 1, 0.0, 10.0])
plt.yticks(np.arange(0.0, 10.0, 0.5))
plt.suptitle('Average ratings for movies on IMDB', fontsize=18)
plt.title('Which year is the average rating of movies higher?')
plt.ylabel('Average', fontsize=13)
plt.xlabel('Release year', fontsize=13)


if __name__ == "__main__":
    plt.show()
