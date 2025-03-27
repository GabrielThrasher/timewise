class Major:
    def __init__(self, name, credit, description, college_under,
                 admission_requirements, level, required_courses, electives,
                 electives_desc):
        self.name = name
        self.credit = credit
        self.description = description
        self.college_under = college_under
        self.admission_requirements = admission_requirements
        self.level = level
        self.required_courses = required_courses
        self.electives = electives
        self.electives_desc = electives_desc

    def __eq__(self, other):
        return (
            self.name == other.name and
            self.credit == other.credit and
            self.description == other.description and
            self.college_under == other.college_under and
            self.admission_requirements == other.admission_requirements and
            self.level == other.level and
            self.required_courses == other.required_courses and
            self.electives == other.electives and
            self.electives_desc == other.electives_desc
        )

    def __str__(self):
        description_message = self.description if self.description \
            else "No description"
        admission_requirements_message = self.admission_requirements if (
            self.admission_requirements) else "No admission requirements"
        electives_desc_message = self.electives_desc if self.electives_desc \
            else "No electives description"

        message = (
            f"======== {__class__.__name__} Object ========\n" +
            f"Name: {self.name}\n" +
            f"Credit: {self.credit}\n" +
            f"Description: {description_message}\n" +
            f"College Under: {self.college_under}\n" +
            f"Admission Requirements: {admission_requirements_message}\n" +
            f"Level: {self.level}\n" +
            f"Required Courses: {self.required_courses}\n" +
            f"Electives: {self.electives}\n" +
            f"Electives Description: {electives_desc_message}\n" +
            "==============================="
        )

        return message


if __name__ == "__main__":
    pass
