// /**
//  * Graceful shutdown 설정
//  */
// export const setupGracefulShutdown = (server, prisma) => {
//   const shutdown = async (signal) => {
//     console.log(`\n${signal} 신호를 받았습니다. 서버를 종료합니다...`);

//     try {
//       // 1. HTTP 서버 종료 (새 요청 거부, 기존 요청 완료 대기)
//       await new Promise((resolve, reject) => {
//         server.close((err) => {
//           if (err) return reject(err);
//           console.log('서버가 종료되었습니다.');
//           resolve();
//         });
//       });

//       // 2. Prisma 연결 종료 (Pool 포함)
//       await prisma.$disconnect();
//       console.log('데이터베이스 연결이 종료되었습니다.');

//       process.exit(0);
//     } catch (error) {
//       console.error('종료 중 에러:', error);
//       process.exit(1);
//     }
//   };

//   // SIGINT: Ctrl+C
//   process.on('SIGINT', () => shutdown('SIGINT'));

//   // SIGTERM: 클라우드 플랫폼의 종료 신호
//   process.on('SIGTERM', () => shutdown('SIGTERM'));
// };

export const setupGracefulShutdown = (server, prisma) => {
  const shutdown = async (signal) => {
    console.log(`\n${signal} 신호를 받았습니다. 서버를 종료합니다...`);

    server.close((err) => {
      if (err) {
        console.error('서버 종료 중 에러:', err);
        process.exit(1);
      }
      console.log('서버가 종료되었습니다.');
    });

    try {
      await prisma.$disconnect();
      console.log('데이터베이스 연결이 종료되었습니다.');
      process.exit(0);
    } catch (error) {
      console.error('데이터베이스 종료 중 에러:', error);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};