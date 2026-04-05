/*
  Warnings:

  - Added the required column `title` to the `CarImageContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarImageContent" ADD COLUMN     "title" TEXT NOT NULL;
