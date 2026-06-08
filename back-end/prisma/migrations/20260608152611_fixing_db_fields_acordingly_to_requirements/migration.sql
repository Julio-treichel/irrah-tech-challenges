/*
  Warnings:

  - The `sentByType` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `documentType` on the `clients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `planType` on the `clients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('prepaid', 'postpaid');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');

-- CreateEnum
CREATE TYPE "MessagePriority" AS ENUM ('normal', 'urgent');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('queued', 'processing', 'sent', 'failed');

-- CreateEnum
CREATE TYPE "SentByType" AS ENUM ('client', 'user');

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "documentType",
ADD COLUMN     "documentType" "DocumentType" NOT NULL,
DROP COLUMN "planType",
ADD COLUMN     "planType" "PlanType" NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "sentByType",
ADD COLUMN     "sentByType" "SentByType" NOT NULL DEFAULT 'client',
DROP COLUMN "priority",
ADD COLUMN     "priority" "MessagePriority" NOT NULL DEFAULT 'normal',
DROP COLUMN "status",
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'queued';

-- CreateIndex
CREATE INDEX "conversations_clientId_idx" ON "conversations"("clientId");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE INDEX "sessions_clientId_idx" ON "sessions"("clientId");
