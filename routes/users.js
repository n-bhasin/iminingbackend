const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/health", async (req, res) => {
  // const user = await User.findById(req.user._id).sort("-date");
  res.status(200).send("OK!");
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).sort("-date");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  console.log("users", req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  //check for email
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with this email already exists.");

  user = new User(_.pick(req.body, ["email", "name", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "email"]));
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req,
    params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      password: req.body.password,
    },
    { new: true }
  );

  if (!user) return res.send(400).send("The user with given id is not found.");

  res.send(user);
});
module.exports = router;
