"""Bầy đàn nhị phân (chương 15): hàm chuyển dạng S và V, Binary PSO, bài cái túi 0/1, chọn đặc trưng.

Hàm chuyển S1–S4, V1–V4: Mirjalili & Lewis (2013), Swarm and Evolutionary Computation 9: 1–14.
Binary PSO: Kennedy & Eberhart (1997). Tham số theo Mirjalili & Lewis (2013): vmax = 6, w 0.9 -> 0.4, c1 = c2 = 2.
Hàm chọn đặc trưng: alpha (1 - acc) + (1 - alpha) |S|/|N|, alpha = 0.99 (Emary, Zawbaa & Hassanien, 2016).
"""
import math
import numpy as np

S = {
    'S1': lambda v: 1 / (1 + np.exp(-2 * v)), 'S2': lambda v: 1 / (1 + np.exp(-v)),
    'S3': lambda v: 1 / (1 + np.exp(-v / 2)), 'S4': lambda v: 1 / (1 + np.exp(-v / 3)),
}
V = {
    'V1': lambda v: np.abs(np.vectorize(math.erf)(np.sqrt(np.pi) / 2 * v)), 'V2': lambda v: np.abs(np.tanh(v)),
    'V3': lambda v: np.abs(v / np.sqrt(1 + v ** 2)), 'V4': lambda v: np.abs(2 / np.pi * np.arctan(np.pi / 2 * v)),
}


def bpso(fitness, D, budget, rng, transfer='S2', n=30, vmax=6.0, w_max=0.9, w_min=0.4, c1=2.0, c2=2.0):
    """Cực tiểu fitness(B) với B ma trận nhị phân (n, D). Trả về (vector tốt nhất, giá trị, số lần đánh giá)."""
    T = max(1, budget // n)
    tf = {**S, **V}[transfer]
    X = (rng.random((n, D)) < 0.5).astype(int)
    Vel = rng.uniform(-vmax, vmax, (n, D))
    f = fitness(X); fes = n
    P, pf = X.copy(), f.copy()
    t = 0
    while fes < budget:
        t += 1
        w = w_max - (w_max - w_min) * t / T
        g = P[np.argmin(pf)]
        Vel = np.clip(w * Vel + c1 * rng.random((n, D)) * (P - X) + c2 * rng.random((n, D)) * (g - X), -vmax, vmax)
        prob = tf(Vel)
        if transfer.startswith('S'):
            X = (rng.random((n, D)) < prob).astype(int)
        else:
            X = np.where(rng.random((n, D)) < prob, 1 - X, X)
        f = fitness(X); fes += n
        b = f < pf
        P[b], pf[b] = X[b], f[b]
    i = int(np.argmin(pf))
    return P[i], pf[i], fes


def knapsack_instance(n, seed):
    rng = np.random.default_rng(seed)
    w = rng.integers(1, 101, n); v = rng.integers(1, 101, n)
    return w, v, int(w.sum() // 2)


def knapsack_dp(w, v, cap):
    best = np.zeros(cap + 1, int)
    for wi, vi in zip(w, v):
        best[wi:] = np.maximum(best[wi:], best[:-wi or None][:cap + 1 - wi] + vi)
    return int(best.max())


def knapsack_fitness(w, v, cap):
    """Giá trị âm (để cực tiểu), phạt tuyến tính theo phần vượt tải với hệ số max(v/w)."""
    rho = float((v / w).max())
    def fit(B):
        W = B @ w; Val = B @ v
        return -(Val - rho * np.maximum(0, W - cap) * 1.0)
    return fit


def fs_fitness(Xtr, ytr, alpha=0.99, folds=5, k=5, seed=0):
    from sklearn.model_selection import cross_val_score, StratifiedKFold
    from sklearn.neighbors import KNeighborsClassifier
    cv = StratifiedKFold(folds, shuffle=True, random_state=seed)
    N = Xtr.shape[1]; cache = {}
    def fit(B):
        out = np.empty(len(B))
        for r, b in enumerate(B):
            key = b.tobytes()
            if key not in cache:
                if b.sum() == 0:
                    cache[key] = 1.0
                else:
                    acc = cross_val_score(KNeighborsClassifier(k), Xtr[:, b == 1], ytr, cv=cv).mean()
                    cache[key] = alpha * (1 - acc) + (1 - alpha) * b.sum() / N
            out[r] = cache[key]
        return out
    return fit
