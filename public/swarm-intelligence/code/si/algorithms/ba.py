"""Bat Algorithm (chương 10.2).

Yang (2010), Nature Inspired Cooperative Strategies for Optimization (NICSO 2010), SCI 284.
f in [0, 2], A0 = 1, r0 = 0.5, alpha = gamma = 0.9; bước cục bộ x* + eps * mean(A), eps ~ U(-1, 1).
Vận tốc được kẹp ở 0.2 (ub - lb) để tránh tràn số (lựa chọn cài đặt, ghi rõ trong slide).
"""
import numpy as np


def run(prob, rng, n=30, fmin=0.0, fmax=2.0, A0=1.0, r0=0.5, alpha=0.9, gamma=0.9, vfrac=0.2):
    X = prob.random(rng, n)
    fx = prob(X)
    V = np.zeros_like(X)
    A = np.full(n, A0); r = np.zeros(n)
    vmax = vfrac * (prob.ub - prob.lb)
    t = 0
    while not prob.done:
        t += 1
        best = prob.best_x.copy()
        Abar = A.mean()
        for i in range(n):
            if prob.done:
                break
            fr = fmin + (fmax - fmin) * rng.random()
            V[i] = np.clip(V[i] + (X[i] - best) * fr, -vmax, vmax)
            xn = X[i] + V[i]
            if rng.random() > r[i]:
                xn = best + rng.uniform(-1, 1, prob.dim) * Abar
            xn = prob.clip(xn)
            fn = prob(xn)[0]
            if rng.random() < A[i] and fn < fx[i]:
                X[i], fx[i] = xn, fn
                A[i] *= alpha
                r[i] = r0 * (1 - np.exp(-gamma * t))
    return prob.best_x, prob.best_f
