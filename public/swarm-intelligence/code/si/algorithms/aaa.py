"""Artificial Algae Algorithm (chương 12.2).

Uymaz, Tezel & Yel (2015), Applied Soft Computing 31: 153-171.
Ba quá trình: chuyển động xoắn ốc (3 chiều ngẫu nhiên m, k, l), tiến hóa (ô ngẫu nhiên của khuẩn lạc nhỏ nhất
nhận giá trị của khuẩn lạc lớn nhất), thích nghi (khuẩn lạc đói nhất tiến về khuẩn lạc lớn nhất với xác suất Ap).
Tham số theo bài: lực cắt Delta = 2, mất năng lượng e = 0.3, Ap = 0.5.
Kích thước tăng theo mô hình Monod với Ks = 0.5 trên độ thích nghi chuẩn hóa; năng lượng và bề mặt ma sát
được chuẩn hóa về [0, 1]. Các bản cài đặt AAA công khai khác nhau ở bước chuẩn hóa này.
"""
import numpy as np


def _norm(v):
    lo, hi = v.min(), v.max()
    return np.zeros_like(v) if hi - lo < 1e-300 else (v - lo) / (hi - lo)


def run(prob, rng, n=30, delta=2.0, e=0.3, Ap=0.5, ks=0.5):
    X = prob.random(rng, n)
    fx = prob(X)
    G = np.ones(n)
    starv = np.zeros(n)
    D = prob.dim
    while not prob.done:
        fit = 1 - _norm(fx)                                     # 1 = tốt nhất
        G = G + fit / (ks + fit)                                # tăng trưởng Monod
        energy = _norm(G) + 1e-12
        tau = _norm(2 * np.pi * (np.cbrt(3 * G / (4 * np.pi))) ** 2)
        for i in range(n):
            starving = True
            while energy[i] > 0 and not prob.done:
                a, b = rng.integers(n, size=2)                  # tournament chọn nguồn sáng
                j = a if fx[a] < fx[b] else b
                if j == i:
                    j = (i + 1) % n
                m, k, l = rng.choice(D, 3, replace=D < 3)
                y = X[i].copy()
                y[m] += (X[j, m] - X[i, m]) * (delta - tau[i]) * rng.uniform(-1, 1)
                y[k] += (X[j, k] - X[i, k]) * (delta - tau[i]) * np.cos(rng.uniform(0, 2 * np.pi))
                y[l] += (X[j, l] - X[i, l]) * (delta - tau[i]) * np.sin(rng.uniform(0, 2 * np.pi))
                y = prob.clip(y)
                fy = prob(y)[0]
                energy[i] -= e / 2
                if fy < fx[i]:
                    X[i], fx[i] = y, fy
                    starving = False
                else:
                    energy[i] -= e / 2
            starv[i] = starv[i] + 1 if starving else starv[i]
        big, small = int(np.argmax(G)), int(np.argmin(G))      # tiến hóa
        d = rng.integers(D)
        X[small, d] = X[big, d]
        fx[small] = prob(X[small])[0]
        if rng.random() < Ap:                                   # thích nghi
            s = int(np.argmax(starv))
            X[s] = prob.clip(X[s] + (X[big] - X[s]) * rng.random(D))
            fx[s] = prob(X[s])[0]
            starv[s] = 0
    return prob.best_x, prob.best_f
