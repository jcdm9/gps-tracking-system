const { Schema, model } = require("mongoose");

const truckSchema = new Schema(
  {
    controlId: String,
    plate_no: String,
    company: String,
    model: String,
    peza: { type: Boolean, default: false },
    device_id: String,
    mobile_number: String,
    created_by: Schema.Types.ObjectId,
    created_date: { type: Date, default: Date.now },
    updated_by: Schema.Types.ObjectId,
    updated_date: Date,
  },
  {
    versionKey: false,
  }
);

module.exports = model("trucks", truckSchema);
