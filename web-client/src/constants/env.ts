// src/constants/env.ts

const isProd = import.meta.env.PROD; // 빌드 시 자동으로 true/false 결정됨

export const BASE_URL = isProd 
  ? 'https://api.your-production-server.com' // 운영 서버 주소
  : 'http://localhost:3000';               // 개발 로컬 주소

export const FRONTEND_URL = isProd 
  ? 'https://your-site.com'                 // 운영 프런트 주소
  : 'http://localhost:5173';                // 개발 로컬 주소
