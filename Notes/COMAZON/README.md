# Comazon - Schema Models

2-2. Prisma 스키마: 온라인강의를 버전 7로 연습하는 결과물 입니다.

## 프로젝트 구조

```
prisma-blog/
├── prisma/
│   ├── schema.prisma       # User와 Post 모델 정의
│   └── migrations/         # 마이그레이션 파일 (실행 후 생성)
├── env/
│   ├── .env.example
│   ├── .env.development
│   └── .env.production
├── src/
│   ├── config/
│   │   └── config.js
│   ├── db/
│   │   └── prisma.js
│   └── server.js
├── generated/
│   └── prisma/             # 생성된 Prisma Client (실행 후 생성)
├── prisma.config.js
├── jsconfig.json
├── .prettierrc
├── eslint.config.js
├── .gitignore
└── package.json
```

## 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp env/.env.example env/.env.development
# env/.env.development 파일을 열어 DATABASE_URL 수정

# 3. Prisma Client 생성
npm run prisma:generate

# 4. 마이그레이션 실행
npm run prisma:migrate
# 마이그레이션 이름 입력: init

# 5. 개발 서버 실행
npm run dev

# 6. (선택) Prisma Studio로 데이터베이스 확인
npm run prisma:studio
```


**User 모델:**

- `id`: Primary Key (자동 증가)
- `email`: 중복 불가
- `name`: 선택적 필드
- `posts`: Post 모델과의 관계 (1:N)
- `createdAt`, `updatedAt`: 자동 타임스탬프

**Post 모델:**

- `id`: Primary Key (자동 증가)
- `title`: 게시글 제목
- `content`: 게시글 내용 (선택적)
- `published`: 공개 여부 (기본값: false)
- `author`, `authorId`: User 모델과의 관계
- `createdAt`, `updatedAt`: 자동 타임스탬프

### 2. 관계 설정 (1:N)

```prisma
// User: 한 명의 사용자가 여러 게시글 작성
model User {
  posts Post[]  // Post 배열
}

// Post: 각 게시글은 한 명의 작성자
model Post {
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```

## 마이그레이션

마이그레이션 실행 시 다음이 생성됩니다:

- `prisma/migrations/` 폴더
- `20YYMMDDHHMMSS_init/` 마이그레이션 폴더
- SQL 파일 (CREATE TABLE 명령어)

## 주요 명령어

```bash
npm run prisma:generate  # Prisma Client 생성
npm run prisma:migrate   # 마이그레이션 생성 및 적용
npm run prisma:studio    # Prisma Studio 실행
npm run dev              # 개발 서버 실행
```

TODO: migrations // 데이터베이스 구조 변경 이력을 관리하고 실행하는 도구
ㄴnpm run prisma:generate // 데이터베이스 변경때마다 새로 실행
ㄴnpm run prisma:migrate dev //개발 중 migration 생성 및 적용
ㄴnpm run prisma:migrate deploy //프로덕션에 migration 적용
ㄴnpm run prisma:migrate reset //DB 초기화 후 모든 migration 재실행

TODO: generated //Prisma Client 코드를 자동 생성하는 명령어입니다.
ㄴ설계도 = schema.prisma 파일을 보고 실제 작업 도구 = @prisma/client (JavaScript/TypeScript 코드)를 만드는 것

TODO: 인증(Authentication)

카페 입장:
1. 신분증 제시 (로그인)
2. 직원이 신분증 확인 (인증)
3. 팔찌 착용 (토큰 발급)
4. 팔찌로 자유롭게 출입 (인증된 요청)

// 인증이 필요한 작업들
- 내 프로필 조회/수정
- 게시글 작성/수정/삭제
- 댓글 작성/수정/삭제
- 좋아요/팔로우