import express from 'express';
import { postRepository } from '#repository';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { NotFoundException, ForbiddenException } from '#exceptions';
import { validate } from '#middlewares/validation.middleware.js';
import { authMiddleware } from '#middlewares/auth.middleware.js';
import {
  idParamSchema,
  paginationQuerySchema,
  searchQuerySchema,
  createPostSchema,
  updatePostSchema,
  createPostWithCommentSchema,
  batchCreatePostsSchema,
} from './posts.schemas.js';

export const postsRouter = express.Router();

// 모든 게시글 조회 (페이지네이션)
postsRouter.get(
  '/',
  validate('query', paginationQuerySchema),
  async (req, res, next) => {
    try {
      const { page, limit } = req.query; // 이미 number로 변환됨

      const result = await postRepository.getPostsWithPagination(page, limit);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 검색
postsRouter.get(
  '/search',
  validate('query', searchQuerySchema),
  async (req, res, next) => {
    try {
      const { q: search } = req.query; // 이미 검증됨

      const posts = await postRepository.searchPosts(search);
      res.status(HTTP_STATUS.OK).json({ posts });
    } catch (error) {
      next(error);
    }
  },
);

// 공개 게시글만 조회
postsRouter.get('/published', async (req, res, next) => {
  try {
    const posts = await postRepository.getPublishedPosts();
    res.status(HTTP_STATUS.OK).json({ posts });
  } catch (error) {
    next(error);
  }
});

// 특정 게시글 조회
postsRouter.get(
  '/:id',
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params; // 이미 number로 검증됨

      const post = await postRepository.findPostById(id, {
        author: true,
      });

      if (!post) {
        throw new NotFoundException(ERROR_MESSAGE.POST_NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json(post);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 생성
postsRouter.post(
  '/',
  authMiddleware,
  validate('body', createPostSchema),
  async (req, res, next) => {
    try {
      const { title, content, published } = req.body; // 이미 검증됨

      // 인증된 사용자를 작성자로 설정
      const newPost = await postRepository.createPost({
        title,
        content,
        published,
        authorId: req.user.id,
      });

      res.status(HTTP_STATUS.CREATED).json(newPost);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 수정
postsRouter.patch(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  validate('body', updatePostSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content, published } = req.body;

      // 게시글 존재 확인
      const existingPost = await postRepository.findPostById(id);
      if (!existingPost) {
        throw new NotFoundException(ERROR_MESSAGE.POST_NOT_FOUND);
      }

      // 작성자만 수정 가능
      if (existingPost.authorId !== req.user.id) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN_RESOURCE);
      }

      const updatedPost = await postRepository.updatePost(id, {
        title,
        content,
        published,
      });

      res.status(HTTP_STATUS.OK).json(updatedPost);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 삭제
postsRouter.delete(
  '/:id',
  authMiddleware,
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // 게시글 존재 확인
      const existingPost = await postRepository.findPostById(id);
      if (!existingPost) {
        throw new NotFoundException(ERROR_MESSAGE.POST_NOT_FOUND);
      }

      // 작성자만 삭제 가능
      if (existingPost.authorId !== req.user.id) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN_RESOURCE);
      }

      await postRepository.deletePost(id);

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글과 댓글 함께 생성
postsRouter.post(
  '/with-comment',
  authMiddleware,
  validate('body', createPostWithCommentSchema),
  async (req, res, next) => {
    try {
      const { title, content, commentContent } = req.body; // 이미 검증됨

      // 인증된 사용자를 작성자로 설정
      const result = await postRepository.createWithComment(
        req.user.id,
        { title, content, published: true },
        commentContent,
      );

      res.status(HTTP_STATUS.CREATED).json({
        message: '게시글과 댓글이 함께 생성되었습니다.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 여러 게시글 일괄 생성
postsRouter.post(
  '/batch',
  authMiddleware,
  validate('body', batchCreatePostsSchema),
  async (req, res, next) => {
    try {
      const { posts } = req.body; // 이미 검증됨

      const result = await postRepository.createMultiple(posts);

      res.status(HTTP_STATUS.CREATED).json({
        message: `${result.length}개의 게시글이 생성되었습니다.`,
        posts: result,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 게시글과 댓글 함께 삭제
postsRouter.delete(
  '/:id/with-comments',
  authMiddleware,
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // 게시글 존재 및 권한 확인
      const existingPost = await postRepository.findPostById(id);
      if (!existingPost) {
        throw new NotFoundException(ERROR_MESSAGE.POST_NOT_FOUND);
      }

      // 작성자만 삭제 가능
      if (existingPost.authorId !== req.user.id) {
        throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN_RESOURCE);
      }

      const result = await postRepository.deleteWithComments(id);

      res.status(HTTP_STATUS.OK).json({
        message: '게시글과 댓글이 삭제되었습니다.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
);
