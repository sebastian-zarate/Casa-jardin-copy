"use server"

import { PrismaClient } from "@prisma/client";
import { Provincia } from "./provincia";

const prisma = new PrismaClient();
export type Pais = {
  id: number;
  nombre: string;
}

// en esta funcion se obtienen los paises
// para poder mostrarlos en el formulario de registro
export async function getPaises() {
    return await prisma.nacionalidad.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });
}

export async function getPaisById(paisId: number) {
    return await prisma.nacionalidad.findUnique({
      where: {
        id: Number(paisId),
      },
    });
}
export async function getPaisByName(pais: string) {
  return await prisma.nacionalidad.findFirst({
    where: {
      nombre: {
        equals: pais,
        mode: 'insensitive',
      }
    },
  });
}
export async function updatePaisById(id:number, data: {
  nombre: string;
}) {
  const newPais = {
    id: id,
    nombre: data.nombre,
  }
  console.log("actualizo pais")

  return await prisma.nacionalidad.update({
    where: { id },
    data: newPais
  });
}

export async function addPais(data: {
  nombre: string;
}) {
  const paisExistente = await prisma.nacionalidad.findFirst({
    where: {
      nombre: {
        equals: data.nombre,
        mode: 'insensitive', // This ensures case-insensitive comparison
      },
    },
  });
  if (paisExistente) {
    console.log("PAIS EXISTENTE")
    return paisExistente;
  }
  console.log("PAIS NUEVO")
  const pais = prisma.nacionalidad.create({
    data: data
  })
  return pais

}

/* export async function getAllPais(provincias: Provincia[]) {
  return await prisma.nacionalidad.findMany({
    where: {
      provincias: {
        some: {
          id: {
            in: provincias.map(provincia => provincia.id)
          }
        }
      }
}
  });
} */

