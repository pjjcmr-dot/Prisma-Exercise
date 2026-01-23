// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002', // Unique constraint 위반
  RECORD_NOT_FOUND: 'P2025', // 레코드를 찾을 수 없음
};

// 에러 메시지 상수
export const ERROR_MESSAGE = {
  // User 관련
  USER_NOT_FOUND: 'User not found',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required', //! 추가
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  FAILED_TO_FETCH_USERS: 'Failed to fetch users',
  FAILED_TO_FETCH_USER: 'Failed to fetch user',
  FAILED_TO_CREATE_USER: 'Failed to create user',
  FAILED_TO_UPDATE_USER: 'Failed to update user',
  FAILED_TO_DELETE_USER: 'Failed to delete user',

  // Post 관련
  POST_NOT_FOUND: 'Post not found',
  TITLE_REQUIRED: 'Title is required',
  AUTHOR_ID_REQUIRED: 'Author ID is required',
  SEARCH_QUERY_REQUIRED: 'Search query is required', // 추가
  FAILED_TO_FETCH_POSTS: 'Failed to fetch posts',
  FAILED_TO_FETCH_POST: 'Failed to fetch post',
  FAILED_TO_CREATE_POST: 'Failed to create post!!!!!',
  FAILED_TO_UPDATE_POST: 'Failed to update post',
  FAILED_TO_DELETE_POST: 'Failed to delete post',
  FAILED_TO_SEARCH_POSTS: 'Failed to search posts', // 추가
  FAILED_TO_FETCH_PUBLISHED_POSTS: 'Failed to fetch published posts', // 추가
  FAILED_TO_FETCH_USER_WITH_POSTS: 'Failed to fetch user with posts',
  FAILED_TO_DELETE_POST_WITH_COMMENTS: 'Failed to delete post with comments', // 추가
  FAILED_TO_CREATE_POST_WITH_COMMENT: 'Failed to create post with comment', // 추가
  FAILED_TO_CREATE_MULTIPLE_POSTS: 'Failed to create multiple posts', // 추가
  POSTS_ARRAY_REQUIRED: 'Posts array is required', // 추가
  INVALID_POSTS_ARRAY: 'Posts must be an array', // 추가

  // Comment 관련 (새로 추가)
  COMMENT_NOT_FOUND: 'Comment not found',
  COMMENT_CONTENT_REQUIRED: 'Comment content is required',
  FAILED_TO_CREATE_COMMENT: 'Failed to create comment',
  FAILED_TO_DELETE_COMMENT: 'Failed to delete comment',

  //! Auth 관련 (추가)
  NO_AUTH_TOKEN: 'No authentication token provided',
  INVALID_TOKEN: 'Invalid or expired token',
  USER_NOT_FOUND_FROM_TOKEN: 'User not found from token',
  AUTH_FAILED: 'Authentication failed',
  INVALID_CREDENTIALS: 'Invalid email or password',

  //! Validation 관련 (추가)
  INVALID_INPUT: 'Invalid input',
  VALIDATION_FAILED: 'Validation failed',
  
  //! Permission (추가3)
  FORBIDDEN_RESOURCE: "접근 권한이 없습니다.",

  //! 일반 에러 (Exception 기본값으로 사용) (추가3)
  RESOURCE_NOT_FOUND: "리소스를 찾을 수 없습니다.",
  BAD_REQUEST: "잘못된 요청입니다.",
  RESOURCE_CONFLICT: "이미 존재하는 데이터입니다.",
  INTERNAL_SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
};











