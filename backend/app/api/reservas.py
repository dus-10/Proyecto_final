from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from sqlalchemy import and_
from app.db import get_db
from app.models.reserva import Reserva
from app.models.espacio import Espacio
from app.schemas.estado_reserva import EstadoReservaUpdate
from app.auth.dependencies import get_admin_user
from app.schemas.reserva import (
    ReservaCreate,
    ReservaResponse
)
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/reservas",
    tags=["Reservas"]
)


@router.post(
    "/",
    response_model=ReservaResponse
)
def crear_reserva(
    reserva: ReservaCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):



    if reserva.hora_inicio >= reserva.hora_fin:
        raise HTTPException(
            status_code=400,
            detail="La hora de inicio debe ser menor que la hora final"
        )

    espacio = db.query(Espacio).filter(
    Espacio.id_espacio == reserva.id_espacio
    ).first()

    if not espacio:
        raise HTTPException(
            status_code=404,
         detail="Espacio no encontrado"
        )

    if espacio.estado.lower() != "activo":
        raise HTTPException(
            status_code=400,
            detail="El espacio no está disponible para reservas"
        )

    if reserva.cantidad_asistentes > espacio.capacidad:
        raise HTTPException(
            status_code=400,
            detail="La cantidad de asistentes supera la capacidad del espacio"
        )

    fecha_reserva = datetime.combine(
    reserva.fecha,
    reserva.hora_inicio
)

    if fecha_reserva < datetime.now() + timedelta(hours=24):
        raise HTTPException(
            status_code=400,
            detail="La reserva debe realizarse con al menos 24 horas de anticipación"
        )

    dia_semana = reserva.fecha.weekday()

    if dia_semana == 6:
        raise HTTPException(
            status_code=400,
            detail="No se permiten reservas los domingos"
        )

    if dia_semana <= 4:
        if (
            reserva.hora_inicio.hour < 7 or
            reserva.hora_fin.hour > 20
        ):
            raise HTTPException(
                status_code=400,
                detail="Horario permitido: 07:00 a 20:00"
            )

    if dia_semana == 5:
        if (
            reserva.hora_inicio.hour < 8 or
            reserva.hora_fin.hour > 12
        ):
            raise HTTPException(
                status_code=400,
                detail="Horario permitido los sábados: 08:00 a 12:00"
            )

    conflicto = db.query(Reserva).filter(
        Reserva.id_espacio == reserva.id_espacio,
        Reserva.fecha == reserva.fecha,
        Reserva.estado.in_(["esperando", "aprobada"]),
        Reserva.hora_inicio < reserva.hora_fin,
        Reserva.hora_fin > reserva.hora_inicio
).first()

    if conflicto:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una reserva para este espacio en ese horario"
        )

    nueva_reserva = Reserva(
        id_usuario=usuario.id_usuario,
        id_espacio=reserva.id_espacio,
        fecha=reserva.fecha,
        hora_inicio=reserva.hora_inicio,
        hora_fin=reserva.hora_fin,
        cantidad_asistentes=reserva.cantidad_asistentes,
        estado="esperando"
    )

    db.add(nueva_reserva)
    db.commit()
    db.refresh(nueva_reserva)

    return nueva_reserva

@router.patch("/{id_reserva}/estado")
def actualizar_estado_reserva(
    id_reserva: int,
    datos: EstadoReservaUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    reserva = db.query(Reserva).filter(
        Reserva.id_reserva == id_reserva
    ).first()

    if not reserva:
        raise HTTPException(
            status_code=404,
            detail="Reserva no encontrada"
        )

    if datos.estado not in [
        "aprobada",
        "rechazada"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Estado inválido"
        )

    reserva.estado = datos.estado

    db.commit()
    db.refresh(reserva)

    return {
        "mensaje": f"Reserva {datos.estado} correctamente"
    }

@router.get("/mis-reservas")
def mis_reservas(
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):

    reservas = db.query(Reserva).filter(
        Reserva.id_usuario == usuario.id_usuario
    ).all()

    return reservas

@router.get("/")
def obtener_todas_las_reservas(
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    reservas = db.query(Reserva).all()

    return reservas

@router.delete("/{id_reserva}")
def cancelar_reserva(
    id_reserva: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):

    reserva = db.query(Reserva).filter(
        Reserva.id_reserva == id_reserva
    ).first()

    if not reserva:
        raise HTTPException(
            status_code=404,
            detail="Reserva no encontrada"
        )

    if (
        reserva.id_usuario != usuario.id_usuario
        and usuario.rol != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="No tiene permisos para cancelar esta reserva"
        )

    reserva.estado = "cancelada"

    db.commit()

    return {
        "mensaje": "Reserva cancelada correctamente"
    }