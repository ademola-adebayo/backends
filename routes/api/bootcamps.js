const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  getBootcamps,
  getBootcampById,
  getBootcampsByUserId,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
} = require('../../controllers/bootcamps');
const { placeValidator } = require('../../validators/auth');

const { runValidation } = require('../../validators');

router.route('/user/:uid').get(getBootcampsByUserId);

router
  .route('/bootcamps/radius/:zipcode/:distance')
  .get(getBootcampsInRadius);
  
router
  .route('/bootcamps')
  .get(getBootcamps)
  .post(runValidation, createBootcamp);

router
  .route('/bootcamps/:id')
  .get(getBootcampById)
  .patch(
    [
      check('title')
        .not()
        .isEmpty(),
      check('description').isLength({ min: 5 })
    ],
    updateBootcamp
  )
  .delete(deleteBootcamp);

module.exports = router;
