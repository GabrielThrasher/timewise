import os
import json

def rename_files_in_directory(directory_path):
    """
    Renames all files in the specified directory by adding a prefix or suffix.

    Args:
        directory_path (str): The path to the directory containing the files.
        prefix (str): The prefix to add to each file name.
        suffix (str): The suffix to add to each file name.
    """
    renamed_files = []
    try:
        # List all files in the directory
        for filename in os.listdir(directory_path):
            file_path = os.path.join(directory_path, filename)

            # Skip directories
            if os.path.isdir(file_path):
                continue

            # Get the file name and extension
            name, ext = os.path.splitext(filename)
            # print(name)
            # tokens = [token for token in name.split(" ") if token not in ["_", ",", "-"]]
            renamed_files.append(name)
            # # Create the new file name
            # new_name = f"{" ".join(tokens)}.json"
            # new_file_path = os.path.join(directory_path, new_name)

            # # Rename the file
            # os.rename(file_path, new_file_path)
            # print(f"Renamed: {filename} -> {new_name}")
        with open("majors.json", "w") as json_file:
            json.dump(renamed_files, json_file, indent=4)
    except Exception as e:
        print(f"Error: {e}")

# Example usage
if __name__ == "__main__":
    directory = "../data/"  # Replace with your directory path
    rename_files_in_directory(directory)