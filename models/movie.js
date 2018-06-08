const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 255
  }
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(50)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .max(255),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(255)
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validate = validateMovie;
