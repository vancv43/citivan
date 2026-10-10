"""Firefly Algorithm (chương 5.2).

Yang (2008, 2010). Theo mã minh họa của Yang: beta = (beta0 - beta_min) e^{-gamma r^2} + beta_min,
beta0 = 1, beta_min = 0.2, gamma = 1, alpha0 = 0.2 giảm 3% mỗi vòng, bước ngẫu nhiên nhân với độ rộng miền.
Khoảng cách được chuẩn hóa theo độ rộng miền để gamma = 1 có nghĩa trên mọi miền.
Vị trí được cập nhật dựa trên độ sáng đầu vòng, đánh giá một lần mỗi vòng (n lần đánh giá / vòng).
"""
import numpy as np


def run(prob, rng, n=30, beta0=1.0, beta_min=0.2, gamma=1.0, alpha0=0.2, decay=0.97):
    X = prob.random(rng, n)
    f = prob(X)
    scale = prob.ub - prob.lb
    alpha = alpha0
    while not prob.done:
        Xn = X.copy()
        for i in range(n):
            for j in range(n):
                if f[j] < f[i]:
                    r2 = np.sum(((X[i] - X[j]) / scale) ** 2)
                    beta = (beta0 - beta_min) * np.exp(-gamma * r2) + beta_min
                    Xn[i] = Xn[i] * (1 - beta) + X[j] * beta + alpha * (rng.random(prob.dim) - 0.5) * scale
        b = int(np.argmin(f))
        Xn[b] = X[b] + alpha * (rng.random(prob.dim) - 0.5) * scale   # con sáng nhất đi ngẫu nhiên
        X = prob.clip(Xn)
        f = prob(X)
        alpha *= decay
    return prob.best_x, prob.best_f
