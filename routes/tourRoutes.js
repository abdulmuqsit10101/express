const express = require('express');
const { getAllTours, createNewTour, getTour, updateTour, deleteTour, checkID, checkBody } = require("../controllers/tourController.js");

const router = express.Router();

router.param('id', checkID);

router
    .route('/')
    .get(getAllTours)
    .post(checkBody, createNewTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router;