import { Router } from 'express';
import * as EmploymentController  from '@/controllers/employment-controller';
import { authenticateToken } from '../middlewares/authenticate-token';

// 부모 라우터에서 restaurantId를 받아오기 위해 mergeParams 필수
const router = Router({ mergeParams: true });

// 스태프 고용하기 (POST /employment/:restaurantId)
router.post('/:restaurantId', authenticateToken, EmploymentController.postEmploymentStaff);

// 스태프 고용 정보 수정하기 (PATCH /employment/:restaurantId/:employmentId)
router.patch('/:restaurantId/:employmentId', authenticateToken, EmploymentController.patchEmploymentStaff);

// 고용된 스태프 목록 조회 (GET /employment/:restaurantId)
router.get('/:restaurantId', authenticateToken, EmploymentController.getEmploymentStaffs);

// 스태프 고용 정보 삭제 해고 (DELETE /employment/:employmentId)
router.delete('/:employmentId', authenticateToken, EmploymentController.delEmploymentStaff);

export default router;
