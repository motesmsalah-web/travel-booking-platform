-- Add username login support for admin users.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "username" TEXT;
UPDATE "User" SET "username" = split_part("email", '@', 1) WHERE "username" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
