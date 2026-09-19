const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");
const AppError = require("../errors/AppError");

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  async createTicket(data) {
    const ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null,
    };

    this.repo.save(ticket);
    const notification = await this.notificationService.create(
      "email",
      `Nuevo ticket creado: ${ticket.title}`,
      ticket.id,
    );

    return { ...ticket, notification };
  }

  async assignTicket(id, user) {
    const ticket = this.repo.update(id, { assignedUser: user });

    if (!ticket) {
      throw new AppError("Ticket no encontrado", 404);
    }

    const notification = await this.notificationService.create(
      "email",
      `El ticket ${ticket.id} fue asignado a ${user}`,
      ticket.id,
    );

    return { ...ticket, notification };
  }

  async changeStatus(id, newStatus) {
    const ticket = this.repo.update(id, { status: newStatus });

    if (!ticket) {
      throw new AppError("Ticket no encontrado", 404);
    }

    const notification = await this.notificationService.create(
      "push",
      `El ticket ${ticket.id} cambió a ${newStatus}`,
      ticket.id,
    );

    return { ...ticket, notification };
  }

  list(page, limit) {
    const tickets = this.repo.findAll();
    const start = (page - 1) * limit;

    return {
      data: tickets.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total: tickets.length,
        totalPages: Math.ceil(tickets.length / limit),
      },
    };
  }

  getNotifications(id) {
    if (!this.repo.findById(id)) {
      throw new AppError("Ticket no encontrado", 404);
    }

    return this.notificationService.listByTicketId(id);
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
