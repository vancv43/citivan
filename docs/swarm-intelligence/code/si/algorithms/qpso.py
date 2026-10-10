"""Quantum-behaved PSO (chương 16).

Sun, Feng & Xu (2004), IEEE CEC 2004; Sun, Xu & Feng (2004), IEEE CIS 2004.
x = p ± beta |mbest - x| ln(1/u), p = phi pbest + (1 - phi) gbest; beta giảm tuyến tính 1.0 -> 0.5.
"""
import numpy as np


def run(prob, rng, n=30, b_max=1.0, b_min=0.5):
    T = prob.budget // n
    X = prob.random(rng, n)
    f = prob(X)
    P, pf = X.copy(), f.copy()
    t = 0
    while not prob.done:
        t += 1
        beta = b_max - (b_max - b_min) * t / T
        g = P[np.argmin(pf)]
        mbest = P.mean(axis=0)
        phi = rng.random(X.shape)
        p = phi * P + (1 - phi) * g
        u = rng.random(X.shape)
        sign = np.where(rng.random(X.shape) < 0.5, 1, -1)
        X = prob.clip(p + sign * beta * np.abs(mbest - X) * np.log(1 / u))
        f = prob(X)
        better = f < pf
        P[better], pf[better] = X[better], f[better]
    return prob.best_x, prob.best_f
