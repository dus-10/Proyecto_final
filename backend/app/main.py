from fastapi import FastAPI
from app.api.usuarios import router as usuarios_router
from app.api.espacios import router as espacios_router
from app.api.reservas import router as reservas_router
from app.db import Base, engine
from app.api.auth import router as auth_router
from app.models.usuario import Usuario
from app.models.espacio import Espacio
from app.models.reserva import Reserva
from fastapi.middleware.cors import CORSMiddleware





Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Reservas",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios_router)
app.include_router(espacios_router)
app.include_router(reservas_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "mensaje": "API funcionando correctamente"
    }


