import numpy as np
from skimage import color, feature

def analyse_image_complexity(image: np.ndarray):
    # Convert the image to grayscale
    grey_image = color.rgb2gray(image)
    
    # Detect edges in the grayscale image
    edges = feature.canny(grey_image)
    
    # Calculate the complexity of the image based on the edges
    complexity = np.sum(edges) / edges.size
    
    # Return the calculated complexity
    return complexity
