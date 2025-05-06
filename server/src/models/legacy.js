const { Schema, model } = require("mongoose");

const legacySchema = new Schema(
  {
    parent: { type: String },
    child: { type: String },
    created_by: Schema.Types.ObjectId,
    created_date: { type: Date, default: Date.now },
    updated_by: Schema.Types.ObjectId,
    updated_date: Date,
  },
  {
    versionKey: false,
  }
);

module.exports = model("legacy", legacySchema);
