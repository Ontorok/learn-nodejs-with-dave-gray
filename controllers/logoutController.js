const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

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
    sameSite: "none",
    secure: true,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
