from data_templates.course_template import Course
from data_templates.data_templates_util import list_to_str


class SemesterCourse(Course):
    def __init__(self, code, credit, name, subject, unique_id, times, locations,
                 instructors, instructor_ratings, mode_type, final_exam_date,
                 class_dates, department, description="",
                 prereq_description="", coreq_description="", attribute="",
                 additional_course_fee="NA", gen_ed="NA",
                 level_of_difficulty="NA", would_take_again="NA"):
        super().__init__(code, credit, name, subject, description,
                         prereq_description, coreq_description, attribute)
        # Remove all of these comments in this __init__() func after
        # semester_scheduler and the webscrapper to get the data from One.Uf is
        # done.
        self.unique_id = unique_id  # 5 digit unique course code after the
        # hashtag in One.UF
        self.times = times  # list of times for each location. That is,
        # each index (which accesses a dictionary) is for one location. One
        # location can have multiple times which is why it's stored in a
        # dictionary. The key (which is a string) is the day of the week (M,
        # T, W, R, F) and the value is a list. The list is formated as [start
        # time, end time, period]. All elements in the list are strings.
        # Start and end time are both in MILITARY time (e.g., 3PM is 15). The
        # format for the time is XXYY where XX is the hour (if 9 or below put a
        # 0 in front so 9 becomes 09, 8 becomes 08, and so on) and YY is the
        # minute (if 9 or below put a 0 in front so 9 becomes 09, 8 becomes 08,
        # and so on). The period is formated as: Period {period number}; or
        # if there's multiple period numbers: Period {start period number-end
        # period number}. An example is below:
        # self.times = [
        #     # times for location 1, then times for location 2
        #     {"M": ("1250", "1340", "Period 6"), "W": ("1250", "1340",
        #     "Period 6"), "F": ("1250", "1340", "Period 6")}, {"T": ("1040",
        #     "1130", "Period 4")}
        # ]
        self.locations = locations  # list of strings the corresponding
        # dictionary of times for each location is at the same index but in
        # self.times: location names in short form, for example: CAR100
        self.instructors = instructors  # list of strings: professor names
        self.instructor_ratings = instructor_ratings  # list of strings:
        self.level_of_difficulty = level_of_difficulty  # string: float out of 5
        self.would_take_again = would_take_again  # string: percentage out of
        # 100 (do not add the percent symbol)
        # rate my professor star rating out of 5, in the same order as the
        # professor's in self.instructors
        self.mode_type = mode_type  # string: Primarily Classroom, or Online,
        # etc...
        self.final_exam_date = final_exam_date  # string: example:
        # 12/9/2025 @ 7:30 AM - 9:30 AM
        self.class_dates = class_dates  # string: example:
        # 08/21/2025 - 12/03/2025
        self.department = department  # string: example: Physics
        self.additional_course_fee = additional_course_fee  # string: X.XX
        # (like money format without dollars symbol):
        self.gen_ed = gen_ed  # string: example: Physical Science

    def __eq__(self, other):
        return (
                self.code == other.code and
                self.credit == other.credit and
                self.name == other.name and
                self.description == other.description and
                self.subject == other.subject and
                self.prereq_description == other.prereq_description and
                self.prereq_codes == other.prereq_codes and
                self.coreq_description == other.coreq_description and
                self.coreq_codes == other.coreq_codes and
                self.attribute == other.attribute and
                self.level == other.level and
                self.unique_id == other.unique_id and
                self.times == other.times and
                self.locations == other.locations and
                self.instructors == other.instructors and
                self.instructor_ratings == other.instructor_ratings and
                self.mode_type == other.mode_type and
                self.final_exam_date == other.final_exam_date and
                self.class_dates == other.class_dates and
                self.department == other.department and
                self.additional_course_fee ==
                other.additional_course_fee and
                self.gen_ed == other.gen_ed and
                self.level_of_difficulty == other.level_of_difficulty and
                self.would_take_again == other.would_take_again
        )

    def __str__(self):
        prerequisites_desc_message = self.prereq_description if (
            self.prereq_description) else "No prerequisites"
        corequisites_desc_message = self.coreq_description if (
            self.coreq_description) else "No corequisites"
        course_desc_message = self.description if (
            self.description) else "No description"
        attribute_message = self.attribute if (
            self.attribute) else "No attribute"
        prereq_codes_message = (
            f"Prerequisite Course Codes: {list_to_str(self.prereq_codes)}\n") \
            if self.prereq_codes else ""
        coreq_codes_message = (
            f"Coerequisite Course Codes: {list_to_str(self.coreq_codes)}\n") \
            if self.coreq_codes else ""

        message = (
                f"======== {__class__.__name__} Object ========\n" +
                f"Code: {self.code}\n" +
                f"Credit: {self.credit}\n" +
                f"Name: {self.name}\n" +
                f"Description: {course_desc_message}\n" +
                f"Subject: {self.subject}\n" +
                f"Prerequisites Description: {prerequisites_desc_message}\n" +
                prereq_codes_message +
                f"Corequisites Description: {corequisites_desc_message}\n" +
                coreq_codes_message +
                f"Attribute: {attribute_message}\n" +
                f"Level: {self.level}\n" +
                f"Unique ID: {self.unique_id}\n" +
                f"Times: {self.times}\n" +
                f"Locations: {list_to_str(self.locations)}\n" +
                f"Instructors: {list_to_str(self.instructors)}\n" +
                f"Instructor Ratings: "
                f"{list_to_str(self.instructor_ratings)}\n" +
                f"Level of Difficulty: {self.level_of_difficulty}\n" +
                f"Would Take Again: {self.would_take_again}\n" +
                f"Mode Type: {self.mode_type}\n" +
                f"Final Exam Date: {self.final_exam_date}\n" +
                f"Class Dates: {self.class_dates}\n" +
                f"Department: {self.department}\n" +
                f"Additional Course Fee: {self.additional_course_fee}\n" +
                f"Gen ED: {self.gen_ed}\n" +
                "==============================="
        )

        return message

    def times_overlap(self, self_time_for_location, other_time_for_location):
        for self_day, self_start_end_times in self_time_for_location.items():
            for other_day, other_start_end_times in (
                    other_time_for_location.items()):
                if (self_day == other_day and (other_start_end_times[0] <=
                        self_start_end_times[0] <= other_start_end_times[1] or
                        self_start_end_times[0] <= other_start_end_times[0] <=
                        self_start_end_times[1])):
                    return True

        return False

    def is_compatible(self, other):
        if self.code == other.code:
            return False

        for self_time_for_location in self.times:
            for other_time_for_location in other.times:
                if self.times_overlap(self_time_for_location,
                                      other_time_for_location):
                    return False

        return True

    def meets_requirements(self, earliest_time="", latest_time="",
                           period_blackouts=None, day_blackouts=None,
                           min_instructor_rating="0",
                           max_level_of_difficulty="", min_would_take_again=""):
        meets_requirements = True

        for time_dict in self.times:
            for day, time_list in time_dict.items():
                if earliest_time:
                    if time_list[0] < earliest_time:
                        meets_requirements = False
                if latest_time:
                    if time_list[1] > latest_time:
                        meets_requirements = False
                if period_blackouts:
                    for period_blackout in period_blackouts:
                        if period_blackout in time_list[2]:
                            meets_requirements = False
                if day_blackouts:
                    for day_blackouts in day_blackouts:
                        if day_blackouts == day:
                            meets_requirements = False

            if min_instructor_rating:
                if self.instructors != ["Staff"]:
                    if min(self.instructor_ratings) < min_instructor_rating:
                        meets_requirements = False
            if max_level_of_difficulty:
                if self.level_of_difficulty > max_level_of_difficulty:
                    meets_requirements = False
            if min_would_take_again:
                if self.would_take_again < min_would_take_again:
                    meets_requirements = False

        return meets_requirements
