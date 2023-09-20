/* eslint-disable node/no-unsupported-features/es-syntax */
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

const checkID = (req, res, next, value) => {
  const id = value * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name and Price must be send in the body object',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    tours,
  });
};

const createNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return res.status(404).send('Something went wrong');
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    },
  );
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  if (Object.keys(req.body).length === 0 || req.body === undefined) {
    return res.status(404).json({
      status: 'fail',
      message: 'Body must not b empty!',
    });
  }

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  const indexOfTour = tours.indexOf(tour);
  const newTour = { ...tour, ...req.body };
  tours[indexOfTour] = newTour;

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return res.status(404).send('Something went wrong');
      res.status(200).json({
        status: 'success',
        data: newTour,
      });
    },
  );
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const updateToursList = tours.filter((el) => el.id !== id);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updateToursList),
    (err) => {
      if (err) return res.status(404).send(`Something went wrong`);
      res.status(204).json({
        status: 'success',
        data: 'null',
      });
    },
  );
};

module.exports = {
  getAllTours,
  createNewTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
};
