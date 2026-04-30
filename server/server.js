const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3500;

const allowedOrigins = [
  process.env.CLIENT_URL_DEV || 'http://localhost:5173',
  process.env.CLIENT_URL_PROD || 'https://nestly.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(express.json());

// Serve frontend static files from the project root (one level up from /server)
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Nestly' });
});

// Catch-all: serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nestly server running on http://localhost:${PORT}`);
});
