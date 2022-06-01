const express = require("express");
//call express methode to creat the app
const app = express();
//helmet protect hide express related informations and prevent our website from using outside ressources
const helmet = require("helmet");
//mongoose import to work with the data base
const mongoose = require("mongoose");
//get access to path
const path = require("path");
//==================Routes================
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauces");
//==================Routes end================
//intercept any request containing json() content and put it in the request body (same as body parser)
app.use(express.json());
//==========data base connection============
//store our values away, in the .env
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongUser = process.env.USER_MON;
const mongPass = process.env.MON_PASS;

mongoose
  .connect(
    `mongodb+srv://${mongUser}:${mongPass}@cluster0.fzi4c.mongodb.net/projectHotSauce?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connection successfull !"))
  .catch((error) => console.log("Connection failed:" + error.message));
//==========db connection end============

//using helmet to allow our front to upload the image
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

//header on response object
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/", sauceRoutes);
app.use("/api/auth", userRoutes);

//export the app so we can use it in our server
module.exports = app;
