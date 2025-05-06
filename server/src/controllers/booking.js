const Bookings = require("./../models/booking");
const BookingDetails = require("./../models/booking_details");
const logger = require("./../utils/logger");
const { cbs } = require("./../utils/cbs");
const moment = require("moment");

const isPastSevenDays = (dateString) => {
  const currentDate = moment();
  const inputDate = moment(dateString);

  const daysDifference = currentDate.diff(inputDate, "days");

  return daysDifference > 7;
};

const getAll = async (req, res, next) => {
  try {
    const opt = await cbs(req.currentUser, 'booking');
    const bookings = await Bookings.find(opt).populate("booking_details");
    if (!bookings.length)
      return res
        .status(404)
        .json({ error: false, message: "No bookings found." });

    const newBookings = [];
    for (const booking of bookings) {
      let status = "COMPLETE";
      if (
        (!booking.client && !booking.consignee) ||
        !booking.quantity ||
        !booking.size ||
        !booking.delivery_date ||
        !booking.weight ||
        !booking.booking_details ||
        (booking.type && !booking.container_no)
      ) {
        status = "INCOMPLETE";
      }

      if (booking.booking_details) {
        booking.booking_details.forEach((detail) => {
          if (detail.status !== "completed") {
            status = "INCOMPLETE";
          }
        });
      }

      newBookings.push({ ...booking._doc, status });
    }

    const filtered = newBookings.filter(
      (booking) =>
        booking.status == "INCOMPLETE" ||
        (booking.status == "COMPLETE" && !isPastSevenDays(booking.updated_date))
    );

    res.json(filtered);
  } catch (e) {
    logger.error(`CTRL_BOOKINGS > getAll - ${e}`);
    next();
  }
};

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(401).json({ error: true, message: "Invalid id." });

    const booking = await Bookings.findOne({ _id: id });
    if (!booking)
      return res
        .status(404)
        .json({ error: false, message: "No Booking found." });

    res.json(booking);
  } catch (e) {
    logger.error(`CTRL_BOOKINGS > findOne - ${e}`);
    next();
  }
};

const create = async (req, res, next) => {
  try {
    const {
      quantity,
      size,
      client,
      consignee,
      isImport,
      additional_fields,
      booking_details,
      delivery_date,
      peza,
      weight,
      container_no,
    } = req.body;

    let firstCreatedId = "";
    for (let i = 0; i < quantity; i++) {
      // create bookingDetails first
      const bookingDetailsIds = [];
      if (booking_details.length > 0) {
        for (const bookingDetail of booking_details) {
          const bookingDetails = new BookingDetails({
            row: bookingDetail.row,
            controlId: req.currentUser.controlId,
            task: bookingDetail.task,
            address: bookingDetail.address,
            time: bookingDetail.time,
            status: bookingDetail.status,
            plate_no: bookingDetail.plate_no,
            shipping_line: bookingDetail.shipping_line,
            chasis_no: bookingDetail.chasis_no,
            created_by: req.currentUser._id,
          });

          const createdDetail = await bookingDetails.save();
          bookingDetailsIds.push(createdDetail._id);
        }
      }

      const booking = new Bookings({
        controlId: req.currentUser.controlId,
        quantity,
        size,
        client: client || null,
        consignee,
        type: isImport,
        booking_details: bookingDetailsIds,
        delivery_date,
        additional_fields,
        peza,
        weight,
        container_no,
        created_by: req.currentUser._id,
      });

      const createdBooking = await booking.save();
      if (!createdBooking)
        return res.status(500).json({ error: true, message: "Server error." });

      if (i == 0) {
        firstCreatedId = createdBooking._id;
      }
    }

    const result = await Bookings.findById(firstCreatedId).populate(
      "booking_details"
    );

    res.json(result);
  } catch (e) {
    logger.error(`CTRL_BOOKINGS > create - ${e}`);
    next();
  }
};

const updateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(401).json({ error: true, message: "Invalid id." });

    const booking = await Bookings.findOne({ _id: id });
    if (!booking)
      return res
        .status(404)
        .json({ error: false, message: "No booking found." });

    const payload = {};
    const fields = [
      "quantity",
      "size",
      "client",
      "consignee",
      "additional_fields",
      "delivery_date",
      "booking_details",
      "isImport",
      "peza",
      "weight",
      "container_no",
    ];

    fields.forEach((field) => {
      if (req.body[field]) {
        payload[field] = req.body[field];
      }

      if (req.body.hasOwnProperty(field) && field == "isImport") {
        payload["type"] = req.body["isImport"];
      }

      if (req.body[field] && field == "container_no") {
        payload["container_no"] = req.body["container_no"];
      }

      if (req.body[field] && field == "client") {
        payload["client"] = req.body["client"];
      }

      if (
        req.body[field] &&
        field == "delivery_date" &&
        req.body[field] == "Invalid date"
      ) {
        payload["delivery_date"] = null;
      }
    });

    payload.updated_by = req.currentUser._id;
    payload.updated_date = Date.now();

    // initiate booking details
    if (booking.booking_details.length) {
      for (const booking_detail of booking.booking_details) {
        await BookingDetails.deleteOne({ _id: booking_detail._id });
      }
    }

    const bookingDetailsIds = [];
    if (payload.booking_details.length) {
      for (const bookingDetail of payload.booking_details) {
        const bookingDetails = new BookingDetails({
          task: bookingDetail.task,
          address: bookingDetail.address,
          time: bookingDetail.time,
          shipping_line: bookingDetail.shipping_line,
          plate_no: bookingDetail.plate_no,
          status: bookingDetail.status,
          chasis_no: bookingDetail.chasis_no,
          updated_by: req.currentUser._id,
        });

        const createdDetails = await bookingDetails.save();
        bookingDetailsIds.push(createdDetails._id);
      }
    }

    payload.booking_details = bookingDetailsIds;
    booking.set(payload);
    const updatedBooking = await booking.save();
    if (!updatedBooking)
      return res.status(500).json({ error: true, message: "Server error." });

    const result = await Bookings.findById(updatedBooking._id).populate(
      "booking_details"
    );

    res.json(result);
  } catch (e) {
    logger.error(`CTRL_BOOKINGS > updateById - ${e}`, e.stack);
    next();
  }
};

const removeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(401).json({ error: true, message: "Invalid id." });

    const booking = await Bookings.findById(id);
    if (!booking)
      return res
        .status(404)
        .json({ error: true, message: "Booking not found." });

    if (booking.booking_details.length) {
      for (const booking_detail of booking.booking_details) {
        await BookingDetails.deleteOne({ _id: booking_detail._id });
      }
    }

    await Bookings.deleteOne({ _id: id });

    res.json({ id });
  } catch (e) {
    logger.error(`CTRL_BOOKINGS > removeById - ${e}`);
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
