import prisma from './src/db/prisma.js';

async function main() {
  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: '테스트 유저',
    },
  });
  
  console.log('생성된 사용자:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
