const express = require("express");
const router = express.Router();
const bookingController = require("./../controllers/booking");
const middleware = require("./../middleware/auth");

router.get(
  "/",
  middleware.validate,
  middleware.permissionCheck(["booking:read", "dispatch:read"]),
  bookingController.getAll
);
router.get(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["booking:read", "dispatch:read"]),
  bookingController.findOne
);
router.post(
  "/",
  middleware.validate,
  middleware.permissionCheck(["booking:update", "dispatch:update"]),
  bookingController.create
);
router.patch(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["booking:update", "dispatch:update"]),
  bookingController.updateById
);
router.delete(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["booking:delete"]),
  bookingController.removeById
);

module.exports = router;
