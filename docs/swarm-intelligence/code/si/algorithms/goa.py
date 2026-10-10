"""Grasshopper Optimisation Algorithm (chương 7.1).

Saremi, Mirjalili & Lewis (2017), Advances in Engineering Software 105.
Theo mã gốc: s(r) = f e^{-r/l} - e^{-r}, f = 0.5, l = 1.5; khoảng cách ánh xạ 2 + rem(d, 2);
c = cMax - t (cMax - cMin) / T, cMax = 1, cMin = 4e-5.
"""
import numpy as np


def run(prob, rng, n=30, cmax=1.0, cmin=4e-5, f=0.5, l=1.5):
    T = prob.budget // n
    X = prob.random(rng, n)
    fx = prob(X)
    target = X[np.argmin(fx)].copy()
    half = (prob.ub - prob.lb) / 2
    s = lambda r: f * np.exp(-r / l) - np.exp(-r)
    t = 0
    while not prob.done:
        t += 1
        c = cmax - t * (cmax - cmin) / T
        diff = X[None, :, :] - X[:, None, :]                 # x_j - x_i
        dist = np.linalg.norm(diff, axis=2) + 1e-14
        mapped = 2 + np.mod(dist, 2)
        coef = s(mapped) / dist
        np.fill_diagonal(coef, 0)
        S = np.einsum('ij,ijd->id', coef, diff) * (c * half)
        X = prob.clip(c * S + target)
        fx = prob(X)
        if prob.best_x is not None:
            target = prob.best_x.copy()
    return prob.best_x, prob.best_f
