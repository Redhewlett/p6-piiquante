//calling mongoose to export the model and give the database a reference
const mongoose = require("mongoose");
//impose unique Email usage
const uniqueValidator = require("mongoose-unique-validator");

//the user model
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  //password will be ashed later
  password: { type: String, required: true },
});

//using the validator on the email
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
