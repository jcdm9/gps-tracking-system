require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./utils/logger");
const db = require("./config/db");
const app = express();

// routes
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/user");
const bookingRoutes = require("./routes/booking");
const bookingDetailsRoutes = require("./routes/bookingDetails");
const trucksRoutes = require("./routes/trucks");
const reportRoutes = require("./routes/reports");
const companyRoutes = require("./routes/company");
const permissionRoutes = require("./routes/permissions");

// initiate database
db.InitiateMongoServer();

// app settings
app.use(cors({ origin: "*", credentials: true }));
app.use(helmet());
app.use(bodyParser.json());
if (process.env.ENV == "development") app.use(morgan("dev"));

app.get("/status", (req, res) => {
  res.json({ health: "ok!" });
});

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/booking", bookingRoutes);
app.use("/booking-details", bookingDetailsRoutes);
app.use("/trucks", trucksRoutes);
app.use("/reports", reportRoutes);
app.use("/companies", companyRoutes);
app.use("/permissions", permissionRoutes);

// app initialize
app.listen(process.env.PORT, () => {
  logger.info(`[${process.env.APP}] is running on ${process.env.ENV}`);
  logger.info(
    `[${process.env.APP}] is listening on ${process.env.URL}:${process.env.PORT}`
  );
});
