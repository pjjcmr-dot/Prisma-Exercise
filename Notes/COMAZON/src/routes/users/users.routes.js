import express from 'express';
import { usersRepository } from '#repository';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { NotFoundException, ForbiddenException } from '#exceptions';
import { validate } from '#middlewares/validation.middleware.js';
import { authMiddleware } from '#middlewares/auth.middleware.js';
import {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
} from './users.schemas.js';

export const usersRouter = express.Router();

// 모든 사용자 조회
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await usersRepository.findAllUsers();
    res.status(HTTP_STATUS.OK).json(users);
  } catch (error) {
    next(error);
  }
});

// 특정 사용자 조회
usersRouter.get(
  '/:id',
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params; // 이미 number로 검증됨

      const user = await usersRepository.findUserById(id);

      if (!user) {
        throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
      next(error);
    }
  },
);

// 사용자 생성
usersRouter.post(
  '/',
  validate('body', createUserSchema),
  async (req, res, next) => {
    try {
      const { email, name } = req.body; // 이미 검증됨

      const newUser = await usersRepository.createUser({
        email,
        name,
      });

      res.status(HTTP_STATUS.CREATED).json(newUser);
    } catch (error) {
      next(error);
    }
  },
);

// 사용자 수정
usersRouter.patch(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  validate('body', updateUserSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email, name } = req.body;

      // 자신의 정보만 수정 가능
      if (req.user.id !== id) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN_RESOURCE);
      }

      // 사용자 존재 확인
      const existingUser = await usersRepository.findUserById(id);
      if (!existingUser) {
        throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
      }

      const updatedUser = await usersRepository.updateUser(id, {
        email,
        name,
      });

      res.status(HTTP_STATUS.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
);

// 사용자 삭제
usersRouter.delete(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // 자신의 계정만 삭제 가능
      if (req.user.id !== id) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN_RESOURCE);
      }

      // 사용자 존재 확인
      const existingUser = await usersRepository.findUserById(id);
      if (!existingUser) {
        throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
      }

      await usersRepository.deleteUser(id);

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);
