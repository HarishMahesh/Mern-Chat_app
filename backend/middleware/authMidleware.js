const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asynchandeler = require("express-async-handler");

const verifyUser = asynchandeler(async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "harish");

      let { name, pic, email, _id } = await User.findById(decoded.id);
      req.user = { name, pic, email, _id };

      next();
    } catch (err) {
      res
        .status(401)
        .json({ message: "Authorizarion is failed or token failed" });
    }
  } else {
    res.status(401).json({ message: "user is not authorised" });
  }
});

module.exports = verifyUser;
