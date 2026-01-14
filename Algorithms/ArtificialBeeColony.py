import numpy as np
import matplotlib.pyplot as plt
from typing import Callable, Tuple, List




def initialize_population(n_bees: int, dim: int, bounds: Tuple[float, float], objective_func: Callable):

    food_sources = np.random.uniform(bounds[0], bounds[1], (n_bees, dim))
    fitness = np.array([objective_func(source) for source in food_sources])
    trial_counter = np.zeros(n_bees)

    best_idx = np.argmin(fitness)
    best_solution = food_sources[best_idx].copy()
    best_fitness = fitness[best_idx]

    return food_sources, fitness, trial_counter, best_solution, best_fitness





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






def roulette_wheel_selection(probabilities: np.ndarray) -> int:

    r = np.random.random()
    cumsum = np.cumsum(probabilities)
    return np.searchsorted(cumsum, r)






def onlooker_bees_phase(food_sources, fitness, trial_counter, best_solution, best_fitness, bounds, objective_func):
    """Pszczoły obserwatorki wybierają źródła probabilistycznie i próbują je ulepszyć."""
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






def scout_bees_phase(food_sources, fitness, trial_counter, bounds, objective_func, limit):

    max_trial_idx = np.argmax(trial_counter)
    if trial_counter[max_trial_idx] >= limit:
        food_sources[max_trial_idx] = np.random.uniform(bounds[0], bounds[1], food_sources.shape[1])
        fitness[max_trial_idx] = objective_func(food_sources[max_trial_idx])
        trial_counter[max_trial_idx] = 0
    return food_sources, fitness, trial_counter






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







def artificial_bee_colony_position(
    n_bees, dim, bounds, max_iter, objective_func,
    limit=None, save_every=1
):
    """Główna funkcja optymalizacji ABC z logowaniem pozycji agentów."""
    
    if limit is None:
        limit = n_bees * dim

    food_sources, fitness, trial_counter, best_solution, best_fitness = initialize_population(
        n_bees, dim, bounds, objective_func
    )
    convergence_curve = [best_fitness]

    # Log pozycji agentów (tylko dla dim = 2)
    positions_log = []

    # Zapis początkowych pozycji
    if dim == 2 and save_every == 0:
        raise ValueError("save_every musi być >= 1")

    if dim == 2:
        positions_log.append(food_sources.copy())

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

        # Zapis pozycji co save_every iteracji
        if dim == 2 and (iteration + 1) % save_every == 0:
            positions_log.append(food_sources.copy())

    return best_solution, best_fitness, convergence_curve, positions_log