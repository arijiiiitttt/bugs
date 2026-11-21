import express from 'express';

export function createApp() {
  const app = express();
  const notes = [];

  const router = express.Router();
  router.get('/notes', (req, res) => res.json(notes));
  router.post('/notes', (req, res) => {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ message: 'text is required' });
    const note = { id: notes.length + 1, text, by: req.user.name };
    notes.push(note);
    res.status(201).json(note);
  });

  app.get('/health', (req, res) => res.type('text').send('ok'));

  app.use(express.json());

  app.use('/api', (req, res, next) => {
    if (req.headers.authorization !== 'Bearer secret-token') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = { name: 'ann' };
    next();
  });

  app.use('/api', router);

  return app;
}
