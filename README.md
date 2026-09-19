# Semana 05 Desarrollo de Aplicaciones Web Avanzado

Laboratorio 05 sobre la creación de una API RESTful con Express. El proyecto permite registrar, asignar, actualizar y eliminar tickets, además de guardar sus notificaciones en un archivo JSON.

Repositorio: [JasonGomezzz api-restful](https://github.com/JasonGomezzz/api-restful-)

## Requisitos

- Node.js 18 o superior.
- npm.
- Postman.

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

La API estará disponible en `http://localhost:3000`.

Las credenciales del correo se leen desde `.env`. Este archivo está excluido del repositorio y `.env.example` contiene los nombres de las variables necesarias.

## Estructura del proyecto

```text
api-restful/
├── controllers/
├── database/
│   └── db.json
├── docs/
│   └── postman/
├── errors/
├── middlewares/
├── repositories/
├── routes/
├── scripts/
├── services/
│   └── email/
├── tests/
├── .env.example
├── app.js
└── package.json
```

## Endpoints

- `GET /`: comprueba que la API está disponible.
- `POST /tickets`: crea un ticket.
- `GET /tickets?page=1&limit=5`: lista los tickets con paginación.
- `PUT /tickets/:id/assign`: asigna un usuario al ticket.
- `PUT /tickets/:id/status`: cambia el estado del ticket.
- `DELETE /tickets/:id`: elimina un ticket.
- `GET /tickets/:id/notifications`: muestra las notificaciones de un ticket.
- `GET /notifications`: lista todas las notificaciones.
- `GET /notifications/email/status`: comprueba la conexión del servicio de correo.

## Laboratorio y tarea

El laboratorio base implementa la configuración de Express, la persistencia en `db.json` y las capas de repositorios, servicios, controladores y rutas.

La tarea agrega el middleware global de errores, la paginación de tickets y la consulta del historial de notificaciones por ticket. También se implementó el envío de correos con Nodemailer.

## Pruebas automatizadas

```bash
npm test
```

Las pruebas utilizan una base temporal para no modificar `database/db.json`.

## Conclusiones

1. Los scripts `start` y `dev` deben declararse en `package.json`; instalar Nodemon no los crea automáticamente.
2. Separar repositorios, servicios, controladores y rutas facilita la organización de la API.
3. El middleware global permite responder de forma uniforme cuando ocurre un error.
4. La paginación evita devolver todos los tickets en una sola respuesta.
5. Las variables de entorno permiten usar el servicio de correo sin publicar credenciales en GitHub.
