const test = require("node:test");
const assert = require("node:assert/strict");

const EmailService = require("../services/email/EmailService");

test("EmailService verifica SMTP y entrega los datos del envío", async () => {
  const previousEnvironment = {
    EMAIL_ENABLED: process.env.EMAIL_ENABLED,
    MAILER_SERVICE: process.env.MAILER_SERVICE,
    MAILER_EMAIL: process.env.MAILER_EMAIL,
    MAILER_SECRET_KEY: process.env.MAILER_SECRET_KEY,
    MAILER_TO: process.env.MAILER_TO,
  };

  Object.assign(process.env, {
    EMAIL_ENABLED: "true",
    MAILER_SERVICE: "gmail",
    MAILER_EMAIL: "emisor@example.com",
    MAILER_SECRET_KEY: "secret-for-test",
    MAILER_TO: "receptor@example.com",
  });

  const service = new EmailService();
  service.transporter = {
    verify: async () => true,
    sendMail: async (message) => ({
      messageId: "message-id-test",
      accepted: [message.to],
      rejected: [],
      response: "250 Message accepted",
    }),
  };

  const status = await service.verifyConnection();
  const delivery = await service.sendEmail({
    subject: "Prueba",
    text: "Correo de prueba",
    html: "<p>Correo de prueba</p>",
  });

  assert.deepEqual(status, { enabled: true, ready: true });
  assert.equal(delivery.skipped, false);
  assert.equal(delivery.messageId, "message-id-test");
  assert.deepEqual(delivery.accepted, ["receptor@example.com"]);

  for (const [key, value] of Object.entries(previousEnvironment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});
