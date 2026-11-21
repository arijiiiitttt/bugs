export function cors({ origins = [], methods = ['GET', 'POST', 'PUT', 'DELETE'], headers = ['Content-Type', 'Authorization'], maxAge = 600 } = {}) {
  return function (req, res, next) {
    const origin = req.headers.origin;
    res.setHeader('Vary', 'Origin');
    const allowed = Boolean(origin) && (origins.includes('*') || origins.includes(origin));
    if (allowed) res.setHeader('Access-Control-Allow-Origin', origin);
    if (req.method === 'OPTIONS' && req.headers['access-control-request-method']) {
      if (allowed) {
        res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
        res.setHeader('Access-Control-Allow-Headers', headers.join(', '));
        res.setHeader('Access-Control-Max-Age', String(maxAge));
      }
      return res.status(204).end();
    }
    next();
  };
}
