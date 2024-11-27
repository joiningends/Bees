require("dotenv/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));

const usersRoutes = require("./routes/users");
const tickettypeRoutes = require("./routes/tickettypes");
const employeeRoutes = require("./routes/employees");
const customerRoutes = require("./routes/coustmers");
const ticketRoutes = require("./routes/tickets");
const otpRoutes = require("./routes/otps");
const statusRoutes = require("./routes/statuss");
const reportsRoutes = require("./routes/reports");
const birthRoutes = require("./routes/birthda");
const newinformationRoutes = require("./routes/newinformation");

const api = process.env.API_URL;

const PORT = process.env.PORT || 5001;
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/tickettype`, tickettypeRoutes);
app.use(`${api}/employee`, employeeRoutes);
app.use(`${api}/customer`, customerRoutes);
app.use(`${api}/ticket`, ticketRoutes);
app.use(`${api}/otp`, otpRoutes);
app.use(`${api}/status`, statusRoutes);
app.use(`${api}/reports`, reportsRoutes);
app.use(`${api}/births`, birthRoutes);
app.use(`${api}/ins`, newinformationRoutes);
const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));
app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});
mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: "Bees",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch(err => {
    console.log(err);
  });

app.listen(5001, () => {
  console.log("server is running http://localhost:5001");
});
