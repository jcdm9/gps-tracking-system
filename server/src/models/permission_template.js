const { Schema, model } = require("mongoose");

const permissionTemplateSchema = new Schema(
  {
    code: String,
    autoAssignCustomer: { type: Boolean, default: false },
    autoAssignEmployee: { type: Boolean, default: false },
    autoAssignSuperUser: { type: Boolean, default: false },
    permission: [{ type: Schema.Types.ObjectId, ref: "permissions" }],
    created_by: Schema.Types.ObjectId,
    created_date: { type: Date, default: Date.now },
    updated_by: Schema.Types.ObjectId,
    updated_date: Date,
  },
  {
    versionKey: false,
  }
);

module.exports = model("permissions_template", permissionTemplateSchema);
