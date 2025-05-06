const XLSX = require("xlsx");
const Booking = require("./../models/booking");
const logger = require("./../utils/logger");

const exportBooking = async (req, res, next) => {
  try {
    const { body } = req;
    const { controlId } = req.currentUser;
    const payload = [
      "consignee",
      "client",
      "container_no",
      "status",
      "date_from",
      "date_to",
    ];

    const filters = {
      controlId,
    };

    for (load of payload) {
      if (load == "date_from" && body[load]) {
        filters.delivery_date = {
          $gt: body[load],
        };
      } else if (load == "date_to" && body[load]) {
        filters.delivery_date = {
          $lt: body[load],
        };
      } else if (load == "status") {
      } else {
        if (body[load]) {
          filters[load] = body[load];
        }
      }
    }

    const objects = await Booking.find(filters)
      .populate("booking_details")
      .populate("client");
    if (!objects.length) {
      return res.status(404).json({ message: "No record found." });
    }
    const bookingReport = [];
    bookingReport.push([
      "DEVILERY_DATE",
      "CLIENT",
      "CONSIGNEE",
      "CONTAINER_NO",
      "WEIGHT",
      "PEZA",
      "TYPE",
    ]);

    const bdetails = [
      "TASK",
      "ADDRESS",
      "TIME",
      "STATUS",
      "SHIPPING_LINE",
      "CHASIS_NO",
      "PLATE_NO",
    ];

    for await (object of objects) {
      const obj = [
        object.delivery_date,
        object.client.name,
        object.consignee,
        object.container_no || "",
        object.weight,
        object.peza ? "yes" : "no",
        object.type ? "import" : "export",
      ];
      bookingReport.push(obj);

      if (object.booking_details) {
        bookingReport.push([
          "TASK",
          "ADDRESS",
          "TIME",
          "STATUS",
          "SHIPPING_LINE",
          "CHASIS_NO",
          "PLATE_NO",
        ]);
        for (detail of object.booking_details) {
          const obj2 = [
            detail.task,
            detail.address,
            detail.time,
            detail.status,
            detail.shipping_line,
            detail.chasis_no,
            detail.plate_no,
          ];
          bookingReport.push(obj2);
        }
        bookingReport.push([]);
      }
    }

    // export data to excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(bookingReport);
    wb.SheetNames.push("Report");
    wb.Sheets["Report"] = ws;

    const xlsFile = "Report.xlsx";
    await XLSX.writeFile(wb, xlsFile);
    res.download(xlsFile);
  } catch (e) {
    logger.error(`CTRL_REPORTS > getBooking - ${e.message}, ${e.stack}`);
    next();
  }
};

const getBooking = async (req, res, next) => {
  try {
    const { body } = req;
    const { controlId, cbs } = req.currentUser;
    const payload = [
      "consignee",
      "client",
      "container_no",
      "status",
      "date_from",
      "date_to",
    ];

    const filters = {};

    if (!cbs) {
      filters.controlId = controlId;
    }

    for (load of payload) {
      if (load == "date_from" && body[load]) {
        filters.delivery_date = {
          $gt: body[load],
        };
      } else if (load == "date_to" && body[load]) {
        filters.delivery_date = {
          $lt: body[load],
        };
      } else if (load == "status") {
      } else {
        if (body[load]) {
          filters[load] = body[load];
        }
      }
    }
    console.log(filters);

    const objects = await Booking.find(filters)
      .populate("booking_details")
      .populate("client");
    if (!objects.length) {
      return res.status(404).json({ message: "No record found." });
    }

    const newBookings = [];
    for (const booking of objects) {
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

    if (req.body.hasOwnProperty("status")) {
      switch (req.body.status.toLowerCase()) {
        case "completed":
          return res.json(
            newBookings.filter(
              (booking) => booking.status.toLowerCase() === "complete"
            )
          );
          break;
        default:
          return res.json(
            newBookings.filter(
              (booking) => booking.status.toLowerCase() === "incomplete"
            )
          );
          break;
      }
    }

    res.json(newBookings);
  } catch (e) {
    logger.error(`CTRL_REPORTS > getBooking - ${e.message}, ${e.stack}`);
    next();
  }
};

module.exports = { getBooking, exportBooking };
