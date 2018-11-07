#!/usr/bin/env python
# Name: Xandra Vos
# Student number: 10731148
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # create empty list for all movies
    movies = []

    # find all information per movie
    for movie in dom.find_all('div', 'lister-item-content'):
        header = movie.find('h3', 'lister-item-header')
        title = header.find('a').contents[0]
        runtime = movie.find('span','runtime').contents[0].split()[0]
        rating = movie.find('strong').contents[0]
        year = movie.find('span','lister-item-year text-muted unbold').contents[0]
        year = year.strip('() I')

        # create empty list for actors per movie
        actors_movie = []

        # append all actors of movie to list
        actors_directors = movie.find_all('p', '')[2]
        for actors in actors_directors:
            if 'Stars:' in actors:
                while True:
                    actors = actors.next_sibling
                    if actors is None:
                        break
                    actors_movie.append(actors.text)
                    actors = actors.next_sibling

        # append all information to dictionary in list
        movies.append({"title": title, "rating": rating, "year": year, "actors":
        actors_movie, "runtime": runtime})

    # return list of movies
    return movies

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """

    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # make string from actors list
    for movie in movies:
        actors = ""
        for i, actor in enumerate(movie['actors']):
            if i == len(movie['actors']) - 1:
                actors += actor
            else:
                actors += actor + ', '

        # write all information to csv file
        writer.writerow([movie['title'], movie['rating'], movie['year'],
        actors, movie['runtime']])

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
