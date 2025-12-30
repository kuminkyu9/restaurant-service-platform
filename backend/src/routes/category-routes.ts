import { Router } from 'express';
import * as CategoryController  from '@/controllers/category-controller';
import { authenticateToken } from '../middlewares/authenticate-token';

// mergeParams: true 옵션
// 부모 라우터(app.ts)에서 '/restaurants/:restaurantId/categories'로 연결할 때
// URL 파라미터(:restaurantId)를 자식 라우터(여기)까지 전달받기 위함
const router = Router({ mergeParams: true });

// 식당 카테고리 목록 조회:사장용 (GET /restaurants/:restaurantId/categories)
// 식당 카테고리 목록 조회:손님용 (GET /restaurants/:restaurantId/categories?tableNumber=5)
router.get('/', CategoryController.getCategoryMenus);

// 카테고리 추가 (POST /restaurants/:restaurantId/categories)
router.post('/', authenticateToken, CategoryController.postCategory);

// 카테고리 수정 (PATCH /restaurants/:restaurantId/categories/:categoryId)
router.patch('/:categoryId', authenticateToken, CategoryController.patchCategory);

// 카테고리 삭제 (DELETE /restaurants/:restaurantId/categories/:categoryId)
router.delete('/:categoryId', authenticateToken, CategoryController.delCategory);

export default router;
