"""Bacterial Foraging Optimization (chương 13.1).

Passino (2002), IEEE Control Systems Magazine 22(3): 52-67.
Theo bài: Ns = 4, Nre = 4, Ned = 2, Ped = 0.25, Sr = S/2, hệ số bầy đàn d_attract = 0.1,
w_attract = 0.2, h_repellant = 0.1, w_repellant = 10. Bước chạy C = 0.01 (ub - lb) (bài dùng C = 0.1
trên miền cỡ 10). Số bước hóa hướng động Nc được chọn để vừa ngân sách.
"""
import numpy as np


def _jcc(X, i, da=0.1, wa=0.2, hr=0.1, wr=10.0):
    d2 = np.sum((X[i] - X) ** 2, axis=1)
    return np.sum(-da * np.exp(-wa * d2)) + np.sum(hr * np.exp(-wr * d2))


def run(prob, rng, n=30, Ns=4, Nre=4, Ned=2, Ped=0.25):
    C = 0.01 * (prob.ub - prob.lb)
    Nc = max(1, prob.budget // (n * Nre * Ned * 2))
    X = prob.random(rng, n)
    J = prob(X)
    while not prob.done:
        for _ in range(Ned):
            for _ in range(Nre):
                health = np.zeros(n)
                for _ in range(Nc):
                    for i in range(n):
                        if prob.done:
                            return prob.best_x, prob.best_f
                        Jlast = J[i] + _jcc(X, i)
                        delta = rng.uniform(-1, 1, prob.dim)
                        step = C * delta / np.linalg.norm(delta)
                        X[i] = prob.clip(X[i] + step); J[i] = prob(X[i])[0]
                        Ji = J[i] + _jcc(X, i)
                        m = 0
                        while m < Ns and Ji < Jlast and not prob.done:     # bơi tiếp khi còn tốt lên
                            Jlast = Ji
                            X[i] = prob.clip(X[i] + step); J[i] = prob(X[i])[0]
                            Ji = J[i] + _jcc(X, i)
                            m += 1
                        health[i] += J[i]
                o = np.argsort(health)                                   # sinh sản
                half = n // 2
                X = np.vstack([X[o[:half]], X[o[:half]]])[:n]
                J = np.concatenate([J[o[:half]], J[o[:half]]])[:n]
            disperse = rng.random(n) < Ped                               # loại bỏ – phát tán
            if disperse.any():
                X[disperse] = prob.random(rng, int(disperse.sum()))
                J[disperse] = prob(X[disperse])
    return prob.best_x, prob.best_f
