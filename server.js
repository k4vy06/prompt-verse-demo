import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const root = path.resolve(__dirname, 'dist');

console.log('--- SYSTEM BOOT ---');
console.log('Target Directory:', root);

if (!fs.existsSync(root)) {
  console.error('CRITICAL ERROR: dist directory not found!');
  process.exit(1);
}

app.use(express.static(root));

app.get('*', (req, res) => {
  const indexPath = path.join(root, 'index.html');
  console.log('REQ:', req.url, '->', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server live on port ${PORT}`);
});
