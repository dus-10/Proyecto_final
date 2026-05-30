from pydantic import BaseModel, EmailStr


class UsuarioCreate(BaseModel):
    nombre: str
    correo: EmailStr
    password: str
    rol: str


class UsuarioResponse(BaseModel):
    id_usuario: int
    nombre: str
    correo: EmailStr
    rol: str

    class Config:
        from_attributes = True