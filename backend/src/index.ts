import 'dotenv/config'; 
import app from '@/app'
import prisma from '@/utils/prisma';

import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    // origin: "http://localhost:5173",
    // origin: "*", // 보안상 배포시 프론트엔드 URL로 변경 권장 (예: ["https://my-web.com", "http://localhost:3000"])
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket Connected:', socket.id);

  // 직원 앱에서 식당 ID를 가지고 룸에 입장
  socket.on('joinRoom', (restaurantId) => {
    if (restaurantId) {
      socket.join(`restaurant_${restaurantId}`);
      console.log(`Socket ${socket.id} joined room: restaurant_${restaurantId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket Disconnected:', socket.id);
  });
});

server.listen(PORT, async () => {
  console.log(`Server running on [http://localhost:${PORT}](http://localhost:${PORT})`);

  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed', error);
  }
});