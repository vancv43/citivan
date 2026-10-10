"""Artificial Bee Colony (chương 5.1).

Karaboga & Basturk (2007), Journal of Global Optimization 39(3).
Bầy 30 ong -> SN = 15 nguồn hoa; limit = SN * D; tối đa một ong trinh sát mỗi chu kỳ.
"""
import numpy as np


def _fit(f):
    return np.where(f >= 0, 1 / (1 + f), 1 + np.abs(f))


def run(prob, rng, n=30, limit=None):
    SN, D = n // 2, prob.dim
    limit = limit or SN * D
    X = prob.random(rng, SN)
    f = prob(X)
    trial = np.zeros(SN, int)

    def neighbour(i):
        k = rng.integers(SN - 1); k += k >= i
        j = rng.integers(D)
        v = X[i].copy()
        v[j] = v[j] + rng.uniform(-1, 1) * (v[j] - X[k, j])
        return prob.clip(v)

    def try_improve(i):
        v = neighbour(i)
        fv = prob(v)[0]
        if fv < f[i]:
            X[i], f[i], trial[i] = v, fv, 0
        else:
            trial[i] += 1

    while not prob.done:
        for i in range(SN):                      # ong thợ
            try_improve(i)
        fit = _fit(f)
        p = fit / fit.sum()
        for _ in range(SN):                      # ong quan sát
            try_improve(int(rng.choice(SN, p=p)))
        i = int(np.argmax(trial))                # ong trinh sát
        if trial[i] > limit:
            X[i] = prob.random(rng, 1)[0]
            f[i] = prob(X[i])[0]
            trial[i] = 0
    return prob.best_x, prob.best_f
