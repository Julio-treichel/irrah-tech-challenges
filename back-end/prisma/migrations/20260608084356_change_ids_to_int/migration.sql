/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Conversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Conversation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Recipient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Recipient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `clientId` on the `Conversation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `recipientId` on the `Conversation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `conversationId` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sentById` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `clientId` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_clientId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clientId",
ADD COLUMN     "clientId" INTEGER NOT NULL,
DROP COLUMN "recipientId",
ADD COLUMN     "recipientId" INTEGER NOT NULL,
ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "conversationId",
ADD COLUMN     "conversationId" INTEGER NOT NULL,
DROP COLUMN "sentById",
ADD COLUMN     "sentById" INTEGER NOT NULL,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Recipient" DROP CONSTRAINT "Recipient_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clientId",
ADD COLUMN     "clientId" INTEGER NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
