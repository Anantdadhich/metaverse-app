/*
  Warnings:

  - You are about to drop the column `widht` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `elementid` on the `MapElement` table. All the data in the column will be lost.
  - You are about to drop the column `mapid` on the `MapElement` table. All the data in the column will be lost.
  - You are about to drop the column `elementid` on the `SpaceElement` table. All the data in the column will be lost.
  - You are about to drop the column `spaceid` on the `SpaceElement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `static` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `elementId` to the `MapElement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mapId` to the `MapElement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Space` table without a default value. This is not possible if the table is not empty.
  - Made the column `height` on table `Space` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `elementId` to the `SpaceElement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `SpaceElement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Element" ADD COLUMN     "static" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Map" DROP COLUMN "widht",
ADD COLUMN     "thumbnail" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MapElement" DROP COLUMN "elementid",
DROP COLUMN "mapid",
ADD COLUMN     "elementId" TEXT NOT NULL,
ADD COLUMN     "mapId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "creatorId" TEXT NOT NULL,
ALTER COLUMN "height" SET NOT NULL;

-- AlterTable
ALTER TABLE "SpaceElement" DROP COLUMN "elementid",
DROP COLUMN "spaceid",
ADD COLUMN     "elementId" TEXT NOT NULL,
ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarColor" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceElement" ADD CONSTRAINT "SpaceElement_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceElement" ADD CONSTRAINT "SpaceElement_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapElement" ADD CONSTRAINT "MapElement_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapElement" ADD CONSTRAINT "MapElement_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
