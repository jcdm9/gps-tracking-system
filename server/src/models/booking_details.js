const { Schema, model } = require("mongoose");

const bookingDetailsSchema = new Schema(
  {
    row: Number,
    controlId: String,
    task: String,
    address: String,
    time: Date,
    status: String,
    shipping_line: String,
    chasis_no: String,
    plate_no: String,
    created_by: Schema.Types.ObjectId,
    created_date: { type: Date, default: Date.now },
    updated_by: Schema.Types.ObjectId,
    updated_date: Date,
  },
  {
    versionKey: false,
  }
);

module.exports = model("booking_details", bookingDetailsSchema);
