-- DropIndex
DROP INDEX "Post_authorId_idx";

-- DropIndex
DROP INDEX "Post_createdAt_idx";

-- DropIndex
DROP INDEX "Post_published_idx";

-- CreateIndex
CREATE INDEX "Post_createdAt_published_authorId_idx" ON "Post"("createdAt", "published", "authorId");
