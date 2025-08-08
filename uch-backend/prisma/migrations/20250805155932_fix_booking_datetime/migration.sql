/*
  Warnings:

  - You are about to alter the column `startTime` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Time(0)` to `DateTime`.
  - You are about to alter the column `endTime` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Time(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Booking` MODIFY `startTime` DATETIME NOT NULL,
    MODIFY `endTime` DATETIME NOT NULL;
