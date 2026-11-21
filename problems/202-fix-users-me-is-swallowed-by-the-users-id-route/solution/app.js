import express from 'express';

export function createApp() {
  const app = express();

  app.get('/users/me', (req, res) => {
    res.json({ me: true });
  });

  app.get('/users/:id', (req, res) => {
    if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    res.json({ id: Number(req.params.id) });
  });

  app.get('/users/:id/posts', (req, res) => {
    res.json({ userId: Number(req.params.id), posts: [] });
  });

  return app;
}
