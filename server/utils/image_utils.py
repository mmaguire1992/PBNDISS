import os
import numpy as np
from skimage import io, color
import matplotlib.pyplot as plt

def load_image(image_path: str):
    # Check if the image file exists
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found: {image_path}")

    try:
        # Read the image from the specified path
        image = io.imread(image_path)
        # Ensure the loaded data is a NumPy array
        if not isinstance(image, np.ndarray):
            raise ValueError("The loaded data is not in the expected format (NumPy array).")
        # Convert grayscale images to RGB format
        if len(image.shape) == 2:
            image = color.gray2rgb(image)
        return image
    except Exception as e:
        # Handle errors during image loading
        raise IOError(f"Failed to load the image from {image_path}. Error: {e}")



def save_image(image: np.ndarray, path: str):
    # Ensure the input image is a NumPy array
    if not isinstance(image, np.ndarray):
        raise TypeError("The image must be a NumPy array for saving.")
    # Display the image using matplotlib and save it to the specified path
    plt.imshow(image)
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(path, bbox_inches='tight', pad_inches=0, dpi=1000)
    plt.close()
