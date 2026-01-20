import express from 'express';
import { userPostsRouter as router } from './user-posts.routes.js';

// mergeParams: true - 부모의 :id 파라미터를 상속
export const userPostsRouter = express.Router({
  mergeParams: true,
});

// User의 Posts 라우트 연결
userPostsRouter.use('/', router);
