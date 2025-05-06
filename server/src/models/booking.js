const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    controlId: String,
    client: { type: Schema.Types.ObjectId, ref: "users" },
    consignee: { type: String, default: null },
    quantity: String,
    size: String,
    container_no: String,
    additional_fields: String,
    booking_details: [{ type: Schema.Types.ObjectId, ref: "booking_details" }],
    delivery_date: { type: Date, default: null },
    weight: String,
    peza: Boolean,
    type: Boolean,
    created_by: Schema.Types.ObjectId,
    created_date: { type: Date, default: Date.now },
    updated_by: Schema.Types.ObjectId,
    updated_date: Date,
  },
  {
    versionKey: false,
  }
);

module.exports = model("bookings", bookingSchema);
