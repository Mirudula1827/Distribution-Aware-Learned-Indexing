import numpy as np

def generate_data(dist_type, n=100000):
    if dist_type == "uniform":
        data = np.sort(np.random.uniform(0, 1, n))
    elif dist_type == "normal":
        data = np.sort(np.random.normal(0.5, 0.1, n))
    elif dist_type == "skewed":
        data = np.sort(np.random.exponential(1, n))
    return data
