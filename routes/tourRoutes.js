const express = require('express');
const {
  getAllTours,
  createNewTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTop5Tours,
} = require('../controllers/tourController');

const router = express.Router();

// router.param('id', checkID);

router.route('/top-5-cheap').get(aliasTop5Tours, getAllTours);

router.route('/').get(getAllTours).post(createNewTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
