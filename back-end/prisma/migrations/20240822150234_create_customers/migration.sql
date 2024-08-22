/*
  Warnings:

  - You are about to drop the column `minicipality` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `municipality` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "minicipality",
ADD COLUMN     "municipality" TEXT NOT NULL,
ALTER COLUMN "house_number" SET DATA TYPE TEXT;
