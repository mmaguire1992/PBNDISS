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

# Function to print progress messages
def print_progress(message, percent):
    print(f"PROGRESS: {message} {percent}%", flush=True)

# Ensure numpy array type
def verify_numpy_array(image, step_description):
    if not isinstance(image, np.ndarray):
        raise TypeError(f"After {step_description}, the image is not a NumPy array.")

# Generate a unique filename using timestamp
def generate_unique_filename(original_filename):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    _, ext = os.path.splitext(original_filename)
    return f"{timestamp}{ext}"

# Upload to Google Cloud Storage
def upload_to_gcloud(bucket_name, source_file_path, destination_blob_name):
    storage_client = storage.Client.from_service_account_json(
        "/Users/michaelmaguire/Downloads/maximal-kingdom-414314-57f47cd90afb.json"
    )
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    try:
        blob.upload_from_filename(source_file_path)
        print(f"Successfully uploaded {destination_blob_name} to Google Cloud Storage.", flush=True)
        return blob.public_url
    except Exception as e:
        print(f"Failed to upload {source_file_path} to Google Cloud Storage. Error: {e}", flush=True)
        return None

# Main function for paint-by-numbers process
def paint_by_numbers(image_path, bucket_name, folder_name, difficulty):
    print_progress("Loading image", 10)
    image = load_image(image_path)
    verify_numpy_array(image, "loading the image")

    print_progress("Analysing image complexity", 20)
    edge_density = analyse_image_complexity(image)
    n_segments, compactness = adaptive_segmentation_params(image, edge_density, difficulty)

    print_progress("Segmenting image", 40)
    segments = segment_image(image, n_segments, compactness)
    segments = filter_small_segments(segments)
    segment_colours = get_segment_colours(image, segments)

    print_progress("Clustering colours", 60)
    kmeans = dynamic_colour_clustering(segment_colours, difficulty)

    print_progress("Creating PBN output", 80)
    pbn_output = create_pbn_output(image, segments, kmeans)
    verify_numpy_array(pbn_output, "creating PBN output")
    coloured_output = create_coloured_output(image, segments, kmeans)
    verify_numpy_array(coloured_output, "creating coloured output")

    print_progress("Creating colour key and capturing colour codes", 90)
    colour_key_path = create_colour_key(kmeans.cluster_centers_, "/tmp")

    colour_codes = [rgb_to_hex(color) for color in kmeans.cluster_centers_]

    files_to_upload = [
        (pbn_output, "pbn_output.png", False),
        (coloured_output, "coloured_output.png", False),
        (colour_key_path, "colour_key.png", True),
    ]

    output_data = {
        'pbnOutputUrl': None,
        'colouredOutputUrl': None,
        'colourKeyUrl': None,
        'colourCodes': colour_codes
    }

    for item, filename, is_path in files_to_upload:
        unique_filename = generate_unique_filename(filename)
        if not is_path:
            temp_path = f"/tmp/{unique_filename}"
            save_image(item, temp_path)
        else:
            temp_path = item

        uploaded_url = upload_to_gcloud(bucket_name, temp_path, f"{folder_name}/{unique_filename}")
        if uploaded_url:

            if filename == "pbn_output.png":
                output_data['pbnOutputUrl'] = uploaded_url
            elif filename == "coloured_output.png":
                output_data['colouredOutputUrl'] = uploaded_url
            elif filename == "colour_key.png":
                output_data['colourKeyUrl'] = uploaded_url

    print_progress("Complete", 100)
    print(json.dumps(output_data))

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python main.py <input_image_path> <bucket_name> <folder_name> <difficulty>", file=sys.stderr)
        sys.exit(1)

    input_image_path, bucket_name, folder_name, difficulty = sys.argv[1:5]
    difficulty = difficulty.lower()

    if difficulty not in {"easy", "medium", "hard"}:
        print("Invalid difficulty level. Choose from 'easy', 'medium', 'hard'.", file=sys.stderr)
        sys.exit(1)

    try:
        paint_by_numbers(input_image_path, bucket_name, folder_name, difficulty)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
