-- CreateTable
CREATE TABLE "car" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year_manufacture" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imported" BOOLEAN NOT NULL,
    "plate" TEXT NOT NULL,
    "selling_date" TIMESTAMP(3),
    "selling_price" DECIMAL(65,30),

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);
