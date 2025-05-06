const express = require("express");
const router = express.Router();
const permissionController = require("./../controllers/permission");
const middleware = require("./../middleware/auth");

router.get(
  "/",
  middleware.validate,
  middleware.permissionCheck(["permission:read", "dispatch:read"]),
  permissionController.getAll
);

module.exports = router;
