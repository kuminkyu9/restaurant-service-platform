import { Router } from 'express';
import * as StaffController  from '@/controllers/staff-controller';
import { authenticateToken } from '../middlewares/authenticate-token';

// 부모 라우터에서 restaurantId를 받아오기 위해 mergeParams 필수
const router = Router({ mergeParams: true });

// 스태프 고용한 식당 목록 조회 (GET /staff/restaurants)
router.get('/restaurants', authenticateToken, StaffController.getStaffRestaurant);

// 스태프 출근/퇴근 처리 (POST /staff/work-logs/:restaurantId)
router.post('/work-logs/:restaurantId', authenticateToken, StaffController.postStaffWork);

// 스태프 근무기록 조회(전체 식당) (GET /staff/work-logs)
router.get('/work-logs', authenticateToken, StaffController.getStaffWorkLogs);

// 특정 식당 주문목록 조회 (GET /staff/restaurants/:restaurantId/orders) 
// status 진행중, 완료 구별 /staff/restaurants/1/orders?status=active || /staff/restaurants/1/orders?status=finished
router.get('/restaurants/:restaurantId/orders', authenticateToken, StaffController.getRestaurantOrders);

// 주문 상태 변경 (PATCH /staff/restaurants/:restaurantId/orders/:orderId/status)
router.patch('/restaurants/:restaurantId/orders/:orderId/status', authenticateToken, StaffController.patchOrderStatus);

export default router;