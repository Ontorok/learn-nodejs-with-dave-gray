const express = require("express");
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const { errorHander } = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

const app = express();

// custom middleware logger
app.use(logger);

// CORS (Cross Origin Resource Sharing)
const whiteList = [
  "https://www.facebook.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) > -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// build-in- middleware to handle urlencoded data
// in other words, form data
// "Content-Type: application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: false }));

// build-in- middleware for json
app.use(express.json());

// server static files
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  // res.sendFile('./views/index.html', { root: __dirname })
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  console.log(req);
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); // 302 by default
});

// Route handlers
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log(`attempted to load file hello.html`);
    next();
  },
  (req, res) => {
    res.send("Hello Nasir!!!!");
  }
);

const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res) => {
  console.log("three");
  res.send("Finished");
};

app.get("/chain(.html)?", [one, two, three]);

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
