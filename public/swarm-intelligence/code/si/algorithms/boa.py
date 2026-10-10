"""Butterfly Optimization Algorithm (chương 7.2).

Arora & Singh (2019), Soft Computing 23. Theo bài và mã gốc: hương = c I^a với I = f(x),
p = 0.8, a = 0.1, c0 = 0.01, c <- c + 0.025 / (c T); bước toàn cục x + (r² g* - x) f_i;
bước cục bộ x + (r² x_j - x_k) f_i; nhận lời giải mới nếu tốt hơn.
Vì I = f(x) cần không âm, ta dùng I = f(x) - min(f) + 1e-12 trong vòng lặp.
"""
import numpy as np


def run(prob, rng, n=30, p=0.8, a=0.1, c=0.01):
    T = prob.budget // n
    X = prob.random(rng, n)
    fx = prob(X)
    while not prob.done:
        g = prob.best_x
        I = fx - fx.min() + 1e-12
        fr = c * I ** a
        Y = np.empty_like(X)
        for i in range(n):
            r = rng.random()
            if rng.random() < p:
                Y[i] = X[i] + (r * r * g - X[i]) * fr[i]
            else:
                j, k = rng.integers(n, size=2)
                Y[i] = X[i] + (r * r * X[j] - X[k]) * fr[i]
        Y = prob.clip(Y)
        fy = prob(Y)
        better = fy < fx
        X[better], fx[better] = Y[better], fy[better]
        c = c + 0.025 / (c * T)
    return prob.best_x, prob.best_f
