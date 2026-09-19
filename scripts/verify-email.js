require("dotenv").config({ quiet: true });

const EmailService = require("../services/email/EmailService");

async function verifyEmail() {
  const service = new EmailService();
  const status = await service.verifyConnection();

  if (!status.enabled) {
    throw new Error("El envío está desactivado. Configura EMAIL_ENABLED=true en .env");
  }

  console.log("Conexión SMTP y credenciales verificadas correctamente");
}

verifyEmail().catch((error) => {
  console.error(`No se pudo verificar el correo: ${error.message}`);
  process.exitCode = 1;
});
