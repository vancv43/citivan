"""Tối ưu đa mục tiêu (chương 14): ZDT1–3, MOPSO với kho lưu trữ + khoảng cách đông đúc, NSGA-II, IGD, HV.

ZDT: Zitzler, Deb & Thiele (2000), Evolutionary Computation 8(2).
MOPSO: Coello Coello, Pulido & Lechuga (2004), IEEE TEC 8(3); chọn lãnh đạo và cắt kho theo khoảng cách
đông đúc như MOPSO-CD (Raquel & Naval, 2005). NSGA-II: Deb, Pratap, Agarwal & Meyarivan (2002), IEEE TEC 6(2), cài đặt của pymoo (Blank & Deb, 2020, IEEE Access 8).
"""
import numpy as np


def zdt(k):
    def f(X):
        f1 = X[:, 0]
        g = 1 + 9 * X[:, 1:].sum(1) / (X.shape[1] - 1)
        if k == 1:
            h = 1 - np.sqrt(f1 / g)
        elif k == 2:
            h = 1 - (f1 / g) ** 2
        else:
            h = 1 - np.sqrt(f1 / g) - (f1 / g) * np.sin(10 * np.pi * f1)
        return np.column_stack([f1, g * h])
    return f


def true_front(k, m=1000):
    x = np.linspace(0, 1, m)
    if k == 1:
        F = np.column_stack([x, 1 - np.sqrt(x)])
    elif k == 2:
        F = np.column_stack([x, 1 - x ** 2])
    else:
        F = np.column_stack([x, 1 - np.sqrt(x) - x * np.sin(10 * np.pi * x)])
        F = F[nondominated(F)]
    return F


def dominates(a, b):
    return np.all(a <= b) and np.any(a < b)


def nondominated(F):
    """Chỉ số các điểm không bị điểm nào khác trội."""
    keep = [i for i in range(len(F)) if not np.any(np.all(F <= F[i], 1) & np.any(F < F[i], 1))]
    return np.array(keep, int)


def crowding(F):
    n = len(F); d = np.zeros(n)
    if n <= 2:
        return np.full(n, np.inf)
    for k in range(F.shape[1]):
        o = np.argsort(F[:, k]); span = F[o[-1], k] - F[o[0], k] or 1
        d[o[0]] = d[o[-1]] = np.inf
        d[o[1:-1]] += (F[o[2:], k] - F[o[:-2], k]) / span
    return d


def igd(F, ref):
    return float(np.mean(np.min(np.linalg.norm(ref[:, None] - F[None], axis=2), axis=1)))


def hv2d(F, r=(1.1, 1.1)):
    P = F[np.all(F < r, 1)]
    if len(P) == 0:
        return 0.0
    P = P[np.argsort(P[:, 0])]
    hv, prev = 0.0, r[1]
    for x, y in P:
        if y < prev:
            hv += (r[0] - x) * (prev - y); prev = y
    return hv


def mopso(fun, D, budget, rng, n=100, archive=100, w=0.4, c1=1.0, c2=1.0, pm=0.5):
    X = rng.random((n, D)); V = np.zeros((n, D))
    F = fun(X); fes = n
    P, PF = X.copy(), F.copy()
    A, AF = X.copy(), F.copy()
    nd = nondominated(AF); A, AF = A[nd], AF[nd]
    it, T = 0, budget // n
    while fes < budget:
        it += 1
        cd = crowding(AF); cd = np.where(np.isinf(cd), cd[np.isfinite(cd)].max(initial=1) * 2 + 1, cd)
        top = np.argsort(-cd)[:max(1, len(A) // 10)]
        L = A[rng.choice(top, n)]
        V = w * V + c1 * rng.random((n, D)) * (P - X) + c2 * rng.random((n, D)) * (L - X)
        X = np.clip(X + V, 0, 1)
        mr = (1 - it / T) ** (1 / pm)                  # đột biến giảm dần như MOPSO gốc
        mut = rng.random(n) < mr
        if mut.any():
            j = rng.integers(D, size=int(mut.sum()))
            X[np.flatnonzero(mut), j] = rng.random(int(mut.sum()))
        F = fun(X); fes += n
        for i in range(n):
            if dominates(F[i], PF[i]) or (not dominates(PF[i], F[i]) and rng.random() < 0.5):
                P[i], PF[i] = X[i], F[i]
        A = np.vstack([A, X]); AF = np.vstack([AF, F])
        nd = nondominated(AF); A, AF = A[nd], AF[nd]
        if len(A) > archive:
            keep = np.argsort(-crowding(AF))[:archive]; A, AF = A[keep], AF[keep]
    return AF


def nsga2(fun_name, D, budget, seed, n=100):
    """NSGA-II từ thư viện pymoo 0.6.2 (Blank & Deb, 2020), dùng làm mốc so sánh đã được kiểm chứng.
    Bản NSGA-II tự viết trước đây hội tụ kém hơn tài liệu nên đã bị loại."""
    from pymoo.algorithms.moo.nsga2 import NSGA2
    from pymoo.problems import get_problem
    from pymoo.optimize import minimize
    from pymoo.termination import get_termination
    res = minimize(get_problem(fun_name, n_var=D), NSGA2(pop_size=n), get_termination('n_eval', budget), seed=seed, verbose=False)
    return res.F
