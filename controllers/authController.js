const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username and password are required!!" });
  const foundUser = userDB.users.find((u) => u.username === user);

  if (!foundUser) return res.status(401).json({ message: "user not found" });

  // evaluate password
  const isMatchPassword = await bcrypt.compare(pwd, foundUser.password);
  if (isMatchPassword) {
    // create JWTs
    res.status(200).json({ message: `User ${user} Logged in!!!` });
  } else {
    res.status(401).json({ message: "username  password is incorrect" });
  }
};

module.exports = { handleLogin };
