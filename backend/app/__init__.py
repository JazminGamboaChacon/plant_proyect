import logging
import sys
import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .firebase import get_firestore_client
from .routes import router

_handler = logging.StreamHandler(sys.stderr)
_handler.setLevel(logging.DEBUG)
_handler.setFormatter(
    logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
)

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(_handler)
logger.propagate = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        get_firestore_client()
        logger.info("Firebase connection OK")
    except Exception as e:
        logger.error(f"Firebase connection FAILED: {e}")
        print(f"STARTUP ERROR: Firebase connection FAILED: {e}", file=sys.stderr, flush=True)
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Plant Project API",
        version="1.0.0",
        description="API en FastAPI sobre Firebase Firestore para la app de plantas.",
        lifespan=lifespan,
        debug=True,
    )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        tb = traceback.format_exc()
        logger.error(f"Error en {request.method} {request.url}:")
        logger.error(tb)
        print(
            f"UNHANDLED EXCEPTION on {request.method} {request.url}:\n{tb}",
            file=sys.stderr,
            flush=True,
        )
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router)
    return app
