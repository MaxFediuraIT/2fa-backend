export const validation = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    error.message = "Validation error";
    error.status = 400;
    next(error);
  } else {
    next();
  }
};
