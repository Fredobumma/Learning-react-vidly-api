const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().select("-__v").sort("name");
    res.send(genres);
  } catch (error) {
    return res.status(400).send("Bad Request.");
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
  } catch (error) {
    return res.status(500).send("Something failed.");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true,
      }
    );
    res.send(genre);
  } catch (error) {
    return res.status(404).send("The genre with the given ID was not found.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    res.send(genre);
  } catch (error) {
    return res.status(404).send("The genre with the given ID was not found.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id).select("-__v");
    res.send(genre);
  } catch (error) {
    return res.status(404).send("The genre with the given ID was not found.");
  }
});

module.exports = router;
