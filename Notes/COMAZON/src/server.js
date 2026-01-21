import express from 'express';
import cookieParser from 'cookie-parser'; //!추가
import { errorHandler } from './middlewares/error-handler.middleware.js'; //! 추가
import { prisma } from '#db/prisma.js';
import { config } from '#config';
import { router as apiRouter } from './routes/index.js';

const app = express();

// 미들웨어
app.use(express.json());
app.use(cookieParser());

// 라우터
app.use('/api', apiRouter); //! 기존 내용 삭제 후 수정

//! 에러 핸들링 미들웨어 (반드시 마지막에 위치)
app.use(errorHandler);

const PORT = config.PORT || 5015;

app.listen(PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

//! 회원가입 테스트
//성공케이스
/* curl -X POST http://localhost:5001/api/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "password123",
  "name": "테스트"
}' */

//유효성 검사 실패
/*
curl -X POST http://localhost:5015/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'
*/

//이메일 중복
/*
curl -X POST http://localhost:5015/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
*/

//! 로그인 테스트
/*
curl -X POST http://localhost:5015/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
*/