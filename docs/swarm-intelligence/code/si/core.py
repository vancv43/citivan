"""Lõi dùng chung: bài toán có đếm số lần đánh giá hàm, bước Lévy, kẹp biên.

Core utilities: a problem wrapper that counts function evaluations and stops at the budget,
Lévy steps (Mantegna), and bound handling.  Châu Văn Vân · PTITHCM.
"""
import math
import numpy as np


class Problem:
    """Bài toán cực tiểu với ngân sách đánh giá hàm.

    f      : hàm nhận ma trận (m, D) và trả về vector (m,)
    lb, ub : cận dưới / cận trên (vô hướng hoặc vector)
    budget : số lần đánh giá tối đa; vượt ngân sách thì các hàng còn lại nhận +inf
    """

    def __init__(self, f, dim, lb, ub, budget, fopt=0.0, name=''):
        self.f, self.dim, self.budget, self.fopt, self.name = f, dim, budget, fopt, name
        self.lb = np.full(dim, lb, dtype=float) if np.isscalar(lb) else np.asarray(lb, float)
        self.ub = np.full(dim, ub, dtype=float) if np.isscalar(ub) else np.asarray(ub, float)
        self.fes = 0
        self.best_f = math.inf
        self.best_x = None
        self.curve = []          # (fes, best error) sau mỗi lần gọi

    @property
    def done(self):
        return self.fes >= self.budget

    def clip(self, X):
        return np.clip(X, self.lb, self.ub)

    def random(self, rng, m):
        return self.lb + rng.random((m, self.dim)) * (self.ub - self.lb)

    def __call__(self, X):
        X = np.atleast_2d(X)
        out = np.full(X.shape[0], math.inf)
        k = min(X.shape[0], self.budget - self.fes)
        if k > 0:
            out[:k] = self.f(X[:k])
            self.fes += k
            i = int(np.argmin(out[:k]))
            if out[i] < self.best_f:
                self.best_f, self.best_x = float(out[i]), X[i].copy()
            self.curve.append((self.fes, self.best_f - self.fopt))
        return out

    @property
    def error(self):
        return self.best_f - self.fopt


def levy(rng, shape, beta=1.5):
    """Bước Lévy theo thuật toán Mantegna (dùng trong HHO, CS, MPA)."""
    num = math.gamma(1 + beta) * math.sin(math.pi * beta / 2)
    den = math.gamma((1 + beta) / 2) * beta * 2 ** ((beta - 1) / 2)
    sigma = (num / den) ** (1 / beta)
    u = rng.normal(0, sigma, shape)
    v = rng.normal(0, 1, shape)
    return u / np.abs(v) ** (1 / beta)


def roulette(rng, w):
    w = np.asarray(w, float)
    c = np.cumsum(w)
    return int(np.searchsorted(c, rng.random() * c[-1]))
