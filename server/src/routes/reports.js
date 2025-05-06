const express = require("express");
const router = express.Router();
const reportController = require("./../controllers/report");
const middleware = require("./../middleware/auth");

router.post("/booking", middleware.validate, reportController.getBooking);
router.get(
  "/booking/export",
  middleware.validate,
  reportController.exportBooking
);

module.exports = router;
