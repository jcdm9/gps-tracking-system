const Trucks = require("./../models/trucks");
const BookingDetails = require("./../models/booking_details");
const logger = require("./../utils/logger");
const { cbs } = require("./../utils/cbs");

// const { Wialon, UnitsDataFormat } = require("node-wialon");

// const getFromWialon = async () => {
//   const wialon = await Wialon.tokenLogin({ token: process.env.WIALON_TOKEN });

//   /** svc=core/search_item */
//   return await wialon.Core.searchItem({
//     id: 19041432,
//     flags: 1 + 256 + 512 + 1024 + 8192,
//   });
// };

const getAll = async (req, res, next) => {
  try {
    const opt = await cbs(req.currentUser);
    const trucks = await Trucks.find(opt);
    if (!trucks)
      return res
        .status(404)
        .json({ error: false, message: "No trucks found." });

    const trucksWithBooking = [];
    for (const truck of trucks) {
      const payload = {};
      Object.keys(truck._doc).map((prop) => {
        payload[prop] = truck[prop];
      });

      const booking = await BookingDetails.findOne({
        plate_no: truck._id,
        status: "transit",
      });

      payload.status = booking ? "In-transit" : "Available";
      trucksWithBooking.push(payload);
    }

    res.json(trucksWithBooking);
  } catch (e) {
    logger.error(`CTRL_TRUCKS > getAll - ${e}`);
    next();
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(404).json({ error: true, message: "Invalid id." });

    const trucks = await Trucks.findOne({ _id: id });
    if (!trucks)
      return res.status(404).json({ error: false, message: "No truck found." });

    res.json(trucks);
  } catch (e) {
    logger.error(`CTRL_TRUCKS > findOne - ${e}`);
    next();
  }
};

const create = async (req, res, next) => {
  try {
    const { plate_no, company, model, peza, device_id, mobile_number } =
      req.body;

    const truck = new Trucks({
      controlId: req.currentUser.controlId,
      plate_no,
      company,
      model,
      peza,
      device_id,
      mobile_number,
      created_by: req.currentUser._id,
    });

    const createdTruck = await truck.save();
    if (!createdTruck)
      return res.status(500).json({ error: true, message: "Server error." });

    res.json(createdTruck);
  } catch (e) {
    logger.error(`CTRL_TRUCKS > create - ${e}`);
    next();
  }
};

const updateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(401)
        .json({ error: true, message: "Invalid truck parameter." });

    const truck = await Trucks.findById(id);
    if (!truck)
      return res
        .status(404)
        .json({ error: false, message: "Truck not found." });

    const payload = {};
    if (req.body.plate_no) {
      payload.plate_no = req.body.plate_no;
    }

    if (req.body.company) {
      payload.company = req.body.company;
    }

    if (req.body.model) {
      payload.model = req.body.model;
    }

    if (req.body.hasOwnProperty("peza")) {
      payload.peza = req.body.peza;
    }

    if (req.body.device_id) {
      payload.device_id = req.body.device_id;
    }

    if (req.body.mobile_number) {
      payload.mobile_number = req.body.mobile_number;
    }

    payload.updated_by = req.currentUser._id;
    payload.updated_date = Date.now();
    truck.set(payload);
    const updatedTruck = await truck.save();

    if (!updatedTruck)
      return res.status(500).json({ error: true, message: "Server error." });

    res.json(updatedTruck);
  } catch (e) {
    logger.error(`CTRL_TRUCKS > updateById - ${e}`);
    next();
  }
};

const removeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(401)
        .json({ error: true, message: "Invalid truck parameter." });

    const truck = await Trucks.findById(id);
    if (!truck)
      return res
        .status(404)
        .json({ error: false, message: "Truck not found." });

    const deletedTruck = await Trucks.deleteOne({ _id: id });

    if (!deletedTruck)
      return res.status(500).json({ error: true, message: "Server error." });

    res.json({ ...deletedTruck, id });
  } catch (e) {
    logger.error(`CTRL_TRUCKS > removeById - ${e}`);
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
