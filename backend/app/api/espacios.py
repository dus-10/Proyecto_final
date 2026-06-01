from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.espacio import Espacio
from app.schemas.espacio import (
    EspacioCreate,
    EspacioResponse
)
from app.auth.dependencies import (
    get_current_user,
    get_admin_user
)

router = APIRouter(
    prefix="/espacios",
    tags=["Espacios"]
)


@router.post(
    "/",
    response_model=EspacioResponse
)
def crear_espacio(
    espacio: EspacioCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    nuevo_espacio = Espacio(
        nombre=espacio.nombre,
        ubicacion=espacio.ubicacion,
        capacidad=espacio.capacidad,
        estado=espacio.estado
    )

    db.add(nuevo_espacio)
    db.commit()
    db.refresh(nuevo_espacio)

    return nuevo_espacio


@router.get(
    "/",
    response_model=list[EspacioResponse]
)
def listar_espacios(
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):
    return db.query(Espacio).all()