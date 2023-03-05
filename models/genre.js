const Joi = require("joi");
const mongoose = require("mongoose");

mongoose.connect(process.env.VIDLY_DB || "mongodb://127.0.0.1/vidly");

const genreSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
  };

  return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
