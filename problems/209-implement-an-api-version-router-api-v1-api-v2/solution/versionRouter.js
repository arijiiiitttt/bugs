import { Router } from 'express';

export function versionRouter(versions) {
  const router = Router();
  router.use('/:version', (req, res, next) => {
    const target = Object.hasOwn(versions, req.params.version) ? versions[req.params.version] : undefined;
    if (!target) return res.status(404).json({ message: 'Unsupported API version' });
    target(req, res, next);
  });
  return router;
}
