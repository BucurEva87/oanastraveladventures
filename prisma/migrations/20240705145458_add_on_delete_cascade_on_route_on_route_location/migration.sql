-- DropForeignKey
ALTER TABLE `RouteLocation` DROP FOREIGN KEY `RouteLocation_routeId_fkey`;

-- AddForeignKey
ALTER TABLE `RouteLocation` ADD CONSTRAINT `RouteLocation_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
