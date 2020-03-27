const Job = require('../models/job');
const createJob = async(req, res,next) => {

}

const getJobs = async(req, res,next) => {
  const jobs = await Job.find({}).exec();
  res.json(jobs)
}

exports.createJob = createJob;
exports.getJobs = getJobs;