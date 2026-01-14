// src/server.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경 변수 로드
dotenv.config({ path: join(__dirname, '../env/.env.development') });

console.log('🔍 [server.js] DATABASE_URL:', process.env.DATABASE_URL);

import express from 'express';
import prisma from './db/prisma.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, '../public'))); 

app.get('/', (req, res) => {
  res.send('<h1>Prisma Practice Server</h1><p>서버가 실행 중입니다!</p>');
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
