export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const valid = (n) => Number.isInteger(n) && n >= 400 && n <= 599;
  const status = valid(err && err.status) ? err.status : valid(err && err.statusCode) ? err.statusCode : 500;
  let message;
  if (status >= 500) message = 'Internal Server Error';
  else if (err.type === 'entity.parse.failed') message = 'Invalid JSON';
  else message = err.message;
  res.status(status).json({ message });
}
