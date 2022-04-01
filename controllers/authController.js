const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

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
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // saving refresh token with current user
    const users = [...userDB.users];
    const currentUserIndex = users.findIndex(
      (u) => u.username === foundUser.username
    );
    users[currentUserIndex].refreshToken = refreshToken;
    userDB.setUsers(users);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(userDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: `User ${user} Logged in!!!`, accessToken });
  } else {
    res.status(401).json({ message: "username  password is incorrect" });
  }
};

module.exports = { handleLogin };
