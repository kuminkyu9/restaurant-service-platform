import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// JWT 토큰 타입을 정의
interface UserPayload extends jwt.JwtPayload {
  id: number;
  email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // 1. 헤더에서 토큰 추출 (Format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer " 뒷부분만 가져옴

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: '인증 토큰이 없습니다. 로그인 후 이용해주세요.' 
    });
  }

  // 2. 토큰 검증
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: '유효하지 않은 토큰입니다.' 
      });
    }

    // 3. 검증 성공 시 req.user에 정보 저장
    req.user = user as UserPayload;
    
    // 4. 다음 미들웨어/컨트롤러로 통과
    next();
  });
};
