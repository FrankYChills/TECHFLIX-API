require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// db
const connectDB = require("./config/dbconn");
// cors
const cors = require("cors");

// make app
const app = express();
const PORT = process.env.PORT || 3500;

//get the logger middleware and use that
const { logger, logEvents } = require("./middleware/logger");
// this middleware logs any requests coming to the server
app.use(logger);

//get the error handler middleware and use that(at last)
// whenever any error is encountered this middleware logs error
const errorHandler = require("./middleware/errorHandler");

// allow cors
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// allow json
app.use(express.json());

// connect to DB
connectDB();

// handling reqs via router aka custom middleware
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/movies", require("./routes/movieRoute"));
app.use("/api/lists", require("./routes/listRoute"));

//handles error in the server
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to mongodb server ✅");
  app.listen(PORT, () => {
    console.log("Server is listening on port ", PORT, " 📶");
  });
});

mongoose.connection.on("error", () => {
  console.log(error, "[MongoDB connection error]");
});
