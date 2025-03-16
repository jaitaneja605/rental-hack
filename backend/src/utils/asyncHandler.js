// const asyncHandler = (fn) => {
//   return (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch((err) => {
//       return res.status(err.statusCode).json({
//         statusCode: err.statusCode,
//         message: err.message,
//       });
//       // next(err);
//     });
//   };
// };

// export { asyncHandler };
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      const statusCode = err.statusCode || 500; // Default to 500 if statusCode is not defined
      return res.status(statusCode).json({
        statusCode,
        message: err.message || "Internal Server Error", // Provide a default message
      });
    });
  };
};

export { asyncHandler };
