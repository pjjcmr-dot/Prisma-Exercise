import { flattenError, z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().positive().default(5015),
  DATABASE_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().min(32), // 추가됨
  JWT_REFRESH_SECRET: z.string().min(32), // 추가됨
});

const parseEnvironment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET, // 추가됨
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET, // 추가됨
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { fieldErrors } = flattenError(error);
      console.error('환경 변수 검증 실패:', fieldErrors);
    }
    process.exit(1);
  }
};

export const config = parseEnvironment();

export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';
