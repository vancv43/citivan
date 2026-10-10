"""GA-PSO lai (chương 16, nối tiếp mục GA-PSO của chương 3).

Theo ý tưởng chọn lọc của Angeline (1998) và lai ghép GA-PSO (Juang, 2004; Kao & Zahara, 2008):
mỗi vòng chạy một bước PSO (như si.algorithms.pso), rồi nửa kém của bầy được thay bằng con lai SBX
và đột biến đa thức của các cá thể chọn từ nửa tốt (tỉ lệ chọn lọc 0.5). Vận tốc của con được đặt lại 0.
"""
import numpy as np
from .ga import sbx, poly_mutation


def run(prob, rng, n=30, w_max=0.9, w_min=0.4, c1=2.0, c2=2.0, vfrac=0.2, sel=0.5):
    T = prob.budget // n
    X = prob.random(rng, n)
    V = np.zeros_like(X)
    vmax = vfrac * (prob.ub - prob.lb)
    f = prob(X)
    P, pf = X.copy(), f.copy()
    t = 0
    while not prob.done:
        t += 1
        w = w_max - (w_max - w_min) * t / T
        g = P[np.argmin(pf)]
        V = np.clip(w * V + c1 * rng.random(X.shape) * (P - X) + c2 * rng.random(X.shape) * (g - X), -vmax, vmax)
        X = prob.clip(X + V)
        f = prob(X)
        o = np.argsort(f)
        k = int(n * sel)
        good, bad = o[:n - k], o[n - k:]
        for q in range(0, k, 2):
            a, b = X[rng.choice(good)], X[rng.choice(good)]
            ca, cb = sbx(rng, a, b, prob.lb, prob.ub)
            X[bad[q]] = poly_mutation(rng, ca, prob.lb, prob.ub, 1 / prob.dim)
            if q + 1 < k:
                X[bad[q + 1]] = poly_mutation(rng, cb, prob.lb, prob.ub, 1 / prob.dim)
        V[bad] = 0
        f[bad] = prob(X[bad])
        better = f < pf
        P[better], pf[better] = X[better], f[better]
    return prob.best_x, prob.best_f
