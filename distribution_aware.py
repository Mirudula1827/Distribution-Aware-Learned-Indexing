import numpy as np
import random

np.random.seed(42)
random.seed(42)

def generate_data(n, dist="uniform"):
    important_values = np.array([1, 100, 1000, 10000])

    if dist == "uniform":
        data = np.arange(n)
    elif dist == "random":
        data = np.random.choice(np.arange(n * 10), n, replace=False)
    elif dist == "skewed":
        data = (np.random.pareto(2.0, n) + 1) * 1000
        data = np.unique(data.astype(int))
    else:
        raise ValueError("Unknown distribution")

    data = np.unique(np.concatenate((data, important_values)))
    return np.sort(data)

def linear_search(arr, target):
    steps = 0
    for i in range(len(arr)):
        steps += 1
        if arr[i] == target:
            return i, steps
    return -1, steps

def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    steps = 0
    while left <= right:
        steps += 1
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid, steps
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1, steps

class SimpleLearnedIndex:
    def __init__(self):
        self.a = 0
        self.b = 0
        self.data = None

    def train(self, data):
        self.data = data
        indices = np.arange(len(data))
        self.a, self.b = np.polyfit(data, indices, 1)

    def search(self, key):
        steps = 0
        n = len(self.data)
        pred = int(self.a * key + self.b)
        pred = max(0, min(n - 1, pred))
        left = max(0, pred - 20)
        right = min(n - 1, pred + 20)
        idx, s = binary_search(self.data[left:right + 1], key)
        steps += s
        if idx == -1:
            return -1, steps
        return left + idx, steps

class DistributionAwareRMI:
    def __init__(self, num_leaves=100):
        self.num_leaves = num_leaves
        self.root = None
        self.leaves = []
        self.data = None

    def train(self, data):
        self.data = data
        n = len(data)
        indices = np.arange(n)
        slope, intercept = np.polyfit(data, indices, 1)
        self.root = (slope, intercept)
        raw_preds = slope * data + intercept
        leaf_ids = np.clip((raw_preds / n * self.num_leaves).astype(int), 0, self.num_leaves - 1)
        self.leaves = []
        for i in range(self.num_leaves):
            mask = (leaf_ids == i)
            if np.any(mask):
                l_data = data[mask]
                l_idx = indices[mask]
                if len(l_data) > 1:
                    ls, li = np.polyfit(l_data, l_idx, 1)
                else:
                    ls, li = 0, l_idx[0]
                preds = ls * l_data + li
                errors = l_idx - preds
                min_err = int(np.floor(np.min(errors)))
                max_err = int(np.ceil(np.max(errors)))
                self.leaves.append({'params': (ls, li), 'bounds': (min_err, max_err), 'empty': False})
            else:
                self.leaves.append({'empty': True})

    def search(self, key):
        n = len(self.data)
        steps = 0
        rs, ri = self.root
        leaf_idx = int((rs * key + ri) / n * self.num_leaves)
        leaf_idx = max(0, min(self.num_leaves - 1, leaf_idx))
        leaf = self.leaves[leaf_idx]
        if leaf['empty']:
            idx, s = binary_search(self.data, key)
            return idx, s
        ls, li = leaf['params']
        min_err, max_err = leaf['bounds']
        pred = int(ls * key + li)
        left = max(0, pred + min_err)
        right = min(n - 1, pred + max_err)
        idx, s = binary_search(self.data[left:right + 1], key)
        steps += s
        if idx == -1:
            return -1, steps
        return left + idx, steps

def run_benchmarks():
    N = 10000
    distributions = ["uniform", "random", "skewed"]
    for dist in distributions:
        print(f"\n--- Testing Distribution: {dist.upper()} ---")
        data = generate_data(N, dist)
        simple = SimpleLearnedIndex()
        simple.train(data)
        rmi = DistributionAwareRMI(num_leaves=100)
        rmi.train(data)
        queries = random.sample(list(data), min(200, len(data)))
        stats = {"Linear": [], "Binary": [], "SimpleLearned": [], "DistributionAwareRMI": []}
        for q in queries:
            stats["Linear"].append(linear_search(data, q)[1])
            stats["Binary"].append(binary_search(data, q)[1])
            stats["SimpleLearned"].append(simple.search(q)[1])
            stats["DistributionAwareRMI"].append(rmi.search(q)[1])
        for name, steps in stats.items():
            avg = sum(steps) / len(steps)
            print(f"{name:25} | Avg Steps: {avg:8.2f}")
            print(f"{name:25} | P99 Steps: {np.percentile(steps, 99):6.2f}")

if __name__ == "__main__":
    run_benchmarks()
