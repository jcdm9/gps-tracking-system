const express = require("express");
const router = express.Router();
const bookingDetailsController = require("./../controllers/bookingDetails");
const middleware = require("./../middleware/auth");

router.get(
  "/",
  middleware.validate,
  middleware.permissionCheck(["booking:read", "dispatch:read"]),
  bookingDetailsController.getAll
);
router.patch(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["booking:update", "dispatch:update"]),
  bookingDetailsController.updateById
);

module.exports = router;
