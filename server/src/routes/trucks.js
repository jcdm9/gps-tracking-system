const express = require("express");
const router = express.Router();
const trucksController = require("./../controllers/truck");
const middleware = require("./../middleware/auth");

router.get(
  "/",
  middleware.validate,
  middleware.permissionCheck(["trucks:read", "dispatch:read"]),
  trucksController.getAll
);
router.get(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["trucks:read"]),
  trucksController.findOne
);
router.post(
  "/",
  middleware.validate,
  middleware.permissionCheck(["trucks:update"]),
  trucksController.create
);
router.patch(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["trucks:update"]),
  trucksController.updateById
);
router.delete(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["trucks:delete"]),
  trucksController.removeById
);

module.exports = router;
