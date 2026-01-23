import {
  verifyToken,
  shouldRefreshToken,
  refreshTokens,
  setAuthCookies,
} from '#utils';
import { ERROR_MESSAGE } from '#constants';
import { UnauthorizedException } from '#exceptions';

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    // 1. 액세스 토큰 없음
    if (!accessToken) {
      throw new UnauthorizedException(ERROR_MESSAGE.NO_AUTH_TOKEN);
    }

    // 2. 페이로드 검증
    const payload = verifyToken(accessToken, 'access');
    if (!payload) {
      throw new UnauthorizedException(ERROR_MESSAGE.INVALID_TOKEN);
    }

    // 3. DB 조회 없이 토큰의 userId만 사용 (성능 개선)
    req.user = { id: payload.userId };

    // 4. 토큰 만료 5분 전이면 자동 갱신
    if (shouldRefreshToken(payload) && refreshToken) {
      const newTokens = await refreshTokens(refreshToken);
      if (newTokens) {
        setAuthCookies(res, newTokens);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
