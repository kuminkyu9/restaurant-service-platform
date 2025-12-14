import { Router, Request, Response } from 'express';

const router = Router();

// 실제 접근 경로는 나중에 app.use()에서 결정
// 여기서는 하위 경로만 작성

router.get('/profile', (req, res) => {
  // 예시: 실제 접근 URL은 '/user/profile'
  res.status(200).send('사용자 프로필 페이지');
});

router.get('/settings', (req: Request, res: Response) => {
  // 예시: 실제 접근 URL은 '/user/settings'
  res.status(200).send('사용자 설정 페이지');
});

export default router;
