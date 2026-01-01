import { Router, Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // 환경변수에서 가져오기

// 스태프 회원가입 (POST /auth/staff/register)
export const createSignUpStaff = async (req: Request, res: Response) => {
// router.post('/staff/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: '이메일, 비밀번호, 이름은 필수입니다.' 
      });
    }
    // 이미 존재하는 이메일인지 확인
    const existingStaff = await prisma.staff.findUnique({
      where: { email },
    });
    if (existingStaff) {
      return res.status(409).json({ 
        success: false, 
        message: '이미 가입된 이메일입니다.' 
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 암호화 (Salt Round: 10)
    const newStaff = await prisma.staff.create({  // DB 저장
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    // 응답 (비밀번호는 빼고)
    const { password: _, ...staffWithoutPassword } = newStaff;
    return res.status(201).json({
      success: true,
      message: '스태프 회원가입 성공!',
      data: staffWithoutPassword,
    });
  } catch (error) {
    console.error('Owner Register Error:', error);
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
// });

// 스태프 로그인 (POST /auth/staff/login)
export const postLoginStaff = async (req: Request, res: Response) => {
// router.post('/staff/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: '이메일과 비밀번호를 입력해주세요.' });
    }
    const staff = await prisma.staff.findUnique({ where: { email } });
    if (!staff) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }
    // 비밀번호 일치 여부 확인 (bcrypt)
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }
    // JWT 토큰 발급 (Payload에 id, email, 등을 담음)
    const token = jwt.sign(
      { id: staff.id, email: staff.email, name: staff.name, role: 'STAFF' }, 
      JWT_SECRET, 
      { expiresIn: '12h' } // 토큰 유효기간: 12시간
    );
    // 응답 (토큰 전달)
    return res.status(200).json({
      success: true,
      message: '로그인 성공!',
      data: {
        token,
        staff: { id: staff.id, name: staff.name, email: staff.email }
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: '서버 에러', error: 'Unknown error' });
  }
};
// });

// 사장님 회원가입 (POST /auth/owner/register)
export const postSignUpOwner = async (req: Request, res: Response) => {
// router.post('/owner/register', async (req: Request, res: Response) => {
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
};
// });

// 사장님 로그인 (POST /auth/owner/login)
export const postLoginOwner = async (req: Request, res: Response) => {
// router.post('/owner/login', async (req: Request, res: Response) => {
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
};
// });

// 사장님 회원 탈퇴 (DELETE /auth/owner/withdraw)   
// !!!! !!!! 이거 사용하려면 soft 삭제 부분 적용해야함 restaurant, category, menu 등 연관 테이블 싹다 soft delete 적용필요
export const delWithdrawOwner = async (req: Request, res: Response) => {
// router.delete('/owner/withdraw', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

     // 1. 입력값 검증
    if (!email || !password) {
      return res.status(400).json({ success: false, message: '이메일과 비밀번호를 모두 입력해주세요.' });
    }

    // 2. 사용자 찾기
    const owner = await prisma.owner.findUnique({ where: { email } });
    if (!owner) {
      // 보안상 "없는 계정입니다"라고 알려주는 것보다 
      // "정보가 일치하지 않습니다"라고 퉁치는 게 좋습니다. (계정 존재 여부 노출 방지)
      return res.status(404).json({ success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    // 3. 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      return res.status(403).json({ success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }
    
    // 4. 탈퇴 처리
    await prisma.$transaction(async (tx) => {
      const randomString = Math.random().toString(36).substring(7);
    
      // 식당이나 주문을 삭제하면 데이터 무결성이 깨지거나 매출 기록이 날아감. 따라서 식당은 그대로 두고, 사장님 정보만 알 수 없게 하거나 삭제해야 함.
      // 이메일/비번 등 개인정보는 날리고, ID만 남겨서 식당이 유지되게 함.
      await tx.owner.update({
        where: { id: owner.id },
        data: {
          email: `deleted_${owner.id}_${randomString}@withdraw.com`,
          password: '',
          name: '탈퇴한 사용자',
        }
      });
      
      // 나중에 여기에 "식당 상태 변경" 같은 로직 추가하기 좋음
    });

    return res.status(200).json({
      success: true,
      message: '회원 탈퇴가 완료되었습니다.',
    });
  } catch (error) {
    console.error('Withdraw Error:', error);
    return res.status(500).json({ success: false, message: '탈퇴 처리 중 오류 발생' });
  }
};
// });