const express = require('express');
const router = express.Router();

//import controllers
const { allowIfSignedin, adminMiddleware } = require('../../controllers/auth');
const { getUsers, read, update } = require('../../controllers/user');

router.route('/users').get(getUsers);

router.route('/user/:id').get(allowIfSignedin, read);

router.route('/user/update').put(allowIfSignedin, update);

router.route('/admin/update').put(allowIfSignedin, adminMiddleware, update);

module.exports = router;
