import { Router } from 'express';
import * as RestaurantController  from '@/controllers/restaurant-controller';
import { authenticateToken } from '../middlewares/authenticate-token';
import upload from '@/middlewares/upload';

const router = Router();

// 식당 추가 (POST /restaurants)
router.post('/', authenticateToken, upload.single('image'), RestaurantController.postRestaurant);

// 내 식당 목록 조회 (GET /restaurants/my)
router.get('/my', authenticateToken, RestaurantController.getRestaurants);

// 식당 정보 수정 (PATCH /restaurants/:id)
router.patch('/:id', authenticateToken, upload.single('image'), RestaurantController.patchRestaurant);

// 식당 삭제 (DELETE /restaurants/:id)
router.delete('/:id', authenticateToken, RestaurantController.delRestaurant);

// 현재 식당 조회 (GET /restaurants/:id)    단일 식당 정보 가져오는거 손님쪽에 사용중
router.get('/:id', authenticateToken, RestaurantController.getRestaurant);

export default router;
