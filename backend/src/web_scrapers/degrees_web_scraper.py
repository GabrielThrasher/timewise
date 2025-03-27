import requests
from bs4 import BeautifulSoup
import re
from pprint import pprint
from data_templates.certificate_template import Certificate
from data_templates.major_template import Major
from data_templates.minor_template import Minor

# Get links on all majors, minors, and certificates offered at UF
def get_all_data(catalog_url):
    response = requests.get(catalog_url)
    soup = BeautifulSoup(response.text, "html.parser")
    items = soup.find_all("li", id=lambda x: x and x.startswith("isotope-item"))

    all_data = {}
    for item in items:
        link = item.find("a")
        if link:
            name = link.get_text(strip=True)
            href = link.get("href")
            if name.lower() != "learn more":  # Filter out unwanted links
                all_data[name] = href

    return all_data

def split_dict(input_dict):
    minor = {}
    certificates = {}
    major = {}

    for key, value in input_dict.items():
        lowered_key = key.lower()
        if "minor" in lowered_key:
            minor[key] = value
        elif "certificate" in lowered_key:
            certificates[key] = value
        else:
            major[key] = value

    return minor, certificates, major

# Some formatting issues like in
# https://catalog.ufl.edu/UGRD/colleges-schools/UGART/ART_UCT06/
# College name structured differently so difficult to get name
# Credits don't display sometimes
# Sometimes required courses don't show up
# Possibly more issues as I have checked each individiual certificate
def get_certificate_data(dict):
    all_certificates = []
    max_val = 0
    base_url = "https://catalog.ufl.edu"
    counter = 0
    for name, value in dict.items():
        url = f"{base_url}{value}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        list_items = soup.find_all('li')
        p_elements = soup.find_all('p')
        print("Certificate URL: " + url)
        description = ' '.join([p.get_text() for p in soup.find_all('p') if 'certificate' in p.get_text().lower()])
        prerequisite_courses = []
        required_courses = []
        # Extract courses from Prerequisite Courses
        prerequisite_section = soup.find('h2', string='Prerequisite Courses')
        if prerequisite_section:
            prerequisite_table = prerequisite_section.find_next('table')
            if prerequisite_table:
                prerequisite_links = prerequisite_table.find_all('a', class_='bubblelink code')
                prerequisite_courses = [link.text.strip().replace('\xa0', '') for link in prerequisite_links]
        else:
            prerequisite_courses = []  # No prerequisite courses found

        # Extract courses from Required Courses
        required_section = soup.find('h2', string='Required Courses')
        if required_section:
            required_table = required_section.find_next('table')
            if required_table:
                required_links = required_table.find_all('a', class_='bubblelink code')
                required_courses = [link.text.strip().replace('\xa0', '') for link in required_links]
        credits = -1
        college_name = "-1"
        # Get all the College Names
        for li in list_items:
            if li.find('strong') and 'College:' in li.find('strong').text:
                college_name = li.find('a').text.strip()
            if li.find('strong') and 'Credits:' in li.find('strong').text:
                credits_text = li.text.strip()
                credits = re.search(r'\d+', credits_text.lstrip()).group()
        # scrape the admissions criteria (ex: https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/ENG_UCT12/)
        # Add the electives
        certificate = Certificate(name, credits, description, college_name, prerequisite_courses, "Undergraduate", required_courses, [])
        all_certificates.append(certificate)
        if len(description) > max_val:
            max_val = len(description)
        counter += 1
    return all_certificates

def get_minor_data(dict):
    all_minors = []
    base_url = "https://catalog.ufl.edu"
    for name, value in dict.items():
        url = f"{base_url}{value}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        print("Minor URL: " + url)
        list_items = soup.find_all('li')
        p_elements = soup.find_all('p')
        description = ' '.join([p.get_text() for p in soup.find_all('p') if 'minor' in p.get_text().lower()])
        prerequisite_courses = []
        required_courses = []
        # Extract courses from Prerequisite Courses
        prerequisite_section = soup.find('h2', string='Prerequisite Courses')
        if prerequisite_section:
            prerequisite_table = prerequisite_section.find_next('table')
            if prerequisite_table:
                prerequisite_links = prerequisite_table.find_all('a', class_='bubblelink code')
                prerequisite_courses = [link.text.strip().replace('\xa0', '') for link in prerequisite_links]

        else:
            prerequisite_courses = []  # No prerequisite courses found

        # Extract courses from Required Courses
        required_section = soup.find('h2', string='Required Courses')
        if required_section:
            required_table = required_section.find_next('table')
            if required_table:
                required_links = required_table.find_all('a', class_='bubblelink code')
                required_courses = [link.text.strip().replace('\xa0', '') for link in required_links]
                or_cols = soup.find_all('td', class_='codecol orclass')
                for course in or_cols:
                    course_code = course.find('a').text
        college_name = "-1"
        credits = -1
        # Get all the College Names
        for li in list_items:
            if li.find('strong') and 'College:' in li.find('strong').text:
                college_name = li.text.strip()
                college_name = college_name.replace('College: ', '')
            if li.find('strong') and 'Credits:' in li.find('strong').text:
                credits_text = li.text.strip()
                credits = re.search(r'\d+', credits_text.lstrip())
                if credits:
                    credits = credits.group()
                else:
                    credits = -1
        # Add non-eligible majors (ex:https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/CIE_UMN/)
        minor = Minor(name, credits, description, college_name, prerequisite_courses, "", "Undergraduate", required_courses, [])
        all_minors.append(minor)
    return all_minors

def get_major_data(dict):
    all_majors = []
    base_url = "https://catalog.ufl.edu"
    for name, value in dict.items():
        url = f"{base_url}{value}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        list_items = soup.find_all('li')
        p_elements = soup.find_all('p')
        print("Major URL: " + url)
        intro_text_div = soup.find('div', id='intro-text')
        description = str(intro_text_div.find_all('p')[0])
        description = description.replace('<p>', '')
        description = description.replace('</p>', '')
        prerequisite_courses = []
        required_courses = []
        # Extract courses from Prerequisite Courses
        prerequisite_section = soup.find('h2', string='Prerequisite Courses')
        if prerequisite_section:
            prerequisite_table = prerequisite_section.find_next('table')
            if prerequisite_table:
                prerequisite_links = prerequisite_table.find_all('a', class_='bubblelink code')
                prerequisite_courses = [link.text.strip().replace('\xa0', '') for link in prerequisite_links]
        else:
            prerequisite_courses = []  # No prerequisite courses found

        # Extract courses from Required Courses
        required_section = soup.find('h2', string='Required Courses')
        if required_section:
            required_table = required_section.find_next('table')
            if required_table:
                required_links = required_table.find_all('a', class_='bubblelink code')
                required_courses = [link.text.strip().replace('\xa0', '') for link in required_links]
        credits = -1
        college_name = "-1"
        # Get all the College Names
        for li in list_items:
            if li.find('strong') and 'College:' in li.find('strong').text:
                college_name = li.text.strip()
                college_name = college_name.replace('College: ', '')
            if li.find('strong') and 'Credits for Degree:' in li.find('strong').text:
                credits_text = li.text.strip()
                credits = re.search(r'\d+', credits_text.lstrip())
                if(credits):
                    credits = credits.group()
        major = Major(name, credits, description, college_name, prerequisite_courses, "Undergraduate",
                      required_courses, [], "Elective Description Needed")
        all_majors.append(major)
    return all_majors
