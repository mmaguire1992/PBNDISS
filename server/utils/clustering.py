import numpy as np
from sklearn.cluster import KMeans
from typing import List

def dynamic_colour_clustering(segment_colours: List[np.ndarray], difficulty: str):
    # Calculate the mean colour  across segments
    colour_var = np.var(segment_colours, axis=0).mean()
    # establish the number of clusters based on the difficulty level
    n_clusters = min(max({'easy': 25, 'medium': 35, 'hard': 45}[difficulty], 5), int(colour_var * 100))
    # Perform KMeans clustering with the number of clusters
    return KMeans(n_clusters=n_clusters, n_init=50, random_state=42).fit(segment_colours)
