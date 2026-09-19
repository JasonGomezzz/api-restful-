const NotificationService = require("../services/NotificationService");

const service = new NotificationService();

exports.list = (req, res) => {
  res.status(200).json(service.list());
};

exports.emailStatus = async (req, res, next) => {
  try {
    const status = await service.verifyEmail();
    res.status(status.ready ? 200 : 503).json(status);
  } catch (error) {
    error.statusCode = 502;
    next(error);
  }
};
