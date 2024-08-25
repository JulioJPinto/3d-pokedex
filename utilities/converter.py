import os
import pyassimp

def convert_to_obj(input_file, output_file):
    # Load the file using pyassimp
    scene = pyassimp.load(input_file)
    
    # Export the scene to OBJ format
    pyassimp.export(scene, output_file, file_type='obj')
    
    # Release the scene
    pyassimp.release(scene)
    print(f"Converted {input_file} to {output_file}")

def convert_models_in_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.dae'):
                input_path = os.path.join(root, file)
                output_path = os.path.splitext(input_path)[0] + '.obj'
                convert_to_obj(input_path, output_path)

# Specify the directory containing your models
models_directory = 'downloads/Pokemon XY'

# Convert all models in the directory to OBJ
convert_models_in_directory(models_directory)
