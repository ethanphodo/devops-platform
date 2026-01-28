const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint - critical for container orchestration
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Basic info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'devops-platform',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    author: 'Ethan Do'
  });
});

// Sample data endpoint - demonstrates basic API functionality
const quotes = [
  { id: 1, text: 'Infrastructure as code is not about the code, it\'s about the infrastructure.', author: 'Unknown' },
  { id: 2, text: 'Automate yourself out of a job, then find a better one.', author: 'DevOps Proverb' },
  { id: 3, text: 'If it hurts, do it more often.', author: 'Martin Fowler' },
  { id: 4, text: 'The best way to predict the future is to implement it.', author: 'David Heinemeier Hansson' },
  { id: 5, text: 'Move fast and break things. Then fix them with CI/CD.', author: 'Modern Proverb' }
];

app.get('/api/quote', (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json(randomQuote);
});

app.get('/api/quotes', (req, res) => {
  res.json(quotes);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API info: http://localhost:${PORT}/api/info`);
  });
}

module.exports = app;
