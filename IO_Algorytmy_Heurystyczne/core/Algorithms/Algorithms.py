from core.Algorithms.ABC import artificial_bee_colony, artificial_bee_colony_positions
from core.Algorithms.bat import bat_algorithm, bat_algorithm_positions
from core.Algorithms.GA import genetic_algorithm, genetic_algorithm_positions
from core.Parallel_ABC.objective_functions import (
    sphere_function,
    rastrigin_function,
    rosenbrock_function,
    heavy_monte_carlo,
    griewank_function,
    zakharov_function
)

def get_objective_function(func_name: str):
    func_name = func_name.lower().strip()
    
    functions = {
        "sphere": sphere_function,
        "rastrigin": rastrigin_function,
        "rosenbrock": rosenbrock_function,
        "heavy_monte_carlo": heavy_monte_carlo,
        "griewank": griewank_function,
        "zakharov": zakharov_function,
    }
    
    if func_name not in functions:
        raise ValueError(f"Unknown function: {func_name}. Available: {list(functions.keys())}")
    
    return functions[func_name]


async def run_abc(fn, n_bees, dimensions=10):
    best_solution, best_value, convergence = artificial_bee_colony(
        n_bees=n_bees,
        dim=dimensions,
        bounds=(-5.12, 5.12),
        max_iter=100,
        objective_func=get_objective_function(fn),
    )
    return best_solution, best_value, convergence

async def run_bat(fn, n_bats, dimensions=10):
    best_solution, best_value, convergence = bat_algorithm(
        fn=get_objective_function(fn),
        n_bats=n_bats,
        bounds=(-5.12, 5.12),
        alpha=0.9,
        gamma=0.9,
        f_bounds=(0, 2),
        max_iter=100,
        dims=dimensions
    )
    return best_solution, best_value, convergence

async def run_ga(fn, n, dimensions=10):
    best_solution, best_value, convergence = genetic_algorithm(
        pop_size=n,
        dim=dimensions,
        bounds=(-5.12, 5.12),
        max_generations=100,
        objective_func=get_objective_function(fn),
        crossover_rate=0.8,
        mutation_rate=0.1,
        mutation_scale=0.1,
    )
    return best_solution, best_value, convergence


async def run_positions(algorithm_name: str, fn: str, n_agents: int):

    bounds = (-5.12, 5.12)
    max_iter = 60

    if algorithm_name == "abc":
        return artificial_bee_colony_positions(
            n_bees=n_agents,
            dim=2,
            bounds=bounds,
            max_iter=max_iter,
            objective_func=get_objective_function(fn),
        )

    if algorithm_name == "bat":
        return bat_algorithm_positions(
            fn=get_objective_function(fn),
            n_bats=n_agents,
            bounds=bounds,
            alpha=0.9,
            gamma=0.9,
            f_bounds=(0, 2),
            max_iter=max_iter,
            dims=2,
        )

    if algorithm_name == "ga":
        return genetic_algorithm_positions(
            pop_size=n_agents,
            dim=2,
            bounds=bounds,
            max_generations=max_iter,
            objective_func=get_objective_function(fn),
        )

    raise ValueError(f"Unknown algorithm for positions: {algorithm_name}")