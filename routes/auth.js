const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { registerUser, authenticateUser } = require("../models/user");

router.use(bodyParser.json());

router.post("/register", (req, res) => {
  const { username, password, email } = req.body;
  registerUser(username, password, email, (err) => {
    if (err) return res.status(500).send("Error registering user");
    res.send("User registered successfully!");
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  authenticateUser(username, password, (err, user) => {
    if (err) return res.status(500).send("Error logging in");
    if (!user) return res.status(401).send("Invalid username or password");
    req.session.user = user;
    res.send("Login successful");
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.send("Logout successful");
  });
});

module.exports = router;
