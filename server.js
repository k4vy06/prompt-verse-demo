import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

console.log('Starting server...');
console.log('Serving files from:', path.join(__dirname, 'dist'));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log('Serving request for:', req.url);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server is successfully listening on port ${PORT}`);
});
