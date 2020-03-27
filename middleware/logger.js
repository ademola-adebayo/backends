const colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: ['grey', 'bgBrightGreen'],
  data: ['grey','bold', 'bgBrightWhite'],
  help: 'cyan',
  warn: ['yellow','bold', 'bgBlack'],
  debug: ['blue', 'bgRed'],
  error: 'red'
});

//@desc Logs request to console
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`.cyan.underline.bold);
  next();
}

module.exports = logger;