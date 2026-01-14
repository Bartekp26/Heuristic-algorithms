import numpy as np

def initialization_bats(bounds, n_bats, dims):
    x = np.zeros((n_bats, dims))
    for i in range(n_bats):
        for j in range(dims):
            x[i, j] = bounds[0] + np.random.rand() * (bounds[1] - bounds[0])
    return x


# f = frequency
# V = velocity

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

# x = bats
# A - loudness
# r - pulse emission rate

def sphere_function(x):
    return np.sum(x**2)

def rastrigin_function(x):
    d = len(x)
    return 10 * d + np.sum(x**2 - 10 * np.cos(2 * np.pi * x))

def rosenbrock_function(x):
    return np.sum(100.0 * (x[1:] - x[:-1]**2)**2 + (1 - x[:-1])**2)

def griewank_function(x):
    n = len(x)
    sum_part = np.sum(x**2 / 4000.0)
    prod_part = np.prod(np.cos(x / np.sqrt(np.arange(1, n+1))))
    return sum_part - prod_part + 1

def zakharov_function(x):
    n = len(x)
    sum1 = np.sum(x**2)
    sum2 = np.sum(0.5 * np.arange(1, n+1) * x)
    return sum1 + sum2**2 + sum2**4

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
        # if t % max(1, max_iter // 10) == 0 or t == 1 or t == max_iter:
        #     print(f"Iteracja {t}/{max_iter}: najlepsze f(x) = {best_f:.6e}")

    #print("\nNajlepsze znalezione rozwiązanie:", best)
    #print("Najlepsza wartość funkcji celu:", best_f)
    return best, best_f, history

# if __name__ == '__main__':
#     max_iter = 1000
#     dims = 50
#     n_bats = 50
#     alpha = 0.9
#     gamma = 0.9
#     bounds = (-15, 15)
#     f_bounds = (0, 2)
#     fn = rastrigin_function

#     print(bat_algorithm(fn, n_bats, bounds, alpha, gamma, f_bounds, max_iter, dims))
