import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAdminByEmail(email: string) {
  return await prisma.administrador.findUnique({
    where: {
      email,
    },
  });
}