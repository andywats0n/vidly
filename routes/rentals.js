const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const Fawn = require("fawn");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-rentalDate");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Customer not found.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Movie not found.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie is out of stock.");

  let rental = new Rental({
    rentalDate: req.body.rentalDate,
    returnDate: req.body.returnDate,
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRate: movie.dailyRate
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (e) {
    res.status(500).send("Something failed.");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      rentalDate: req.body.rentalDate,
      returnDate: req.body.returnDate,
      movie: {
        _id: movie._id,
        title: movie.title
      }
    },
    {
      new: true
    }
  );

  if (!rental)
    return res.status(404).send("Rental with given ID was not found.");
  res.send(rental);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send("Rental with given ID was not found.");
  res.send(rental);
});

router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental)
    return res.status(404).send("Rental with given ID was not found.");
  res.send(rental);
});

module.exports = router;
