export function requestLogger(log) {
  return function (req, res, next) {
    res.on('finish', () => {
      log(req.method + ' ' + req.originalUrl + ' ' + res.statusCode);
    });
    next();
  };
}
