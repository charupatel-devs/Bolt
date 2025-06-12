// utils/catchAsync.js
// Wrapper function to catch async errors and pass them to error middleware

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
