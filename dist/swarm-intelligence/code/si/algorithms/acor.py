"""ACO cho miền liên tục: ACO_R (chương 4).

Socha & Dorigo (2008), European Journal of Operational Research 185(3).
Kho lưu trữ k = 50 lời giải, m = 2 kiến mỗi vòng, q = 1e-4, xi = 0.85 (giá trị trong bài báo).
Để công bằng với các thuật toán khác, kho khởi tạo dùng n = 30 điểm đầu rồi lấp đầy tới k bằng điểm ngẫu nhiên.
"""
import numpy as np


def run(prob, rng, n=30, k=50, m=2, q=1e-4, xi=0.85):
    S = prob.random(rng, k)
    sf = prob(S)
    order = np.argsort(sf)
    S, sf = S[order], sf[order]
    ranks = np.arange(1, k + 1)
    w = np.exp(-((ranks - 1) ** 2) / (2 * (q * k) ** 2)) / (q * k * np.sqrt(2 * np.pi))
    p = w / w.sum()
    while not prob.done:
        new = np.empty((m, prob.dim))
        for a in range(m):
            for d in range(prob.dim):
                l = rng.choice(k, p=p)
                sigma = xi * np.sum(np.abs(S[:, d] - S[l, d])) / (k - 1)
                new[a, d] = rng.normal(S[l, d], sigma)
        new = prob.clip(new)
        nf = prob(new)
        S = np.vstack([S, new]); sf = np.concatenate([sf, nf])
        order = np.argsort(sf)[:k]
        S, sf = S[order], sf[order]
    return prob.best_x, prob.best_f
