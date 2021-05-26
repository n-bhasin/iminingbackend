const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const jwtPrivateKey = process.env.jwtPrivateKey;

const adminSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, minlength: 5, maxlength: 50 },
  phone: { type: String, unique: true, maxlength: 10 },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  walletAddr: { type: String },
});

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, email: this.email }, jwtPrivateKey);
  return token;
};
const Admin = mongoose.model("Admin", adminSchema);

function validateAdmin(admin) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().email(),
    phone: Joi.string().min(3).max(10).required(),
    name: Joi.string().min(3).max(50).required(),
    walletAddr: Joi.string().optional(),
    password: Joi.string().min(3).max(255),
  });

  return schema.validate(admin);
}

exports.Admin = Admin;
exports.validate = validateAdmin;
