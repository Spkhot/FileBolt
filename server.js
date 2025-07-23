const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const path = require('path');

dotenv.config();

const app = express();

// Serve static files
app.use(express.static('public'));

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

// Routes
const uploadRoutes = require('./routes/uploadRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const deleteRoutes = require('./routes/deleteRoutes');
const zipRoute = require('./routes/zipRoute');
const fileRoute = require('./routes/fileRoute');

app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/delete', deleteRoutes);
app.use('/api/zip', zipRoute);
app.use('/api/file', fileRoute);

// Cloudinary config
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cleanup expired files every hour
const FileGroup = require('./models/FileGroup');

cron.schedule('0 * * * *', async () => {
  console.log('🧹 Running hourly cleanup...');
  const expired = await FileGroup.find({
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  for (const group of expired) {
    for (const file of group.files) {
      if (file.cloudinaryId) {
        await cloudinary.uploader.destroy(file.cloudinaryId);
      }
    }
    await group.deleteOne();
  }
  console.log(`✅ Expired files cleaned`);
});

// Fallback test route
app.get('/ping', (req, res) => {
  res.send('pong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
