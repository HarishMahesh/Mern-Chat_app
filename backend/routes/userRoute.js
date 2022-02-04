const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateJwtToken = require("../config/generateJwtToken");
const verifyUser = require("../middleware/authMidleware");

const Router = express();

const userRegister = asyncHandler(async (req, res) => {
  let { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("required fileds input missing");
  }

  let isEmailAvailable = await User.findOne({ email: email });

  if (isEmailAvailable) {
    res.status(400).json({ message: "Email allready exists" });
    //throw new Error("Email allready exists");
  }

  let encryptedPassword = await bcrypt.hash(password, 10);

  // to create a document in the db
  let userCreated = await User.create({
    name,
    email,
    password: encryptedPassword,
    pic,
  });

  if (userCreated) {
    res.status(201).json({
      name: userCreated.name,
      _id: userCreated._id,
      email: userCreated.email,
      pic: userCreated.pic,
      token: generateJwtToken(userCreated._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const authoriseUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        name: user.name,
        _id: user._id,
        email: user.email,
        pic: user.pic,
        token: generateJwtToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid username or password" });
      // throw new Error("Invalid username or password");
    }
  } catch (err) {
    res.status(400).json({ message: "Internal server error" });
  }
});

// api/users?serach=piyush
const getUsers = asyncHandler(async (req, res) => {
  let search = req.query.search;
  let querryCmd;
  if (search) {
    querryCmd = {
      name: { $regex: search, $options: "i" },
    };
  } else {
    querryCmd = {};
  }

  let data = await User.find(querryCmd).find({ _id: { $ne: req.user._id } });
  res.status(200).json(data);
});

Router.post("/register", userRegister); // for creating new user
Router.post("/", authoriseUser);
Router.get("/", verifyUser, getUsers);

module.exports = Router;
