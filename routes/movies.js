const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().select("-__v").sort("name");
    res.send(movies);
  } catch (error) {
    return res.status(400).send("Bad Request.");
  }
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.body.genreId);
    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      publishDate: moment().toJSON(),
    });
    await movie.save();

    res.send(movie);
  } catch (error) {
    return res.status(400).send("Invalid genre.");
  }
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let genre;
    try {
      genre = await Genre.findById(req.body.genreId);
    } catch (error) {
      return res.status(400).send("Invalid genre.");
    }
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { new: true }
    );
    res.send(movie);
  } catch (error) {
    return res.status(404).send("The movie with the given ID was not found.");
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    res.send(movie);
  } catch (error) {
    return res.status(404).send("The movie with the given ID was not found.");
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).select("-__v");
    res.send(movie);
  } catch (error) {
    return res.status(404).send("The movie with the given ID was not found.");
  }
});

module.exports = router;
