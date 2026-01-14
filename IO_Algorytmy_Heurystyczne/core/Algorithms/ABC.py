import numpy as np
import matplotlib.pyplot as plt
from typing import Callable, Tuple, List


# Inicjalizacja Populacji

def initialize_population(n_bees: int, dim: int, bounds: Tuple[float, float], objective_func: Callable):

    food_sources = np.random.uniform(bounds[0], bounds[1], (n_bees, dim))
    fitness = np.array([objective_func(source) for source in food_sources])
    trial_counter = np.zeros(n_bees)

    best_idx = np.argmin(fitness)
    best_solution = food_sources[best_idx].copy()
    best_fitness = fitness[best_idx]

    return food_sources, fitness, trial_counter, best_solution, best_fitness

# Produkcja nowego rozwiązania

def produce_new_solution(food_sources: np.ndarray, bee_idx: int, bounds: Tuple[float, float]) -> np.ndarray:
    
    dim = food_sources.shape[1]
    new_solution = food_sources[bee_idx].copy()

    j = np.random.randint(0, dim)
    k = np.random.randint(0, food_sources.shape[0])
    while k == bee_idx:
        k = np.random.randint(0, food_sources.shape[0])

    phi = np.random.uniform(-1, 1)
    new_solution[j] = food_sources[bee_idx, j] + phi * (food_sources[bee_idx, j] - food_sources[k, j])
    new_solution[j] = np.clip(new_solution[j], bounds[0], bounds[1])

    return new_solution

# Faza pszczół zatrudnionych

def employed_bees_phase(food_sources, fitness, trial_counter, best_solution, best_fitness, bounds, objective_func):

    for i in range(food_sources.shape[0]):
        new_solution = produce_new_solution(food_sources, i, bounds)
        new_fitness = objective_func(new_solution)

        if new_fitness < fitness[i]:
            food_sources[i] = new_solution
            fitness[i] = new_fitness
            trial_counter[i] = 0
            if new_fitness < best_fitness:
                best_solution = new_solution.copy()
                best_fitness = new_fitness
        else:
            trial_counter[i] += 1

    return food_sources, fitness, trial_counter, best_solution, best_fitness

# Selekcja ruletka

def roulette_wheel_selection(probabilities: np.ndarray) -> int:

    r = np.random.random()
    cumsum = np.cumsum(probabilities)
    return np.searchsorted(cumsum, r)

# Faza pszczół obserwatorek

def onlooker_bees_phase(food_sources, fitness, trial_counter, best_solution, best_fitness, bounds, objective_func):

    fitness_sum = np.sum(1.0 / (1.0 + fitness))
    probabilities = (1.0 / (1.0 + fitness)) / fitness_sum

    for i in range(food_sources.shape[0]):
        selected_idx = roulette_wheel_selection(probabilities)
        new_solution = produce_new_solution(food_sources, selected_idx, bounds)
        new_fitness = objective_func(new_solution)

        if new_fitness < fitness[selected_idx]:
            food_sources[selected_idx] = new_solution
            fitness[selected_idx] = new_fitness
            trial_counter[selected_idx] = 0
            if new_fitness < best_fitness:
                best_solution = new_solution.copy()
                best_fitness = new_fitness
        else:
            trial_counter[selected_idx] += 1

    return food_sources, fitness, trial_counter, best_solution, best_fitness

# Faza pszczół zwiadowców

def scout_bees_phase(food_sources, fitness, trial_counter, bounds, objective_func, limit):

    max_trial_idx = np.argmax(trial_counter)
    if trial_counter[max_trial_idx] >= limit:
        food_sources[max_trial_idx] = np.random.uniform(bounds[0], bounds[1], food_sources.shape[1])
        fitness[max_trial_idx] = objective_func(food_sources[max_trial_idx])
        trial_counter[max_trial_idx] = 0
    return food_sources, fitness, trial_counter

# Główna pętla optymalizacji

def artificial_bee_colony(n_bees, dim, bounds, max_iter, objective_func, limit=None):
    """Główna funkcja optymalizacji ABC."""
    if limit is None:
        limit = n_bees * dim

    food_sources, fitness, trial_counter, best_solution, best_fitness = initialize_population(n_bees, dim, bounds, objective_func)
    convergence_curve = [best_fitness]

    for iteration in range(max_iter):
        food_sources, fitness, trial_counter, best_solution, best_fitness = employed_bees_phase(
            food_sources, fitness, trial_counter, best_solution, best_fitness, bounds, objective_func
        )
        food_sources, fitness, trial_counter, best_solution, best_fitness = onlooker_bees_phase(
            food_sources, fitness, trial_counter, best_solution, best_fitness, bounds, objective_func
        )
        food_sources, fitness, trial_counter = scout_bees_phase(
            food_sources, fitness, trial_counter, bounds, objective_func, limit
        )

        convergence_curve.append(best_fitness)

    return best_solution, best_fitness, convergence_curve

# Wizualizcja - krzywa zbierzna algorytmu

def plot_convergence(convergence_curve):

    plt.figure(figsize=(10, 6))
    plt.plot(convergence_curve, 'b-', linewidth=2)
    plt.xlabel('Iteracja')
    plt.ylabel('Najlepsza wartość funkcji celu')
    plt.title('Krzywa zbieżności algorytmu ABC')
    plt.grid(True, alpha=0.3)
    plt.yscale('log')
    plt.show()





# Funkcja Sferyczna

def sphere_function(x: np.ndarray) -> float:
    return np.sum(x ** 2)

# Funkcja Rastrigina

def rastrigin_function(x: np.ndarray, A: float = 10) -> float:

    n = len(x)
    return A * n + np.sum(x**2 - A * np.cos(2 * np.pi * x))

# Funkcja Rosenbrocka

def rosenbrock_function(x: np.ndarray) -> float:

    return np.sum(100.0 * (x[1:] - x[:-1]**2)**2 + (1 - x[:-1])**2)

# Funkcja Griewanka

def griewank_function(x: np.ndarray) -> float:
    n = len(x)
    sum_part = np.sum(x**2 / 4000.0)
    prod_part = np.prod(np.cos(x / np.sqrt(np.arange(1, n+1))))
    return sum_part - prod_part + 1

# Funkcja Zakharova

def zakharov_function(x: np.ndarray) -> float:
    n = len(x)
    sum1 = np.sum(x**2)
    sum2 = np.sum(0.5 * np.arange(1, n+1) * x)
    return sum1 + sum2**2 + sum2**4


# # Wywołanie

# if __name__ == "__main__":
#     best_solution, best_value, convergence = artificial_bee_colony(
#     n_bees=50,
#     dim=10,
#     bounds=(-5.12, 5.12),
#     max_iter=100,
#     objective_func = sphere_function
#     )

#     print("Najlepsze rozwiązanie:", best_solution)
#     print("Wartość funkcji:", best_value)
#     plot_convergence(convergence)