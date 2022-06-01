//import jsonwebtoken to verify our authentification
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = (req, res, next) => {
  console.log(req.headers);
  try {
    //we know that the token has the form: Bearer token-character-chain so we use this to get it(without the empty space)
    const token = req.headers.authorization.split(" ")[1];
    //using our secret token key with safty
    const jwtKey = process.env.JWT_KEY;
    const decodedToken = jwt.verify(token, `${jwtKey}`);
    //get the verification objects and if it fails go to the error
    const userId = decodedToken.userId;
    //pass the userId in the request to prevent them from deleting someone else's stuff
    req.auth = { userId };
    //
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({ message: "unauthorized request" });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
