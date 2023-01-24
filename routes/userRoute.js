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

//GET SINGLE
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

//GET ALL
// Protected
// Only Admins
router.get("", verifyJWT, async (req, res) => {
  // query can be like filters etc(/api/users?new=true)
  const query = req.query.new;
  try {
    if (req.user.isAdmin) {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
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

// GET user Stats
// OPEN
router.get("/stats", async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        // grab month from createdAt attribute from each entry
        // 2023-01-20T07 - 1 ,2023-02-20T07 - 2
        $project: {
          month: { $month: "$createdAt" },
        },
        //
      },
      // count number of 1s,2s ....12s ans sum up with key as month that is 1 or 2 -> 1 - 10,2-5 etc
      {
        $group: { _id: "$month", total: { $sum: 1 } },
      },
    ]);
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while getting user stats" });
  }
});

module.exports = router;

// const today = new Date();

// const lastYear = today.getFullYear() - 1;
// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
// const users = await User.find();
// let userCdatesM = users.map(
//   (user) => months[new Date(user.createdAt).getMonth()]
// );
// console.log(userCdatesM);
// try {
//   var monthToUser = {
//     January: 0,
//     February: 0,
//     March: 0,
//     April: 0,
//     May: 0,
//     June: 0,
//     July: 0,
//     August: 0,
//     September: 0,
//     October: 0,
//     November: 0,
//     December: 0,
//   };
//   userCdatesM.map((month) => (monthToUser[month] += 1));
//   res.status(201).json({ data: [monthToUser] });
// }
