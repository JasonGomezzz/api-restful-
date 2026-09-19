const TicketService = require("../services/TicketService");

const service = new TicketService();

exports.create = (req, res) => {
  const ticket = service.createTicket(req.body);
  res.status(201).json(ticket);
};

exports.list = (req, res) => {
  res.status(200).json(service.list());
};

exports.assign = (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const ticket = service.assignTicket(id, user);

  if (!ticket) {
    return res.status(404).json({ error: "Ticket no encontrado" });
  }

  return res.status(200).json(ticket);
};

exports.changeStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ticket = service.changeStatus(id, status);

  if (!ticket) {
    return res.status(404).json({ error: "Ticket no encontrado" });
  }

  return res.status(200).json(ticket);
};

exports.delete = (req, res) => {
  try {
    service.deleteTicket(req.params.id);
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
