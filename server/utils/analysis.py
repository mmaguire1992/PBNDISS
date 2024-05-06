import numpy as np
from skimage import color, feature

def analyse_image_complexity(image: np.ndarray):
    # Convert RGB image to grayscale
    grey_image = color.rgb2gray(image)  
    # Detect edges in the grayscale image
    edges = feature.canny(grey_image)  
    # Calculate complexity as the ratio of edge pixels to total pixels
    complexity = np.sum(edges) / edges.size   
    # Return the calculated complexity
    return complexity  