import { db } from './store.js';

/** Reads the x-user-id header and attaches the matching user to req.user. */
export function requireAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(403).json({ message: 'Not authenticated' });
  }

  const user = db.users.find((u) => u._id === userId);

  req.user = user;
  next();
}
