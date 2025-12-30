import { Router } from 'express';
import * as MenuController  from '@/controllers/menu-controller';
import { authenticateToken } from '../middlewares/authenticate-token';
import upload from '@/middlewares/upload';

// mergeParams: true 필수 (부모 URL의 :restaurantId, :categoryId 가져오기 위해)
const router = Router({ mergeParams: true });

// 메뉴 목록 조회 (GET /restaurants/:restaurantId/categories/:categoryId/menus)
router.get('/', authenticateToken, MenuController.getMenus);

// 메뉴 추가 (POST /restaurants/:restaurantId/categories/:categoryId/menus)
router.post('/', authenticateToken, upload.single('image'), MenuController.postMenu);

// 메뉴 수정 (PATCH /restaurants/:restaurantId/categories/:categoryId/menus/:menuId)
router.patch('/:menuId', authenticateToken, upload.single('image'), MenuController.patchMenu);

// 메뉴 삭제 (DELETE /restaurants/:restaurantId/categories/:categoryId/menus/:menuId)
router.delete('/:menuId', authenticateToken, MenuController.delMenu);

export default router;
