-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `npm` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `prodi` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_npm_key`(`npm`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `room` VARCHAR(191) NOT NULL,
    `purpose` TEXT NOT NULL,
    `audience` INTEGER NOT NULL,
    `bookingDate` DATE NOT NULL,
    `startTime` TIME NOT NULL,
    `endTime` TIME NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QRCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `QRCode_bookingId_key`(`bookingId`),
    UNIQUE INDEX `QRCode_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Checkin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `checkinTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Checkin_bookingId_key`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QRCode` ADD CONSTRAINT `QRCode_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Checkin` ADD CONSTRAINT `Checkin_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Checkin` ADD CONSTRAINT `Checkin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
