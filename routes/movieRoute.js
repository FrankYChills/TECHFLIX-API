const router = require("express").Router();

const Movie = require("../models/Movie");

const verifyJWT = require("../middleware/verifyJWT");

// CREATE/POST
// Protected / Only Admin
router.post("/", verifyJWT, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      res
        .status(201)
        .json({ message: "Movie added successfully", data: savedMovie });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error while creating new movie" });
    }
  } else {
    res.status(401).json({ message: "You do not have permission to create" });
  }
});

// UPDATE/PUT
// Protected / Only Admin
// params - id

router.put("/:id", verifyJWT, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res
        .status(201)
        .json({ message: "Movie updated successfully", body: updatedMovie });
    } catch (err) {
      res.status(500).json({ message: "Error while updating a movie" });
    }
  } else {
    res.status(500).json({ message: "You do not have permission to update" });
  }
});

// DELETE
// Protected / Only Admin
// params - id

router.delete("/:id", verifyJWT, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(201).json({ message: "Movie deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error while deleting a movie" });
    }
  } else {
    res.status(500).json({ message: "You do not have permission to delete" });
  }
});

// GET /By id
// Protected
router.get("/find/:id", verifyJWT, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching a movie" });
  }
});

// GET RANDOM
// query - type(eg - series,movie)
// Protected
router.get("/random", verifyJWT, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }

    res.status(200).json({ data: movie });
  } catch (err) {
    res.status(500).json({ message: "Error while fetching a movie" });
  }
});

// GET ALL
// Protected/ Only Admin
router.get("", verifyJWT, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      res.status(201).json({ data: movies });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error while fetching all movies" });
    }
  } else {
    res
      .status(401)
      .json({ message: "You do not have permission to fetch all movies" });
  }
});

module.exports = router;
