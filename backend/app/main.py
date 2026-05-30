from fastapi import FastAPI
from app.api.usuarios import router as usuarios_router
from app.db import Base, engine

from app.models.usuario import Usuario
from app.models.espacio import Espacio
from app.models.reserva import Reserva

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Reservas",
    version="1.0"
)
app.include_router(usuarios_router)

@app.get("/")
def root():
    return {
        "mensaje": "API funcionando correctamente"
    }