function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isInvalidJson = error instanceof SyntaxError && error.status === 400;
  const statusCode = isInvalidJson ? 400 : error.statusCode || 500;
  const message = isInvalidJson
    ? "El cuerpo de la solicitud contiene JSON inválido"
    : error.message || "Error interno del servidor";

  return res.status(statusCode).json({
    error: message,
  });
}

module.exports = errorHandler;
