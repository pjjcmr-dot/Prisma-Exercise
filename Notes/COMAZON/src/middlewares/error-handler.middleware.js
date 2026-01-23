import { Prisma } from '#generated/prisma/client.ts';
import { HTTP_STATUS, PRISMA_ERROR, ERROR_MESSAGE } from '#constants';
import { HttpException, UnauthorizedException } from '#exceptions';
import jwt from 'jsonwebtoken';

export const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);

  // 1. JWT 에러 처리
  if (err instanceof jwt.JsonWebTokenError) {
    const error = new UnauthorizedException(ERROR_MESSAGE.INVALID_TOKEN);
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // 2. 커스텀 에러 처리
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Prisma의 특정 에러 코드 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (err.code === PRISMA_ERROR.UNIQUE_CONSTRAINT) {
      const field = err.meta?.target?.[0];
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: `${field}가 이미 사용 중입니다.`,
      });
    }

    // P2025: Record not found
    if (err.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGE.RESOURCE_NOT_FOUND,
      });
    }
  }

  // 기타 예상 가능한 에러 처리 (추후 확장 가능)
  // if (err instanceof CustomError) { ... }

  // 처리되지 않은 모든 에러
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
  });
};;;
