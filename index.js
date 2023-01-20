require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// db
const connectDB = require("./config/dbconn");

// make app
const app = express();
const PORT = process.env.PORT || 3500;

// allow json
app.use(express.json());

// connect to DB
connectDB();

// handling reqs via router aka custom middleware
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoute"));

mongoose.connection.once("open", () => {
  console.log("Connected to mongodb server ✅");
  app.listen(PORT, () => {
    console.log("Server is listening on port ", PORT, " 📶");
  });
});

mongoose.connection.on("error", () => {
  console.log(error, "[MongoDB connection error]");
});
