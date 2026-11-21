export function envelope(req, res, next) {
  res.ok = (data, meta) => {
    const body = { success: true, data };
    if (meta !== undefined) body.meta = meta;
    return res.status(200).json(body);
  };
  res.created = (data) => res.status(201).json({ success: true, data });
  res.fail = (status, message, details) => {
    const error = { message };
    if (details !== undefined) error.details = details;
    return res.status(status).json({ success: false, error });
  };
  next();
}
