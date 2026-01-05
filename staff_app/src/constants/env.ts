export const PROD = process.env.NODE_ENV === 'production';

export const SERVER_URL = PROD 
  ? 'https://food-manager.shop' 
  : 'http://192.168.200.182:3000';
