const { logEvents } = require("./logger");

//whenever thers an error in the server this gets called
// next is a function that passes flow to next middleware
// theres no next called here cause this middleware wil be used at last
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errlogs.log"
  );
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500; //server roor
  res.status(status);
  res.json({ message: err.message, isError: true });
};

module.exports = errorHandler;
