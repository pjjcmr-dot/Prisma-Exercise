import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '#config';
import pg from 'pg'; //! 추가

//! 수정
// 커넥션 풀 생성 - 여러 DB 연결을 미리 준비
const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
});

// Pool을 어댑터에 전달
const adapter = new PrismaPg(pool);

// 기존 코드
// const adapter = new PrismaPg({
//   connectionString: config.DATABASE_URL,

// Prisma 클라이언트 생성
export const prisma = new PrismaClient({ adapter });
