import sys
import os
from datetime import datetime
from image_utils import load_image, save_image
from analysis import analyze_image_complexity
from segmentation import (
    segment_image,
    adaptive_segmentation_params,
    filter_small_segments,
    get_segment_colours,
)
from clustering import dynamic_color_clustering
from pbn_creation import create_pbn_output, create_colored_output, create_color_key
from google.cloud import storage
import numpy as np


def verify_numpy_array(image, step_description):
    if not isinstance(image, np.ndarray):
        raise TypeError(f"After {step_description}, the image is not a NumPy array.")


def generate_unique_filename(original_filename):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    _, ext = os.path.splitext(original_filename)
    return f"{timestamp}{ext}"


def upload_to_gcloud(bucket_name, source_file_path, destination_blob_name):
    storage_client = storage.Client.from_service_account_json(
        "/Users/michaelmaguire/Downloads/maximal-kingdom-414314-57f47cd90afb.json"
    )
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    try:
        blob.upload_from_filename(source_file_path)
        print(f"Successfully uploaded {destination_blob_name} to Google Cloud Storage.")
        return blob.public_url
    except Exception as e:
        print(
            f"Failed to upload {source_file_path} to Google Cloud Storage. Error: {e}"
        )
        return None


def paint_by_numbers(image_path, bucket_name, folder_name, difficulty):
    image = load_image(image_path)
    verify_numpy_array(image, "loading the image")

    edge_density = analyze_image_complexity(image)
    n_segments, compactness = adaptive_segmentation_params(
        image, edge_density, difficulty
    )
    segments = segment_image(image, n_segments, compactness)
    segments = filter_small_segments(segments)
    segment_colours = get_segment_colours(image, segments)
    kmeans = dynamic_color_clustering(segment_colours, difficulty)

    pbn_output = create_pbn_output(image, segments, kmeans)
    verify_numpy_array(pbn_output, "creating PBN output")
    colored_output = create_colored_output(image, segments, kmeans)
    verify_numpy_array(colored_output, "creating colored output")

    # Ensure this generates an image and saves it, returning the path
    color_key_path = create_color_key(kmeans.cluster_centers_, "/tmp")

    # Prepare and upload files
    files_to_upload = [
        (pbn_output, "pbn_output.png", False),  # False indicates it's an image array
        (
            colored_output,
            "colored_output.png",
            False,
        ),  # False indicates it's an image array
        (color_key_path, "color_key.png", True),  # True indicates it's already a path
    ]

    for item, filename, is_path in files_to_upload:
        unique_filename = generate_unique_filename(filename)
        if not is_path:
            # It's an image array that needs saving
            temp_path = f"/tmp/{unique_filename}"
            save_image(item, temp_path)
            print(f"Saved {filename} to {temp_path}")
        else:
            # It's already a file path
            temp_path = item
            print(f"{filename} is already saved at {temp_path}")

        # Upload the file
        uploaded_url = upload_to_gcloud(
            bucket_name, temp_path, f"{folder_name}/{unique_filename}"
        )
        if uploaded_url:
            print(f"Uploaded {filename} to {uploaded_url}")
        else:
            print(f"Failed to upload {filename}.")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(
            "Usage: python main.py <input_file_path> <bucket_name> <folder_name> <difficulty>",
            file=sys.stderr,
        )
        sys.exit(1)

    input_image_path, bucket_name, folder_name, difficulty = sys.argv[1:5]
    difficulty = difficulty.lower()

    if difficulty not in {"easy", "medium", "hard"}:
        print(
            "Invalid difficulty level. Choose from 'easy', 'medium', 'hard'.",
            file=sys.stderr,
        )
        sys.exit(1)

    try:
        paint_by_numbers(input_image_path, bucket_name, folder_name, difficulty)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
