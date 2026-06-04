# Sistema de Gestión de Reservas de Espacios

## Descripción General

Sistema web desarrollado para la gestión y administración de reservas de espacios institucionales. Permite a los usuarios consultar espacios disponibles, realizar reservas y administrar información de manera segura mediante autenticación basada en JWT.

## Objetivo

Facilitar la administración de espacios mediante una plataforma centralizada que permita gestionar reservas, evitar conflictos de horarios y controlar el acceso según los roles de usuario.

---

## Integrantes del Equipo

| Integrante          | Rol                     |
| ------------------- | ----------------------- |
| David Usuga         | Backend                 |
| Yesid Ardila        | Frontend                |
| Yesid y David       | DevOps                  |
| Yesid y David       | Documentación y Pruebas |

---

## Problema que Resuelve

Antes de la implementación del sistema, la gestión de reservas se realizaba manualmente, generando problemas como:

* Duplicidad de reservas.
* Dificultad para consultar disponibilidad.
* Falta de control de usuarios.
* Pérdida de información.

La aplicación centraliza toda la gestión de reservas y mejora el control de los espacios disponibles.

---

## Funcionalidades Principales

### Usuarios

* Inicio de sesión seguro.
* Gestión de permisos por rol.
* Cierre de sesión.

### Espacios

* Crear espacios.
* Consultar espacios.
* Actualizar espacios.
* Eliminar espacios.

### Reservas

* Crear reservas.
* Consultar reservas.
* Cancelar reservas.
* Validar disponibilidad.

### Administración

* Gestión de usuarios.
* Control de roles.
* Acceso restringido para administradores.

---

## Arquitectura General

Frontend → React + Vite

Backend → FastAPI

Base de Datos → PostgreSQL

Contenedores → Docker

Orquestación → Docker Compose

Autenticación → JWT

---

## Tecnologías Utilizadas

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT
* Passlib

### Base de Datos

* PostgreSQL

### Infraestructura

* Docker
* Docker Compose
* Linux / WSL

---

## Despliegue

La aplicación se ejecuta mediante Docker Compose utilizando tres servicios:

* Frontend
* Backend
* PostgreSQL

Puertos utilizados:

* Frontend: 5173
* Backend: 8000
* PostgreSQL: 5432

La documentación detallada del despliegue se encuentra en la rama `ops`.

---

# Tutorial de Uso

## 1. Inicio de Sesión

<img width="710" height="590" alt="image" src="https://github.com/user-attachments/assets/e600f357-1ef4-450b-8d20-5d84b125627a" />

1. Ingresar correo electrónico.
2. Ingresar contraseña.
3. Presionar "Iniciar Sesión".

---

## 2. Gestión de Espacios

* Consultar espacios registrados.
<img width="1082" height="414" alt="image" src="https://github.com/user-attachments/assets/60a3f4c5-c16a-46a8-ad8e-7dcf25028fe0" />


* Crear nuevos espacios.
<img width="1365" height="600" alt="image" src="https://github.com/user-attachments/assets/3550c6e0-3e5b-4f87-85b1-ab464af1cdda" />


* Editar información
<img width="679" height="456" alt="image" src="https://github.com/user-attachments/assets/eff166ed-fc1d-4b42-b7f0-067ee83817d0" />

* Eliminar espacios.
<img width="1037" height="455" alt="image" src="https://github.com/user-attachments/assets/515858fb-650f-4143-b579-28bcada42954" />
<img width="1083" height="391" alt="image" src="https://github.com/user-attachments/assets/8b882148-b464-462d-98bd-08221280ff51" />

---

## 3. Gestión de Reservas

* Seleccionar espacio.
<img width="613" height="447" alt="image" src="https://github.com/user-attachments/assets/5a95c5aa-b219-4e16-87d4-3f125478bea7" />

  
* Elegir fecha y hora.
<img width="478" height="451" alt="image" src="https://github.com/user-attachments/assets/7c5211c2-4a03-47f3-a019-1a7c8a8e3429" />


* Confirmar reserva.
<img width="598" height="525" alt="image" src="https://github.com/user-attachments/assets/560d1dbc-ff89-4404-b5d1-fd62cfb0bf36" />

---

## 4. Cancelación de Reservas

[INSERTAR IMAGEN CANCELAR]

* Seleccionar reserva.
<img width="1085" height="515" alt="image" src="https://github.com/user-attachments/assets/c11fead8-44d0-4b92-8838-e6af554b2906" />
  
* Presionar cancelar.
<img width="1029" height="128" alt="image" src="https://github.com/user-attachments/assets/9f69f178-4948-4f5f-8381-7d66d7e3516c" />


* Confirmar operación.
 <img width="1047" height="59" alt="image" src="https://github.com/user-attachments/assets/27e6d4d5-5f65-4456-859c-8f2fa05fec34" />


---

## 5. Gestión de Usuarios

<img width="1322" height="566" alt="image" src="https://github.com/user-attachments/assets/7e777d12-89df-483d-a56d-dd11813ebbd2" />


Disponible únicamente para administradores.

---

## 6. Mensajes de Error

*Credenciales invalidas

<img width="558" height="565" alt="image" src="https://github.com/user-attachments/assets/2fb3329f-d16d-47b7-8f08-787d3c62db4f" />

*Espacio no disponible
<img width="868" height="490" alt="image" src="https://github.com/user-attachments/assets/2ca5c8cb-9ff5-4564-baae-5e4fb5f9b7b2" />

*Horarios errados
<img width="442" height="393" alt="image" src="https://github.com/user-attachments/assets/ad1f9688-e082-4abe-a5f1-ec1313cc10fd" />


---

## 7. Cierre de Sesión

<img width="540" height="590" alt="image" src="https://github.com/user-attachments/assets/a899a234-58b4-4516-ba8d-ee62aa2a6637" />

*Presionar el botón "Cerrar Sesión".
<img width="726" height="561" alt="image" src="https://github.com/user-attachments/assets/c0a35d66-f64c-4766-be7c-0b86980e9fce" />




---

# Conclusiones

* Se implementó exitosamente una solución completa para la gestión de reservas.
* La arquitectura desacoplada facilita el mantenimiento.
* Docker simplifica el despliegue y la portabilidad.

# Dificultades Encontradas

* Configuración inicial de Docker.
* Integración Frontend-Backend.
* Manejo de autenticación JWT.
* Compatibilidad entre librerías de cifrado.

# Aprendizajes

* Desarrollo de APIs REST con FastAPI.
* Gestión de bases de datos con PostgreSQL.
* Contenerización mediante Docker.
* Control de acceso basado en roles.

# Mejoras Futuras

* Recuperación de contraseña.
* Notificaciones por correo.
* Calendario visual de reservas.
* Historial de actividad.
* Reportes administrativos.
