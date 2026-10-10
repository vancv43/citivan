"""Thí nghiệm theo chương (PROTOCOL.md mục 3).

python -m experiments.run_chapters ch1|ch2|ch14|ch15|ch17|ch18     (chương 16 chạy bằng run_continuous)
Kết quả: results/<chương>/*.csv
"""
import csv, os, sys, time, math
import numpy as np
from si.core import Problem, levy


def save(path, header, rows):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', newline='') as fh:
        w = csv.writer(fh); w.writerow(header); w.writerows(rows)


def ch1():
    from si.applications import book_constrained
    from si.algorithms import pso
    rows = []
    for seed in range(1, 31):
        prob = Problem(book_constrained(), 3, -5, 5, 20000, 0.0, 'book')
        pso.run(prob, np.random.default_rng(seed))
        x = prob.best_x
        obj = 5 * (x[0] - 1) ** 2 + 10 * x[0] * x[1] + (x[2] - 3) ** 2
        viol = max(0, x.sum() - 5) + max(0, x[0] ** 2 + x[1] ** 2 - 5)
        rows.append((seed, *np.round(x, 4), round(obj, 4), round(viol, 6)))
    save('results/ch1/constrained_pso.csv', ['seed', 'x1', 'x2', 'x3', 'objective', 'violation'], rows)


def ch2():
    rng = np.random.default_rng(1)
    L = levy(rng, 100000); G = rng.normal(size=100000)
    rows = []
    for name, s in (('Levy(1.5)', L), ('Gauss', G)):
        a = np.abs(s); med = np.median(a)
        rows.append((name, round(med, 4), round(np.percentile(a, 99), 3), round(a.max(), 1), round(np.mean(a > 10 * med) * 100, 3)))
    save('results/ch2/steps.csv', ['distribution', 'median_abs', 'p99_abs', 'max_abs', 'pct_over_10x_median'], rows)


def ch14():
    from si.multiobjective import zdt, true_front, mopso, nsga2, igd, hv2d
    rows = []
    for k in (1, 2, 3):
        ref = true_front(k)
        for seed in range(1, 11):
            F = mopso(zdt(k), 30, 25000, np.random.default_rng(seed)); rows.append((f'ZDT{k}', 'MOPSO', seed, igd(F, ref), hv2d(F)))
            F = nsga2(f'zdt{k}', 30, 25000, seed); rows.append((f'ZDT{k}', 'NSGA-II (pymoo)', seed, igd(F, ref), hv2d(F)))
    rows.append(('ref', 'true front', 0, 0, 0))
    save('results/ch14/zdt.csv', ['problem', 'algo', 'seed', 'IGD', 'HV'], rows)
    save('results/ch14/hv_true.csv', ['problem', 'HV'], [(f'ZDT{k}', hv2d(true_front(k))) for k in (1, 2, 3)])


def ch15():
    from si.binary import bpso, knapsack_instance, knapsack_dp, knapsack_fitness, fs_fitness
    rows = []
    for n, iseed in ((50, 1), (100, 2), (200, 3)):
        w, v, cap = knapsack_instance(n, iseed); opt = knapsack_dp(w, v, cap)
        fit = knapsack_fitness(w, v, cap)
        for tf in ('S2', 'V2'):
            for seed in range(1, 31):
                b, f, _ = bpso(fit, n, 20000, np.random.default_rng(seed), tf)
                feas = b @ w <= cap
                rows.append((f'KP{n}', opt, tf, seed, int(b @ v) if feas else 0, int(feas)))
    save('results/ch15/knapsack.csv', ['instance', 'optimum', 'transfer', 'seed', 'value', 'feasible'], rows)
    from sklearn.datasets import load_breast_cancer
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.neighbors import KNeighborsClassifier
    X, y = load_breast_cancer(return_X_y=True)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, stratify=y, random_state=0)
    sc = StandardScaler().fit(Xtr); Xtr, Xte = sc.transform(Xtr), sc.transform(Xte)
    base = KNeighborsClassifier(5).fit(Xtr, ytr).score(Xte, yte)
    rows = [('all features', 0, 30, round(base, 4))]
    fit = fs_fitness(Xtr, ytr)
    for tf in ('S2', 'V2'):
        for seed in range(1, 11):
            b, f, _ = bpso(fit, 30, 600, np.random.default_rng(seed), tf, n=20)
            acc = KNeighborsClassifier(5).fit(Xtr[:, b == 1], ytr).score(Xte[:, b == 1], yte) if b.sum() else 0
            rows.append((f'BPSO-{tf}', seed, int(b.sum()), round(acc, 4)))
    save('results/ch15/feature_selection.csv', ['method', 'seed', 'n_features', 'test_accuracy'], rows)


def ch17():
    from si.applications import MLP, otsu_between
    from si.algorithms import pso
    from sklearn.datasets import load_breast_cancer, load_wine, load_digits, load_sample_image
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.preprocessing import StandardScaler
    from sklearn.neural_network import MLPClassifier
    from sklearn.ensemble import RandomForestClassifier
    import warnings; warnings.filterwarnings('ignore')
    rows = []
    for dname, loader in (('BreastCancer', load_breast_cancer), ('Wine', load_wine)):
        X, y = loader(return_X_y=True)
        Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, stratify=y, random_state=0)
        sc = StandardScaler().fit(Xtr); Xtr, Xte = sc.transform(Xtr), sc.transform(Xte)
        net = MLP(X.shape[1], 10, len(set(y)))
        for seed in range(1, 11):
            prob = Problem(lambda W: np.array([net.loss(w, Xtr, ytr) for w in W]), net.size, -5, 5, 6000)
            pso.run(prob, np.random.default_rng(seed))
            acc_pso = float(np.mean(net.proba(prob.best_x, Xte).argmax(1) == yte))
            adam = MLPClassifier((10,), activation='tanh', max_iter=500, random_state=seed).fit(Xtr, ytr)
            rows.append((dname, seed, round(acc_pso, 4), round(adam.score(Xte, yte), 4)))
    save('results/ch17/mlp.csv', ['dataset', 'seed', 'acc_PSO_6000evals', 'acc_Adam_500epochs'], rows)
    X, y = load_digits(return_X_y=True)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, stratify=y, random_state=0)
    def rf(p):
        return RandomForestClassifier(n_estimators=int(round(p[0])), max_depth=int(round(p[1])), min_samples_leaf=int(round(p[2])),
                                      max_features=float(p[3]), random_state=0, n_jobs=1)
    lb, ub = np.array([10, 2, 1, 0.05]), np.array([200, 20, 10, 1.0])
    rows = []
    for seed in range(1, 11):
        obj = lambda P: np.array([1 - cross_val_score(rf(p), Xtr, ytr, cv=3).mean() for p in P])
        prob = Problem(obj, 4, lb, ub, 50); pso.run(prob, np.random.default_rng(seed), n=10)
        bp = prob.best_x; cv_pso = 1 - prob.best_f
        rng = np.random.default_rng(1000 + seed); R = lb + rng.random((50, 4)) * (ub - lb); e = obj(R); br = R[np.argmin(e)]
        rows.append((seed, round(cv_pso, 4), round(rf(bp).fit(Xtr, ytr).score(Xte, yte), 4), round(1 - e.min(), 4), round(rf(br).fit(Xtr, ytr).score(Xte, yte), 4)))
    save('results/ch17/hpo_rf.csv', ['seed', 'cv_PSO', 'test_PSO', 'cv_Random', 'test_Random'], rows)
    img = load_sample_image('china.jpg').mean(2).astype(int)
    hist = np.bincount(img.ravel(), minlength=256).astype(float)
    best_ex, t_ex = -1, None
    for a in range(255):
        for b in range(a + 1, 255):
            s = otsu_between(hist, (a, b))
            if s > best_ex:
                best_ex, t_ex = s, (a, b)
    rows = [('exhaustive', 0, t_ex[0], t_ex[1], round(best_ex, 3), 32385)]
    for seed in range(1, 11):
        prob = Problem(lambda P: np.array([-otsu_between(hist, sorted(np.round(p))) for p in P]), 2, 0, 254, 1000)
        pso.run(prob, np.random.default_rng(seed), n=20)
        t = sorted(np.round(prob.best_x).astype(int))
        rows.append(('PSO', seed, t[0], t[1], round(-prob.best_f, 3), 1000))
    save('results/ch17/otsu.csv', ['method', 'seed', 't1', 't2', 'between_class_variance', 'evaluations'], rows)


def ch18():
    from si.applications import cvrp_instance, clarke_wright, cvrp_cost, aco_cvrp, moving_sphere, dynamic_pso
    P, q, D, cap = cvrp_instance()
    cw = cvrp_cost(D, clarke_wright(D, q, cap))
    rows = [('Clarke-Wright', 0, round(cw, 2))]
    for seed in range(1, 11):
        _, L = aco_cvrp(D, q, cap, np.random.default_rng(seed)); rows.append(('ACO (AS)', seed, round(L, 2)))
    save('results/ch18/cvrp.csv', ['method', 'seed', 'cost'], rows)
    rows = []
    for seed in range(1, 11):
        for react in (False, True):
            f, st = moving_sphere(seed=seed)
            e = dynamic_pso(f, st, 5, 20000, np.random.default_rng(seed), react=react)
            rows.append((seed, 'PSO + phát hiện và khởi tạo lại' if react else 'PSO thường', round(e, 4)))
    save('results/ch18/dynamic.csv', ['seed', 'method', 'mean_current_error'], rows)


if __name__ == '__main__':
    for name in sys.argv[1:]:
        t0 = time.time(); globals()[name](); print(name, 'done', round(time.time() - t0, 1), 's', flush=True)
