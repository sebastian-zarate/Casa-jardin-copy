"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//obtener solicitudMayor por id de solicitud 
export async function getSolicitudMenorByIdSolictud(solicitudId: number) {
    const x =  await prisma.solicitudMenores.findFirst({
      where: {
        solicitudId: solicitudId,
      },
    });
    return x;
  }