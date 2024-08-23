import os
import shutil

# Path to the downloads folder
folder_path = './downloads'

# Function to delete everything in the downloads folder
def clear_downloads_folder(folder_path):
    # Check if the folder exists
    if os.path.exists(folder_path):
        # Iterate through all the files and folders in the directory
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            try:
                # Check if it is a file or a directory
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)  # Remove file or link
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)  # Remove directory
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')
    else:
        print(f'The folder {folder_path} does not exist.')

# Call the function to clear the downloads folder
clear_downloads_folder(folder_path)
