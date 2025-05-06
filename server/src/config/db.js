const mongoose = require("mongoose");
const logger = require("./../utils/logger");
//const path = `${__dirname}/../../files/rds-combined-ca-bundle.pem`;

const InitiateMongoServer = async () => {
  try {
    if (process.env.ENV !== "development") {
      //const sslCAPath = "./../../files/rds-combined-ca-bundle.pem";
      await mongoose.connect(process.env.DB_URL, {
        //tls: true,
        //sslValidate: false,
        //sslCA: path,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      const url = process.env.DB_URL;
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    logger.info(`Database connected to ${process.env.DB_URL}.`);
  } catch (e) {
    logger.error(`Database Error: ${e}`);
    throw e;
  }
};

module.exports = { InitiateMongoServer };
