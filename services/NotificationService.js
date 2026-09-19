const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
  }

  create(type, message, ticketId) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId,
    };

    return this.repo.save(notification);
  }

  list() {
    return this.repo.findAll();
  }

  listByTicketId(ticketId) {
    return this.repo.findByTicketId(ticketId);
  }
}

module.exports = NotificationService;
