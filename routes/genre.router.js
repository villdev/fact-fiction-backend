const router = require("express").Router();
const Genre = require("../models/genre.model");
const productData = require("../productData");

router.param("genreId", async (req, res, next, genreId) => {
  try {
    const genreFound = await Genre.findById(genreId).populate("items");
    if (!genreFound) {
      res.status(404).json({ success: false, message: "Genre not found!" });
    }
    req.genre = genreFound;
    next();
  } catch (error) {
    console.error(error);
    // ! change status code accordingly
    res
      .status(404)
      .json({ success: false, message: "Error while retrieving book." });
  }
});

router
  .route("/")
  .get(async (req, res) => {
    try {
      const allGenres = await Genre.find({});
      if (!allGenres) {
        res.status(404).json({ success: false, message: "No genres found!" });
      }
      res.status(200).json({ success: true, genres: allGenres });
      // res.status(200).json({success: true, genres: {allGenres}});
    } catch (error) {
      console.error(error);
      res
        .status(+error.code)
        .json({ success: false, message: "Error while retrieving genres." });
    }
  })
  .post(async (req, res) => {
    try {
      let tempGenres = [];
      productData.forEach((product) => {
        tempGenres = [...tempGenres, ...product.genres];
      });
      const allUniqueGenres = Array.from(new Set(tempGenres));
      allUniqueGenres.forEach(async (genre) => {
        const genrePresent = await Genre.findOne({ name: genre });
        if (genrePresent) return;

        const newGenre = new Genre({
          name: genre,
        });
        const savedGenre = await newGenre.save();
        if (!savedGenre) {
          res
            .status(500)
            .json({ success: false, message: "Could not create the genre." });
        }
      });
      res.status(201).json({
        success: true,
        message: "Successfully added all genres to database.",
      });
    } catch (error) {
      console.error(error);
      res
        .status(+error.code)
        .json({ success: false, message: "Failed to add all genres." });
    }
  });

router.get("/:genreId", async (req, res) => {
  try {
    res.status(200).json({ success: true, genre: req.genre });
  } catch (error) {
    console.error(error);
    res
      .status(+error.code)
      .json({ success: false, message: "Error while retrieving genre." });
  }
});

module.exports = router;
