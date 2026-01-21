//! 인증 미들웨어 구현

import { verifyToken } from '../utils/jwt.util.js';
import { prisma } from '#db/prisma.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';

export const authMiddleware = async (req, res, next) => {
  try {
    // 1. 쿠키에서 Access Token 추출
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: ERROR_MESSAGE.NO_AUTH_TOKEN });
    }

    // 2. 토큰 검증
    const payload = verifyToken(accessToken, 'access');

    if (!payload) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: ERROR_MESSAGE.INVALID_TOKEN,
      });
    }

    // 3. 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: ERROR_MESSAGE.USER_NOT_FOUND_FROM_TOKEN,
      });
    }

    // 4. req.user에 사용자 정보 저장
    req.user = user;

    // 5. 다음 미들웨어/핸들러로 진행
    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGE.AUTH_FAILED,
    });
  }
};
