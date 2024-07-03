/*
  Warnings:

  - You are about to alter the column `length` on the `Route` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Route` MODIFY `length` DOUBLE NOT NULL;
