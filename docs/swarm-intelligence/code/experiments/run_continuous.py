"""Chạy bộ hàm liên tục theo PROTOCOL.md mục 1.

python -m experiments.run_continuous [--runs 30] [--budget 20000] [--algos PSO,GWO] [--out results/continuous]
Mỗi dòng của raw.csv: thuật toán, hàm, hạt giống, sai số tốt nhất, số lần đánh giá, thời gian (s).
Đường hội tụ (sai số tốt nhất tại 50 mốc ngân sách) được lưu trong curves.npz.
"""
import argparse, csv, os, time
import numpy as np
from multiprocessing import Pool
from si.core import Problem
from si.benchmarks import suite
from si.algorithms import REGISTRY, EXTRA
ALL = {**REGISTRY, **EXTRA}

DIM = 10


def one(task):
    algo, fid, seed, budget = task
    F = {s[0]: s for s in suite(DIM)}[fid]
    prob = Problem(F[2], DIM, F[3], F[4], budget, 0.0, F[1])
    rng = np.random.default_rng(seed)
    t0 = time.time()
    ALL[algo](prob, rng, n=30)
    dt = time.time() - t0
    marks = np.linspace(budget / 50, budget, 50)
    fes = np.array([c[0] for c in prob.curve]); err = np.array([c[1] for c in prob.curve])
    curve = np.array([err[fes <= m].min() if np.any(fes <= m) else err[0] for m in marks])
    return algo, fid, seed, prob.error, prob.fes, dt, curve


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--runs', type=int, default=30)
    ap.add_argument('--budget', type=int, default=2000 * DIM)
    ap.add_argument('--algos', default=','.join(REGISTRY))
    ap.add_argument('--out', default='results/continuous')
    ap.add_argument('--funcs', default=None)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    fids = a.funcs.split(',') if a.funcs else [s[0] for s in suite(DIM)]
    tasks = [(al, f, s, a.budget) for al in a.algos.split(',') for f in fids for s in range(1, a.runs + 1)]
    rows, curves = [], {}
    with Pool(8) as pool:
        for k, (al, f, s, err, fes, dt, cur) in enumerate(pool.imap_unordered(one, tasks, chunksize=1)):
            rows.append((al, f, s, err, fes, dt)); curves[f'{al}|{f}|{s}'] = cur
            if (k + 1) % 50 == 0:
                print(f'{k + 1}/{len(tasks)}', flush=True)
    rows.sort()
    with open(os.path.join(a.out, 'raw.csv'), 'w', newline='') as fh:
        w = csv.writer(fh); w.writerow(['algo', 'func', 'seed', 'error', 'fes', 'seconds']); w.writerows(rows)
    np.savez_compressed(os.path.join(a.out, 'curves.npz'), **curves)
    print('DONE', len(rows))
