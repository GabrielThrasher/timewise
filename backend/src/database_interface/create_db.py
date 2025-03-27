import asyncio
import asyncpg
import sys
# sys.path.append('my/path/to/module/folder')
print(sys.path)
sys.path.append("/Users/hieu/dev/timewise/backend/src")

from web_scrapers.degrees_web_scraper import get_all_data, split_dict, get_minor_data, get_certificate_data, get_major_data

catalog_url = "https://catalog.ufl.edu/UGRD/programs/#filter=.filter_24"
all_data = get_all_data(catalog_url) # Get links for all majors, minors, and certificates
split_data = split_dict(all_data) # Split data into three dictionaries
minors = split_data[0]
certificates = split_data[1]
majors = split_data[2]
# all_minors = get_minor_data(minors)
# all_certificates = get_certificate_data(certificates)
all_majors = get_major_data(majors)

def format_array(lst):
    return "{" + ",".join(f'"{item}"' for item in lst) + "}" if lst else None

async def main():
    # Establish a connection to an existing database named "test"
    # as a "postgres" user.
    conn = await asyncpg.connect('postgresql://postgres@localhost/testdb')
    # Execute a statement to create a new table.
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS Minors (
             id SERIAL PRIMARY KEY,
             name TEXT NOT NULL,
             credit INT NOT NULL,
             description TEXT,
             college_under TEXT,
             admission_requirements TEXT,
             non_eligible_majors TEXT,
             lvl VARCHAR(50),
            required_courses TEXT[],
             electives TEXT
         );

        CREATE TABLE IF NOT EXISTS Majors (
             id SERIAL PRIMARY KEY,
             name TEXT NOT NULL,
             credit INT NOT NULL,
             description TEXT,
             college_under TEXT,
             admission_requirements TEXT,
             lvl VARCHAR(50),
             required_courses TEXT[],
             electives TEXT[],
             electives_desc TEXT
        );

        CREATE TABLE IF NOT EXISTS Certificates (
             id SERIAL PRIMARY KEY,
             name TEXT NOT NULL,
             credit INT NOT NULL,
             description TEXT,
             college_under TEXT,
             admission_requirements TEXT,
            lvl VARCHAR(50),
             required_courses TEXT[],
             electives TEXT
         );
    ''')

    idx = 1
    for major in all_majors:
        if idx > 10: break

        # FIXME: figure out why this gives an error

        await conn.execute('''
        INSERT INTO Majors (name, credit, description, college_under, admission_requirements, lvl, required_courses, electives, electives_desc)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    ''', (major.name, major.credit, major.description, major.college_under, format_array(major.admission_requirements), major.level, format_array(major.required_courses), format_array(major.electives), major.electives_desc))
        idx+=1

    # Close the connection.
    await conn.close()

asyncio.run(main())

# import psycopg2
# from web_scrapers.degrees_web_scraper import get_all_data, split_dict, get_minor_data, get_certificate_data, get_major_data

# # Connect to the default 'postgres' database
# conn = psycopg2.connect(
#     dbname="postgres",
#     user="postgres",
#     password="root",
#     host="localhost",
#     port="5432"
# )
# conn.autocommit = True  # Allow database creation without a transaction
# cur = conn.cursor()

# catalog_url = "https://catalog.ufl.edu/UGRD/programs/#filter=.filter_24"
# all_data = get_all_data(catalog_url) # Get links for all majors, minors, and certificates
# split_data = split_dict(all_data) # Split data into three dictionaries
# minors = split_data[0]
# certificates = split_data[1]
# majors = split_data[2]
# all_minors = get_minor_data(minors)
# all_certificates = get_certificate_data(certificates)
# all_majors = get_major_data(majors)

# def format_array(lst):
#     return "{" + ",".join(f'"{item}"' for item in lst) + "}" if lst else None

# database_name = "timewise"

# # Creates DB
# #cur.execute(f"CREATE DATABASE {database_name};")

# cur.execute('''
#         CREATE TABLE IF NOT EXISTS Minors (
#             id SERIAL PRIMARY KEY,
#             name TEXT NOT NULL,
#             credit INT NOT NULL,
#             description TEXT,
#             college_under TEXT,
#             admission_requirements TEXT,
#             non_eligible_majors TEXT,
#             lvl VARCHAR(50),
#             required_courses TEXT[],
#             electives TEXT
#         );

#         CREATE TABLE IF NOT EXISTS Majors (
#             id SERIAL PRIMARY KEY,
#             name TEXT NOT NULL,
#             credit INT NOT NULL,
#             description TEXT,
#             college_under TEXT,
#             admission_requirements TEXT,
#             lvl VARCHAR(50),
#             required_courses TEXT[],
#             electives TEXT[],
#             electives_desc TEXT
#         );

#         CREATE TABLE IF NOT EXISTS Certificates (
#             id SERIAL PRIMARY KEY,
#             name TEXT NOT NULL,
#             credit INT NOT NULL,
#             description TEXT,
#             college_under TEXT,
#             admission_requirements TEXT,
#             lvl VARCHAR(50),
#             required_courses TEXT[],
#             electives TEXT
#         );
#         ''')

# # Insert minors into the database
# for minor in all_minors:
#     cur.execute('''
#         INSERT INTO Minors (name, credit, description, college_under, admission_requirements, non_eligible_majors, lvl, required_courses, electives)
#         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
#     ''', (minor.name, minor.credit, minor.description, minor.college_under, format_array(minor.admission_requirements), minor.non_eligible_majors, minor.level, format_array(minor.required_courses), format_array(minor.electives)))

# # Insert certificates into the database
# for certificate in all_certificates:
#     cur.execute('''
#         INSERT INTO Certificates (name, credit, description, college_under, admission_requirements, lvl, required_courses, electives)
#         VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
#     ''', (certificate.name, certificate.credit, certificate.description, certificate.college_under, format_array(certificate.admission_requirements), certificate.level, format_array(certificate.required_courses), format_array(certificate.electives)))

# # Insert majors into the database
# for major in all_majors:
#     cur.execute('''
#         INSERT INTO Majors (name, credit, description, college_under, admission_requirements, lvl, required_courses, electives, electives_desc)
#         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
#     ''', (major.name, major.credit, major.description, major.college_under, format_array(major.admission_requirements), major.level, format_array(major.required_courses), format_array(major.electives), major.electives_desc))

# # View all tables
# cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
# tables = cur.fetchall()

# print("Tables created in the database:")
# for table in tables:
#     print(table[0])

# # Commit and close connection
# cur.close()
# conn.close()



