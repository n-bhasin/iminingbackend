const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const jwtPrivateKey = process.env.JWTPRIVATEKEY;
// const userSchema = new mongoose.Schema({
//   title: { type: String, minlength: 1, maxlength: 50 },

//   firstName: { type: String, required: true, minlength: 3, maxlength: 50 },
//   middleName: { type: String },
//   lastName: { type: String, required: true, minlength: 3, maxlength: 50 },
//   birthDate: { type: String, required: true, minlength: 3, maxlength: 50 },
//   language: { type: String, required: true },
//   streetNumber: { type: String, required: true },
//   streetAddress: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   city: { type: String, required: true },
//   country: { type: String, required: true },
//   photoId1: { type: String },
//   photoId2: { type: String },
//   employmentStatus: { type: String },
//   civilStatus: { type: String },
//   amountLikeDeposit: { type: String },
//   email: { type: String, required: true, minlength: 5, maxlength: 50 },
//   password: { type: String, required: true, minlength: 5, maxlength: 1024 },
//   confirmPassword: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 1024,
//   },
// });

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, minlength: 5, maxlength: 50 },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, email: this.email }, jwtPrivateKey);
  return token;
};
const User = mongoose.model("User", userSchema);

function validateAdmin(admin) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().email(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(5).max(1024).required(),
  });

  return schema.validate(admin);
}

exports.User = User;
exports.validate = validateAdmin;
