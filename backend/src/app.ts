import express, { Express, Request, Response } from "express";
import cors from 'cors';

import authRoutes from '@/routes/auth-routes'; 


// t
import prisma from '@/utils/prisma';


const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API Server is running');
})


// t
// POST /test/users (유저 생성)
app.post('/test/users', async (req: Request, res: Response) => {
  // 1. try-catch 블록으로 오류 처리
  try {
    const { email, password, name } = req.body;

    // TODO: 비밀번호 해싱(Hashing) 로직이 여기에 추가되어야 함 (현업 필수)

    const user = await prisma.owner.create({
      data: { email, password, name },
    });

    // 2. 생성 성공 시 HTTP 201 Created 반환 및 일관된 응답 형식 사용
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });

  } catch (error) {
    // 3. 오류 발생 시 500 Internal Server Error 반환
    console.error(error);
    let errorMessage = 'An unknown error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: errorMessage, // 수정된 변수 사용
    });
  }
});

// GET /test/users (모든 유저 조회)
app.get('/test/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.owner.findMany();
    
    // 2. 조회 성공 시 HTTP 200 OK 반환 및 일관된 응답 형식 사용
    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });

  } catch (error) {
    // 3. 오류 발생 시 500 Internal Server Error 반환
    console.error(error);
    let errorMessage = 'An unknown error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: errorMessage, // 수정된 변수 사용
    });
  }
});



export default app;