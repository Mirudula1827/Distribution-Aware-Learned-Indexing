# Distribution-Aware Learned Index

We present a distribution-aware variant of the Recursive Model Index (RMI) that adapts to data distribution while providing explicit error bounds for guaranteed correctness. Inspired by The Case for Learned Index Structures (Kraska et al.), this system achieves low average lookup cost while maintaining tight tail latency across diverse data distributions.

The system adapts to uniform, random, and skewed distributions while maintaining low search complexity and tight tail latency.

---

## Key Idea

Traditional indexing relies on comparisons:

```
Binary Search → O(log n)
```

We instead learn:

```
position ≈ f(key)
```

and refine predictions using distribution-aware local models with bounded error correction.

---

## Core Features

* Hierarchical learned index (root + leaf models)
* Explicit residual error bounds → **guaranteed correctness**
* Distribution-aware behavior across:

  * Uniform
  * Random
  * Skewed (heavy-tailed)
* Low average and tail latency

---

## 📊 Results

| Method         | Avg Steps | P99 Steps |
| -------------- | --------- | --------- |
| Binary Search  | ~10–12    | ~12–14    |
| Simple Learned | ~4–5      | ~6        |
| **Elite RMI**  | **~2–3**  | **~2–5**  |

→ Up to **6× faster than binary search**

→ Maintains **tight tail latency across distributions**

---

## Why This Matters

Most learned indexes perform well only under ideal distributions.

This work shows that:

> Distribution-aware modeling + error bounds enables stable and efficient learned indexing in realistic scenarios.

---


## 🛠️ Tech Stack

- Frontend: React.js
- Backend: Flask (Python)
- Libraries: NumPy

---
## 🚀 How to run?

1️⃣ Clone the Repository
```
git clone https://github.com/Mirudula1827/Distribution-Aware-Learned-Indexing.git
cd Distribution-Aware-Learned-Indexing
```
2️⃣ Backend Setup
```
cd backend
pip install -r requirements.txt
python distribution_aware.py
```
Backend runs on: http://localhost:5000

3️⃣ Frontend Setup
```
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

---
### Note

- Ensure backend is running before frontend
- Supported distributions: uniform, random, skewed

---

## 📂 Project Structure

```
Distribution-Aware-Learned-Indexing/
│── backend/
│   ├── distribution_aware.py
│   ├── requirements.txt
│
│── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│
│── README.md
```

---

## 👤 Author

- Mirudula N D
- Sanjay Kumar Sakamuri Kamalakar
- Jane Pathuva Reya R
 
---

## Summary

This project demonstrates that incorporating distribution awareness into learned indexing significantly improves both performance and robustness, bridging the gap between classical data structures and machine learning-based systems.

> Under progress
> Currently as a DAA curriculum project




