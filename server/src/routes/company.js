const express = require("express");
const router = express.Router();
const companyController = require("./../controllers/company");
const middleware = require("./../middleware/auth");

router.get(
  "/",
  middleware.validate,
  middleware.permissionCheck(["companies:read", "users:read"]),
  companyController.getAll
);
router.get(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["companies:read"]),
  companyController.findOne
);
router.post(
  "/",
  middleware.validate,
  middleware.permissionCheck(["companies:update"]),
  companyController.create
);
router.patch(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["companies:update"]),
  companyController.updateById
);
router.delete(
  "/:id",
  middleware.validate,
  middleware.permissionCheck(["companies:delete"]),
  companyController.removeById
);


module.exports = router;
