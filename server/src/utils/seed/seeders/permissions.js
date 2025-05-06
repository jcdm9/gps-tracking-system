const Permissions = require("./../../../models/permissions");

const init = async () => {
  console.log("seeding permissions..");
  return await Permissions.insertMany([
    { access: "users:view_page" },
    { access: "users:read" },
    { access: "users:update" },
    { access: "users:delete" },
    { access: "booking:view_page" },
    { access: "booking:read" },
    { access: "booking:update" },
    { access: "booking:delete" },
    { access: "dispatch:view_page" },
    { access: "dispatch:read" },
    { access: "dispatch:update" },
    { access: "dispatch:delete" },
    { access: "trucks:view_page" },
    { access: "trucks:read" },
    { access: "trucks:update" },
    { access: "trucks:delete" },
    { access: "companies:view_page" },
    { access: "companies:read" },
    { access: "companies:update" },
    { access: "companies:delete" },
    { access: "permission:read" },
  ]);
};

module.exports = { init };
