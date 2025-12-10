import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();


app.use(cors());
app.use(express.json());

// 테스트 API: 유저 생성
app.post('/test/users', async (req, res) => {
  const { email, password, name } = req.body;
  const user = await prisma.user.create({
    data: { email, password, name },
  });
  res.json(user);
});

// 테스트 API: 모든 유저 조회
app.get('/test/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});