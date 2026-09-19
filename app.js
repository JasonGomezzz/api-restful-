const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./errors/AppError");

// Middleware
app.use(express.json()); // Para leer JSON en las solicitudes
app.use(cors()); // Permitir solicitudes de otros dominios
app.use(morgan("dev")); // detalles de cada petición

// Mensaje de prueba en la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);

app.use((req, res, next) => {
  next(new AppError("Ruta no encontrada", 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
