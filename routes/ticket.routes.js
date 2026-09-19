const express = require("express");
const controller = require("../controllers/TicketController");

const router = express.Router();

router.post("/", controller.create);
router.get("/", controller.list);
router.put("/:id/assign", controller.assign);
router.put("/:id/status", controller.changeStatus);
router.delete("/:id", controller.delete);

module.exports = router;
