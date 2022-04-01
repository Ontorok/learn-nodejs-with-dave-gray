// Core modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Local modules
const { logger } = require("./middleware/logEvents");
const { errorHander } = require("./middleware/errorHandler");
const { rootRoute, employeesRoute, authRoute } = require("./routes");
const corsOptions = require("./config/corsConfig");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const PORT = process.env.PORT || 3500;

const app = express();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS
// and fetch cookies credentials requiremnts
app.use(credentials);

// CORS (Cross Origin Resource Sharing)
app.use(cors(corsOptions));

// build-in- middleware to handle urlencoded data  in other words form data
app.use(express.urlencoded({ extended: false }));

// build-in- middleware for json
app.use(express.json());

// cookies middleware
app.use(cookieParser());

// server static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes handler
app.use("/", rootRoute);
app.use("/auth", authRoute);

app.use(verifyJWT);
app.use("/employees", employeesRoute);

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
