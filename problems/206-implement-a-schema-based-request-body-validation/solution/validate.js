export function validate(schema) {
  return function (req, res, next) {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const errors = [];
    for (const [field, rule] of Object.entries(schema)) {
      const v = body[field];
      const fail = (message) => errors.push({ field, message });
      if (v === undefined || v === null) {
        if (rule.required) fail('is required');
        continue;
      }
      if (rule.type && typeof v !== rule.type) { fail('must be a ' + rule.type); continue; }
      if (typeof v === 'string') {
        if (rule.minLength !== undefined && v.length < rule.minLength) { fail('must have at least ' + rule.minLength + ' characters'); continue; }
        if (rule.maxLength !== undefined && v.length > rule.maxLength) { fail('must have at most ' + rule.maxLength + ' characters'); continue; }
      }
      if (typeof v === 'number') {
        if (rule.min !== undefined && v < rule.min) { fail('must be >= ' + rule.min); continue; }
        if (rule.max !== undefined && v > rule.max) { fail('must be <= ' + rule.max); continue; }
      }
      if (rule.enum && !rule.enum.includes(v)) { fail('must be one of: ' + rule.enum.join(', ')); continue; }
    }
    if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });
    next();
  };
}
