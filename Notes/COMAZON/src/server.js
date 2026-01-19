import express from 'express';
import { prisma } from '#db/prisma.js';
import { config } from '#config';
import { router as apiRouter } from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/api', apiRouter); //! 기존 내용 삭제 후 수정

app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
