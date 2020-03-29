const mongoose = require('mongoose');


const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true
  },
  faveFoods: [{type: String}],
  info: {
    school: {
      type: String
    },
    shoeSize: {
      type: Number
    }
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'School'
  }
},{timestamps: true});


const SchoolSchema = new mongoose.Schema({
  name: String,
  openSince:Number,
  students: Number,
  isGreat: Boolean
})
module.exports = mongoose.model('School', SchoolSchema);
module.exports = mongoose.model('Student', StudentSchema);