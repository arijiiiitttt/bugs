import express from 'express';

export function createApp() {
  const app = express();
  const api = express.Router();

  app.get('/', (req, res) => res.json({ name: 'api' }));
  app.get('/ping', (req, res) => res.type('text').send('pong'));
  api.get('/items', (req, res) => res.json([1, 2, 3]));
  app.use('/api', api);

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  return app;
}
