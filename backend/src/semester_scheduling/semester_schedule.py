from itertools import product
from itertools import combinations
from bs4 import BeautifulSoup
import requests
import re
from data_templates.semester_course import SemesterCourse


class SemesterScheduler:
    def __init__(self, semester_class_codes):
        self.semester_class_codes = semester_class_codes  # give it a list of
        # course codes that the user wants to take for the semester
        self.semester_class_data = {}
        self.semester_courses_grouped_by_code = []
        self.valid_semester_schedules = []
        self.have_valid_semester_schedules = False

    def get_semester_class_data(self):
        sem_dict = {key: [] for key in self.semester_class_codes}

        # self.semester_class_data = func() # call webscrapper function that
        # (using the semester_course class as a data holder/template)
        # returns the data in dictionary form with the keys being the course
        # code and the values being a list of the semester_course objects
        # associated with said course code

    def professor_rating(self, professor_name):
        # Construct the search URL
        search_url = f"https://www.ratemyprofessors.com/search/professors/1100?q={professor_name.replace(' ', '%20')}"
        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        # Send a GET request to the search page
        response = requests.get(search_url, headers=headers)
        if response.status_code != 200:
            return {"error": "Failed to retrieve search results."}

        # Parse the search results page
        soup = BeautifulSoup(response.text, 'html.parser')
        # Find the first professor link
        professor_link = soup.find('a', href=re.compile(r'/professor/\d+'))
        if not professor_link:
            return {"error": "Professor not found."}

        # Construct the professor's page URL
        professor_url = f"https://www.ratemyprofessors.com{professor_link['href']}"
        # Send a GET request to the professor's page
        prof_response = requests.get(professor_url, headers=headers)
        if prof_response.status_code != 200:
            return {"error": "Failed to retrieve professor page."}

        # Parse the professor's page
        prof_soup = BeautifulSoup(prof_response.text, 'html.parser')

        # Extract overall rating
        overall_rating_tag = prof_soup.find('div', class_='RatingValue__Numerator-qw8sqy-2')
        overall_rating = overall_rating_tag.text.strip() if overall_rating_tag else "N/A"

        # Extract level of difficulty
        difficulty_tag = prof_soup.find('div', class_='FeedbackItem__FeedbackNumber-uof32n-1')
        difficulty = difficulty_tag.text.strip() if difficulty_tag else "N/A"

        # Extract "would take again" percentage
        would_take_again_tag = prof_soup.find_all('div', class_='FeedbackItem__FeedbackNumber-uof32n-1')
        would_take_again = would_take_again_tag[1].text.strip() if len(would_take_again_tag) > 1 else "N/A"

        return {
            "professor": professor_name,
            "overall_rating": overall_rating,
            "level_of_difficulty": difficulty,
            "would_take_again": would_take_again
        }

    def get_all_valid_semester_schedules(self):
        self.semester_courses_grouped_by_code = list(
            self.semester_class_data.values())

        all_class_combos = list(product(*self.semester_courses_grouped_by_code))

        for class_combo in all_class_combos:
            valid_class_combo = True
            all_class_pairs = list(combinations(class_combo, 2))

            for class_pair in all_class_pairs:
                if not class_pair[0].is_compatible(class_pair[1]):
                    valid_class_combo = False
                    break

            if valid_class_combo:
                self.valid_semester_schedules.append(list(class_combo))

        if len(self.valid_semester_schedules) != 0:
            self.have_valid_semester_schedules = True

    def print_valid_semester_schedules(self):
        if self.have_valid_semester_schedules:
            for i, valid_semester_schedule in (
                    enumerate(self.valid_semester_schedules)):
                print(f"***************** Valid Schedule #{i+1} "
                      f"*****************")
                for j, course in enumerate(valid_semester_schedule):
                    print(f" --------------- Course #{j+1} ---------------")
                    print(course)
                print("*****************************************************")
        else:
            print("No valid semester schedule found.")

codes = ["COP4600", "CAP4641"]
scheduler = SemesterScheduler(codes)
scheduler.get_semester_class_data()

professor_name = "Alexandre Gomes de Siqueira"
print(scheduler.professor_rating(professor_name))