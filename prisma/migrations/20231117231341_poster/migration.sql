/*
  Warnings:

  - You are about to drop the column `poster_img` on the `movies` table. All the data in the column will be lost.
  - Added the required column `poster` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "poster_img",
ADD COLUMN     "poster" TEXT NOT NULL;
