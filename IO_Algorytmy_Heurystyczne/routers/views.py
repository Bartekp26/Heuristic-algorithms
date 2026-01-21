from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from core.Algorithms.Algorithms import run_abc, run_bat, run_ga, get_objective_function, run_positions


templates = Jinja2Templates(directory="templates")

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
async def spa_home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.get("/GetAlgorithmsData/{func_name}/{n}/{dimensions}")
async def get_algorithms_data(func_name: str, n: int, dimensions: int):
    try:
        abc_solution, abc_value, abc_convergence = await run_abc(func_name, n, dimensions)
        bat_solution, bat_value, bat_convergence = await run_bat(func_name, n, dimensions)
        ga_solution, ga_value, ga_convergence = await run_ga(func_name, n, dimensions)

        return {
            "algorithms": [
                {
                    "name": "Artificial Bee Colony",
                    "best_solution": abc_solution.tolist() if hasattr(abc_solution, 'tolist') else abc_solution,
                    "best_value": float(abc_value),
                    "convergence": abc_convergence
                },
                {
                    "name": "Bat Algorithm",
                    "best_solution": bat_solution.tolist() if hasattr(bat_solution, 'tolist') else bat_solution,
                    "best_value": float(bat_value),
                    "convergence": bat_convergence
                },
                {
                    "name": "Genetic Algorithm",
                    "best_solution": ga_solution.tolist() if hasattr(ga_solution, 'tolist') else ga_solution,
                    "best_value": float(ga_value),
                    "convergence": ga_convergence,
                }
            ]
        }
    except Exception as e:
        return {"error": str(e)}


@router.get("/simulate_positions/{algorithm}/{function}/{n_agents}")
async def simulate_positions(algorithm: str, function: str, n_agents: int):
    try:
        if not algorithm or not function:
            return {"error": "Brak funkcji lub algorytmu"}
        positions = await run_positions(algorithm, function, n_agents)
        serial_positions = []
        for frame in positions:
            try:
                serial_positions.append(frame.tolist())
            except Exception:
                serial_positions.append(frame)

        return {"positions": serial_positions, "steps": len(serial_positions)}
    except Exception as e:
        return {"error": str(e)}