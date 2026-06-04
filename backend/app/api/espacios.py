from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.espacio import Espacio
from app.schemas.espacio import EspacioCreate, EspacioResponse, EspacioUpdate
from app.auth.dependencies import get_current_user, get_admin_user

router = APIRouter(
    prefix="/espacios",
    tags=["Espacios"]
)


@router.post("/", response_model=EspacioResponse)
def crear_espacio(
    espacio: EspacioCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):
    nuevo_espacio = Espacio(
        nombre=espacio.nombre,
        ubicacion=espacio.ubicacion,
        capacidad=espacio.capacidad,
        estado=espacio.estado.lower().strip()
    )
    db.add(nuevo_espacio)
    db.commit()
    db.refresh(nuevo_espacio)
    return nuevo_espacio


@router.get("/", response_model=list[EspacioResponse])
def listar_espacios(
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):
    return db.query(Espacio).all()


# ── NUEVO: Editar espacio ──
@router.put("/{id_espacio}", response_model=EspacioResponse)
def editar_espacio(
    id_espacio: int,
    datos: EspacioUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):
    espacio = db.query(Espacio).filter(
        Espacio.id_espacio == id_espacio
    ).first()

    if not espacio:
        raise HTTPException(status_code=404, detail="Espacio no encontrado")

    if datos.nombre is not None:
        espacio.nombre = datos.nombre
    if datos.ubicacion is not None:
        espacio.ubicacion = datos.ubicacion
    if datos.capacidad is not None:
        espacio.capacidad = datos.capacidad
    if datos.estado is not None:
        espacio.estado = datos.estado.lower().strip()

    db.commit()
    db.refresh(espacio)
    return espacio


@router.delete("/{id_espacio}")
def eliminar_espacio(
    id_espacio: int,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):
    espacio = db.query(Espacio).filter(
        Espacio.id_espacio == id_espacio
    ).first()

    if not espacio:
        raise HTTPException(status_code=404, detail="Espacio no encontrado")

    db.delete(espacio)
    db.commit()
    return {"mensaje": "Espacio eliminado correctamente"}
