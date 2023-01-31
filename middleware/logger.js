const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};
// middleware controls what will happen b/w req and response and even can move to more middlewares before sending response
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.header.origin}`, "reqlogs.log");
  console.log(`${req.method}\t${req.url}\t${req.header.origin}`);

  next();
};

module.exports = { logEvents, logger };
