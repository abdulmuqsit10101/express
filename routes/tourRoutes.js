const express = require('express');
const { getAllTours, createNewTour, getTour, updateTour, deleteTour } = require("../controllers/tourController.js");

const router = express.Router();

router
    .route('/')
    .get(getAllTours)
    .post(createNewTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router;