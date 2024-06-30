/*
  Warnings:

  - Made the column `countryFlag` on table `City` required. This step will fail if there are existing NULL values in that column.
  - Made the column `countryCode` on table `City` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `City` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `City` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `City` MODIFY `countryFlag` VARCHAR(10) NOT NULL,
    MODIFY `countryCode` CHAR(2) NOT NULL,
    MODIFY `latitude` DOUBLE NOT NULL,
    MODIFY `longitude` DOUBLE NOT NULL;
