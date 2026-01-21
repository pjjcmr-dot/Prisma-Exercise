import { Prisma } from '#generated/prisma/client.ts';
import { HTTP_STATUS, PRISMA_ERROR } from '#constants';

export const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);

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
        message: '요청한 리소스를 찾을 수 없습니다.',
      });
    }
  }

  // 기타 예상 가능한 에러 처리 (추후 확장 가능)
  // if (err instanceof CustomError) { ... }

  // 처리되지 않은 모든 에러
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: '서버 내부 오류가 발생했습니다.',
  });
};
