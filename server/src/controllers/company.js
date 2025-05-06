const Companies = require("./../models/companies");
const logger = require("./../utils/logger");
const { cbs } = require("./../utils/cbs");
const legacyTool = require('./../utils/legacy-tool')

const getAll = async (req, res, next) => {
  try {
    const opt = await cbs(req.currentUser);
    const companies = await Companies.find(opt);
    if (!companies)
      return res
        .status(404)
        .json({ error: false, message: "No company found." });

    res.json(companies);
  } catch (e) {
    logger.error(`CTRL_COMPANY > getAll - ${e}`);
    next();
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(404).json({ error: true, message: "Invalid id." });

    const company = await Companies.findOne({ _id: id });
    if (!company)
      return res
        .status(404)
        .json({ error: false, message: "No company found." });

    res.json(company);
  } catch (e) {
    logger.error(`CTRL_COMPANY > findOne - ${e}`);
    next();
  }
};

const generateControl = async () => {
  const charLength = 10;
  const randomChar =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let char = "";
  for (let i = 0; i < charLength; i++) {
    char += randomChar.charAt(Math.floor(Math.random() * randomChar.length));
  }

  const exist = await Companies.find({ controlId: char });

  return exist.length ? generateControl() : char;
};

const create = async (req, res, next) => {
  try {
    const { name, active } = req.body;
    const company = new Companies({
      name,
      active,
      controlId: await generateControl(),
      created_by: req.currentUser._id,
    });
    const createdCompany = await company.save();
    if (!createdCompany)
      return res.status(500).json({ error: true, message: "Server error." });

    // create relation
    await legacyTool.mapCreatedCompany(createdCompany, req.currentUser.controlId)

    res.json(createdCompany);
  } catch (e) {
    logger.error(`CTRL_COMPANY > create - ${e}`);
    next();
  }
};

const updateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(401)
        .json({ error: true, message: "Invalid company parameter." });

    const company = await Companies.findById(id);
    if (!company)
      return res
        .status(404)
        .json({ error: false, message: "Company not found." });

    const payload = {};
    if (req.body.name) {
      payload.name = req.body.name;
    }

    if (req.body.hasOwnProperty("active")) {
      payload.active = req.body.active;
    }

    payload.updated_by = req.currentUser._id;
    payload.updated_date = Date.now();
    company.set(payload);
    const updatedCompany = await company.save();

    if (!updatedCompany)
      return res.status(500).json({ error: true, message: "Server error." });

    res.json(updatedCompany);
  } catch (e) {
    logger.error(`CTRL_COMPANY > updateById - ${e}`);
    next();
  }
};

const removeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(401)
        .json({ error: true, message: "Invalid company parameter." });

    const company = await Companies.findById(id);
    if (!company)
      return res
        .status(404)
        .json({ error: false, message: "Company not found." });

    const deletedCompany = await Companies.deleteOne({ _id: id });

    if (!deletedCompany)
      return res.status(500).json({ error: true, message: "Server error." });

    res.json({ ...deletedCompany, id });
  } catch (e) {
    logger.error(`CTRL_COMPANY > removeById - ${e}`);
    next();
  }
};

module.exports = {
  getAll,
  findOne,
  create,
  updateById,
  removeById,
};
