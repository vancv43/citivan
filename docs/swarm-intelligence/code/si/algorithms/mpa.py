"""Marine Predators Algorithm (chương 11).

Faramarzi, Heidarinejad, Mirjalili & Gandomi (2020), Expert Systems with Applications 152: 113377.
Theo mã gốc: P = 0.5, FADs = 0.2, CF = (1 - t/T)^{2t/T}, bước Lévy nhân 0.05;
ba pha theo một phần ba số vòng; lưu trữ trí nhớ biển (giữ vị trí tốt hơn) sau cập nhật và sau FADs.
Mỗi vòng tốn 2n lần đánh giá.
"""
import numpy as np
from ..core import levy


def run(prob, rng, n=30, P=0.5, FADs=0.2):
    T = prob.budget // (2 * n)
    X = prob.random(rng, n)
    fx = prob(X)
    t = 0
    while not prob.done:
        elite = prob.best_x.copy()
        CF = (1 - t / T) ** (2 * t / T) if t < T else 0.0
        RL = 0.05 * levy(rng, X.shape)
        RB = rng.normal(size=X.shape)
        R = rng.random(X.shape)
        Y = X.copy()
        if t < T / 3:
            Y = X + P * R * (RB * (elite - RB * X))
        elif t < 2 * T / 3:
            h = n // 2
            Y[:h] = X[:h] + P * R[:h] * (RL[:h] * (elite - RL[:h] * X[:h]))
            Y[h:] = elite + P * CF * (RB[h:] * (RB[h:] * elite - X[h:]))
        else:
            Y = elite + P * CF * (RL * (RL * elite - X))
        Y = prob.clip(Y)
        fy = prob(Y)
        keep = fy < fx
        X[keep], fx[keep] = Y[keep], fy[keep]                    # trí nhớ biển
        if rng.random() < FADs:
            U = rng.random(X.shape) < FADs
            Y = X + CF * ((prob.lb + rng.random(X.shape) * (prob.ub - prob.lb)) * U)
        else:
            r = rng.random()
            Y = X + (FADs * (1 - r) + r) * (X[rng.permutation(n)] - X[rng.permutation(n)])
        Y = prob.clip(Y)
        fy = prob(Y)
        keep = fy < fx
        X[keep], fx[keep] = Y[keep], fy[keep]
        t += 1
    return prob.best_x, prob.best_f
