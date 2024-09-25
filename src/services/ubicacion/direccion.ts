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

  if (!direccion) {
    throw new Error("La dirección no existe.");
  }

  const newDireccion = {
    calle: data.calle,
    numero: data.numero,
    localidadId: data.localidadId,
  };

  console.log("actualizo direccion");
  return await prisma.direccion.update({
    where: {
      id: direccionId,
    },
    data: newDireccion,
  });
}
export async function updateDireccionByIdUser(userId: number, rolId: number, data: {
  calle: string;
  numero: number;
  localidadId: number;
}) {
  // Verificar si la provincia existe
  //si el rol es 2 es de alumno
  if (rolId === 2) {
    const alumno = await prisma.alumno.findUnique({ where: { id: userId } });
    console.log(alumno);
    if (!alumno) {
      throw new Error("El usuario no existe.");
    }
    const direccion = await prisma.direccion.findUnique({ where: { id: Number(alumno?.direccionId) } });
    console.log(direccion);
    return await prisma.direccion.update({
      where: { id: Number(alumno?.direccionId) },
      data: {
        calle: data.calle,
        numero: data.numero,
        localidadId: data.localidadId,
      },
    })
  }
  //si el rol es 3 es de profesional
  if (rolId === 3) {
    const profesional = await prisma.profesional.findUnique({ where: { id: userId } });
    console.log(profesional);
    if (!profesional) {
      throw new Error("El usuario no existe.");
    }
    const direccion = await prisma.direccion.findUnique({ where: { id: Number(profesional?.direccionId) } });
    console.log(direccion);
    return await prisma.direccion.update({
      where: { id: Number(profesional?.direccionId) },
      data: {
        calle: data.calle,
        numero: data.numero,
        localidadId: data.localidadId,
      },
    })
  }
}

//agrego una dirección a la DB
export async function addDireccion(data: {
  calle: string;
  numero: number;
  localidadId: number;
}) {
  const dirr = await prisma.direccion.create({
    data: data
  });
  return dirr;
}
/* export async function addDireccion(data: {
  calle: string;
  numero: number;
  localidadId: number;
}) {

  console.log("CREANDO DIRECCION")
  let estado = false
  const direcciones = await getDireccionByLocalidadId(Number(data.localidadId));
  for (let index = 0; index < direcciones.length; index++) {
    if (direcciones[index].calle === data.calle) {
      estado = true
      return direcciones[index];
    }
  }
  if(!estado){
    const dirr = await prisma.direccion.create({
      data: data
    });
    return dirr;
  } 
} */
//obtengo dirección por ID
export async function getDireccionById(DireccionId: number) {
  return await prisma.direccion.findUnique({
    where: {
      id: DireccionId
    }
  })
}
//obtengo dirección por ID
export async function getDireccionByLocalidadId(LocalidadId: number) {
  return await prisma.direccion.findMany({
    where: {
      localidadId: Number(LocalidadId),
    }
  })
}
// en esta funsion se obtienen las provincias por pais segun lo que se seleccione en el formulario de registro
// para poder mostrarlas en el formulario de registro de alumno
export async function getProvinciasByPais(paisId: number) {
  return await prisma.provincia.findMany({
    where: {
      nacionalidadId: Number(paisId),
    },
    select: {
      id: true,
      nombre: true,
    },
  });
}
// en esta funsion se obtienen las localidades por provincia segun lo que se seleccione en el formulario de registro
// para poder mostrarlas en el formulario de registro de alumno
export async function getLocalidadesByProvincia(provinciaId: number) {
  return await prisma.localidad.findMany({
    where: {
      provinciaId: Number(provinciaId),
    },
    select: {
      id: true,
      nombre: true,
    },
  });
}
