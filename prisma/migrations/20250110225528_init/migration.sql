CREATE TABLE "user" (
    "id" VARCHAR(191) NOT NULL,
    "name" VARCHAR(99) NOT NULL,
    "email" VARCHAR(99) NOT NULL,
    "password" VARCHAR(100) NULL,
    "refreshToken" TEXT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3) NULL,
    "emailVerificationToken" VARCHAR(100) NULL,
    "emailVerificationExpires" TIMESTAMP(3) NULL,
    "passwordResetToken" VARCHAR(100) NULL,
    "passwordResetExpires" TIMESTAMP(3) NULL,
    "image" VARCHAR(191) NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_email_key" UNIQUE ("email"),
    PRIMARY KEY ("id")
);
