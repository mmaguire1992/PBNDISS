import numpy as np
import matplotlib.pyplot as plt
from skimage.segmentation import find_boundaries
from skimage.morphology import skeletonize
from scipy.ndimage import center_of_mass
from sklearn.cluster import KMeans
from typing import List
import os

def create_pbn_output(image: np.ndarray, segments: np.ndarray, kmeans: KMeans) -> np.ndarray:
    pbn_output = np.ones(image.shape, dtype=np.uint8) * 255
    skeletonized_boundaries = skeletonize(find_boundaries(segments, mode='outer'))
    pbn_output[skeletonized_boundaries] = 0

    label_positions = {}
    height, width = image.shape[:2]

    for segment_id in np.unique(segments):
        if segment_id == 0:
            continue

        segment_mask = segments == segment_id
        y, x = map(int, center_of_mass(segment_mask))

        offset_y, offset_x = 0, 0
        max_offset = 50
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

    for segment_id, pos in label_positions.items():
        plt.text(pos[1], pos[0], str(kmeans.labels_[segment_id - 1] + 1), color='black', ha='center', va='center', fontsize=0.7)

    return pbn_output

def create_colored_output(image: np.ndarray, segments: np.ndarray, kmeans: KMeans) -> np.ndarray:
    colored_output = np.zeros_like(image)

    for idx, segment_id in enumerate(np.unique(segments)):
        if segment_id == 0:
            continue
        mask = segments == segment_id
        colored_output[mask] = kmeans.cluster_centers_[kmeans.labels_[idx]]

    return colored_output

def create_color_key(clustered_colors: List[np.ndarray], output_directory: str) -> str:
    num_colors = len(clustered_colors)
    fig, ax = plt.subplots(figsize=(20, num_colors))

    for idx, color in enumerate(clustered_colors):
        ax.fill_between([0, 5], idx, idx + 1, color=np.clip(color / 255, 0, 1))
        ax.text(0.5, idx + 0.5, str(idx + 1), color='black', ha='center', va='center')

    ax.set_xlim(0, 1)
    ax.set_ylim(0, num_colors)
    ax.axis('off')

    color_key_path = os.path.join(output_directory, 'color_key.png')
    plt.savefig(color_key_path, bbox_inches='tight')
    plt.close()

    return color_key_path
