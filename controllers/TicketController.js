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

exports.list = (req, res) => {
  res.status(200).json(service.list());
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
