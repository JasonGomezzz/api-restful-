const BaseRepository = require("./BaseRepository");

class NotificationRepository extends BaseRepository {
  constructor() {
    super("notifications");
  }

  findByTicketId(ticketId) {
    return this.findAll().filter((notification) => notification.ticketId === ticketId);
  }
}

module.exports = NotificationRepository;
