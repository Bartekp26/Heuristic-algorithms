import numpy as np
import matplotlib.pyplot as plt
from typing import Callable, Tuple, List




def initialization_bats(bounds, n_bats, dims):
    x = np.zeros((n_bats, dims))
    for i in range(n_bats):
        for j in range(dims):
            x[i, j] = bounds[0] + np.random.rand() * (bounds[1] - bounds[0])
    return x





def update_position_frequency_velocity(xi, vi, best, f_bounds, A_avg, ri):
    f_min, f_max = f_bounds

    beta = np.random.rand()                 # Losowa liczba z zakresu (0,1)
    f = f_min + (f_max - f_min) * beta      # Przypisywanie nowej częstotliwości

    vi = vi + (best - xi) * f                  # Aktualizacja prędkości
    xi += vi                                # Aktualizacja pozycji bata

    if np.random.rand() < ri:
        epsilon = np.random.rand()
        xi = best + epsilon * A_avg         # Lokalna eksploracja

    return xi, vi, f





def adjust_loudness(A, alpha):
    return A * alpha

def adjust_pulse_rate(r0, gamma, t):
    return  r0 * (1 - np.exp(-gamma * t))





def bat_algorithm(fn,n_bats, bounds, alpha, gamma, f_bounds, max_iter, dims):
    v = np.zeros((n_bats, dims))
    x = initialization_bats(bounds, n_bats, dims)
    f = np.zeros(n_bats)
    A = np.full(n_bats, 1.5)
    r0 = np.full(n_bats, 0.5)

    fitness = np.array([fn(xi) for xi in x])
    best_idx = np.argmin(fitness)
    best = x[best_idx].copy()
    best_f = fitness[best_idx]

    convergence_curve = [best_f]

    history = []
    t = 0
    while t < max_iter:
        a_avg = np.average(A)
        r_new = np.zeros(n_bats)
        for i in range(n_bats):
            r_new[i] = adjust_pulse_rate(r0[i], gamma, t)
            A[i] = adjust_loudness(A[i], alpha)

            x[i], v[i], f[i] = update_position_frequency_velocity(x[i], v[i], best, f_bounds, a_avg, r_new[i])

            x[i] = np.clip(x[i], bounds[0], bounds[1])

            f_new = fn(x[i])

            if np.random.rand() < A[i] and f_new < fitness[i]:
                fitness[i] = f_new
                A[i] = adjust_loudness(A[i], alpha)
                r_new[i] = adjust_pulse_rate(r0[i], gamma, t)


            if f_new < best_f:
                best_f = f_new
                best =x[i].copy()

        history.append(best_f)
        t += 1
        
        convergence_curve.append(best_f)

    return best, best_f, convergence_curve






def bat_algorithm_position(fn, n_bats, bounds, alpha, gamma, f_bounds, max_iter, dims,
                  save_every: int = 1):
    """
    Bat Algorithm z logowaniem pozycji (dla dims = 2).
    """

    # Inicjalizacja
    v = np.zeros((n_bats, dims))
    x = initialization_bats(bounds, n_bats, dims)
    f = np.zeros(n_bats)
    A = np.full(n_bats, 1.5)
    r0 = np.full(n_bats, 0.5)

    fitness = np.array([fn(xi) for xi in x])
    best_idx = np.argmin(fitness)
    best = x[best_idx].copy()
    best_f = fitness[best_idx]

    convergence_curve = [best_f]

    # Log pozycji
    positions_log = []
    if dims == 2:
        positions_log.append(x.copy())

    t = 0
    while t < max_iter:

        a_avg = np.average(A)
        r_new = np.zeros(n_bats)

        for i in range(n_bats):

            # Aktualizacja parametrów
            r_new[i] = adjust_pulse_rate(r0[i], gamma, t)
            A[i] = adjust_loudness(A[i], alpha)

            # Aktualizacja pozycji, prędkości i częstotliwości
            x[i], v[i], f[i] = update_position_frequency_velocity(
                x[i], v[i], best, f_bounds, a_avg, r_new[i]
            )

            # Ograniczenia
            x[i] = np.clip(x[i], bounds[0], bounds[1])

            # Nowy fitness
            f_new = fn(x[i])

            # Akceptacja nowego rozwiązania
            if np.random.rand() < A[i] and f_new < fitness[i]:
                fitness[i] = f_new
                A[i] = adjust_loudness(A[i], alpha)
                r_new[i] = adjust_pulse_rate(r0[i], gamma, t)

            # Aktualizacja najlepszego
            if f_new < best_f:
                best_f = f_new
                best = x[i].copy()

        convergence_curve.append(best_f)

        # Logowanie pozycji co save_every iteracji
        if dims == 2 and (t + 1) % save_every == 0:
            positions_log.append(x.copy())

        t += 1

    return best, best_f, convergence_curve, positions_log




