const { Admin, validate } = require("../models/admin");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const admin = await Admin.findById(req.user._id).sort("-date");
  res.send(admin);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check for email
  let admin = await Admin.findOne({ email: req.body.email });
  if (admin)
    return res.status(400).send("User with this email already exists.");

  admin = new Admin(
    _.pick(req.body, ["email", "name", "password", "walletAddr"])
  );
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
  await admin.save();

  const token = admin.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(admin, ["_id", "email", "name", "walletAddr"]));
});

module.exports = router;
