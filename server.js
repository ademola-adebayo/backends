const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

require('colors');
require('dotenv').config();

const errorHandler = require('./middleware/error');
const logger = require('./middleware/logger');
const connectDBWithRetry = require('./config/db');


const app = express();

//add app middlewares and log routes
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());
app.use(logger);
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }


  res.status(error.code || 500).json({
    message: error.message || 'An unknown error occured!'
  });
});

//app.use(cors()); //allows all origins
if (process.env.NODE_ENV == 'development') {
  app.use(
    cors({
      origin: `${process.env.CLIENT_URL}`
    })
  );
}

//import routes
const authRoutes = require('./routes/api/auth');
const userRoutes = require('./routes/api/user');
const bootcampRoutes = require('./routes/api/bootcamps');

//add custom middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', bootcampRoutes);

app.use(errorHandler);

connectDBWithRetry();
const port = process.env.PORT || 8000;

const server = app.listen(port, () =>
  console.log(`API running on port ${port}`.yellow.bold)
);

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
