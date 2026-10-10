"""Harris Hawks Optimization (chương 8).

Heidari, Mirjalili, Faris, Aljarah, Mafarja & Chen (2019), Future Generation Computer Systems 97.
Sáu quy tắc cập nhật của bài gốc; bước Lévy beta = 1.5 với hệ số 0.01; các lần đánh giá Y, Z của
bước lao nhanh được tính vào ngân sách.
"""
import numpy as np
from ..core import levy


def run(prob, rng, n=30):
    T = prob.budget // n
    X = prob.random(rng, n)
    fx = prob(X)
    t = 0
    while not prob.done:
        rabbit = prob.best_x.copy()
        Xm = X.mean(axis=0)
        for i in range(n):
            if prob.done:
                break
            E0 = 2 * rng.random() - 1
            E = 2 * E0 * (1 - t / T)
            J = 2 * (1 - rng.random())
            if abs(E) >= 1:
                if rng.random() >= 0.5:
                    Xr = X[rng.integers(n)]
                    X[i] = Xr - rng.random() * np.abs(Xr - 2 * rng.random() * X[i])
                else:
                    X[i] = (rabbit - Xm) - rng.random() * (prob.lb + rng.random() * (prob.ub - prob.lb))
                X[i] = prob.clip(X[i]); fx[i] = prob(X[i])[0]
            else:
                r = rng.random()
                dX = rabbit - X[i]
                if r >= 0.5 and abs(E) >= 0.5:
                    X[i] = prob.clip(dX - E * np.abs(J * rabbit - X[i])); fx[i] = prob(X[i])[0]
                elif r >= 0.5:
                    X[i] = prob.clip(rabbit - E * np.abs(dX)); fx[i] = prob(X[i])[0]
                else:
                    ref = X[i] if abs(E) >= 0.5 else Xm
                    Y = prob.clip(rabbit - E * np.abs(J * rabbit - ref))
                    fy = prob(Y)[0]
                    if fy < fx[i]:
                        X[i], fx[i] = Y, fy
                    else:
                        Z = prob.clip(Y + rng.random(prob.dim) * 0.01 * levy(rng, prob.dim))
                        fz = prob(Z)[0]
                        if fz < fx[i]:
                            X[i], fx[i] = Z, fz
        t += 1
    return prob.best_x, prob.best_f
