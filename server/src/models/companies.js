const { Schema, model } = require("mongoose");

const companySchema = new Schema(
  {
    name: { type: String, unique: true },
    controlId: { type: String, unique: true },
    active: { type: Boolean, default: true },
    created_by: Schema.Types.ObjectId,
    created_date: { type: Date, default: Date.now },
    updated_by: Schema.Types.ObjectId,
    updated_date: Date,
  },
  {
    versionKey: false,
  }
);

module.exports = model("companies", companySchema);
