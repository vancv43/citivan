"""Thí nghiệm TSP (PROTOCOL.md mục 2): AS, ACS, MMAS so với láng giềng gần nhất và NN + 2-opt.

python -m experiments.run_tsp  -> results/tsp/raw.csv, results/tsp/summary.csv
"""
import csv, os, time
import numpy as np
from multiprocessing import Pool
from si.aco_tsp import read_tsplib, run, nearest_neighbour, two_opt, length

BOOK = np.array([[0, 10, 12, 11, 14], [10, 0, 13, 15, 8], [12, 13, 0, 9, 14], [11, 15, 9, 0, 16], [14, 8, 14, 16, 0]], float)
INST = {'book5': (BOOK, 52), 'eil51': ('data/eil51.tsp', 426), 'berlin52': ('data/berlin52.tsp', 7542), 'st70': ('data/st70.tsp', 675)}


def dist(name):
    src, _ = INST[name]
    return src if isinstance(src, np.ndarray) else read_tsplib(src)[1]


def one(task):
    name, variant, seed = task
    D = dist(name)
    t0 = time.time()
    _, L = run(variant, D, np.random.default_rng(seed), budget_tours=10000 if len(D) > 5 else 300)
    return name, variant, seed, L, time.time() - t0


if __name__ == '__main__':
    os.makedirs('results/tsp', exist_ok=True)
    tasks = [(nm, v, s) for nm in INST for v in ('AS', 'ACS', 'MMAS') for s in range(1, 11)]
    with Pool(8) as pool:
        rows = sorted(pool.map(one, tasks, chunksize=1))
    with open('results/tsp/raw.csv', 'w', newline='') as fh:
        w = csv.writer(fh); w.writerow(['instance', 'algo', 'seed', 'length', 'seconds']); w.writerows(rows)
    with open('results/tsp/summary.csv', 'w', newline='') as fh:
        w = csv.writer(fh); w.writerow(['instance', 'optimum', 'method', 'best', 'mean', 'std', 'mean_gap_pct'])
        for nm, (_, opt) in INST.items():
            D = dist(nm)
            nn = length(D, nearest_neighbour(D)); nn2 = length(D, two_opt(D, nearest_neighbour(D)))
            w.writerow([nm, opt, 'NN', nn, nn, 0, round(100 * (nn - opt) / opt, 2)])
            w.writerow([nm, opt, 'NN+2opt', nn2, nn2, 0, round(100 * (nn2 - opt) / opt, 2)])
            for v in ('AS', 'ACS', 'MMAS'):
                L = np.array([r[3] for r in rows if r[0] == nm and r[1] == v])
                w.writerow([nm, opt, v, L.min(), round(L.mean(), 2), round(L.std(ddof=1), 2), round(100 * (L.mean() - opt) / opt, 2)])
    print('DONE')
