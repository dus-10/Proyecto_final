from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from app.db import Base


class Reserva(Base):
    __tablename__ = "reservas"

    id_reserva = Column(Integer, primary_key=True, index=True)

    id_usuario = Column(
        Integer,
        ForeignKey("usuarios.id_usuario")
    )

    id_espacio = Column(
        Integer,
        ForeignKey("espacios.id_espacio")
    )

    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)

    cantidad_asistentes = Column(Integer, nullable=False)

    estado = Column(String, default="esperando")