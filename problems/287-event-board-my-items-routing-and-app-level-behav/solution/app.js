import express from 'express';
import routes from './routes.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/events', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (process.env.DEBUG) console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
