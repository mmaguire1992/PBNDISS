import numpy as np 
from skimage import color, feature 

def analyze_image_complexity(image: np.ndarray) -> float:

    gray_image = color.rgb2gray(image)
    
    edges = feature.canny(gray_image)
    
    complexity = np.sum(edges) / edges.size
    
    return complexity
