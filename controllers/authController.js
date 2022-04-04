const User = require("../models/User");
const ROLE_LIST = require("../constants/roleList");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleNewUser = async (req, res) => {
  const { user, pwd, roles } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username and password are required!!" });

  // check for duplicate username;
  const duplicateUser = await User.findOne({ username: user }).exec();
  if (duplicateUser)
    return res.status(409).json({ message: "user already registered" });

  try {
    // entrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // store the new user
    const savedUser = await User.create({
      username: user,
      password: hashedPwd,
      roles: roles,
    });

    res
      .status(201)
      .json({ message: `User created with name : ${savedUser.username}` });
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

  const foundUser = await User.findOne({ username: user }).exec();

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
      { expiresIn: "3600s" }
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
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save()

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

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const loggedInUser = await User
    .findOne({ refreshToken })
    .exec()
  if (!loggedInUser) return res.sendStatus(403); // Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log(decoded);
    if (err || loggedInUser.username !== decoded.UserInfo.username)
      return res.sendStatus(403); // Forbidden
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: loggedInUser.username,
          roles: loggedInUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600s" }
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
  const loggedInUser = await User
    .findOne({ refreshToken })
    .exec()

  if (!loggedInUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      // sameSite: "none",
      // secure: true
    });
    return res.sendStatus(204); // No content
  }

  // Delete the refresh in the db
  loggedInUser.refreshToken = ''
  const result = await loggedInUser.save()


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
