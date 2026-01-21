import { z } from 'zod';

// 회원가입 스키마
export const signUpSchema = z.object({
  email: z.email({ error: '유효한 이메일 형식이 아닙니다.' }),
  password: z
    .string({ error: '비밀번호는 필수입니다.' })
    .min(6, { error: '비밀번호는 6자 이상이어야 합니다.' }),
  name: z
    .string()
    .min(2, { error: '이름은 2자 이상이어야 합니다.' })
    .optional(),
});

// 로그인 스키마
export const loginSchema = z.object({
  email: z.email({ error: '유효한 이메일 형식이 아닙니다.' }),
  password: z
    .string({ error: '비밀번호는 필수입니다.' })
    .min(1, { error: '비밀번호를 입력해주세요.' }),
});
