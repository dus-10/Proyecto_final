from pydantic import BaseModel


class EstadoReservaUpdate(BaseModel):
    estado: str