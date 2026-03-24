import numpy as np
import random

class LearnedIndexRMI:
    def __init__(self, num_leaves=100):
        self.num_leaves = num_leaves
        self.root_slope = 0
        self.root_intercept = 0
        self.leaves = [] 
        self.data = []

    def train(self, data):
        self.data = np.array(data)
        n = len(self.data)
        indices = np.arange(n)

        self.root_slope, self.root_intercept = np.polyfit(self.data, indices, 1)
        
        leaf_assignments = self._predict_leaf(self.data)
        
        self.leaves = []
        for i in range(self.num_leaves):

            mask = (leaf_assignments == i)
            leaf_data = self.data[mask]
            leaf_indices = indices[mask]

            if len(leaf_data) > 1:
               
                slope, intercept = np.polyfit(leaf_data, leaf_indices, 1)
                
                preds = slope * leaf_data + intercept
                max_err = int(np.ceil(np.max(np.abs(preds - leaf_indices))))
                self.leaves.append((slope, intercept, max_err))
            elif len(leaf_data) == 1:
                self.leaves.append((0, leaf_indices[0], 0))
            else:
                self.leaves.append((0, 0, 0))

    def _predict_leaf(self, keys):
        raw_pos = self.root_slope * keys + self.root_intercept
        leaf_idx = (raw_pos / len(self.data) * self.num_leaves).astype(int)
        return np.clip(leaf_idx, 0, self.num_leaves - 1)

    def search(self, key):
        steps = 0
        

        leaf_idx = self._predict_leaf(np.array([key]))[0]
        slope, intercept, max_err = self.leaves[leaf_idx]

        pred_pos = int(slope * key + intercept)
        
        left = max(0, pred_pos - max_err)
        right = min(len(self.data) - 1, pred_pos + max_err)

        while left <= right:
            steps += 1
            mid = (left + right) // 2
            if self.data[mid] == key:
                return mid, steps
            elif self.data[mid] < key:
                left = mid + 1
            else:
                right = mid - 1
        return -1, steps

# -----------------------------
# Validation Experiment
# -----------------------------
def run_comparison():
    n = 100000
    data = sorted(np.unique((np.random.pareto(2, n) * 1000).astype(int)))
    
    rmi = LearnedIndexRMI(num_leaves=200)
    rmi.train(data)
    
    queries = random.sample(list(data), 500)
    rmi_steps = []
    
    for q in queries:
        idx, s = rmi.search(q)
        if idx == -1: raise Exception("Index Failed: Logic unsound!")
        rmi_steps.append(s)

    avg_steps = sum(rmi_steps)/len(rmi_steps)
    print(f"Dataset Size: {len(data)}")
    print(f"RMI Average Search Steps: {avg_steps:.2f}")
    print(f"Theoretical Binary Search Steps: {np.log2(len(data)):.2f}")

if __name__ == "__main__":
    run_comparison()
