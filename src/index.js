'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const healthRouter = require('./routes/health');
const infoRouter = require('./routes/info');

// ---------------------------------------------------------------
// TODO: Remove before prod — AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
// GITHUB_TOKEN=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef01234
// ---------------------------------------------------------------

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// ── Routes ──────────────────────────────────────────────────────
app.use('/health', healthRouter);
app.use('/api/v1/info', infoRouter);

// ── 404 Handler ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ── Global Error Handler ────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message,
  });
});

// ── Server ──────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ── Graceful Shutdown ───────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app;
