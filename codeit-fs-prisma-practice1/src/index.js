// src/index.js
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Prisma 연결 테스트 시작...');

  // 모든 유저 조회
  const users = await prisma.user.findMany();
  console.log('현재 유저 목록:', users);
}

main()
  .catch((e) => {
    console.error('에러 발생:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma 연결 종료');
  });
