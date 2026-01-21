# abc_workers.py

import numpy as np
from typing import Tuple, Callable


def produce_new_solution(food_sources: np.ndarray, bee_idx: int, bounds: Tuple[float, float]) -> np.ndarray:
    """
    Generuje nowe rozwiązanie dla pszczoły o indeksie bee_idx,
    na podstawie pozycji innej losowej pszczoły i losowego wymiaru.
    """
    dim = food_sources.shape[1]
    new_solution = food_sources[bee_idx].copy()

    # losowy wymiar
    j = np.random.randint(0, dim)

    # losowa inna pszczoła
    k = np.random.randint(0, food_sources.shape[0])
    while k == bee_idx:
        k = np.random.randint(0, food_sources.shape[0])

    # współczynnik perturbacji
    phi = np.random.uniform(-1, 1)
    new_solution[j] = food_sources[bee_idx, j] + phi * (food_sources[bee_idx, j] - food_sources[k, j])

    # przycięcie do zakresu
    new_solution[j] = np.clip(new_solution[j], bounds[0], bounds[1])

    return new_solution


def roulette_wheel_selection(probabilities: np.ndarray) -> int:
    """
    Selekcja ruletkowa: wybiera indeks na podstawie rozkładu prawdopodobieństwa.
    """
    r = np.random.random()
    cumsum = np.cumsum(probabilities)
    return np.searchsorted(cumsum, r)


def employed_worker(args):
    """
    Worker dla fazy employed bees.

    args: (i, food_sources, fitness, trial_counter, bounds, objective_func)
    Zwraca: (idx, new_src, new_fit, new_trial)
    """
    i, food_sources, fitness, trial_counter, bounds, objective_func = args

    new_solution = produce_new_solution(food_sources, i, bounds)
    new_fitness = objective_func(new_solution)

    if new_fitness < fitness[i]:
        return i, new_solution, new_fitness, 0
    else:
        return i, food_sources[i], fitness[i], trial_counter[i] + 1


def onlooker_worker(args):
    """
    Worker dla fazy onlooker bees.

    args: (i, food_sources, fitness, trial_counter, probabilities, bounds, objective_func)
    Zwraca: (selected_idx, new_src, new_fit, new_trial)
    """
    i, food_sources, fitness, trial_counter, probabilities, bounds, objective_func = args

    selected_idx = roulette_wheel_selection(probabilities)
    new_solution = produce_new_solution(food_sources, selected_idx, bounds)
    new_fitness = objective_func(new_solution)

    if new_fitness < fitness[selected_idx]:
        return selected_idx, new_solution, new_fitness, 0
    else:
        return selected_idx, food_sources[selected_idx], fitness[selected_idx], trial_counter[selected_idx] + 1