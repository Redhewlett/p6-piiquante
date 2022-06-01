const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

//Creat user
router.post("/signup", userCtrl.signup);
//Login user
router.post("/login", userCtrl.login);

module.exports = router;
