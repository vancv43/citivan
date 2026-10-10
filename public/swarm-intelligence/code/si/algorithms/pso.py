"""Particle Swarm Optimization (chương 3).

Kennedy & Eberhart (1995), trọng số quán tính giảm tuyến tính theo Shi & Eberhart (1998, 1999).
Tham số: w 0.9 -> 0.4, c1 = c2 = 2, vmax = 0.2 (ub - lb).
"""
import numpy as np


def run(prob, rng, n=30, w_max=0.9, w_min=0.4, c1=2.0, c2=2.0, vfrac=0.2):
    T = prob.budget // n
    X = prob.random(rng, n)
    vmax = vfrac * (prob.ub - prob.lb)
    V = np.zeros_like(X)
    f = prob(X)
    P, pf = X.copy(), f.copy()
    g = P[np.argmin(pf)].copy()
    t = 0
    while not prob.done:
        t += 1
        w = w_max - (w_max - w_min) * t / T
        r1, r2 = rng.random(X.shape), rng.random(X.shape)
        V = w * V + c1 * r1 * (P - X) + c2 * r2 * (g - X)
        V = np.clip(V, -vmax, vmax)
        X = prob.clip(X + V)
        f = prob(X)
        better = f < pf
        P[better], pf[better] = X[better], f[better]
        g = P[np.argmin(pf)].copy()
    return prob.best_x, prob.best_f
