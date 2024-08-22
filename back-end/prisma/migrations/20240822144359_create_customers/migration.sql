-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ident_document" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "street_name" TEXT NOT NULL,
    "house_number" INTEGER NOT NULL,
    "complements" TEXT,
    "minicipality" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
