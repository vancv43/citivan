"""Grey Wolf Optimizer (chương 9).

Mirjalili, Mirjalili & Lewis (2014), Advances in Engineering Software 69.
a giảm tuyến tính 2 -> 0; alpha, beta, delta cập nhật như mã gốc (không dồn bậc).
"""
import numpy as np


def run(prob, rng, n=30):
    T = prob.budget // n
    X = prob.random(rng, n)
    lead = [None, None, None]; lf = [np.inf] * 3

    def rank(X, fx):
        for x, v in zip(X, fx):
            if v < lf[0]:
                lf[0], lead[0] = v, x.copy()
            if lf[0] < v < lf[1]:
                lf[1], lead[1] = v, x.copy()
            if lf[0] < v and lf[1] < v < lf[2]:
                lf[2], lead[2] = v, x.copy()
        for k in (1, 2):
            if lead[k] is None:
                lead[k] = lead[0].copy()

    rank(X, prob(X))
    t = 0
    while not prob.done:
        t += 1
        a = 2 - 2 * t / T
        acc = np.zeros_like(X)
        for k in range(3):
            A = 2 * a * rng.random(X.shape) - a
            C = 2 * rng.random(X.shape)
            acc += lead[k] - A * np.abs(C * lead[k] - X)
        X = prob.clip(acc / 3)
        rank(X, prob(X))
    return prob.best_x, prob.best_f
