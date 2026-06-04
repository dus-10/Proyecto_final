# Documentación Técnica

## Arquitectura General

La aplicación sigue una arquitectura cliente-servidor.

Frontend (React)
↓
API REST (FastAPI)
↓
PostgreSQL

---

## Arquitectura Frontend

Tecnologías:

* React
* Vite
* JavaScript
* CSS

Responsabilidades:

* Interfaz de usuario.
* Consumo de API REST.
* Gestión de autenticación.
* Navegación entre módulos.

Módulos principales:

* Login
* Dashboard
* Usuarios
* Espacios
* Reservas

---

## Arquitectura Backend

Tecnologías:

* FastAPI
* SQLAlchemy
* Pydantic
* JWT
* Passlib

Responsabilidades:

* Lógica de negocio.
* Validaciones.
* Seguridad.
* Acceso a datos.

---

## Modelo Entidad Relación

### Usuario

* id
* nombre
* email
* password
* rol

### Espacio

* id
* nombre
* capacidad
* descripcion

### Reserva

* id
* usuario_id
* espacio_id
* fecha
* estado

Relaciones:

* Un usuario puede tener muchas reservas.
* Un espacio puede tener muchas reservas.
* Una reserva pertenece a un usuario y un espacio.

---

## Estructura de Carpetas

backend/

* app/

  * auth/
  * models/
  * routes/
  * schemas/
  * services/
  * database.py
  * main.py

frontend/

* src/

  * pages/
  * components/
  * services/
  * App.jsx

---

## Endpoints

### Autenticación

POST /login

### Usuarios

GET /usuarios

POST /usuarios

PUT /usuarios/{id}

DELETE /usuarios/{id}

### Espacios

GET /espacios

POST /espacios

PUT /espacios/{id}

DELETE /espacios/{id}

### Reservas

GET /reservas

POST /reservas

DELETE /reservas/{id}

---

## JWT y Roles

La autenticación se realiza mediante JSON Web Tokens.

Roles:

### admin

Puede:

* Gestionar usuarios.
* Gestionar espacios.
* Gestionar reservas.

### usuario

Puede:

* Consultar espacios.
* Crear reservas.
* Cancelar sus reservas.

---

## Reglas de Negocio

* No se permiten reservas duplicadas para el mismo espacio y horario.
* Solo usuarios autenticados pueden acceder al sistema.
* Los administradores tienen acceso total.
* Los usuarios tienen acceso limitado según permisos.

---

## Ejecución en Desarrollo

Backend:

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
# o Scripts\activate en Windows

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend

npm install

npm run dev
```

Base de datos:

```bash
docker compose up db
```
