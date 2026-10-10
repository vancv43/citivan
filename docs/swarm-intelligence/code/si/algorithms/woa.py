"""Whale Optimization Algorithm (chương 10.1).

Mirjalili & Lewis (2016), Advances in Engineering Software 95. b = 1; a: 2 -> 0;
A, C vô hướng cho từng cá voi như mã gốc; p < 0.5: vây bắt (|A| < 1) hoặc theo X_rand; p >= 0.5: xoắn ốc.
"""
import numpy as np


def run(prob, rng, n=30, b=1.0):
    T = prob.budget // n
    X = prob.random(rng, n)
    prob(X)
    t = 0
    while not prob.done:
        t += 1
        a = 2 - 2 * t / T
        Xs = prob.best_x.copy()
        old = X.copy()
        for i in range(n):
            A = 2 * a * rng.random() - a
            C = 2 * rng.random()
            l = rng.uniform(-1, 1)
            if rng.random() < 0.5:
                ref = Xs if abs(A) < 1 else old[rng.integers(n)]
                X[i] = ref - A * np.abs(C * ref - X[i])
            else:
                X[i] = np.abs(Xs - X[i]) * np.exp(b * l) * np.cos(2 * np.pi * l) + Xs
        X = prob.clip(X)
        prob(X)
    return prob.best_x, prob.best_f
