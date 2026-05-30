from pydantic import BaseModel


class EspacioCreate(BaseModel):
    nombre: str
    ubicacion: str
    capacidad: int
    estado: str


class EspacioResponse(BaseModel):
    id_espacio: int
    nombre: str
    ubicacion: str
    capacidad: int
    estado: str

    class Config:
        from_attributes = True