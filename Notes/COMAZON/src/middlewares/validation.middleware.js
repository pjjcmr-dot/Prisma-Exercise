import { isProduction } from '#config';
import { flattenError } from 'zod';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';

export const validate = (schema) => (req, res, next) => {
  // safeParse를 사용하여 에러를 직접 제어
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Zod 에러를 flatten하여 필드별로 정리
    const { fieldErrors, formErrors } = flattenError(result.error);

    // 프로덕션 환경: 상세 규칙/메시지를 숨기고, 어떤 필드가 문제인지 정도만 제공
    if (isProduction) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.INVALID_INPUT,
        invalidFields: Object.keys(fieldErrors),
        formErrors,
      });
    }

    // 개발 환경: 필드별 상세 에러 메시지 전체 반환 (디버깅)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGE.VALIDATION_FAILED,
      details: fieldErrors,
      formErrors,
    });
  }

  // 중요: 검증/변환된 데이터를 req.body에 재할당
  // Zod의 parse()는 불필요한 필드 제거, 데이터 변환(coerce) 등을 수행
  // 이 과정을 거쳐야 컨트롤러에서 '깨끗한' 데이터만 사용 가능
  req.body = result.data;

  next();
};
