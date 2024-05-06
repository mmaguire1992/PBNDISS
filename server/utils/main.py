import sys
import os
import json
from datetime import datetime
from image_utils import load_image, save_image
from analysis import analyse_image_complexity
from segmentation import (
    segment_image,
    adaptive_segmentation_params,
    filter_small_segments,
    get_segment_colours,
)
from clustering import dynamic_colour_clustering
from pbn_creation import create_pbn_output, create_coloured_output, create_colour_key, rgb_to_hex
from google.cloud import storage
import numpy as np

def print_progress(message, percent):
    # Print progress message with percentage
    print(f"PROGRESS: {message} {percent}%", flush=True)

def verify_numpy_array(image, step_description):
    # Verify if the input is a NumPy array
    if not isinstance(image, np.ndarray):
        raise TypeError(f"After {step_description}, the image is not a NumPy array.")

def generate_unique_filename(original_filename):
    # Generate a unique filename based on timestamp and original filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")  # Get current timestamp
    _, ext = os.path.splitext(original_filename)  # Get file extension
    return f"{timestamp}{ext}"  # Return unique filename with original extension

def upload_to_gcloud(bucket_name, source_file_path, destination_blob_name):
    # Upload a file to Google Cloud Storage
    key_filename = '/Users/michaelmaguire/Downloads/maximal-kingdom-414314-57f47cd90afb.json'
    storage_client = storage.Client.from_service_account_json(key_filename)  # Create storage client
    bucket = storage_client.bucket(bucket_name)  # Get bucket by name
    blob = bucket.blob(destination_blob_name)  # Create a new blob in the bucket
    try:
        blob.upload_from_filename(source_file_path)  # Upload file to the blob
        print(f"Successfully uploaded {destination_blob_name} to Google Cloud Storage.", flush=True)
        return blob.public_url  # Return the public URL of the uploaded file
    except Exception as e:
        print(f"Failed to upload {source_file_path} to Google Cloud Storage. Error: {e}", flush=True)
        return None  # Return None if upload fails

def paint_by_numbers(image_path, bucket_name, folder_name, difficulty):
    # Generate paint-by-numbers output for an image
    print_progress("Loading image", 10)
    image = load_image(image_path)  # Load image from file
    verify_numpy_array(image, "loading the image")  # Verify image is a NumPy array

    print_progress("Analysing image complexity", 20)
    edge_density = analyse_image_complexity(image)  # Analyze complexity of the image
    n_segments, compactness = adaptive_segmentation_params(image, edge_density, difficulty)  # Determine segmentation parameters

    print_progress("Segmenting image", 40)
    segments = segment_image(image, n_segments, compactness)  # Segment the image
    segments = filter_small_segments(segments)  # Filter out small segments
    segment_colours = get_segment_colours(image, segments)  # Get colours for each segment

    print_progress("Clustering colours", 60)
    kmeans = dynamic_colour_clustering(segment_colours, difficulty)  # Cluster colours using KMeans algorithm

    print_progress("Creating PBN output", 80)
    pbn_output = create_pbn_output(image, segments, kmeans)  # Create paint-by-numbers output
    verify_numpy_array(pbn_output, "creating PBN output")  # Verify PBN output is a NumPy array
    coloured_output = create_coloured_output(image, segments, kmeans)  # Create coloured output
    verify_numpy_array(coloured_output, "creating coloured output")  # Verify coloured output is a NumPy array

    print_progress("Creating colour key and capturing colour codes", 90)
    colour_key_path = create_colour_key(kmeans.cluster_centers_, "/tmp")  # Create colour key image
    colour_codes = [rgb_to_hex(color) for color in kmeans.cluster_centers_]  # Convert RGB colours to hexadecimal codes

    files_to_upload = [  # List of files to upload to Google Cloud Storage
        (pbn_output, "pbn_output.png", False),  # Paint-by-numbers output
        (coloured_output, "coloured_output.png", False),  # Coloured output
        (colour_key_path, "colour_key.png", True),  # Colour key image
    ]

    output_data = {  # Dictionary to store output data
        'pbnOutputUrl': None,  # URL for paint-by-numbers output
        'colouredOutputUrl': None,  # URL for coloured output
        'colourKeyUrl': None,  # URL for colour key image
        'colourCodes': colour_codes  # List of colour codes
    }

    for item, filename, is_path in files_to_upload:
        unique_filename = generate_unique_filename(filename)  # Generate unique filename for each file
        if not is_path:
            temp_path = f"/tmp/{unique_filename}"  # Temporary path for files not yet saved
            save_image(item, temp_path)  # Save the image to temporary path
        else:
            temp_path = item

        uploaded_url = upload_to_gcloud(bucket_name, temp_path, f"{folder_name}/{unique_filename}")  # Upload file to Google Cloud Storage
        if uploaded_url:
            if filename == "pbn_output.png":
                output_data['pbnOutputUrl'] = uploaded_url  # Set URL for paint-by-numbers output
            elif filename == "coloured_output.png":
                output_data['colouredOutputUrl'] = uploaded_url  # Set URL for coloured output
            elif filename == "colour_key.png":
                output_data['colourKeyUrl'] = uploaded_url  # Set URL for colour key image

    print_progress("Complete", 100)  # Progress completion message
    return output_data  # Return output data

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python main.py <input_image_path> <bucket_name> <folder_name> <difficulty>", file=sys.stderr)  
        sys.exit(1)  # Exit with error code 1

    input_image_path, bucket_name, folder_name, difficulty = sys.argv[1:5]  # Get command line arguments
    difficulty = difficulty.lower()  # Convert difficulty level to lowercase

    if difficulty not in {"easy", "medium", "hard"}:
        print("Invalid difficulty level. Choose from 'easy', 'medium', 'hard'.", file=sys.stderr)  # Print error message for invalid difficulty level
        sys.exit(1)  # Exit with error code 

    try:
        result = paint_by_numbers(input_image_path, bucket_name, folder_name, difficulty)  # Generate paint-by-numbers output
        print(json.dumps(result))  # Print output data as JSON
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)  # Print error message if an exception occurs
        sys.exit(1)  # Exit with error code 