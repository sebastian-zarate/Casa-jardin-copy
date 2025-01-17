"use server";
import { PrismaClient } from "@prisma/client";
import { getAlumnoById } from "./Alumno";
const prisma = new PrismaClient();

//get responsable by alumno ID

export async function getResponsableByAlumnoId(alumnoId: number) {
  return await prisma.responsable.findUnique({
    where: {
      alumnoId: alumnoId,
    },
  });
}
export async function getDireccionResponsableByAlumnoId(alumnoId: number) {
  return await prisma.responsable.findUnique({
    where: {
      alumnoId: alumnoId,
    },
    include: {
    direccion: {
      select: {
        calle: true,
        numero: true,
        localidad: {
          select: {
            nombre: true,
            provincia: {
              select: {
                nombre: true,
                nacionalidad: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
          },
        },
      },
    }
    }
  })
}


//obtener todos los responsables
export async function getAllResponsables() {
   return await prisma.responsable.findMany();
}
//crear responsable
export async function createResponsable(data: {
  alumnoId: number;
  nombre: string;
  apellido: string;
  dni: number;
  telefono: string;
  email: string;
  direccionId?: number;
}) {
  const responsableTrim = {
    alumnoId: data.alumnoId,
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    dni: Number(data.dni),
    telefono: data.telefono.trim(),
    email: data.email.trim(),
    direccionId: data?.direccionId,
  };
  const responsable = await getResponsableByAlumnoId(responsableTrim.alumnoId);
  if(responsable) {
    console.log("existe responsable", responsable)
    return await prisma.responsable.update({
      where: { alumnoId: responsableTrim.alumnoId },
      data: data,
    });
  }
  console.log("no existe responsable", responsableTrim)
  return await prisma.responsable.create({
    data: responsableTrim,
  });
}

//actualizar responsable
export async function updateResponsable(idAlumno: number, data: {
  alumnoId: number;
  nombre: string;
  apellido: string;
  dni: number;
  telefono: string;
  email: string;
  direccionId?: number;
}) {
  const responsableTrim = {
    alumnoId: data.alumnoId,
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    dni: Number(data.dni),
    telefono: data.telefono.trim(),
    email: data.email.trim(),
    direccionId: data?.direccionId,
  };

  // buscar si existe responsable
  const responsable = await getResponsableByAlumnoId(idAlumno);
  if(!responsable) 
  {
    // si no existe, se crea
    return await prisma.responsable.create({
      data: responsableTrim,
    });

  } else {
    // si existe, se actualiza
    return await prisma.responsable.update({
      where: { alumnoId: idAlumno },
      data: responsableTrim,
    });
  }
  

}

//eliminar responsable
export async function deleteResponsable(id: number) {
  return await prisma.responsable.delete({
    where: { id },
  });
}

// borrar responsable por id de alumno
export async function deleteResponsableByAlumnoId(alumnoId: number) {
  const responsable = await getResponsableByAlumnoId(alumnoId);
  if(!responsable) return "No posee responsable el alumno"
  return await prisma.responsable.delete({
    where: { id: responsable.id },
  });
}
