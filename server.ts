import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser with a high limit to allow base64 uploads
  app.use(express.json({ limit: '15mb' }));

  const publicFramesDir = path.join(process.cwd(), 'public', 'frames');
  
  // Ensure the public/frames directory exists
  try {
    fs.mkdirSync(publicFramesDir, { recursive: true });
    console.log(`Verified custom frames directory: ${publicFramesDir}`);
  } catch (err) {
    console.error('Failed to create public/frames directory:', err);
  }

  // Serve custom frames statically at /frames
  app.use('/frames', express.static(publicFramesDir));

  // API Route to fetch active custom frames
  app.get('/api/frames', (req, res) => {
    try {
      const hasVertical = fs.existsSync(path.join(publicFramesDir, 'vertical.png'));
      const hasHorizontal = fs.existsSync(path.join(publicFramesDir, 'horizontal.png'));
      
      res.json({
        vertical: hasVertical ? '/frames/vertical.png' : null,
        horizontal: hasHorizontal ? '/frames/horizontal.png' : null,
      });
    } catch (error) {
      console.error('Error checking custom frames:', error);
      res.status(500).json({ error: 'Failed to retrieve frames state' });
    }
  });

  // API Route to update/save custom frames
  app.post('/api/frames', (req, res) => {
    try {
      const { type, image } = req.body;
      
      if (!type || !['vertical', 'horizontal'].includes(type)) {
        return res.status(400).json({ error: 'Invalid frame type' });
      }

      const fileName = type === 'vertical' ? 'vertical.png' : 'horizontal.png';
      const filePath = path.join(publicFramesDir, fileName);

      if (!image) {
        // If image is empty or null, remove the custom frame
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Removed official custom ${type} frame from ${filePath}`);
        }
        return res.json({ success: true, removed: true });
      }

      // Convert base64 data URL to buffer and save
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        // In case it's already a server-served frame URL, we can just keep it or return success
        if (typeof image === 'string' && image.includes('/frames/')) {
          return res.json({ success: true, skipped: true, message: 'Already a server-served frame' });
        }
        return res.status(400).json({ error: 'Invalid base64 image data' });
      }

      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      fs.writeFileSync(filePath, buffer);
      console.log(`Saved official custom ${type} frame to ${filePath}`);
      
      res.json({ success: true, url: `/frames/${fileName}` });
    } catch (error) {
      console.error('Error saving custom frame:', error);
      res.status(500).json({ error: 'Failed to save frame' });
    }
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware integrated for development mode');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production build from dist');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
