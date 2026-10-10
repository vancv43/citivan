"""Moth-Flame Optimization (chương 6.2).

Mirjalili (2015), Knowledge-Based Systems 89. b = 1; FN = round(N - l (N - 1) / T);
r giảm từ -1 về -2, t ~ U(r, 1); ngọn lửa = N vị trí tốt nhất của (ngọn lửa cũ ∪ bướm đêm).
"""
import numpy as np


def run(prob, rng, n=30, b=1.0):
    T = prob.budget // n
    M = prob.random(rng, n)
    mf = prob(M)
    o = np.argsort(mf); F, ff = M[o].copy(), mf[o].copy()
    l = 0
    while not prob.done:
        l += 1
        FN = int(round(n - l * (n - 1) / T)); FN = max(FN, 1)
        r = -1 + l * (-1 / T)
        for i in range(n):
            j = min(i, FN - 1)
            t = (r - 1) * rng.random(prob.dim) + 1
            Dd = np.abs(F[j] - M[i])
            M[i] = Dd * np.exp(b * t) * np.cos(2 * np.pi * t) + F[j]
        M = prob.clip(M)
        mf = prob(M)
        allx = np.vstack([F, M]); allf = np.concatenate([ff, mf])
        o = np.argsort(allf)[:n]
        F, ff = allx[o], allf[o]
    return prob.best_x, prob.best_f
