from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.auth.security import hash_password
from app.db import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioResponse
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


@router.post("/", response_model=UsuarioResponse)
def crear_usuario(
    usuario: UsuarioCreate,
    db: Session = Depends(get_db)
):
    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        correo=usuario.correo,
        password=hash_password(usuario.password),
        rol=usuario.rol
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario


@router.get("/", response_model=list[UsuarioResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Usuario).all()