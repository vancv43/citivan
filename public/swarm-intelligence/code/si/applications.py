"""Ứng dụng (chương 1, 17, 18): tìm kiếm ngẫu nhiên, (1+1)-ES, PSO có hàm phạt, MLP huấn luyện bằng PSO,
tối ưu siêu tham số, phân ngưỡng Otsu, CVRP (ACO và Clarke–Wright), PSO trong môi trường động.
"""
import math
import numpy as np


# ---------------- Chương 1 ----------------
def random_search(prob, rng, n=30):
    while not prob.done:
        prob(prob.random(rng, n))
    return prob.best_x, prob.best_f


def one_plus_one_es(prob, rng, n=30, sigma0=0.1):
    """(1+1)-ES với quy tắc thành công 1/5 (Rechenberg, 1973)."""
    x = prob.random(rng, 1)[0]; fx = prob(x)[0]
    sigma = sigma0 * (prob.ub - prob.lb); succ, k = 0, 0
    while not prob.done:
        y = prob.clip(x + sigma * rng.normal(size=prob.dim)); fy = prob(y)[0]
        k += 1
        if fy < fx:
            x, fx = y, fy; succ += 1
        if k % 10 == 0:
            sigma *= 1.22 if succ / 10 > 0.2 else 0.82
            succ = 0
    return prob.best_x, prob.best_f


def book_constrained(penalty=1e6):
    """Ví dụ có ràng buộc trong Okwu & Tartibu (2021), chương 2, với hàm phạt bậc hai."""
    def f(X):
        obj = 5 * (X[:, 0] - 1) ** 2 + 10 * X[:, 0] * X[:, 1] + (X[:, 2] - 3) ** 2
        g1 = np.maximum(0, X.sum(1) - 5)
        g2 = np.maximum(0, X[:, 0] ** 2 + X[:, 1] ** 2 - 5)
        return obj + penalty * (g1 ** 2 + g2 ** 2)
    return f


# ---------------- Chương 17 ----------------
class MLP:
    """MLP một lớp ẩn (tanh) + softmax; trọng số trải phẳng thành một vector để bầy đàn tối ưu."""
    def __init__(self, n_in, n_hidden, n_out):
        self.shapes = [(n_in, n_hidden), (n_hidden,), (n_hidden, n_out), (n_out,)]
        self.size = sum(int(np.prod(s)) for s in self.shapes)

    def unpack(self, w):
        out, k = [], 0
        for s in self.shapes:
            m = int(np.prod(s)); out.append(w[k:k + m].reshape(s)); k += m
        return out

    def proba(self, w, X):
        W1, b1, W2, b2 = self.unpack(w)
        Z = np.tanh(X @ W1 + b1) @ W2 + b2
        Z -= Z.max(1, keepdims=True)
        E = np.exp(Z)
        return E / E.sum(1, keepdims=True)

    def loss(self, w, X, y):
        return float(-np.mean(np.log(self.proba(w, X)[np.arange(len(y)), y] + 1e-12)))


def otsu_between(hist, t):
    """Phương sai giữa các lớp cho các ngưỡng t (đã sắp xếp), histogram 256 mức."""
    p = hist / hist.sum(); levels = np.arange(256); mu = (p * levels).sum()
    edges = [0] + [int(x) + 1 for x in t] + [256]
    s = 0.0
    for a, b in zip(edges[:-1], edges[1:]):
        w = p[a:b].sum()
        if w > 0:
            m = (p[a:b] * levels[a:b]).sum() / w
            s += w * (m - mu) ** 2
    return s


# ---------------- Chương 18 ----------------
def cvrp_instance(n=30, seed=7, cap=100):
    rng = np.random.default_rng(seed)
    P = rng.uniform(0, 100, (n + 1, 2)); P[0] = [50, 50]
    q = rng.integers(5, 26, n + 1); q[0] = 0
    D = np.sqrt(((P[:, None] - P[None]) ** 2).sum(-1))
    return P, q, D, cap


def cvrp_cost(D, routes):
    return float(sum(D[0, r[0]] + D[r[:-1], r[1:]].sum() + D[r[-1], 0] for r in routes if len(r)))


def clarke_wright(D, q, cap):
    """Thuật toán tiết kiệm Clarke & Wright (1964), bản song song."""
    n = len(q) - 1
    routes = {i: [i] for i in range(1, n + 1)}; where = {i: i for i in range(1, n + 1)}; load = {i: q[i] for i in range(1, n + 1)}
    sav = sorted(((D[0, i] + D[0, j] - D[i, j], i, j) for i in range(1, n + 1) for j in range(i + 1, n + 1)), reverse=True)
    for s, i, j in sav:
        ri, rj = where[i], where[j]
        if ri == rj or load[ri] + load[rj] > cap:
            continue
        A, B = routes[ri], routes[rj]
        if A[-1] == i and B[0] == j:
            new = A + B
        elif A[0] == i and B[-1] == j:
            new = B + A
        elif A[0] == i and B[0] == j:
            new = A[::-1] + B
        elif A[-1] == i and B[-1] == j:
            new = A + B[::-1]
        else:
            continue
        routes[ri] = new; load[ri] += load[rj]; del routes[rj]; del load[rj]
        for c in new:
            where[c] = ri
    return [np.array(r) for r in routes.values()]


def aco_cvrp(D, q, cap, rng, budget=5000, m=None, alpha=1, beta=2, rho=0.1):
    """Ant System cho CVRP (theo Bullnheimer, Hartl & Strauss, 1999, không tìm kiếm cục bộ, không xếp hạng):
    kiến quay về kho khi không còn khách nào vừa tải; rải 1/L trên các cạnh."""
    n = len(q) - 1; m = m or n
    eta = 1 / np.where(D > 0, D, np.inf)
    tau = np.ones_like(D)
    best, bestL, built = None, math.inf, 0
    while built < budget:
        sols = []
        for _ in range(min(m, budget - built)):
            left = set(range(1, n + 1)); routes = []
            while left:
                r, load, cur = [], 0, 0
                while True:
                    cand = [c for c in left if load + q[c] <= cap]
                    if not cand:
                        break
                    w = (tau[cur, cand] ** alpha) * (eta[cur, cand] ** beta)
                    c = cand[int(np.searchsorted(np.cumsum(w), rng.random() * w.sum()))] if w.sum() > 0 else cand[0]
                    r.append(c); load += q[c]; left.discard(c); cur = c
                routes.append(np.array(r))
            L = cvrp_cost(D, routes); sols.append((L, routes))
        built += len(sols)
        tau *= 1 - rho
        for L, routes in sols:
            for r in routes:
                path = np.concatenate([[0], r, [0]])
                tau[path[:-1], path[1:]] += 1 / L; tau[path[1:], path[:-1]] += 1 / L
            if L < bestL:
                bestL, best = L, routes
    return best, bestL


def moving_sphere(dim=5, period=1000, severity=1.0, seed=0, lb=-5, ub=5):
    """Hàm cầu có tâm dịch chuyển một đoạn dài 'severity' sau mỗi 'period' lần đánh giá (bản giản lược của
    Moving Peaks, Branke 1999). Trả về (f, hàm lấy tâm hiện tại)."""
    rng = np.random.default_rng(seed)
    state = {'c': rng.uniform(lb + 1, ub - 1, dim), 'fes': 0}
    def f(X):
        out = np.empty(len(X))
        for i, x in enumerate(X):
            if state['fes'] and state['fes'] % period == 0:
                d = rng.normal(size=dim); d *= severity / np.linalg.norm(d)
                state['c'] = np.clip(state['c'] + d, lb + 1, ub - 1)
            out[i] = np.sum((x - state['c']) ** 2); state['fes'] += 1
        return out
    return f, state


def dynamic_pso(f, state, dim, budget, rng, n=20, react=False, lb=-5, ub=5, w=0.729, c1=1.49445, c2=1.49445):
    """PSO hằng số co (Clerc & Kennedy, 2002). react=True: khi giá trị của gbest thay đổi (phát hiện biến đổi môi trường),
    đánh giá lại pbest và khởi tạo lại ngẫu nhiên một nửa bầy (Hu & Eberhart, 2002). Trả về sai số offline."""
    X = rng.uniform(lb, ub, (n, dim)); V = np.zeros_like(X)
    fx = f(X); fes = n; P, pf = X.copy(), fx.copy(); g = int(np.argmin(pf))
    errs = []
    while fes < budget:
        if react:
            probe = f(P[g:g + 1])[0]; fes += 1
            if abs(probe - pf[g]) > 1e-12:
                half = rng.permutation(n)[: n // 2]
                X[half] = rng.uniform(lb, ub, (len(half), dim)); V[half] = 0
                P = X.copy(); pf = f(P); fes += n
        V = w * V + c1 * rng.random(X.shape) * (P - X) + c2 * rng.random(X.shape) * (P[g] - X)
        X = np.clip(X + V, lb, ub)
        fx = f(X); fes += n
        b = fx < pf; P[b], pf[b] = X[b], fx[b]; g = int(np.argmin(pf))
        errs.append(float(np.min(np.sum((X - state['c']) ** 2, axis=1))))
    return float(np.mean(errs))
