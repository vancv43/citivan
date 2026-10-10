"""Ant Lion Optimizer (chương 6.1).

Mirjalili (2015), Advances in Engineering Software 83. Theo mã nguồn gốc: I = 1 + 10^w t/T,
roulette theo 1/f, đường đi ngẫu nhiên dài T được chuẩn hóa vào [c, d] quanh kiến sư tử.
n kiến + n kiến sư tử; mỗi vòng tốn n lần đánh giá.
"""
import numpy as np
from ..core import roulette


def _walk(rng, prob, T, t, lb, ub, centre):
    lo = np.where(rng.random(prob.dim) < 0.5, lb + centre, -lb + centre)
    hi = np.where(rng.random(prob.dim) >= 0.5, ub + centre, -ub + centre)
    lo, hi = np.minimum(lo, hi), np.maximum(lo, hi)
    steps = np.where(rng.random((T, prob.dim)) > 0.5, 1, -1)
    W = np.vstack([np.zeros(prob.dim), np.cumsum(steps, axis=0)])
    a, b = W.min(axis=0), W.max(axis=0)
    span = np.where(b > a, b - a, 1)
    return (W[t] - a) * (hi - lo) / span + lo


def run(prob, rng, n=30):
    T = prob.budget // n
    A = prob.random(rng, n)
    L = prob.random(rng, n)
    lf = prob(L)
    o = np.argsort(lf); L, lf = L[o], lf[o]
    elite, ef = L[0].copy(), lf[0]
    t = 0
    while not prob.done:
        t += 1
        I = 1.0
        for thr, w in ((0.1, 2), (0.5, 3), (0.75, 4), (0.9, 5), (0.95, 6)):
            if t > thr * T:
                I = 1 + 10 ** w * t / T
        lb, ub = prob.lb / I, prob.ub / I
        wts = 1 / (lf - lf.min() + 1e-12) if np.any(lf < 0) else 1 / (lf + 1e-12)
        for i in range(n):
            j = roulette(rng, wts)
            RA = _walk(rng, prob, T, min(t, T), lb, ub, L[j])
            RE = _walk(rng, prob, T, min(t, T), lb, ub, elite)
            A[i] = (RA + RE) / 2
        A = prob.clip(A)
        af = prob(A)
        allx = np.vstack([L, A]); allf = np.concatenate([lf, af])
        o = np.argsort(allf)[:n]
        L, lf = allx[o], allf[o]
        if lf[0] < ef:
            elite, ef = L[0].copy(), lf[0]
    return prob.best_x, prob.best_f
