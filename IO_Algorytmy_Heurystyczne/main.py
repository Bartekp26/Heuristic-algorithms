from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from settings import settings
from routers.views import router as view_router

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    version=settings.version
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(view_router)
