const express = require("express");
const router = express.Router();
const userController = require("./../controllers/user");
const middleware = require("./../middleware/auth");

router.get(
  "/",
  middleware.validate,
  middleware.permissionCheck(["users:read"]),
  userController.getAll
);
router.get(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["users:read"]),
  userController.findOne
);
//router.post('/', middleware.validate, userController.create)
router.post(
  "/",
  middleware.validate,
  middleware.permissionCheck(["users:update"]),
  userController.create
);
router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.put(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["users:update"]),
  userController.updateById
);
router.delete(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["users:delete"]),
  userController.removeById
);
router.patch("/reset-token", userController.resetToken)

module.exports = router;
