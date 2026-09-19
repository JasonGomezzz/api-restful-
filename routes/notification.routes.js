const express = require("express");
const controller = require("../controllers/NotificationController");

const router = express.Router();

router.get("/email/status", controller.emailStatus);
router.get("/", controller.list);

module.exports = router;
