import { isProduction } from '#config';
import { flattenError } from 'zod';
import { BadRequestException } from '#exceptions';
import { ERROR_MESSAGE } from '#constants';

/**
 * 범용 검증 미들웨어
 * @param {string} target - 검증할 대상 ('body', 'params', 'query')
 * @param {ZodSchema} schema - Zod 스키마
 */
export const validate = (target, schema) => {
  // 서버 시작 시점에 target 검증 (Fail-fast)
  if (!['body', 'query', 'params'].includes(target)) {
    throw new Error(
      `[validate middleware] Invalid target: "${target}". Expected "body", "query", or "params".`,
    );
  }

  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[target]);

      if (!result.success) {
        const { fieldErrors } = flattenError(result.error);

        if (isProduction) {
          throw new BadRequestException(ERROR_MESSAGE.INVALID_INPUT);
        }

        // 개발 환경: 생성자에 details 전달
        throw new BadRequestException(
          ERROR_MESSAGE.VALIDATION_FAILED,
          fieldErrors,
        );
      }

      Object.assign(req[target], result.data); // 검증된 데이터로 교체 (타입 변환 포함)
      next();
    } catch (error) {
      next(error); // 에러 핸들러로 전달
    }
  };
};
