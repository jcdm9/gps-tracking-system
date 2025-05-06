const jwt = require("jsonwebtoken");
const Users = require("./../models/users");
const Permissions = require("./../models/permissions");
const logger = require("./../utils/logger");

const validate = async (req, res, next) => {
  const token =
    req.headers.token ||
    req.query.token ||
    req.header("auth-token") ||
    req.headers.authorization;
  if (!token)
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized Access" });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decoded)
      return res.status(401).json({ error: true, message: "Invalid token." });

    const user = await Users.findById(decoded.user.id)
      .select("-password")
      .populate("permissions");
    if (!user)
      return res
        .status(403)
        .send({ error: true, message: "Unauthorized Access" });
    req.currentUser = user;
    next();
  } catch (e) {
    logger.error(`MIDDLEWARE_AUTH > validate - ${e}`);
    return res.status(401).json({ error: true, message: "Invalid token." });
  }
};

const checkAuth = (req, res, next) => {
  // validate if authenticated
  if (req.isAuthenticated()) return next();

  // if not authenticated
  res.status(403).send({ error: true, message: "Unauthorized Access" });
};

const permissionCheck = (requiredPermissions) => {
  return async (req, res, next) => {
    const { currentUser } = req;
    if (!currentUser)
      return res
        .status(403)
        .json({ error: true, message: "Unauthorized Access." });

    if (currentUser.cbs) {
      next();
      return;
    }

    if (!currentUser.permissions)
      return res
        .status(403)
        .json({ error: true, message: "Unauthorized Access." });

    const permissions = new Set();
    for (const permission of currentUser.permissions) {
      const permissionDB = await Permissions.findOne({ _id: permission });
      if (!permissionDB) return;

      permissions.add(permissionDB.access);
    }

    let hasPermission = false;
    for (const requiredPermission of requiredPermissions) {
      if (permissions.has(requiredPermission)) {
        hasPermission = true;
        break;
      }
    }

    if (!hasPermission)
      return res.status(403).json({
        error: true,
        message: "User does not have the right Access Code",
      });

    next();
  };
};

module.exports = { validate, checkAuth, permissionCheck };
