import { Router } from 'express';
import * as OrderController  from '@/controllers/order-controller';

const router = Router();

// 손님 주문 접수 (POST /orders)  websocket 실시간
router.post('/', OrderController.createOrder);

// 손님 주문 목록 조회 (GET /orders?restaurantId=10&tableNumber=3&status=pending)
router.get('/', OrderController.getOrders);

// 손님 주문 상태 변경 (PATCH /orders/:orderId/status)  일단 사용 안하는 중. 생각해보니깐 스태프쪽에서만 상태 변경되게? 일단 냅두기?
router.patch('/:orderId/status', OrderController.patchOrder);

export default router;