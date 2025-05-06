const Permissions = require("./../models/permissions");
const logger = require("./../utils/logger");

const getAll = async (req, res, next) => {
  try {
    const payload = {}
    if (!req.currentUser.cbs) {
      payload.access = {
        $ne: "companies:fullAccess"
      }
    }
    const permissions = await Permissions.find(payload);
    if (!permissions)
      return res
        .status(404)
        .json({ error: false, message: "No permissions found." });

    res.json(permissions);
  } catch (e) {
    logger.error(`CTRL_permissions > getAll - ${e}`, e.stack);
    next();
  }
};

module.exports = { getAll };
