# Documentación de Despliegue

## Descripción

La aplicación se despliega mediante Docker Compose utilizando tres contenedores:

* PostgreSQL
* FastAPI
* React/Vite

---

# Requisitos Previos

## Software Requerido

* Docker Desktop
* Docker Compose
* Git

## Opcional

* WSL 2 para Windows

Verificación:

bash
docker --version

docker compose version


---

# Clonación del Repositorio

bash
git clone URL_DEL_REPOSITORIO

cd Proyecto_final


---

# Variables de Entorno

Archivo:

text
backend/.env


Ejemplo:

env
DB_USER=postgres
DB_PASSWORD=061024
DB_HOST=db
DB_PORT=5432
DB_NAME=reservas_db

SECRET_KEY=secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60


---

# Dockerfile Backend

dockerfile
FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


---

# Dockerfile Frontend

dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]


---

# Docker Compose

La solución se compone de tres servicios:

## PostgreSQL

* Imagen: postgres:16
* Puerto: 5432

## Backend

* FastAPI
* Puerto: 8000

## Frontend

* React/Vite
* Puerto: 5173

---

# Redes

yaml
networks:
  reservas_network:


Permite la comunicación entre frontend, backend y base de datos.

---

# Persistencia

yaml
volumes:
  postgres_data:


Los datos permanecen almacenados aunque el contenedor sea reiniciado.

---

# Puertos Utilizados

| Servicio   | Puerto |
| ---------- | ------ |
| Frontend   | 5173   |
| Backend    | 8000   |
| PostgreSQL | 5432   |

---

# Construcción de Contenedores

bash
docker compose build


---

# Ejecución

bash
docker compose up -d


---

# Verificación

Ver contenedores:

bash
docker ps


Ver logs:

bash
docker compose logs -f


---

# Acceso al Sistema

Frontend:

text
http://localhost:5173


Backend:

text
http://localhost:8000


Swagger:

text
http://localhost:8000/docs


---

# Reinicio

bash
docker compose restart


---

# Apagado

bash
docker compose down


---

# Actualización

bash
git pull

docker compose build

docker compose up -d


---

# Solución de Problemas

## Puerto ocupado

bash
netstat -ano | findstr :8000


---

## Error de conexión a PostgreSQL

Verificar:

* Variables de entorno.
* Estado del contenedor db.
* Credenciales de acceso.

---

## Error JWT

Verificar:

* SECRET_KEY.
* Token expirado.
* Cabecera Authorization.

---

## Error bcrypt/passlib

Versión compatible utilizada:

txt
bcrypt==4.0.1
passlib==1.7.4


Reconstruir:

bash
docker compose down

docker compose build --no-cache

docker compose up -d


---

# Comandos Útiles

Ver contenedores:

bash
docker ps


Ingresar al backend:

bash
docker exec -it reservas_backend sh


Ingresar a PostgreSQL:

bash
docker exec -it reservas_db psql -U postgres -d reservas_db


Eliminar contenedores y volúmenes:

bash
docker compose down -v

