import express, { Express, Request, Response } from "express";
import cors from 'cors';

import authRoutes from '@/routes/auth-routes'; 
import restaurantRoutes from '@/routes/restaurant-routes';
import categoryRoutes from '@/routes/category-routes';
import menuRoutes from '@/routes/menu-routes';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('API Server is running');
})

// API 라우트 연결
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/restaurants/:restaurantId/categories', categoryRoutes);
app.use('/restaurants/:restaurantId/categories/:categoryId/menus', menuRoutes);

export default app;