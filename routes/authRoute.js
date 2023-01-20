const router = require("express").Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

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
    const { password, ...otherInfo } = user._doc;
    if (!user) {
      return res.status(401).json({ message: "User doesn't exists!" });
    }
    const passCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passCheck) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(201).json({ message: "Success", data: otherInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
