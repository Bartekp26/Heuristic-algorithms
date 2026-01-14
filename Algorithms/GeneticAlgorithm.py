import numpy as np
import matplotlib.pyplot as plt
from typing import Callable, Tuple, List



def initialize_population(pop_size: int, dim: int, bounds: Tuple[float, float], objective_func: Callable):
    population = np.random.uniform(bounds[0], bounds[1], (pop_size, dim))
    fitness = np.array([objective_func(individual) for individual in population])

    best_idx = np.argmin(fitness)
    best_solution = population[best_idx].copy()
    best_fitness = fitness[best_idx]

    return population, fitness, best_solution, best_fitness





def tournament_selection(population: np.ndarray, fitness: np.ndarray, tournament_size: int = 3) -> np.ndarray:
    pop_size = population.shape[0]
    tournament_indices = np.random.choice(pop_size, tournament_size, replace=False)
    tournament_fitness = fitness[tournament_indices]
    winner_idx = tournament_indices[np.argmin(tournament_fitness)]
    return population[winner_idx].copy()





def arithmetic_crossover(parent1: np.ndarray, parent2: np.ndarray, alpha: float = 0.5) -> Tuple[np.ndarray, np.ndarray]:
    offspring1 = alpha * parent1 + (1 - alpha) * parent2
    offspring2 = (1 - alpha) * parent1 + alpha * parent2
    return offspring1, offspring2





def single_point_crossover(parent1: np.ndarray, parent2: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    dim = len(parent1)
    point = np.random.randint(1, dim)

    offspring1 = np.concatenate([parent1[:point], parent2[point:]])
    offspring2 = np.concatenate([parent2[:point], parent1[point:]])

    return offspring1, offspring2





def gaussian_mutation(individual: np.ndarray, bounds: Tuple[float, float],
                      mutation_rate: float = 0.1, mutation_scale: float = 0.1) -> np.ndarray:
    mutated = individual.copy()
    dim = len(individual)

    for i in range(dim):
        if np.random.random() < mutation_rate:
            noise = np.random.normal(0, mutation_scale * (bounds[1] - bounds[0]))
            mutated[i] = mutated[i] + noise
            mutated[i] = np.clip(mutated[i], bounds[0], bounds[1])

    return mutated





def uniform_mutation(individual: np.ndarray, bounds: Tuple[float, float],
                     mutation_rate: float = 0.1) -> np.ndarray:
    mutated = individual.copy()
    dim = len(individual)

    for i in range(dim):
        if np.random.random() < mutation_rate:
            mutated[i] = np.random.uniform(bounds[0], bounds[1])

    return mutated





def elitism(population: np.ndarray, fitness: np.ndarray, n_elite: int) -> Tuple[np.ndarray, np.ndarray]:
    elite_indices = np.argsort(fitness)[:n_elite]
    elite_population = population[elite_indices].copy()
    elite_fitness = fitness[elite_indices].copy()
    return elite_population, elite_fitness





def genetic_algorithm(pop_size: int, dim: int, bounds: Tuple[float, float],
                      max_generations: int, objective_func: Callable,
                      crossover_rate: float = 0.8,
                      mutation_rate: float = 0.1,
                      mutation_scale: float = 0.1,
                      elitism_rate: float = 0.1,
                      tournament_size: int = 3,
                      crossover_type: str = 'arithmetic',
                      mutation_type: str = 'gaussian'):
    # Inicjalizacja
    population, fitness, best_solution, best_fitness = initialize_population(
        pop_size, dim, bounds, objective_func
    )
    convergence_curve = [best_fitness]

    n_elite = max(1, int(pop_size * elitism_rate))

    # Wybór typu krzyżowania
    if crossover_type == 'arithmetic':
        crossover_func = arithmetic_crossover
    else:
        crossover_func = single_point_crossover

    # Wybór typu mutacji
    if mutation_type == 'gaussian':
        mutation_func = lambda ind: gaussian_mutation(ind, bounds, mutation_rate, mutation_scale)
    else:
        mutation_func = lambda ind: uniform_mutation(ind, bounds, mutation_rate)

    # Główna pętla
    for generation in range(max_generations):
        # Elityzm - zachowaj najlepsze osobniki
        elite_population, elite_fitness = elitism(population, fitness, n_elite)

        # Tworzenie nowej populacji
        new_population = []

        while len(new_population) < pop_size - n_elite:
            # Selekcja rodziców
            parent1 = tournament_selection(population, fitness, tournament_size)
            parent2 = tournament_selection(population, fitness, tournament_size)

            # Krzyżowanie
            if np.random.random() < crossover_rate:
                offspring1, offspring2 = crossover_func(parent1, parent2)
            else:
                offspring1, offspring2 = parent1.copy(), parent2.copy()

            # Mutacja
            offspring1 = mutation_func(offspring1)
            offspring2 = mutation_func(offspring2)

            new_population.append(offspring1)
            if len(new_population) < pop_size - n_elite:
                new_population.append(offspring2)

        # Połączenie elity z nową populacją
        new_population = np.array(new_population)
        population = np.vstack([elite_population, new_population])

        # Obliczenie fitness
        fitness = np.array([objective_func(individual) for individual in population])

        # Aktualizacja najlepszego rozwiązania
        current_best_idx = np.argmin(fitness)
        if fitness[current_best_idx] < best_fitness:
            best_solution = population[current_best_idx].copy()
            best_fitness = fitness[current_best_idx]

        convergence_curve.append(best_fitness)

    return best_solution, best_fitness, convergence_curve






def genetic_algorithm_position(pop_size: int, dim: int, bounds: Tuple[float, float],
                      max_generations: int, objective_func: Callable,
                      crossover_rate: float = 0.8,
                      mutation_rate: float = 0.1,
                      mutation_scale: float = 0.1,
                      elitism_rate: float = 0.1,
                      tournament_size: int = 3,
                      crossover_type: str = 'arithmetic',
                      mutation_type: str = 'gaussian',
                      save_every: int = 1):
    """
    Genetic Algorithm z logowaniem pozycji populacji (dla dim=2).
    """

    # Inicjalizacja
    population, fitness, best_solution, best_fitness = initialize_population(
        pop_size, dim, bounds, objective_func
    )
    convergence_curve = [best_fitness]

    # Log pozycji agentów
    positions_log = []
    if dim == 2:
        positions_log.append(population.copy())

    n_elite = max(1, int(pop_size * elitism_rate))

    # Wybór typu krzyżowania
    if crossover_type == 'arithmetic':
        crossover_func = arithmetic_crossover
    else:
        crossover_func = single_point_crossover

    # Wybór typu mutacji
    if mutation_type == 'gaussian':
        mutation_func = lambda ind: gaussian_mutation(ind, bounds, mutation_rate, mutation_scale)
    else:
        mutation_func = lambda ind: uniform_mutation(ind, bounds, mutation_rate)

    # Główna pętla
    for generation in range(max_generations):

        # Elityzm
        elite_population, elite_fitness = elitism(population, fitness, n_elite)

        # Tworzenie nowej populacji
        new_population = []

        while len(new_population) < pop_size - n_elite:
            parent1 = tournament_selection(population, fitness, tournament_size)
            parent2 = tournament_selection(population, fitness, tournament_size)

            # Krzyżowanie
            if np.random.random() < crossover_rate:
                offspring1, offspring2 = crossover_func(parent1, parent2)
            else:
                offspring1, offspring2 = parent1.copy(), parent2.copy()

            # Mutacja
            offspring1 = mutation_func(offspring1)
            offspring2 = mutation_func(offspring2)

            new_population.append(offspring1)
            if len(new_population) < pop_size - n_elite:
                new_population.append(offspring2)

        # Połączenie elity z nową populacją
        new_population = np.array(new_population)
        population = np.vstack([elite_population, new_population])

        # Obliczenie fitness
        fitness = np.array([objective_func(individual) for individual in population])

        # Aktualizacja najlepszego rozwiązania
        current_best_idx = np.argmin(fitness)
        if fitness[current_best_idx] < best_fitness:
            best_solution = population[current_best_idx].copy()
            best_fitness = fitness[current_best_idx]

        convergence_curve.append(best_fitness)

        # Logowanie pozycji co save_every generacji
        if dim == 2 and (generation + 1) % save_every == 0:
            positions_log.append(population.copy())

    return best_solution, best_fitness, convergence_curve, positions_log






