const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");
const AppError = require("../errors/AppError");

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  createTicket(data) {
    const ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null,
    };

    this.repo.save(ticket);
    this.notificationService.create(
      "email",
      `Nuevo ticket creado: ${ticket.title}`,
      ticket.id,
    );

    return ticket;
  }

  assignTicket(id, user) {
    const ticket = this.repo.update(id, { assignedUser: user });

    if (!ticket) {
      throw new AppError("Ticket no encontrado", 404);
    }

    this.notificationService.create(
      "email",
      `El ticket ${ticket.id} fue asignado a ${user}`,
      ticket.id,
    );

    return ticket;
  }

  changeStatus(id, newStatus) {
    const ticket = this.repo.update(id, { status: newStatus });

    if (!ticket) {
      throw new AppError("Ticket no encontrado", 404);
    }

    this.notificationService.create(
      "push",
      `El ticket ${ticket.id} cambió a ${newStatus}`,
      ticket.id,
    );

    return ticket;
  }

  list() {
    return this.repo.findAll();
  }

  deleteTicket(id) {
    const deleted = this.repo.delete(id);

    if (!deleted) {
      throw new AppError("Ticket no encontrado", 404);
    }

    return true;
  }
}

module.exports = TicketService;
