const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    type: String,
    name: String,
    email: { type: String, unique: true },
    password: String,
    controlId: { type: String },
    contact_number: String,
    active: { type: Boolean, default: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: "permissions" }],
    cbs: { type: Boolean, Default: false },
    token: { type: String, Default: '' },
    created_by: Schema.Types.ObjectId,
    created_date: { type: Date, default: Date.now },
    updated_by: Schema.Types.ObjectId,
    updated_date: Date,
  },
  {
    versionKey: false,
  }
);

module.exports = model("users", userSchema);
