const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const ROLE_LIST = require("../constants/roleList");

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const handleNewUser = async (req, res) => {
  const { user, pwd, roles } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username and password are required!!" });

  // check for duplicate username;
  const duplicateUser = userDB.users.find((u) => u.username === user);
  if (duplicateUser)
    return res.status(409).json({ message: "user already registered" });

  try {
    // entrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // store the new user
    const newUser = {
      username: user,
      password: hashedPwd,
      roles,
    };

    userDB.setUsers([...userDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(userDB.users)
    );
    res
      .status(201)
      .json({ message: `User created with name : ${newUser.username}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles,
        },
      },
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
      // sameSite: "none",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: `User ${user} Logged in!!!`, accessToken });
  } else {
    res.status(401).json({ message: "username  password is incorrect" });
  }
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  console.log({ cookies: cookies.jwt });
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const loggedInUser = userDB.users.find(
    (u) => u.refreshToken === refreshToken
  );
  if (!loggedInUser) return res.sendStatus(403); // Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || loggedInUser.username !== decoded.username)
      return res.sendStatus(403); // Forbidden
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

const handleLogout = async (req, res) => {
  // on client, also delete the acces token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;

  // if refresh in db?
  const loggedInUser = userDB.users.find(
    (u) => u.refreshToken === refreshToken
  );
  if (!loggedInUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204); // No content
  }

  // Delete the refresh in the db
  const users = [...userDB.users];
  const loggedInUserIndex = users.findIndex(
    (u) => u.refreshToken === loggedInUser.refreshToken
  );
  users[loggedInUserIndex].refreshToken = "";
  userDB.setUsers(users);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(users)
  );
  res.clearCookie("jwt", {
    httpOnly: true,
    // sameSite: "none",
    // secure: true,
  });
  res.sendStatus(204);
};

module.exports = {
  handleNewUser,
  handleLogin,
  handleRefreshToken,
  handleLogout,
};
