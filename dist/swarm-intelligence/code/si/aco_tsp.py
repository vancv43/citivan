"""ACO cho bài toán người du lịch (chương 4).

Ant System (Dorigo, Maniezzo & Colorni, 1996): alpha = 1, beta = 3, rho = 0.5, m = n, tau0 = m / C_nn.
Ant Colony System (Dorigo & Gambardella, 1997): beta = 2, q0 = 0.9, rho = xi = 0.1, m = 10, tau0 = 1 / (n C_nn).
MAX-MIN Ant System (Stützle & Hoos, 2000): alpha = 1, beta = 2, rho = 0.02, m = n, p_best = 0.05,
  chỉ kiến tốt nhất của vòng rải (lời giải tốt nhất toàn cục mỗi 10 vòng), tau trong [tau_min, tau_max].
Giá trị theo Dorigo & Stützle (2004), Ant Colony Optimization, MIT Press, bảng 3.1 (không tìm kiếm cục bộ).
"""
import math
import numpy as np


def read_tsplib(path):
    pts, on = [], False
    for line in open(path):
        s = line.strip()
        if s.startswith('NODE_COORD_SECTION'):
            on = True; continue
        if s.startswith('EOF'):
            break
        if on and s:
            _, x, y = s.split()[:3]
            pts.append((float(x), float(y)))
    P = np.array(pts)
    D = np.sqrt(((P[:, None] - P[None]) ** 2).sum(-1))
    return P, np.floor(D + 0.5)                       # EUC_2D làm tròn theo TSPLIB


def length(D, tour):
    return float(D[tour, np.roll(tour, -1)].sum())


def nearest_neighbour(D, start=0):
    n = len(D); seen = np.zeros(n, bool); t = [start]; seen[start] = True
    for _ in range(n - 1):
        d = np.where(seen, np.inf, D[t[-1]]); j = int(np.argmin(d)); t.append(j); seen[j] = True
    return np.array(t)


def two_opt(D, tour):
    tour = tour.copy(); n = len(tour); improved = True
    while improved:
        improved = False
        for i in range(n - 1):
            a, b = tour[i], tour[i + 1]
            c, d = tour[i + 2:], np.roll(tour, -1)[i + 2:]
            if len(c) == 0:
                continue
            gain = D[a, b] + D[c, d] - D[a, c] - D[b, d]
            if i == 0:
                gain[-1] = -1                            # tránh đảo cả vòng
            k = int(np.argmax(gain))
            if gain[k] > 1e-9:
                j = i + 2 + k
                tour[i + 1:j + 1] = tour[i + 1:j + 1][::-1]
                improved = True
    return tour


def _construct(rng, tau, eta, alpha, beta, q0=None, local=None):
    n = len(tau)
    start = int(rng.integers(n)); tour = [start]
    visited = np.zeros(n, bool); visited[start] = True
    w_all = (tau ** alpha) * (eta ** beta)
    for _ in range(n - 1):
        i = tour[-1]
        w = np.where(visited, 0.0, w_all[i])
        if q0 is not None and rng.random() < q0:
            j = int(np.argmax(w))
        else:
            j = int(np.searchsorted(np.cumsum(w), rng.random() * w.sum()))
            j = min(j, n - 1)
            if visited[j]:
                j = int(np.flatnonzero(~visited)[0])
        if local is not None:                          # cập nhật cục bộ của ACS
            xi, tau0 = local
            tau[i, j] = tau[j, i] = (1 - xi) * tau[i, j] + xi * tau0
            w_all[i, j] = w_all[j, i] = (tau[i, j] ** alpha) * (eta[i, j] ** beta)
        tour.append(j); visited[j] = True
    return np.array(tour)


def run(variant, D, rng, budget_tours=10000):
    n = len(D)
    eta = 1.0 / np.where(D > 0, D, np.inf)
    cnn = length(D, nearest_neighbour(D))
    best, bestL, built, it = None, math.inf, 0, 0
    if variant == 'AS':
        m, alpha, beta, rho = n, 1, 3, 0.5
        tau = np.full((n, n), m / cnn)
    elif variant == 'ACS':
        m, alpha, beta, rho, xi, q0 = 10, 1, 2, 0.1, 0.1, 0.9
        tau0 = 1 / (n * cnn); tau = np.full((n, n), tau0)
    else:  # MMAS
        m, alpha, beta, rho, pbest = n, 1, 2, 0.02, 0.05
        tmax = 1 / (rho * cnn); tau = np.full((n, n), tmax)
    while built < budget_tours:
        it += 1
        k = min(m, budget_tours - built)
        if variant == 'ACS':
            tours = [_construct(rng, tau, eta, alpha, beta, q0, (xi, tau0)) for _ in range(k)]
        else:
            tours = [_construct(rng, tau, eta, alpha, beta) for _ in range(k)]
        built += k
        Ls = [length(D, t) for t in tours]
        ib = int(np.argmin(Ls))
        if Ls[ib] < bestL:
            bestL, best = Ls[ib], tours[ib].copy()
        if variant == 'AS':
            tau *= 1 - rho
            for t, L in zip(tours, Ls):
                tau[t, np.roll(t, -1)] += 1 / L; tau[np.roll(t, -1), t] += 1 / L
        elif variant == 'ACS':
            e = (best, np.roll(best, -1))
            tau[e] = (1 - rho) * tau[e] + rho / bestL
            tau[e[1], e[0]] = tau[e]
        else:
            tau *= 1 - rho
            t, L = (best, bestL) if it % 10 == 0 else (tours[ib], Ls[ib])
            tau[t, np.roll(t, -1)] += 1 / L; tau[np.roll(t, -1), t] += 1 / L
            tmax = 1 / (rho * bestL)
            pr = pbest ** (1 / n)
            tmin = tmax * (1 - pr) / ((n / 2 - 1) * pr)
            np.clip(tau, tmin, tmax, out=tau)
    return best, bestL
