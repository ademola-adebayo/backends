const User = require('../models/User');

exports.getUsers = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    const user = users.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role
    }));
    res.status(200).json(user);
  });
};

exports.read = (req, res) => {
  const userId = req.params.id;
  console.log('user', res.locals);
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.status(200).json(user);
  });
};

exports.update = (req, res) => {
  console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA - req.body', req.body);
  const { name, password} = req.body;

  User.findOne({_id: req.user._id}, (err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: 'User not found'
      })
    }
    if(!name) {
      return res.status(400).json({
        error: 'Name is required'
      })
    } else {
      user.name = name;
    }

    if(password) {
      if(password.length < 6) {
        return res.status(400).json({
          error: 'Password should be min 6 characters long'
        });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if(err) {
        console.log('USER UPDATE ERROR', err);
        return res.status(400).json({
          error: 'User update failed'
        });
      }

      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.status(200).json(updatedUser);
    })
  });
};
