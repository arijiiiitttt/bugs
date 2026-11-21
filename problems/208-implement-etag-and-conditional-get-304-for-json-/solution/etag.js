import { createHash } from 'node:crypto';

export function etagJson(req, res, data) {
  const text = JSON.stringify(data);
  const etag = 'W/"' + createHash('sha1').update(text).digest('hex').slice(0, 16) + '"';
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'no-cache');
  const header = req.headers['if-none-match'];
  if (header) {
    const strip = (t) => t.trim().replace(/^W\//, '');
    const tags = header.split(',').map(strip);
    if (tags.includes('*') || tags.includes(strip(etag))) return res.status(304).end();
  }
  res.status(200).type('application/json').send(text);
}
