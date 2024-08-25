#!/bin/bash

# Directory containing the zip files (default is the current directory)
DIRECTORY=${1:-.}

# Iterate over each .zip file in the directory
for zip_file in "$DIRECTORY"/*.zip; do
    # Check if there are any zip files
    if [[ -f "$zip_file" ]]; then
        # Extract the base name of the zip file (without path and extension)
        base_name=$(basename "$zip_file" .zip)
        
        # Unzip the file into the newly created directory
        unzip -q "$zip_file" -d "$DIRECTORY/"
        
        echo "Unzipped $zip_file into $DIRECTORY/"
    else
        echo "No zip files found in the directory."
        break
    fi
done
