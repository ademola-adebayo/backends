const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

//sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**1: Method */
// exports.signup = (req, res) => {
//   //console.log('REQ BODY ON SIGNUP', req.body)
//   const { name, email, password } = req.body;

//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: 'Email is taken'
//       });
//     }
//   });

//   let newUser = new User({
//     name,
//     email,
//     password
//   });

//   newUser.save((err, success) => {
//     if (err) {
//       console.log('SIGNUP ERROR', err);
//       return res.status(400).json({
//         error: err
//       });
//     }
//     res.json({
//       message: 'Signup success!Please sign in'
//       // user: newUser
//     });
//   });
// };

/**2:Method send a confirmation email */
exports.signup = (req, res) => {
  /**
   * if you used the above approach signup user in reall world app
   *no problem it works but you will be saving a lot of junk users in your database
   people will signup with whatever email and it works....
   but lets use the concept of email confirmation when they want to signup, we will send them an email, if they used valid email only then they will be able to see the confirmation on tha email.
   */
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken'
      });
    }

    const token = jwt.sign(
      {
        name,
        email,
        password
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '10m' }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `<h2>Please use the following link to activate your account</h2>
      <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
      <hr/>
      <p>This email may contain sensitive information</p>
      <p>${process.env.CLIENT_URL}</p>
      `
    };

    sgMail
      .send(emailData)
      .then(sent => {
        return res.json({
          message: `Email has been sent to ${email}. Follow the instruction to activate your account`
        });
      })
      .catch(err => {
        //console.log('SIGNUP EMAIL SENT ERROR', err);
        return res.json({
          message: err.message
        });
      });
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(
      err,
      decoded
    ) {
      if (err) {
        console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
        return res.status(401).json({
          error: 'Expired link. Signup again'
        });
      }

      const { name, email, password } = jwt.decode(token);

      const user = new User({ name, email, password });

      user.save((err, user) => {
        if (err) {
          console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
          return res.status(401).json({
            error: 'Error saving user in database.Try signup again.'
          });
        }

        return res.json({
          message: 'Signup successfull. Please sign in'
        });
      });
    });
  } else {
    return res.json({
      message: 'Something went wrong.Try again.'
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  //check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup.'
      });
    }

    //authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match.'
      });
    }

    //generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role }
    });
  });
};


exports.allowIfSignedin = expressJwt({
  secret: process.env.JWT_SECRET //req.user
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({_id: req.user._id}).exec((err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }

    if(user.role !== 'admin') {
      return res.status(400).json({
        error: 'Admin resource.Access denied.'
      });
    }

    req.profile = user;
    next();
  })
}
