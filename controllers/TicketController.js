const TicketService = require("../services/TicketService");
const AppError = require("../errors/AppError");

const service = new TicketService();

exports.create = (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
      throw new AppError("Los campos title y description son obligatorios", 400);
    }

    const ticket = service.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.list = (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 5);

    if (!Number.isInteger(page) || page < 1) {
      throw new AppError("El parámetro page debe ser un entero mayor que cero", 400);
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new AppError("El parámetro limit debe ser un entero entre 1 y 100", 400);
    }

    res.status(200).json(service.list(page, limit));
  } catch (error) {
    next(error);
  }
};

exports.listNotifications = (req, res, next) => {
  try {
    const notifications = service.getNotifications(req.params.id);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.assign = (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.body;

    if (!user?.trim()) {
      throw new AppError("El campo user es obligatorio", 400);
    }

    const ticket = service.assignTicket(id, user);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status?.trim()) {
      throw new AppError("El campo status es obligatorio", 400);
    }

    const ticket = service.changeStatus(id, status);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.delete = (req, res, next) => {
  try {
    service.deleteTicket(req.params.id);
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
