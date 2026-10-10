"""Salp Swarm Algorithm (chương 12.1).

Mirjalili, Gandomi, Mirjalili, Saremi, Faris & Mirjalili (2017), Advances in Engineering Software 114.
c1 = 2 e^{-(4t/T)^2}; theo mã gốc nửa đầu quần thể là con dẫn đầu, nửa sau là con bám đuôi
x_i = (x_i + x_{i-1}) / 2; thức ăn F = lời giải tốt nhất.
"""
import numpy as np


def run(prob, rng, n=30):
    T = prob.budget // n
    X = prob.random(rng, n)
    prob(X)
    t = 0
    while not prob.done:
        t += 1
        c1 = 2 * np.exp(-(4 * t / T) ** 2)
        F = prob.best_x.copy()
        for i in range(n):
            if i < n / 2:
                c2, c3 = rng.random(prob.dim), rng.random(prob.dim)
                step = c1 * ((prob.ub - prob.lb) * c2 + prob.lb)
                X[i] = np.where(c3 < 0.5, F + step, F - step)
            else:
                X[i] = (X[i] + X[i - 1]) / 2
        X = prob.clip(X)
        prob(X)
    return prob.best_x, prob.best_f
