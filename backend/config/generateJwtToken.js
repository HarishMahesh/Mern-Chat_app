const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "harish", { expiresIn: "30d" });
};

module.exports = generateToken;
