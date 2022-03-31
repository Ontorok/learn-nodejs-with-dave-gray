const { logEvents } = require("./logEvents");

const errorHander = (err, req, res, next) => {
  console.log(req);
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.log(err.stack);
  res.status(500).send(err.message);
};

module.exports = { errorHander };
