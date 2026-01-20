import express from 'express';
import { usersRouter } from './users.routes.js';
import { userPostsRouter } from './posts/index.js'; //! 추가

export const userRouter = express.Router();

// User 기본 CRUD 라우트 연결
userRouter.use('/', usersRouter);

// Nested resource: /users/:id/posts
userRouter.use('/:id/posts', userPostsRouter); //! 추가
