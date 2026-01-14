import numpy as np


def sphere_function(x: np.ndarray) -> float:
    return np.sum(x**2)


def rastrigin_function(x: np.ndarray, A: float = 10) -> float:

    n = len(x)
    return A * n + np.sum(x**2 - A * np.cos(2 * np.pi * x))


def rosenbrock_function(x: np.ndarray) -> float:

    return np.sum(100.0 * (x[1:] - x[:-1]**2)**2 + (1 - x[:-1])**2)


def heavy_monte_carlo(x: np.ndarray, samples: int = 200_000) -> float:
    """
    Ciężka funkcja celu: Monte Carlo integration.
    Dla każdego punktu x wykonuje dużą liczbę losowych próbek.
    """
    total = 0.0
    for _ in range(samples):
        noise = np.random.normal(0, 1, size=x.shape)
        total += np.sum((x + noise)**2)
    return total / samples
