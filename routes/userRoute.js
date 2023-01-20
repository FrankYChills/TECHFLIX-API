const router = require("express").Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

// use JWT Middleware for authentication
const verifyJWT = require("../middleware/verifyJWT");

// UPDATE
// Protected
// params - id
router.put("/:id", verifyJWT, async (req, res) => {
  try {
    // only user itself or admin can update a user
    // req.user is coming from verify JWT
    if (req.user.id == req.params.id || req.user.isAdmin) {
      // if user wants to update password, hash that
      if (req.body.password) {
        req.body.password = bcrypt.hash(req.body.password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const { password, ...otherInfo } = updatedUser._doc;
      res
        .status(201)
        .json({ message: "User updated successfully", data: otherInfo });
    } else {
      return res
        .status(401)
        .json({ message: "You can only update your account" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while updating a user" });
  }
});

// DELETE
// Protected
// params - id
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    // only user itself or admin can update a user
    // req.user is coming from verify JWT
    if (req.user.id == req.params.id || req.user.isAdmin) {
      const updatedUser = await User.findByIdAndDelete(req.params.id);

      res.status(201).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(401)
        .json({ message: "You can only delete your account" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while updating a user" });
  }
});

//GET
// OPEN
//params - id
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid user id" });
    }
    const { password, ...otherInfo } = user._doc;
    res.status(201).json({ data: otherInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while getting a user" });
  }
});

//GET
// Protected
// Only Admins
router.get("", verifyJWT, async (req, res) => {
  // query can be like filters etc(/api/users?new=true)
  const query = req.query.new;
  try {
    if (req.user.isAdmin) {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(10)
        : await User.find().sort({ _id: -1 });
      res.status(201).json({ data: users });
    } else {
      return res.status(401).json({ message: "UnAuthorized | Only admins" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while getting all users" });
  }
});

module.exports = router;
