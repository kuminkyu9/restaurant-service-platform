import { Router } from 'express';
import * as AuthController  from '@/controllers/auth-controller';

const router = Router();

// 스태프 회원가입 (POST /auth/staff/register)
router.post('/staff/register', AuthController.createSignUpStaff);

// 스태프 로그인 (POST /auth/staff/login)
router.post('/staff/login', AuthController.postLoginStaff);

// 사장님 회원가입 (POST /auth/owner/register)
router.post('/owner/register', AuthController.postSignUpOwner);

// 사장님 로그인 (POST /auth/owner/login)
router.post('/owner/login', AuthController.postLoginOwner);

// 사장님 회원 탈퇴 (DELETE /auth/owner/withdraw)
router.delete('/owner/withdraw', AuthController.delWithdrawOwner);

export default router;