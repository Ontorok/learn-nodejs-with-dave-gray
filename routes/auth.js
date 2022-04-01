const express = require("express");
const {
  handleNewUser,
  handleLogin,
  handleRefreshToken,
  handleLogout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", handleNewUser);
router.post("/login", handleLogin);
router.get("/refresh", handleRefreshToken);
router.get("/logout", handleLogout);

module.exports = router;
