const router = require("express").Router();

const List = require("../models/List");

const verifyJWT = require("../middleware/verifyJWT");

// CREATE / POST
// Protected / Only Admin

router.post("/", verifyJWT, async (req, res) => {
  if (req.user.isAdmin) {
    const newlist = new List(req.body);
    try {
      const savedList = await newlist.save();
      res
        .status(201)
        .json({ message: "List added successfully", data: savedList });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error while creating a list" });
    }
  } else {
    res
      .status(401)
      .json({ message: "You do not have permission to create a list" });
  }
});

// DELETE
// Protected / Only Admin

router.delete("/:id", verifyJWT, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const deletedList = await List.findByIdAndDelete(req.params.id);
      res
        .status(201)
        .json({ message: "List deleted successfully", data: deletedList });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error while deleting a list" });
    }
  } else {
    res
      .status(401)
      .json({ message: "You do not have permission to delete a list" });
  }
});

// GET ALL
// Protected

// UPDATE/PUT
// Protected / Only Admin
// params - id

router.put("/:id", verifyJWT, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      let updatedList;
      if (req.body.type == "push") {
        updatedList = await List.findByIdAndUpdate(
          req.params.id,
          { $push: { content: req.body.movieId } },
          { new: true }
        );
      } else {
        updatedList = await List.findByIdAndUpdate(
          req.params.id,
          {
            $pull: { content: req.body.movieId },
          },
          { new: true }
        );
      }

      res
        .status(201)
        .json({ message: "List updated successfully", data: updatedList });
    } catch (err) {
      res.status(500).json({ message: "Error while updating a List" });
      console.log(err);
    }
  } else {
    res.status(500).json({ message: "You do not have permission to update" });
  }
});

router.get("", verifyJWT, async (req, res) => {
  // get lists via type and genre
  //   no type - homepage , type-movie -> movie page etc
  const type = req.query.type;
  const genre = req.query.genre;
  let list;
  try {
    if (type) {
      // user selects a specific genre
      if (genre) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: type, genre: genre } },
        ]);
      } else {
        // default type page
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: type } },
        ]);
      }
    } else {
      //genre selection will not be on homepage
      // get 10 random lists
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    return res.status(200).json({ data: list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while getting lists" });
  }
});

module.exports = router;
