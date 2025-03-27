import re
from data_templates.data_templates_util import list_to_str


class Course:
    def __init__(self, code, credit, name, description="",
                 prereq_description="", coreq_description="", attribute=""):
        self.code = self.get_code_format(code)
        self.credit = credit
        self.name = name
        self.description = description
        self.prereq_description = prereq_description
        self.prereq_codes = self.get_requisite_codes(prereq_description)
        self.coreq_description = coreq_description
        self.coreq_codes = self.get_requisite_codes(coreq_description)
        self.attribute = attribute
        self.level = self.get_level()

    def __eq__(self, other):
        return (
                self.code == other.code and
                self.credit == other.credit and
                self.name == other.name and
                self.description == other.description and
                self.prereq_description == other.prereq_description and
                self.prereq_codes == other.prereq_codes and
                self.coreq_description == other.coreq_description and
                self.coreq_codes == other.coreq_codes and
                self.attribute == other.attribute and
                self.level == other.level
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
            f"Prerequisites Description: {prerequisites_desc_message}\n" +
            prereq_codes_message +
            f"Corequisites Description: {corequisites_desc_message}\n" +
            coreq_codes_message +
            f"Attribute: {attribute_message}\n" +
            f"Level: {self.level}\n" +
            "==============================="
        )

        return message

    def get_code_format(self, code):
        pattern = r"^([A-Za-z]{1,3}) ?(\d{4})([A-Za-z]?)$"
        match = re.fullmatch(pattern, code)

        if match:
            groups = match.groups()

            return groups[0].upper() + " " + groups[1] + groups[2].upper()
        else:
            return "INVALID"

    def get_requisite_codes(self, code_description):
        invalid_code_prefixes = ["one", "two", "six", "ten"]
        pattern = r"([A-Za-z]{3} \d{4}/?[A-Za-z]?(?: ?\/ ?\d{4}[A-Za-z]?)?)"
        matches = re.findall(pattern, code_description)
        codes_unformatted = []

        for match in matches:
            code_seperator = "/"
            if code_seperator in match:
                code1, code2 = match.split(code_seperator)
                if len(code2.strip()) != 1:
                    code2 = code1.strip()[:3] + code2
                else:
                    code2 = code1.strip() + code2

                codes_unformatted.append(code1)
                codes_unformatted.append(code2)
            else:
                codes_unformatted.append(match)

        codes = [self.get_code_format(code.strip()) for code in
                 codes_unformatted if code.strip()[:3].lower() not in
                 invalid_code_prefixes]

        return codes

    def get_level(self):
        highest_undergrad_first_digit = 4
        highest_grad_first_digit = 6
        invalid_level_name = "INVALID"

        for char in self.code:
            if char.isdigit():
                first_digit = int(char)

                if (highest_undergrad_first_digit < first_digit <=
                        highest_grad_first_digit):
                    level = "Graduate"
                elif 0 < first_digit <= highest_undergrad_first_digit:
                    level = "Undergraduate"
                else:
                    level = invalid_level_name

                return level

        return invalid_level_name


if __name__ == "__main__":
    pass
