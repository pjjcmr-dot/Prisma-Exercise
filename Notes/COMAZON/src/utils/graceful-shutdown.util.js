/**
 * Graceful shutdown 설정
 */
export const setupGracefulShutdown = (server, prisma) => {
  const shutdown = async (signal) => {
    console.log(`\n${signal} 신호를 받았습니다. 서버를 종료합니다...`);

    try {
      // 1. HTTP 서버 종료 (새 요청 거부, 기존 요청 완료 대기)
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
<<<<<<< HEAD
          console.log('서버가 종료되었습니다.');
=======
          console.log("서버가 종료되었습니다.");
>>>>>>> ffbc5cb86181e0a736384d59411afe611f1bc284
          resolve();
        });
      });

      // 2. Prisma 연결 종료 (Pool 포함)
      await prisma.$disconnect();
<<<<<<< HEAD
      console.log('데이터베이스 연결이 종료되었습니다.');

      process.exit(0);
    } catch (error) {
      console.error('종료 중 에러:', error);
=======
      console.log("데이터베이스 연결이 종료되었습니다.");

      process.exit(0);
    } catch (error) {
      console.error("종료 중 에러:", error);
>>>>>>> ffbc5cb86181e0a736384d59411afe611f1bc284
      process.exit(1);
    }
  };

  // SIGINT: Ctrl+C
<<<<<<< HEAD
  process.on('SIGINT', () => shutdown('SIGINT'));

  // SIGTERM: 클라우드 플랫폼의 종료 신호
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};
=======
  process.on("SIGINT", () => shutdown("SIGINT"));

  // SIGTERM: 클라우드 플랫폼의 종료 신호
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};
>>>>>>> ffbc5cb86181e0a736384d59411afe611f1bc284
