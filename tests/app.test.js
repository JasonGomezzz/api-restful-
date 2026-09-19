const { after, before, test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "api-restful-"));
process.env.DB_PATH = path.join(testDirectory, "db.json");
fs.writeFileSync(
  process.env.DB_PATH,
  JSON.stringify({ tickets: [], notifications: [] }),
);

const app = require("../app");

let server;
let baseUrl;

before(() => {
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
  fs.rmSync(testDirectory, { recursive: true, force: true });
});

async function request(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...options.headers,
    },
  });
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  return { response, body };
}

test("flujo completo de tickets, paginación, errores y notificaciones", async (t) => {
  await t.test("responde en la ruta principal", async () => {
    const { response, body } = await request("/");
    assert.equal(response.status, 200);
    assert.equal(body, "¡Bienvenido a la API RESTful!");
  });

  await t.test("valida los datos obligatorios con el middleware global", async () => {
    const { response, body } = await request("/tickets", {
      method: "POST",
      body: JSON.stringify({ title: "Sin descripción" }),
    });
    assert.equal(response.status, 400);
    assert.equal(body.error, "Los campos title y description son obligatorios");
  });

  const tickets = [];

  await t.test("crea tickets y registra sus notificaciones", async () => {
    for (let index = 1; index <= 6; index += 1) {
      const { response, body } = await request("/tickets", {
        method: "POST",
        body: JSON.stringify({
          title: `Problema ${index}`,
          description: `Descripción del problema ${index}`,
        }),
      });
      assert.equal(response.status, 201);
      tickets.push(body);
    }
  });

  await t.test("pagina la lista de tickets", async () => {
    const { response, body } = await request("/tickets?page=2&limit=5");
    assert.equal(response.status, 200);
    assert.equal(body.data.length, 1);
    assert.deepEqual(body.pagination, {
      page: 2,
      limit: 5,
      total: 6,
      totalPages: 2,
    });
  });

  await t.test("asigna y actualiza el estado de un ticket", async () => {
    const ticketId = tickets[0].id;
    const assigned = await request(`/tickets/${ticketId}/assign`, {
      method: "PUT",
      body: JSON.stringify({ user: "Jason Gómez" }),
    });
    assert.equal(assigned.response.status, 200);
    assert.equal(assigned.body.assignedUser, "Jason Gómez");

    const updated = await request(`/tickets/${ticketId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: "asignado" }),
    });
    assert.equal(updated.response.status, 200);
    assert.equal(updated.body.status, "asignado");
  });

  await t.test("obtiene el historial de notificaciones de un ticket", async () => {
    const ticketId = tickets[0].id;
    const { response, body } = await request(`/tickets/${ticketId}/notifications`);
    assert.equal(response.status, 200);
    assert.equal(body.length, 3);
    assert.ok(body.every((notification) => notification.ticketId === ticketId));
  });

  await t.test("rechaza parámetros de paginación inválidos", async () => {
    const { response, body } = await request("/tickets?page=0&limit=5");
    assert.equal(response.status, 400);
    assert.equal(body.error, "El parámetro page debe ser un entero mayor que cero");
  });

  await t.test("informa cuando una ruta o ticket no existe", async () => {
    const missingTicket = await request("/tickets/no-existe/notifications");
    assert.equal(missingTicket.response.status, 404);
    assert.equal(missingTicket.body.error, "Ticket no encontrado");

    const missingRoute = await request("/ruta-inexistente");
    assert.equal(missingRoute.response.status, 404);
    assert.equal(missingRoute.body.error, "Ruta no encontrada");
  });
});
