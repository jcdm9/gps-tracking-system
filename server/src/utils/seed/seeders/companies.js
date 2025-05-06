const bcrypt = require("bcryptjs");
const Companies = require("./../../../models/companies");
const Users = require("./../../../models/users");
const Trucks = require("./../../../models/trucks");
const Permissions = require("./../../../models/permissions");

const init = async () => {
  console.log("seeding company...");
  const generateControl = () => {
    const charLength = 10;
    const randomChar =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let char = "";
    for (let i = 0; i < charLength; i++) {
      char += randomChar.charAt(Math.floor(Math.random() * randomChar.length));
    }

    return char;
  };

  const company = await Companies.create({
    name: "RilQuick",
    controlId: generateControl(),
  });

  await Companies.create({
    name: "Basic Kneads Bakery",
    controlId: generateControl(),
  });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("system@122333", salt);
  const permissions = await Permissions.find();
  const formattedPermissions = permissions.map((permission) => permission._id);

  const user = await Users.create({
    type: "administrator",
    name: "System Administrator",
    email: "system@admin.com",
    password,
    contact_number: "123456789",
    cbs: true,
    controlId: company.controlId,
    permissions: formattedPermissions,
  });

  console.log("User - email: ", user.email, " password: system@122333");

  await Trucks.create({
    plate_no: "NBB-1243 (RIL TRANS)",
    device_id: "19041432",
    company: "RilQuick",
    model: "",
    peza: true,
    mobile_number: "123456789",
  });
};

module.exports = { init };
