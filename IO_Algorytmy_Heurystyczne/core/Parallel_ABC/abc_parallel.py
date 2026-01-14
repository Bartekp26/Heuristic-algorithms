# abc_parallel.py

import numpy as np
from typing import Tuple, Callable
from concurrent.futures import ProcessPoolExecutor

from abc_workers import employed_worker, onlooker_worker
from objective_functions import sphere_function


def initialize_population(
    n_bees: int,
    dim: int,
    bounds: Tuple[float, float],
    objective_func: Callable
):
    """
    Inicjalizacja populacji: losowe pozycje, fitness, liczniki prób,
    oraz najlepsze dotychczasowe rozwiązanie.
    """
    food_sources = np.random.uniform(bounds[0], bounds[1], (n_bees, dim))
    fitness = np.array([objective_func(source) for source in food_sources])
    trial_counter = np.zeros(n_bees)

    best_idx = np.argmin(fitness)
    best_solution = food_sources[best_idx].copy()
    best_fitness = fitness[best_idx]

    return food_sources, fitness, trial_counter, best_solution, best_fitness


def employed_bees_phase_parallel(food_sources, fitness, trial_counter, best_solution, best_fitness, bounds, objective_func):
    """
    Równoległa faza employed bees:
    - każda pszczoła jest przetwarzana w osobnym procesie (employed_worker),
    - po zebraniu wyników aktualizujemy food_sources, fitness i trial_counter,
    - aktualizujemy też globalnie najlepsze rozwiązanie.
    """
    args = [
        (i, food_sources, fitness, trial_counter, bounds, objective_func)
        for i in range(food_sources.shape[0])
    ]

    with ProcessPoolExecutor() as ex:
        results = list(ex.map(employed_worker, args))

    for idx, new_src, new_fit, new_trial in results:
        food_sources[idx] = new_src
        fitness[idx] = new_fit
        trial_counter[idx] = new_trial

        if new_fit < best_fitness:
            best_fitness = new_fit
            best_solution = new_src.copy()

    return food_sources, fitness, trial_counter, best_solution, best_fitness


def onlooker_bees_phase_parallel(food_sources, fitness, trial_counter, best_solution, best_fitness, bounds, objective_func):
    """
    Równoległa faza onlooker bees:
    - liczymy prawdopodobieństwa na podstawie fitness,
    - każda pszczoła obserwująca działa w osobnym procesie (onlooker_worker),
    - wyniki scalamy i aktualizujemy najlepsze rozwiązanie.
    """
    fitness_sum = np.sum(1.0 / (1.0 + fitness))
    probabilities = (1.0 / (1.0 + fitness)) / fitness_sum

    args = [
        (i, food_sources, fitness, trial_counter, probabilities, bounds, objective_func)
        for i in range(food_sources.shape[0])
    ]

    with ProcessPoolExecutor() as ex:
        results = list(ex.map(onlooker_worker, args))

    for idx, new_src, new_fit, new_trial in results:
        food_sources[idx] = new_src
        fitness[idx] = new_fit
        trial_counter[idx] = new_trial

        if new_fit < best_fitness:
            best_fitness = new_fit
            best_solution = new_src.copy()

    return food_sources, fitness, trial_counter, best_solution, best_fitness


def scout_bees_phase(food_sources, fitness, trial_counter, bounds, objective_func, limit):
    """
    Faza scout bees (sekwencyjna):
    - jeśli licznik prób dla pszczoły z max. wartością przekracza limit,
      losujemy dla niej nowe położenie.
    """
    max_trial_idx = np.argmax(trial_counter)
    if trial_counter[max_trial_idx] >= limit:
        food_sources[max_trial_idx] = np.random.uniform(bounds[0], bounds[1], food_sources.shape[1])
        fitness[max_trial_idx] = objective_func(food_sources[max_trial_idx])
        trial_counter[max_trial_idx] = 0
    return food_sources, fitness, trial_counter


def artificial_bee_colony_parallel(n_bees, dim, bounds, max_iter, objective_func, limit=None):
    """
    Główna funkcja równoległego ABC:
    - employed_bees_phase_parallel
    - onlooker_bees_phase_parallel
    - scout_bees_phase (sekwencyjnie)
    """
    if limit is None:
        limit = n_bees * dim

    food_sources, fitness, trial_counter, best_solution, best_fitness = initialize_population(
        n_bees, dim, bounds, objective_func
    )

    convergence_curve = [best_fitness]

    for iteration in range(max_iter):
        food_sources, fitness, trial_counter, best_solution, best_fitness = employed_bees_phase_parallel(
            food_sources, fitness, trial_counter, best_solution, best_fitness, bounds, objective_func
        )

        food_sources, fitness, trial_counter, best_solution, best_fitness = onlooker_bees_phase_parallel(
            food_sources, fitness, trial_counter, best_solution, best_fitness, bounds, objective_func
        )

        food_sources, fitness, trial_counter = scout_bees_phase(
            food_sources, fitness, trial_counter, bounds, objective_func, limit
        )

        convergence_curve.append(best_fitness)

    return best_solution, best_fitness, convergence_curve


if __name__ == "__main__":

    n_bees = 50
    dim = 10
    bounds = (-5.0, 5.0)
    max_iter = 1000

    best_solution, best_fitness, convergence = artificial_bee_colony_parallel(
        n_bees=n_bees,
        dim=dim,
        bounds=bounds,
        max_iter=max_iter,
        objective_func = sphere_function
    )

    print("Best fitness:", best_fitness)
    print("Best solution:", best_solution)