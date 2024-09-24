"use server"

import { PrismaClient } from "@prisma/client";

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


export async function addPais(Pais: Pais) {
  /*   const pais = await getPaisById(paisId); */
  try{
    const pais = prisma.nacionalidad.create({
      data: Pais
    })
    return pais
  } catch(error){
    console.error("Error fetching data:", error);
  }

}