"use server"

import { API } from "@/helpers/Api";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
export type Direccion = {
  id: number;
  calle: string;
  numero: number;
  localidadId: number
}

export async function updateDireccionById(direccionId: number, data: {
  calle: string;
  numero: number;
  localidadId: number;
}) {
  // Verificar si la dirección existe
  const direccion = await prisma.direccion.findUnique({
    where: {
      id: direccionId,
    },
  });
  const newDireccion = {
    calle: data.calle,
    numero: data.numero,
    localidadId: data.localidadId,
  };
  
  if (!direccion) {
    throw new Error("La dirección no existe.");
  }

  console.log("actualizo direccion");
  return await prisma.direccion.update({
    where: {
      id: direccionId,
    },
    data: newDireccion,
  });
}

export async function getDireccionByCalleNumero(calle: string, numero: number) {
  return await prisma.direccion.findFirst({
    where: {
      calle: {
        equals: calle,
        mode: 'insensitive', // This ensures case-insensitive comparison
      },
      numero: numero,
    },
  });
}
//agrego una dirección a la DB
export async function addDireccion(data: {
  calle: string;
  numero: number;
  localidadId: number;
}) {
  const direccionExistente = await getDireccionByCalleNumero(data.calle, data.numero);
  if (direccionExistente) {
    console.log("DIRECCION EXISTENTE")
    return direccionExistente;
  }
  console.log("DIRECCION NUEVA")
  const dirr = await prisma.direccion.create({
    data: data
  });
  return dirr;
}

//obtengo dirección por ID
export async function getDireccionById(DireccionId: number) {
  const direccion = await prisma.direccion.findFirst({
    where: {
      id: DireccionId
    }
  })
  console.log(direccion);
  return direccion;
}

//obtengo todas las direcciones
export async function getDireccionCompleta (DireccionId: number) {
  const direccion = await prisma.direccion.findUnique({
    where: { id: DireccionId },
    include: {
      localidad: {
        include: {
          provincia: {
            include: {
              nacionalidad: true
            }
          }
        }
      }
    }
  });
  return direccion;
}

