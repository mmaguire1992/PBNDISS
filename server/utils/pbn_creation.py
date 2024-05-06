import numpy as np
import matplotlib.pyplot as plt
from skimage.segmentation import find_boundaries
from skimage.morphology import skeletonize
from scipy.ndimage import center_of_mass
from sklearn.cluster import KMeans
import os

def rgb_to_hex(rgb):
    # Convert RGB to hexadecimal colour code
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def create_pbn_output(image: np.ndarray, segments: np.ndarray, kmeans: KMeans) -> np.ndarray:
    # Create a paint-by-numbers output image based on input image, segments, and KMeans clustering
    pbn_output = np.ones(image.shape, dtype=np.uint8) * 255
    
    # Skeletonise segment boundaries and fill them in the output image
    skeletonised_boundaries = skeletonize(find_boundaries(segments, mode='outer'))
    pbn_output[skeletonised_boundaries] = 0

    # Determine label positions for each segment to place labels
    label_positions = {}
    height, width = image.shape[:2]

    for segment_id in np.unique(segments):
        if segment_id == 0:
            continue

        # Calculate the centre of mass of each segment
        segment_mask = segments == segment_id
        y, x = map(int, center_of_mass(segment_mask))

        # Search for a suitable label position around the centre of mass
        offset_y, offset_x = 0, 0
        max_offset = 25
        found_spot = False

        while not found_spot and abs(offset_y) <= max_offset and abs(offset_x) <= max_offset:
            proposed_y, proposed_x = y + offset_y, x + offset_x

            if 0 <= proposed_y < height and 0 <= proposed_x < width and segments[proposed_y, proposed_x] == segment_id:
                if not any(np.hypot(pos[0] - proposed_y, pos[1] - proposed_x) < 5 for pos in label_positions.values()):
                    found_spot = True
            if not found_spot:
                offset_x, offset_y = (offset_x + 10, offset_y) if abs(offset_x) <= abs(offset_y) else (offset_x, offset_y + 10)

        if found_spot:
            label_positions[segment_id] = (proposed_y, proposed_x)

    # Add labels to the output image
    for segment_id, pos in label_positions.items():
        plt.text(pos[1], pos[0], str(kmeans.labels_[segment_id - 1] + 1), color='black', ha='center', va='center', fontsize=0.7)

    return pbn_output

def create_coloured_output(image: np.ndarray, segments: np.ndarray, kmeans: KMeans) -> np.ndarray:
    # Create a coloured output image based on input image, segments, and KMeans clustering
    coloured_output = np.zeros_like(image)

    for idx, segment_id in enumerate(np.unique(segments)):
        if segment_id == 0:
            continue
        mask = segments == segment_id
        coloured_output[mask] = kmeans.cluster_centers_[kmeans.labels_[idx]]

    return coloured_output

def create_colour_key(clustered_colours: np.ndarray, output_directory: str) -> str:
    num_colours = len(clustered_colours)
    num_cols = 2  # Number of columns in the grid
    num_rows = (num_colours + num_cols - 1) // num_cols  # Calculate number of rows needed
    
    fig, ax = plt.subplots(figsize=(10, num_rows * 1.5))  # Adjusted for additional text

    for idx, colour in enumerate(clustered_colours):
        row = idx // num_cols
        col = idx % num_cols
        colour_code = rgb_to_hex(colour)
        ax.fill_between([col, col + 1], num_rows - row - 1, num_rows - row, color=np.clip(colour / 255, 0, 1))
        ax.text(col + 0.5, num_rows - row - 0.5, f"{idx + 1}\n{colour_code}", color='black', ha='center', va='center', fontsize=20)  #  fontsize 

    ax.set_xlim(0, num_cols)
    ax.set_ylim(0, num_rows)
    ax.axis('off')

    # Save the colour key image to the output directory
    colour_key_path = os.path.join(output_directory, 'colour_key.png')
    plt.savefig(colour_key_path, bbox_inches='tight')
    plt.close()

    return colour_key_path