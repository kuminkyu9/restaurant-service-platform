import { Router, Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/utils/prisma';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // 환경변수에서 가져오기

// 사장님 회원가입 (POST /auth/owner/register)
router.post('/owner/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // 1. 필수 값 체크
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: '이메일, 비밀번호, 이름은 필수입니다.' 
      });
    }

    // 2. 이미 존재하는 이메일인지 확인
    const existingOwner = await prisma.owner.findUnique({
      where: { email },
    });

    if (existingOwner) {
      return res.status(409).json({ 
        success: false, 
        message: '이미 가입된 이메일입니다.' 
      });
    }

    // 3. 비밀번호 암호화 (Salt Round: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. DB 저장
    const newOwner = await prisma.owner.create({
      data: {
        email,
        password: hashedPassword, // 암호화된 비번 저장
        name,
      },
    });

    // 5. 응답 (비밀번호는 빼고 주는 게 보안상 좋음)
    const { password: _, ...ownerWithoutPassword } = newOwner;

    return res.status(201).json({
      success: true,
      message: '사장님 회원가입 성공!',
      data: ownerWithoutPassword,
    });

  } catch (error) {
    console.error('Owner Register Error:', error);
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// 사장님 로그인 (POST /auth/owner/login)
router.post('/owner/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. 필수 값 체크
    if (!email || !password) {
      return res.status(400).json({ success: false, message: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 2. 사용자 존재 여부 확인
    const owner = await prisma.owner.findUnique({ where: { email } });
    if (!owner) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 3. 비밀번호 일치 여부 확인 (bcrypt)
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 4. JWT 토큰 발급 (Payload에 id, email, role 등을 담음)
    const token = jwt.sign(
      { id: owner.id, email: owner.email, name: owner.name, role: 'OWNER' }, 
      JWT_SECRET, 
      { expiresIn: '12h' } // 토큰 유효기간: 12시간
    );

    // 5. 응답 (토큰 전달)
    return res.status(200).json({
      success: true,
      message: '로그인 성공!',
      data: {
        token, // 프론트엔드에서 이 토큰을 저장해서 써야 함
        owner: { id: owner.id, name: owner.name, email: owner.email }
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러', error: 'Unknown error' });
  }
});

export default router;