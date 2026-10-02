require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PolicyHub API is running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/policies', require('./routes/policyRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve uploaded documents
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
