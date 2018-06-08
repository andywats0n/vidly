const Joi = require("joi");
const mongoose = require("mongoose");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    rentalDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    returnDate: {
      type: Date
    },
    rentalFee: {
      type: Number,
      min: 0
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minLength: 5,
          maxLength: 255
        },
        dailyRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255
        }
      }),
      required: true
    },
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minLength: 5,
          maxLength: 50
        },
        isGold: {
          type: Boolean,
          required: true
        },
        phone: {
          type: String,
          required: true,
          length: 10
        }
      }),
      required: true
    }
  })
);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
