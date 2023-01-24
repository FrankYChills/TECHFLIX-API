const router = require("express").Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  // create a new user
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  };

  try {
    const user = await User.create(newUser);
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(401).json({ message: "User doesn't exists!" });
    }
    const { password, ...otherInfo } = user._doc;

    const passCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passCheck) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // create jwt access token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res
      .status(200)
      .json({ message: "Success", data: { ...otherInfo, accessToken } });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
