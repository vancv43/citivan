"""Bộ hàm kiểm thử (chương 2). Mọi hàm nhận ma trận (m, D), trả về vector (m,).

Benchmark functions (chapter 2). F6, F7 are shifted versions used to reveal origin bias.
"""
import numpy as np


def sphere(X):
    return np.sum(X ** 2, axis=1)


def rosenbrock(X):
    return np.sum(100 * (X[:, 1:] - X[:, :-1] ** 2) ** 2 + (X[:, :-1] - 1) ** 2, axis=1)


def rastrigin(X):
    return 10 * X.shape[1] + np.sum(X ** 2 - 10 * np.cos(2 * np.pi * X), axis=1)


def ackley(X):
    d = X.shape[1]
    return (-20 * np.exp(-0.2 * np.sqrt(np.sum(X ** 2, axis=1) / d))
            - np.exp(np.sum(np.cos(2 * np.pi * X), axis=1) / d) + 20 + np.e)


def griewank(X):
    i = np.arange(1, X.shape[1] + 1)
    return 1 + np.sum(X ** 2, axis=1) / 4000 - np.prod(np.cos(X / np.sqrt(i)), axis=1)


def shifted(f, o):
    return lambda X: f(X - o)


# Các hàm 2 biến dùng trong ví dụ của sách tham khảo
def booth(X):
    x, y = X[:, 0], X[:, 1]
    return (x + 2 * y - 7) ** 2 + (2 * x + y - 5) ** 2


def himmelblau(X):
    x, y = X[:, 0], X[:, 1]
    return (x ** 2 + y - 11) ** 2 + (x + y ** 2 - 7) ** 2


def goldstein_price(X):
    x, y = X[:, 0], X[:, 1]
    a = 1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2)
    b = 30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x ** 2 + 48 * y - 36 * x * y + 27 * y ** 2)
    return a * b


def bukin6(X):
    x, y = X[:, 0], X[:, 1]
    return 100 * np.sqrt(np.abs(y - 0.01 * x ** 2)) + 0.01 * np.abs(x + 10)


def wayburn_seader(X):
    x, y = X[:, 0], X[:, 1]
    return (x ** 6 + y ** 4 - 17) ** 2 + (2 * x + y - 4) ** 2


def suite(dim=10, seed=2026):
    """Bộ 7 hàm của giao thức: (id, tên, hàm, lb, ub)."""
    rng = np.random.default_rng(seed)
    o6 = rng.uniform(-80, 80, dim)
    o7 = rng.uniform(-4, 4, dim)
    return [
        ('F1', 'Sphere', sphere, -100, 100),
        ('F2', 'Rosenbrock', rosenbrock, -30, 30),
        ('F3', 'Rastrigin', rastrigin, -5.12, 5.12),
        ('F4', 'Ackley', ackley, -32, 32),
        ('F5', 'Griewank', griewank, -600, 600),
        ('F6', 'Shifted Sphere', shifted(sphere, o6), -100, 100),
        ('F7', 'Shifted Rastrigin', shifted(rastrigin, o7), -5.12, 5.12),
    ]
