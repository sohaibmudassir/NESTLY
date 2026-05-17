require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3500;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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

app.post('/api/waitlist', async (req, res) => {
  const { email, platform } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const { error } = await supabase
    .from('waitlist')
    .insert({ email: email.toLowerCase().trim(), platform: platform || 'unknown' });

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Already signed up' });
    }
    console.error('Supabase error code:', error.code);
    console.error('Supabase error message:', error.message);
    console.error('Supabase error details:', error.details);
    console.error('SUPABASE_URL set:', !!process.env.SUPABASE_URL);
    console.error('SUPABASE_SERVICE_KEY set:', !!process.env.SUPABASE_SERVICE_KEY);
    return res.status(500).json({ error: 'Server error', detail: error.message });
  }

  return res.json({ success: true });
});

// Catch-all: serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nestly server running on http://localhost:${PORT}`);
});
