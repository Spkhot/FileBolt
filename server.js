// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cron = require('node-cron');
// const path = require('path');

// dotenv.config();

// const app = express();

// // Serve static files
// app.use(express.static('public'));

// // DB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error(err));

// // Routes
// const uploadRoutes = require('./routes/uploadRoutes');
// const downloadRoutes = require('./routes/downloadRoutes');
// const deleteRoutes = require('./routes/deleteRoutes');
// const zipRoute = require('./routes/zipRoute');
// const fileRoute = require('./routes/fileRoute');

// app.use('/api/upload', uploadRoutes);
// app.use('/api/download', downloadRoutes);
// app.use('/api/delete', deleteRoutes);
// app.use('/api/zip', zipRoute);
// app.use('/api/file', fileRoute);

// // Cloudinary config
// const cloudinary = require('cloudinary').v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Cleanup expired files every hour
// const FileGroup = require('./models/FileGroup');

// cron.schedule('0 * * * *', async () => {
//   console.log('🧹 Running hourly cleanup...');
//   const expired = await FileGroup.find({
//     createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
//   });

//   for (const group of expired) {
//     for (const file of group.files) {
//       if (file.cloudinaryId) {
//         await cloudinary.uploader.destroy(file.cloudinaryId);
//       }
//     }
//     await group.deleteOne();
//   }
//   console.log(`✅ Expired files cleaned`);
// });

// // Fallback test route
// app.get('/ping', (req, res) => {
//   res.send('pong!');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const cors = require('cors'); // Added for handling cross-origin requests

// --- Initial Setup ---
dotenv.config();
const app = express();

// --- Core Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies from requests like text uploads
app.use(express.urlencoded({ extended: true })); // To parse form data

// Serve static files from the 'public' directory (for your HTML, CSS, etc.)
app.use(express.static('public'));

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Cloudinary Configuration ---
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- API Routes ---

// 1. ORIGINAL FILE ROUTES (Unchanged)
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


// 2. NEW TEXT NOTE ROUTES (Added)
const textRoutes = require('./routes/textRoutes'); // Import the new text routes
app.use('/api/text', textRoutes); // All text routes are now available under /api/text


// --- Scheduled Cleanup Job ---
const FileGroup = require('./models/FileGroup');
const TextNote = require('./models/TextNote'); // Import the new TextNote model

// This job runs at the top of every hour
cron.schedule('0 * * * *', async () => {
  console.log('🧹 Running hourly cleanup job...');
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // --- Cleanup for File Groups ---
  try {
    const expiredFiles = await FileGroup.find({ createdAt: { $lt: twentyFourHoursAgo } });
    for (const group of expiredFiles) {
      console.log(`- Deleting file group ${group.code}`);
      for (const file of group.files) {
        if (file.cloudinaryId) {
          await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: 'auto' });
        }
      }
      await group.deleteOne();
    }
    console.log(`- Cleaned up ${expiredFiles.length} expired file groups.`);
  } catch (error) {
    console.error('Error cleaning up file groups:', error);
  }
  
  // --- Cleanup for Text Notes (Added) ---
  try {
    const expiredNotesResult = await TextNote.deleteMany({ createdAt: { $lt: twentyFourHoursAgo } });
    console.log(`- Cleaned up ${expiredNotesResult.deletedCount} expired text notes.`);
  } catch (error) {
    console.error('Error cleaning up text notes:', error);
  }

  console.log('✅ Cleanup complete.');
  // NOTE: For a more efficient solution, consider using a MongoDB TTL index on the `createdAt` field in your schemas.
  // Example: createdAt: { type: Date, default: Date.now, expires: '24h' }
});


// --- Server Listener ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));