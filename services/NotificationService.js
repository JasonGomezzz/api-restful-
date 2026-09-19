const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  async create(type, message, ticketId) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: type === "email" ? "pending" : "created",
      ticketId,
      createdAt: new Date().toISOString(),
    };

    this.repo.save(notification);

    if (type !== "email") {
      return notification;
    }

    try {
      const delivery = await this.emailService.sendEmail({
        subject: "API RESTful - Alerta del sistema de tickets",
        text: message,
        html: `<h1>Alerta del sistema de tickets</h1><p>${escapeHtml(message)}</p>`,
      });

      return this.repo.update(notification.id, {
        status: delivery.skipped ? "disabled" : "sent",
        messageId: delivery.messageId || null,
        sentAt: delivery.skipped ? null : new Date().toISOString(),
      });
    } catch (error) {
      console.error("No se pudo enviar la notificación por correo:", error.message);
      return this.repo.update(notification.id, {
        status: "failed",
        errorCode: error.code || "EMAIL_DELIVERY_ERROR",
      });
    }
  }

  list() {
    return this.repo.findAll();
  }

  listByTicketId(ticketId) {
    return this.repo.findByTicketId(ticketId);
  }

  verifyEmail() {
    return this.emailService.verifyConnection();
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

module.exports = NotificationService;
