const { validationResult } = require('express-validator');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

//@desc   Get all bootcamps
//@route  GET /api/bootcamps
//@access Public
const getBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find().sort('name');
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Getting bootcamps failed.please try again.'
    });
  }
};

//@desc   Get single bootcamp
//@route  GET /api/bootcamps/:id
//@access Public
const getBootcampById = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.id;

  await Bootcamp.findById(bootcampId).exec((err, bootcamp) => {
    if (err || !bootcamp) {
      return next(err);
    }

    res.status(200).json({
      success: true,
      msg: `Bootcamp with the id: ${bootcampId} retrieved successfully`,
      data: bootcamp
    });
  });
});

const getBootcampsByUserId = (req, res, next) => {
  const userId = req.params.id;

  res.json({ success: true, msg: `Get places by userId ${userId}` });
};

//@desc   Create new bootcamp
//@route  POST /api/bootcamps
//@access Private
const createBootcamp = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    website,
    phone,
    email,
    address,
    careers,
    housing,
    jobAssitance,
    jobGuarantee,
    acceptGi
  } = req.body;
  //const createdBootcamp = await Bootcamp.create(req.body);
  const createdBootcamp = new Bootcamp({
    name,
    description,
    website,
    phone,
    email,
    address,
    careers,
    housing,
    jobAssitance,
    jobGuarantee,
    cv:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_state_Building_%28aerial_view%29.jpg',
    acceptGi
  });

  await createdBootcamp.save();

  res.status(201).json({
    success: true,
    data: createdBootcamp
  });
});

//@desc   Update bootcamp
//@route  PUT /api/bootcamps/:id
//@access Private
const updateBootcamp = asyncHandler(async (req, res) => {
  await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).exec((err, bootcamp) => {
    if (err || !bootcamp) {
      return res.status(400).json({
        error: 'Bootcamp not updated'
      });
    }

    res.status(200).json({
      success: true,
      msg: `Bootcamp with the id: ${req.params.id} updated successfully`,
      data: bootcamp
    });
  });
});

//@desc   Delete bootcamp
//@route  DELETE /api/bootcamps/:id
//@access Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.id;

  await Bootcamp.findByIdAndDelete(bootcampId).exec((err, bootcamp) => {
    if (err || !bootcamp) {
      return res.status(400).json({
        error: 'Bootcamp not deleted'
      });
    }

    res.status(200).json({
      success: true,
      msg: `Bootcamp with the id: ${bootcampId} deleted successfully`,
      data: {}
    });
  });
});

exports.getBootcamps = getBootcamps;
exports.getBootcampById = getBootcampById;
exports.getBootcampsByUserId = getBootcampsByUserId;
exports.createBootcamp = createBootcamp;
exports.updateBootcamp = updateBootcamp;
exports.deleteBootcamp = deleteBootcamp;
