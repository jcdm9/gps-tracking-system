const logger = require("./../utils/logger");
const { cbs } = require("./../utils/cbs");
const Users = require("./../models/users");
const Companies = require("./../models/companies");
const PermissionTemplate = require("./../models/permission_template");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAll = async (req, res, next) => {
  try {
    const opt = await cbs(req.currentUser);
    const users = await Users.find(opt).select(["-password", "-cbs"]);
    if (!users)
      return res.status(404).json({ error: false, message: "No users found." });

    const usersWithCompany = [];
    for (const user of users) {
      const newUser = JSON.parse(JSON.stringify(user));
      const company = await Companies.findOne({ controlId: user.controlId });
      newUser.company = company.name;

      usersWithCompany.push(newUser);
    }

    res.json(usersWithCompany);
  } catch (e) {
    logger.error(`CTRL_USERS > getAll - ${e.message}, ${e.stack}`);
    next();
  }
};

const findOne = async (req, res, next) => {
  try {
    const opt = await cbs(req.currentUser);
    const { id } = req.params;
    if (!id)
      return res.status(404).json({ error: true, message: "Invalid id." });

    opt["_id"] = id;
    const user = await Users.findOne(opt).select(["-password", "-cbs"]);
    if (!user)
      return res.status(404).json({ error: false, message: "No user found." });

    res.json(user);
  } catch (e) {
    logger.error(`CTRL_USERS > findOne - ${e}`);
    next();
  }
};

const create = async (req, res, next) => {
  try {
    const { type, name, email, company, active, password, contactNumber } =
      req.body;

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ error: true, message: "Please use a valid email." });

    // get permission templates based on user type
    const permissionTemplate = await PermissionTemplate.find({
      code: type,
    }).populate("permission");
    if (!permissionTemplate)
      return res.json({
        error: true,
        message: "Unable to create user with custom type",
      });
    const formattedPermissions = [];
    for (const template of permissionTemplate) {
      for (const permissionDetails of template.permission) {
        formattedPermissions.push(permissionDetails._id);
      }
    }

    const user = new Users({
      password,
      type,
      name,
      email,
      controlId: company,
      active,
      contact_number: contactNumber,
      permissions: formattedPermissions,
      created_by: req.currentUser._id,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const createdUser = await user.save();
    if (!createdUser)
      return res.status(500).json({ error: true, message: "Server error." });
    createdUser.password = undefined;

    res.json(createdUser);
  } catch (e) {
    logger.error(`CTRL_USERS > create - ${e}`);
    next();
  }
};

const updateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(401)
        .json({ error: true, message: "Invalid user parameter." });

    const user = await Users.findById(id);
    if (!user)
      return res.status(404).json({ error: false, message: "User not found." });

    const payload = {};
    if (req.body.name) {
      payload.name = req.body.name;
    }

    if (req.body.hasOwnProperty("password")) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(req.body.password, salt);
    }

    if (req.body.contactNumber) {
      payload.contact_number = req.body.contactNumber;
    }

    if (req.body.type) {
      payload.type = req.body.type;
    }

    if (req.body.permissions) {
      payload.permissions = req.body.permissions;
    }

    if (req.body.token) {
      payload.token = req.body.token;
    }

    payload.active = req.body.active;
    payload.updated_by = req.currentUser._id;
    payload.updated_date = Date.now();
    user.set(payload);
    const updatedUser = await user.save();

    if (!updatedUser)
      return res.status(500).json({ error: true, message: "Server error." });

    res.json(updatedUser);
  } catch (e) {
    logger.error(`CTRL_USERS > updateById - ${e}`, e.stack);
    next();
  }
};

const removeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(401)
        .json({ error: true, message: "Invalid user parameter." });

    const user = await Users.findById(id);
    if (!user)
      return res.status(404).json({ error: false, message: "User not found." });

    const deletedUser = await Users.deleteOne({ _id: id });

    if (!deletedUser)
      return res.status(500).json({ error: true, message: "Server error." });

    res.json({ ...deletedUser, id });
  } catch (e) {
    logger.error(`CTRL_USERS > removeById - ${e}`);
    next();
  }
};

const signUp = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, company } = req.body;

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ error: true, message: "Please use a valid email." });
    if (password.length < 6)
      return res.status(400).json({
        error: true,
        message: "Password should be minimum of 6 characters.",
      });
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ error: true, message: "Confirm password did not match." });

    let user = await Users.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: true, message: "Email already exists." });
    }

    if (!company)
      return res
        .status(401)
        .json({ error: true, message: "Please provide company." });

    user = new Users({
      type: "user",
      name,
      email,
      ip_address,
      company,
      active: false,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const createdUser = await user.save();
    if (!createdUser)
      return res.status(500).json({ error: true, message: "Server error." });
    createdUser.password = undefined;

    res.json(createdUser);
  } catch (e) {
    logger.error(`CTRL_USERS > signUp - ${e}`);
    next();
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Missing fields.",
    });
  }
  if (!validator.isEmail(email))
    return res.status(400).json({ message: "Please use a valid email." });

  try {
    let user = await Users.findOne({
      email,
    }).populate("permissions");
    if (!user)
      return res.status(400).json({ error: true, message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ error: true, message: "Incorrect email or password!" });
    if (!user.active)
      return res.status(400).json({ error: true, message: "User inactive." });
    const payload = {
      user: {
        id: user.id,
      },
    };

    user.password = undefined;

    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          accessToken: token,
          user,
        });
      }
    );
  } catch (e) {
    logger.error(`CTRL_USERS > login - ${e}`);
    next();
  }
};

const profile = async (req, res, next) => {
  try {
    if (!req.currentUser)
      return res.json({ error: true, message: "Invalid user." });

    res.json({ user: req.currentUser });
  } catch (e) {
    logger.error(`CTRL_USERS > profile - ${e}`);
    next();
  }
};

const resetToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    await Users.findOneAndUpdate(
      { token },
      {
        token: "",
      }
    );

    res.json({ message: "ok" });
  } catch (e) {
    logger.error(`CTRL_USERS > resetToken - ${e}`);
    next();
  }
};

module.exports = {
  getAll,
  findOne,
  create,
  updateById,
  removeById,
  signUp,
  login,
  profile,
  resetToken,
};
