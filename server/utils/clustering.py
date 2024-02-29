import numpy as np
from sklearn.cluster import KMeans
from typing import List 

def dynamic_color_clustering(segment_colors: List[np.ndarray], difficulty: str) -> KMeans:
    color_var = np.var(segment_colors, axis=0).mean()
    n_clusters = min(max({'easy': 25, 'medium': 35, 'hard': 45}[difficulty], 5), int(color_var * 100))
    return KMeans(n_clusters=n_clusters, n_init=50, random_state=42).fit(segment_colors)
