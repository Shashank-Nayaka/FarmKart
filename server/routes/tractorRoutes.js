const express = require('express');
const router = express.Router();
const {
  getTractors,
  getAllTractorsAdmin,
  getMyTractors,
  createTractor,
  updateTractor,
  deleteTractor,
} = require('../controllers/tractorController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getTractors)
  .post(protect, createTractor);

router.get('/my-tractors', protect, getMyTractors);
router.get('/admin/all', protect, adminOnly, getAllTractorsAdmin);

router.route('/:id')
  .put(protect, updateTractor)
  .delete(protect, deleteTractor);

module.exports = router;
