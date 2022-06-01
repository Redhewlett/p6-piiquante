const express = require("express");
const router = express.Router();
//import the schema
const sauceCtrl = require("../controllers/sauce");
//import auth middleware to protect the routes
const auth = require("../middleware/auth");
//import multer
const multer = require("../middleware/multer-config");

//=============Sauces routes==================

//get the list of all sauces
router.get("/sauces", auth, sauceCtrl.getAllSauces);
//get one sauce
router.get("/sauces/:id", auth, sauceCtrl.getOneSauce);
//creat new sauce
router.post("/sauces", auth, multer, sauceCtrl.createSauce);
//modify/update and object
router.put("/sauces/:id", auth, multer, sauceCtrl.modifySauce);
//delete an object
router.delete("/sauces/:id", auth, sauceCtrl.deleteSauce);
//likes and dislikes
router.post("/sauces/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
