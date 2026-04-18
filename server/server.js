import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';

dotenv.config();

const app = express();

// ✅ FIX PATH (IMPORTANT)
const __dirname = process.cwd();

// 🔥 Serve static frontend (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);


// ✅ DEFAULT ROUTE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ CATCH ALL ROUTES (FIXED)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});