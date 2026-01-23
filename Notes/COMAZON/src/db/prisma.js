// impo/
import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '#config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const getPrismaLogLevel = () => {
  if (config.NODE_ENV === 'production') {
    return ['warn', 'error']; // 프로덕션: 경고와 에러만
  }
  return ['query', 'info', 'warn', 'error']; // 개발: 모든 로그
};

export const prisma = new PrismaClient({
  adapter,
  log: getPrismaLogLevel(),
});