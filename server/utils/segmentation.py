import numpy as np
from skimage.segmentation import slic
from typing import Tuple, List

def adaptive_segmentation_params(image: np.ndarray, edge_density: float, difficulty: str) -> Tuple[int, float]:
    base_segments = {'easy': 500, 'medium': 1000, 'hard': 2000}
    complexity_factor = edge_density * {'easy': 5000, 'medium': 8000, 'hard': 10000}[difficulty]
    n_segments = int(base_segments[difficulty] + complexity_factor)
    compactness = 6 / (1 + edge_density * {'easy': 4, 'medium': 5, 'hard': 7}[difficulty])
    return n_segments, compactness

def segment_image(image, n_segments, compactness):
    segmented_image = slic(image, n_segments=n_segments, compactness=compactness, sigma=1.6, start_label=1)
    return segmented_image

def get_segment_colours(image: np.ndarray, segments: np.ndarray) -> List[np.ndarray]:
    segment_colors = [image[segments == label].mean(axis=0) for label in np.unique(segments) if label != 0]
    return segment_colors

def filter_small_segments(segments: np.ndarray, min_size: int = 50) -> np.ndarray:
    segment_sizes = np.bincount(segments.ravel())
    mask = np.in1d(segments, np.where(segment_sizes >= min_size)[0]).reshape(segments.shape)
    return np.where(mask, segments, 0)
