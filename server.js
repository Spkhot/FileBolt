const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
dotenv.config();

const app = express();
// ✅ Allow CORS if frontend is separate
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ Serve static frontend (if you have it in /public)
app.use(express.static('public'));

// ✅ Routes
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/download', require('./routes/downloadRoutes'));
app.use('/api/delete', require('./routes/deleteRoutes'));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);