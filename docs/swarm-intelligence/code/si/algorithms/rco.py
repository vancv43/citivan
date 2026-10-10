"""Red-Crowned Crane Optimization (chương 10.3).

Kang & Ma (2025), Biomimetics 10(9): 565, doi:10.3390/biomimetics10090565.
p_c = 0.7 (giá trị cho bộ CEC trong bài), k = n/2; c1 = 2, c2 = 5 - 4t/T, c3 = 2 - t/T;
thoát hiểm khi c_r < (t/T)^{1/2} với r1, r2 ~ U(1, 2); điệu múa: r4 ~ U(0, 0.1), u ~ N(1, (1 - t/T)^2).
Nhánh kiếm ăn + nghỉ đêm tốn 2n lần đánh giá, nhánh múa tốn n.
"""
import numpy as np


def run(prob, rng, n=30, pc=0.7):
    T = max(1, int(prob.budget / (n * (2 * pc + (1 - pc)))))
    X = prob.random(rng, n)
    fx = prob(X)
    pbest, pf = X.copy(), fx.copy()
    k = n // 2
    t = 0
    while not prob.done:
        tt = min(t / T, 1.0)
        o = np.argsort(fx)
        if rng.random() < pc:
            home = X[o[0]].copy(); hf = fx[o[0]]
            Xp = X.copy()
            for rank, i in enumerate(o):
                if rank < k:                                           # kiếm ăn ngẫu nhiên
                    Xp[i] = X[i] + 2 * rng.random(prob.dim) * (home - X[i])
                else:                                                  # kiếm ăn đường dài
                    Xp[i] = X[i] + (5 - 4 * tt) * (home - X[i])
                    if rng.random() < tt ** 0.5:                       # thoát hiểm
                        Xr = prob.random(rng, 1)[0]
                        Xp[i] = Xp[i] + rng.uniform(1, 2) * (Xr - Xp[i]) + rng.uniform(1, 2) * (pbest[i] - Xp[i])
            Xp = prob.clip(Xp)
            fp = prob(Xp)
            if fp.min() < hf:
                home = Xp[np.argmin(fp)].copy()
            X = prob.clip(Xp + (2 - tt) * rng.random((n, 1)) * (home - Xp))   # tụ tập nghỉ đêm
            fx = prob(X)
        else:
            first, second = X[o[0]].copy(), X[o[1]].copy()
            u = rng.normal(1, max(1 - tt, 1e-12), (n, 1))
            r4 = rng.uniform(0, 0.1, (n, 1))
            X = prob.clip(((X + u * r4 * (first - X)) + (X + u * r4 * (second - X))) / 2)
            fx = prob(X)
        better = fx < pf
        pbest[better], pf[better] = X[better], fx[better]
        t += 1
    return prob.best_x, prob.best_f
