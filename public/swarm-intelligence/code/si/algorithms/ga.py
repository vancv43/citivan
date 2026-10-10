"""Giải thuật di truyền mã hóa thực (chương 16).

Holland (1975); Deb & Agrawal (1995) cho lai SBX và đột biến đa thức.
Chọn lọc giải đấu kích thước 2, SBX eta_c = 20 (p_c = 0.9), đột biến đa thức eta_m = 20 (p_m = 1/D),
giữ lại 2 cá thể ưu tú.
"""
import numpy as np


def sbx(rng, a, b, lb, ub, eta=20):
    u = rng.random(a.shape)
    beta = np.where(u <= 0.5, (2 * u) ** (1 / (eta + 1)), (1 / (2 * (1 - u))) ** (1 / (eta + 1)))
    c1 = 0.5 * ((1 + beta) * a + (1 - beta) * b)
    c2 = 0.5 * ((1 - beta) * a + (1 + beta) * b)
    return np.clip(c1, lb, ub), np.clip(c2, lb, ub)


def poly_mutation(rng, x, lb, ub, pm, eta=20):
    y = x.copy()
    mask = rng.random(x.shape) < pm
    u = rng.random(x.shape)
    delta = np.where(u < 0.5, (2 * u) ** (1 / (eta + 1)) - 1, 1 - (2 * (1 - u)) ** (1 / (eta + 1)))
    y[mask] = (x + delta * (ub - lb))[mask]
    return np.clip(y, lb, ub)


def run(prob, rng, n=30, pc=0.9, elite=2):
    X = prob.random(rng, n)
    f = prob(X)
    pm = 1 / prob.dim
    while not prob.done:
        o = np.argsort(f)
        kids = [X[o[k]].copy() for k in range(elite)]
        while len(kids) < n:
            i = min(rng.integers(n, size=2), key=lambda q: f[q])
            j = min(rng.integers(n, size=2), key=lambda q: f[q])
            a, b = X[i], X[j]
            if rng.random() < pc:
                a, b = sbx(rng, a, b, prob.lb, prob.ub)
            kids += [poly_mutation(rng, a, prob.lb, prob.ub, pm), poly_mutation(rng, b, prob.lb, prob.ub, pm)]
        X = np.array(kids[:n])
        f = np.concatenate([f[o[:elite]], prob(X[elite:])])
    return prob.best_x, prob.best_f
