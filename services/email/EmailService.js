const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.enabled = process.env.EMAIL_ENABLED === "true";
    this.transporter = null;
  }

  _getRequiredConfig() {
    const config = {
      service: process.env.MAILER_SERVICE,
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_SECRET_KEY,
      recipient: process.env.MAILER_TO,
      fromName: process.env.MAILER_FROM_NAME || "API RESTful Tickets",
    };

    const missing = Object.entries(config)
      .filter(([key, value]) => key !== "fromName" && !value)
      .map(([key]) => key);

    if (missing.length > 0) {
      throw new Error(`Falta configurar: ${missing.join(", ")}`);
    }

    return config;
  }

  _getTransporter() {
    if (!this.enabled) return null;

    if (!this.transporter) {
      const config = this._getRequiredConfig();
      this.transporter = nodemailer.createTransport({
        service: config.service,
        auth: {
          user: config.user,
          pass: config.pass,
        },
        connectionTimeout: 15_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      });
    }

    return this.transporter;
  }

  async verifyConnection() {
    if (!this.enabled) {
      return { enabled: false, ready: false };
    }

    await this._getTransporter().verify();
    return { enabled: true, ready: true };
  }

  async sendEmail({ to, subject, text, html }) {
    if (!this.enabled) {
      return { skipped: true };
    }

    const config = this._getRequiredConfig();
    const info = await this._getTransporter().sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: to || config.recipient,
      subject,
      text,
      html,
    });

    return {
      skipped: false,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    };
  }
}

module.exports = EmailService;
