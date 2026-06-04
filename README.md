# Documentación Técnica - Sistema de Gestión de Reservas

## Descripción General

El sistema de gestión de reservas permite administrar espacios físicos y realizar reservas mediante una aplicación web desarrollada con React, FastAPI y PostgreSQL.

La solución implementa autenticación JWT, control de roles y despliegue mediante Docker.

---

# Arquitectura General

La aplicación sigue una arquitectura cliente-servidor de tres capas.

text
Frontend (React + Vite)
        │
        ▼
Backend (FastAPI)
        │
        ▼
PostgreSQL



# Tecnologías Utilizadas

## Frontend

* React
* Vite
* JavaScript
* CSS

## Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT (python-jose)
* Passlib
* Bcrypt

## Base de Datos

* PostgreSQL 16

## Infraestructura

* Docker
* Docker Compose

---

# Arquitectura Frontend

El frontend está desarrollado utilizando React y Vite.

Responsabilidades:

* Inicio de sesión.
* Gestión de usuarios.
* Gestión de espacios.
* Gestión de reservas.
* Consumo de la API REST.
* Manejo de sesión mediante JWT.

## Estructura

text
frontend/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── Dockerfile
├── package.json
├── package-lock.json
├── vite.config.js
└── eslint.config.js


--

# Arquitectura Backend

El backend fue desarrollado utilizando FastAPI.

Responsabilidades:

* Autenticación JWT.
* Gestión de usuarios.
* Gestión de espacios.
* Gestión de reservas.
* Validación de datos.
* Comunicación con PostgreSQL.

## Estructura

text
backend/
│
├── app/
│
│   ├── api/
│   │   ├── auth.py
│   │   ├── usuarios.py
│   │   ├── espacios.py
│   │   └── reservas.py
│   │
│   ├── auth/
│   │   ├── dependencies.py
│   │   ├── jwt_handler.py
│   │   └── security.py
│   │
│   ├── crud/
│   │
│   ├── models/
│   │   ├── usuario.py
│   │   ├── espacio.py
│   │   └── reserva.py
│   │
│   ├── schemas/
│   │   ├── usuario.py
│   │   ├── espacio.py
│   │   ├── espacio2.py
│   │   ├── reserva.py
│   │   └── estado_reserva.py
│   │
│   ├── db.py
│   └── main.py
│
├── .env
├── Dockerfile
└── requirements.txt


---

# Diseño de Base de Datos

## Tabla Usuarios

| Campo      | Tipo    |
| ---------- | ------- |
| id_usuario | Integer |
| nombre     | String  |
| correo     | String  |
| password   | String  |
| rol        | String  |

---

## Tabla Espacios

| Campo      | Tipo    |
| ---------- | ------- |
| id_espacio | Integer |
| nombre     | String  |
| ubicacion  | String  |
| capacidad  | Integer |
| estado     | String  |

---

## Tabla Reservas

| Campo               | Tipo    |
| ------------------- | ------- |
| id_reserva          | Integer |
| id_usuario          | Integer |
| id_espacio          | Integer |
| fecha               | Date    |
| hora_inicio         | Time    |
| hora_fin            | Time    |
| cantidad_asistentes | Integer |
| estado              | String  |

---

# Modelo Entidad Relación

text
Usuario
   │
   │ 1
   │
   ▼
Reserva
   ▲
   │ N
   │
Espacio


Relaciones:

* Un usuario puede tener múltiples reservas.
* Un espacio puede tener múltiples reservas.
* Una reserva pertenece a un usuario.
* Una reserva pertenece a un espacio.

---

# Endpoints Desarrollados

## Autenticación

### Login

http
POST /login


Permite autenticar usuarios y obtener un JWT.

--

## Usuarios

http
GET /usuarios
POST /usuarios
PUT /usuarios/{id}
DELETE /usuarios/{id}


---

## Espacios

http
GET /espacios
POST /espacios
PUT /espacios/{id}
DELETE /espacios/{id}


---

## Reservas

http
GET /reservas
POST /reservas
DELETE /reservas/{id}


---

# Sistema de Autenticación JWT

El sistema utiliza JSON Web Tokens (JWT).

Proceso:

1. Usuario inicia sesión.
2. Backend valida credenciales.
3. Se genera un token JWT.
4. El token se almacena en LocalStorage.
5. El frontend envía el token en cada solicitud protegida.

Cabecera utilizada:
http
Authorization: Bearer <token>


---

# Roles Implementados

## Administrador

Permisos:

* Gestionar usuarios.
* Gestionar espacios.
* Gestionar reservas.

## Usuario

Permisos:

* Consultar espacios.
* Crear reservas.
* Consultar reservas.

---

# Reglas de Negocio

## Usuarios

* El correo debe ser único.
* La contraseña se almacena cifrada con bcrypt.

## Espacios

* Todo espacio debe tener nombre.
* Debe tener ubicación.
* Debe tener capacidad definida.
* Debe tener un estado asociado.

## Reservas

* Deben estar asociadas a un usuario.
* Deben estar asociadas a un espacio.
* Deben tener fecha y horario.
* Deben registrar cantidad de asistentes.
* El estado inicial es "esperando".

---

# Ejecución en Desarrollo

## Backend

bash
cd backend

python -m venv .venv

pip install -r requirements.txt

uvicorn app.main:app --reload


---

## Frontend

bash
cd frontend

npm install

npm run dev


---

## Base de Datos

bash
docker compose up db


