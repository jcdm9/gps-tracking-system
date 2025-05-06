const PermissionTemplates = require("./../../../models/permission_template");
const Permissions = require("./../../../models/permissions");

const init = async () => {
  console.log("seeding permission template...");
  const permissions = await Permissions.find();
  const formattedClient = permissions.filter((permission) => {
    if (
      permission.access === "dispatch:view_page" ||
      permission.access === "dispatch:read" ||
      permission.access === "booking:read"
    ) {
      return permission._id;
    }
  });

  const formattedEmployee = permissions.filter((permission) => {
    if (
      permission.access === "booking:view_page" ||
      permission.access === "booking:read" ||
      permission.access === "booking:update" ||
      permission.access === "dispatch:view_page" ||
      permission.access === "dispatch:read" ||
      permission.access === "dispatch:update" ||
      permission.access === "trucks:view_page" ||
      permission.access === "trucks:read" ||
      permission.access === "trucks:update" ||
      permission.access === "companies:read"
    ) {
      return permission._id;
    }
  });

  const formattedAdministrator = permissions.filter((permission) => {
    if (
      permission.access === "users:view_page" ||
      permission.access === "users:read" ||
      permission.access === "users:update" ||
      permission.access === "users:delete" ||
      permission.access === "booking:view_page" ||
      permission.access === "booking:read" ||
      permission.access === "booking:update" ||
      permission.access === "booking:delete" ||
      permission.access === "dispatch:view_page" ||
      permission.access === "dispatch:read" ||
      permission.access === "dispatch:update" ||
      permission.access === "dispatch:delete" ||
      permission.access === "trucks:view_page" ||
      permission.access === "trucks:read" ||
      permission.access === "trucks:update" ||
      permission.access === "trucks:delete" ||
      permission.access === "companies:view_page" ||
      permission.access === "companies:read" ||
      permission.access === "companies:update" ||
      permission.access === "companies:delete" ||
      permission.access === "permission:read"
    ) {
      return permission._id;
    }
  });

  return await PermissionTemplates.insertMany([
    {
      code: "client",
      autoAssignCustomer: true,
      permission: formattedClient,
    },
    {
      code: "employee",
      autoAssignEmployee: true,
      permission: formattedEmployee,
    },
    {
      code: "administrator",
      autoAssignSuperUser: true,
      permission: formattedAdministrator,
    },
  ]);
};

module.exports = { init };
