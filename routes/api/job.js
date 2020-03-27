const express = require('express');
const router = express.Router();

//import controllers

const { createJob, createJobs } = require('../../controllers/job');

router.route('/users').get(getUsers);


router.route('/user/update').put(allowIfSignedin, update);



module.exports = router;