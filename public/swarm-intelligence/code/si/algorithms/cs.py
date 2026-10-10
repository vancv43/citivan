"""Cuckoo Search (chương 13.2).

Yang & Deb (2009), NaBIC 2009, IEEE, pp. 210-214; mã minh họa của Yang & Deb (2010).
pa = 0.25, Lévy beta = 1.5, bước 0.01 * Lévy * (x - best) * N(0, 1);
tổ bị phát hiện thay bằng x + rand * (x_p1 - x_p2). Mỗi vòng tốn 2n lần đánh giá.
"""
import numpy as np
from ..core import levy


def run(prob, rng, n=30, pa=0.25):
    X = prob.random(rng, n)
    fx = prob(X)
    while not prob.done:
        best = prob.best_x.copy()
        Y = X + 0.01 * levy(rng, X.shape) * (X - best) * rng.normal(size=X.shape)
        Y = prob.clip(Y); fy = prob(Y)
        keep = fy < fx; X[keep], fx[keep] = Y[keep], fy[keep]
        K = rng.random(X.shape) > pa
        Y = X + rng.random() * (X[rng.permutation(n)] - X[rng.permutation(n)]) * K
        Y = prob.clip(Y); fy = prob(Y)
        keep = fy < fx; X[keep], fx[keep] = Y[keep], fy[keep]
    return prob.best_x, prob.best_f
