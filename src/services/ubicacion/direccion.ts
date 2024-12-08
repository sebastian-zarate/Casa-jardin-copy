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

  const dataTrim = {
    calle: data.calle.trim(),
    numero: data.numero,
    localidadId: data.localidadId
  }

  // Verificar si la dirección existe
  const direccion = await prisma.direccion.findUnique({
    where: {
      id: direccionId,
    },
  });
  
  if (!direccion) {
    throw new Error("La dirección no existe.");
  }

  console.log("actualizo direccion");
  return await prisma.direccion.update({
    where: {
      id: direccionId,
    },
    data: dataTrim,
  });
}

export async function getDireccionByCalleNumero(calle: string, numero: number) {
  return await prisma.direccion.findFirst({
    where: {
      calle: {
        equals: calle.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
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
  const dataTrim = {
    calle: data.calle.trim(),
    numero: data.numero,
    localidadId: data.localidadId
  }
  const direccionExistente = await getDireccionByCalleNumero(dataTrim.calle, dataTrim.numero);
  if (direccionExistente) {
    console.log("DIRECCION EXISTENTE")
    return direccionExistente;
  }
  console.log("DIRECCION NUEVA")
  const dirr = await prisma.direccion.create({
    data: dataTrim
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

