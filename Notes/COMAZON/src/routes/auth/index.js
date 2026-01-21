import express from 'express';
import { authRouter as router } from './auth.routes.js'; // 이름 중복, as로 처리

export const authRouter = express.Router();

// Auth 라우트 연결
authRouter.use('/', router);
