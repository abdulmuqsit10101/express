const express = require('express');
const {
  getAllTours,
  createNewTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTop5Tours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const { protect } = require('../controllers/authController');

const router = express.Router();

// router.param('id', checkID);

router.route('/top-5-cheap').get(aliasTop5Tours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createNewTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
