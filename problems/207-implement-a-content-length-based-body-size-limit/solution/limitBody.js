export function limitBody(maxBytes) {
  return function (req, res, next) {
    const raw = req.headers['content-length'];
    if (raw === undefined) {
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) return res.status(411).json({ message: 'Length Required' });
      return next();
    }
    if (!/^\d+$/.test(raw)) return res.status(400).json({ message: 'Invalid Content-Length' });
    if (Number(raw) > maxBytes) return res.status(413).json({ message: 'Payload Too Large' });
    next();
  };
}
