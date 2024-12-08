"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export type Pais = {
  id: number;
  nombre: string;
}

// en esta funcion se obtienen los paises
// para poder mostrarlos en el formulario de registro

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
  const dataTrim = {
    nombre: data.nombre.trim(),
  }
  console.log("actualizo pais")

  return await prisma.nacionalidad.update({
    where: { id },
    data: dataTrim
  });
}

export async function addPais(data: {
  nombre: string;
}) {
  const dataTrim = {
    nombre: data.nombre.trim(),
  }
  const paisExistente = await prisma.nacionalidad.findFirst({
    where: {
      nombre: {
        equals: dataTrim.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleUpperCase(),
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
    data: dataTrim
  })
  return pais

}