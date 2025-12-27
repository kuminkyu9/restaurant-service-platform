import express, { Express, Request, Response } from "express";
import cors from 'cors';

import authRoutes from '@/routes/auth-routes'; 
import restaurantRoutes from '@/routes/restaurant-routes';
import categoryRoutes from '@/routes/category-routes';
import menuRoutes from '@/routes/menu-routes';
import orderRoutes from '@/routes/order-routes';
import employmentRoutes from '@/routes/employment-routes';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('API Server is running');
})

// API 라우트 연결
app.use('/auth', authRoutes); // 계정
app.use('/restaurants', restaurantRoutes);  // 식당
app.use('/restaurants/:restaurantId/categories', categoryRoutes); // 식당 카테고리
app.use('/restaurants/:restaurantId/categories/:categoryId/menus', menuRoutes); // 식당 카테고리 메뉴
app.use('/orders', orderRoutes); // 주문
app.use('/employment', employmentRoutes); // 주문

export default app;