import bcrypt from 'bcrypt';

// 회원가입 시
export const hashPassword = async (password) => {
  const saltRounds = 10; // bcrypt 해싱 비용 인자 (2^10 = 1024번 반복, 높을수록 안전하지만 느림)
  try {
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  } catch {
    // error 매개변수를 사용하지 않으므로 생략 (ES2019+)
    throw new Error('비밀번호 해싱 중 오류가 발생했습니다.');
  }
};

// 로그인 시
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    // error 매개변수를 사용하지 않으므로 생략
    return false; // 에러 발생 시 인증 실패로 처리
  }
};
