const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Serve static files (frontend)
app.use(express.static('public'));

// Routes
const uploadRoutes = require('./routes/uploadRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const deleteRoutes = require('./routes/deleteRoutes');

app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/delete', deleteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
