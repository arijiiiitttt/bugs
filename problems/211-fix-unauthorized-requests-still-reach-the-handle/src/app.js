import express from 'express';

export const stats = { handled: 0 };

export function createApp() {
  stats.handled = 0;
  const app = express();

  // authentication
  app.use((req, res, next) => {
    if (req.headers['x-token'] !== 'secret') {
      res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  });

  // language detection
  app.use((req, res, next) => {
    const header = req.headers['accept-language'];
    if (header) {
      req.lang = header.split(',')[0].trim().toLowerCase();
      next();
    }
  });

  app.post('/orders', (req, res) => {
    stats.handled++;
    res.status(201).json({ lang: req.lang });
  });

  return app;
}
