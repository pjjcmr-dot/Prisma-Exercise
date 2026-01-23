// import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
// import { config } from '#config';
import pg from 'pg'; //! 추가

//! 수정 , 수정
// 커넥션 풀 생성 - 여러 DB 연결을 미리 준비
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 15, // 최대 연결 수 (pg 풀의 최대 클라이언트 수)
  idleTimeoutMillis: 30000, // 유휴 연결 제거 시간 (30초)
  connectionTimeoutMillis: 10000, // 새 연결 생성 대기 시간 (10초)
});

// Pool을 어댑터에 전달
const adapter = new PrismaPg(pool);

// 기존 코드
// const adapter = new PrismaPg({
//   connectionString: config.DATABASE_URL,

// Prisma 클라이언트 생성
export const prisma = new PrismaClient({ adapter });
