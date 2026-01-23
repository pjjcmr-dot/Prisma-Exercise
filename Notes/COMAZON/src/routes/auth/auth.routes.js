import express from 'express';
import { usersRepository } from '#repository';
import { hashPassword, comparePassword } from '#utils/hash.util.js';
import { generateTokens } from '#utils/jwt.util.js';
import { setAuthCookies } from '#utils/cookie.util.js';
import { validate } from '#middlewares/validation.middleware.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { UnauthorizedException } from '#exceptions';
import { signUpSchema, loginSchema } from './auth.schemas.js';

export const authRouter = express.Router();

// 회원가입
authRouter.post(
  '/signup',
  validate('body', signUpSchema),
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body;

      const hashedPassword = await hashPassword(password);

      const user = await usersRepository.createUser({
        email,
        password: hashedPassword,
        name,
      });

      const tokens = generateTokens(user);
      setAuthCookies(res, tokens);

      const { password: _, ...userWithoutPassword } = user;
      res.status(HTTP_STATUS.CREATED).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);

// 로그인
authRouter.post(
  '/login',
  validate('body', loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await usersRepository.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGE.INVALID_CREDENTIALS);
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(ERROR_MESSAGE.INVALID_CREDENTIALS);
      }

      const tokens = generateTokens(user);
      setAuthCookies(res, tokens);

      const { password: _, ...userWithoutPassword } = user;
      res.status(HTTP_STATUS.OK).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);
