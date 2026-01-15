from core.Algorithms.ABC import artificial_bee_colony
from core.Algorithms.bat import bat_algorithm
from core.Algorithms.GA import genetic_algorithm
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


async def run_abc(fn, n_bees):
    best_solution, best_value, convergence, positions_log = artificial_bee_colony(
        n_bees=n_bees,
        dim=10,
        bounds=(-5.12, 5.12),
        max_iter=100,
        objective_func = fn
    )
    return best_solution, best_value, convergence, positions_log

async def run_bat(fn, n_bats):
    best_solution, best_value, convergence, positions_log = bat_algorithm(
        fn, n_bats, bounds=(-5.12, 5.12), alpha=0.9, gamma=0.9, f_bounds=(0, 2), max_iter=100, dims=10
    )
    return best_solution, best_value, convergence, positions_log

async def run_ga(fn, n):
    best_solution, best_value, convergence, positions_log = genetic_algorithm(
        pop_size=n,
        dim=10,
        bounds=(-5.12, 5.12),
        max_generations=100,
        objective_func=fn,
        crossover_rate=0.8,
        mutation_rate=0.1,
        mutation_scale=0.1
    )
    return best_solution, best_value, convergence, positions_log