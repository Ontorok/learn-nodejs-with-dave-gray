const express = require("express");
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const { errorHander } = require("./middleware/errorHandler");
const { rootRoute, employeesRoute, usersRoute } = require('./routes');
const corsOptions = require("./config/corsConfig");
const PORT = process.env.PORT || 3500;

const app = express();

// custom middleware logger
app.use(logger);

// CORS (Cross Origin Resource Sharing)
app.use(cors(corsOptions));

// build-in- middleware to handle urlencoded data  in other words form data
app.use(express.urlencoded({ extended: false }));

// build-in- middleware for json
app.use(express.json());

// server static files
app.use('/', express.static(path.join(__dirname, "/public")));

// routes handler
app.use('/', rootRoute)
app.use('/employees', employeesRoute)
app.use('/users', usersRoute)

app.all("/*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ err: "404 not found" });
  } else {
    res.type("text").send("404 not found");
  }
});

app.use(errorHander);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
