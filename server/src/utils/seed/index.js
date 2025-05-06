const seedPermissions = require("./seeders/permissions");
const seedPermissionTemplate = require("./seeders/permission-templates");
const seedCompany = require("./seeders/companies");
const mongoose = require("mongoose");

const InitiateMongoServer = async () => {
  try {
    const url = process.env.DB_URL;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    throw e;
  }
};

module.exports = { InitiateMongoServer };

const init = async () => {
  await InitiateMongoServer();
  await seedPermissions.init();
  await seedPermissionTemplate.init();
  await seedCompany.init();

  process.exit();
};

init();
