const { check } = require('express-validator');

exports.userSignupValidator = [
  check('name')
    .not()
    .isEmpty()  
    .withMessage('Name is required'),
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 chars long')
];

exports.userSigninValidator = [
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 chars long')
];


exports.placeValidator = [
  check('title')
    .not()
    .isEmpty(),
  check('description').isLength({ min: 5 }),
  check('address')
    .not()
    .isEmpty()
];
