/*
  Warnings:

  - Changed the type of `year_manufacture` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "year_manufacture",
ADD COLUMN     "year_manufacture" INTEGER NOT NULL;
