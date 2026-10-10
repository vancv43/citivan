"""Phân tích kết quả bộ hàm liên tục: bảng thống kê, Wilcoxon so với PSO, xếp hạng Friedman, đường hội tụ (SVG).

python -m experiments.analyze results/continuous [results/extra]
"""
import csv, json, os, sys
from collections import defaultdict
import numpy as np
from scipy.stats import ranksums, friedmanchisquare, rankdata

EPS = 1e-8
FUNCS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7']


def load(dirs):
    R = defaultdict(list)
    for d in dirs:
        for r in csv.DictReader(open(os.path.join(d, 'raw.csv'))):
            e = float(r['error']); R[(r['algo'], r['func'])].append(0.0 if e < EPS else e)
    return R


def main(dirs, out='results/summary'):
    os.makedirs(out, exist_ok=True)
    R = load(dirs)
    algos = sorted({a for a, _ in R}, key=lambda a: a)
    stats = {}
    for a in algos:
        for f in FUNCS:
            v = np.array(R[(a, f)])
            if len(v) == 0:
                continue
            p = None if a == 'PSO' else ranksums(v, np.array(R[('PSO', f)])).pvalue
            sign = '='
            if p is not None and p < 0.05:
                ref = np.array(R[('PSO', f)])
                key = lambda x: (np.median(x), np.mean(x))          # trung vị trước, hòa thì so trung bình
                sign = '+' if key(v) < key(ref) else '−'
            stats[f'{a}|{f}'] = {'mean': float(v.mean()), 'std': float(v.std(ddof=1)), 'median': float(np.median(v)),
                                 'best': float(v.min()), 'p_vs_PSO': p, 'sign': sign, 'n': len(v)}
    # Friedman trên trung vị của 7 hàm
    M = np.array([[stats[f'{a}|{f}']['median'] for f in FUNCS] for a in algos])
    ranks = np.array([rankdata(M[:, j]) for j in range(len(FUNCS))]).T
    fr = friedmanchisquare(*M) if len(algos) > 2 else None
    avg = {a: float(ranks[i].mean()) for i, a in enumerate(algos)}
    json.dump({'stats': stats, 'friedman_avg_rank': avg, 'friedman_p': float(fr.pvalue) if fr else None,
               'friedman_stat': float(fr.statistic) if fr else None}, open(os.path.join(out, 'summary.json'), 'w'), indent=1)
    with open(os.path.join(out, 'table.csv'), 'w', newline='') as fh:
        w = csv.writer(fh); w.writerow(['algo'] + [f'{f}_{k}' for f in FUNCS for k in ('mean', 'std', 'sign')] + ['friedman_rank'])
        for a in algos:
            w.writerow([a] + [x for f in FUNCS for x in (f"{stats[f'{a}|{f}']['mean']:.3e}", f"{stats[f'{a}|{f}']['std']:.2e}", stats[f'{a}|{f}']['sign'])] + [f'{avg[a]:.2f}'])
    print('Friedman p =', fr.pvalue if fr else None)
    for a in sorted(avg, key=avg.get):
        print(f'{a:6s} rank {avg[a]:5.2f}  ' + '  '.join(f"{f}:{stats[f'{a}|{f}']['median']:.2e}{stats[f'{a}|{f}']['sign']}" for f in FUNCS))
    # đường hội tụ: trung vị theo hạt giống, mỗi thuật toán một tệp SVG (7 hàm)
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 9, 'svg.fonttype': 'none'})
    curves = {}
    for d in dirs:
        z = np.load(os.path.join(d, 'curves.npz'))
        for k in z.files:
            curves[k] = z[k]
    marks = np.linspace(400, 20000, 50)
    os.makedirs(os.path.join(out, 'conv'), exist_ok=True)
    for a in algos:
        fig, ax = plt.subplots(figsize=(5.2, 3.2))
        for f, c in zip(FUNCS, ['#1f6f78', '#3a7fc1', '#4b8f45', '#c9a227', '#7b5ea7', '#d9562f', '#56676a']):
            C = np.array([curves[k] for k in curves if k.startswith(f'{a}|{f}|')])
            if len(C) == 0:
                continue
            med = np.maximum(np.median(C, axis=0), 1e-12)
            ax.semilogy(marks, med, color=c, lw=1.6, label=f)
        ax.set_xlabel('FEs'); ax.set_ylabel('median error'); ax.grid(alpha=0.25); ax.legend(ncol=4, fontsize=7, frameon=False)
        for s in ('top', 'right'):
            ax.spines[s].set_visible(False)
        fig.tight_layout(); fig.savefig(os.path.join(out, 'conv', f'{a}.svg')); plt.close(fig)


if __name__ == '__main__':
    main(sys.argv[1:] or ['results/continuous'])
