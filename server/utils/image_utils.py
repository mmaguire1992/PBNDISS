import os
import numpy as np
from skimage import io, color
import matplotlib.pyplot as plt

def load_image(image_path: str) -> np.ndarray:
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found: {image_path}")

    try:
        image = io.imread(image_path)
        if not isinstance(image, np.ndarray):
            raise ValueError("Loaded data is not in the expected format (NumPy array).")
        if len(image.shape) == 2:
            image = color.gray2rgb(image)
        return image
    except Exception as e:
        raise IOError(f"Failed to load image from {image_path}. Error: {e}")
    
def convert_to_ycbcr(image: np.ndarray) -> np.ndarray:
    if not isinstance(image, np.ndarray):
        raise TypeError("Image must be a NumPy array for conversion.")
    return color.rgb2ycbcr(image)

def save_image(image: np.ndarray, path: str):
    if not isinstance(image, np.ndarray):
        raise TypeError("Image must be a NumPy array for saving.")
    plt.imshow(image)
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(path, bbox_inches='tight', pad_inches=0, dpi=1000)
    plt.close()
