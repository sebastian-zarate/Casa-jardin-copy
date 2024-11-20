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
  direccionId: number;
}) {
  return await prisma.responsable.create({
    data: data,
  });
}

//actualizar responsable
export async function updateResponsable(idAlumno: number, data: any) {
/*   const alumno = await getAlumnoById(idAlumno);
  const responsable = await getResponsableByAlumnoId(idAlumno); */
  //console.log("alumno", alumno)
  //console.log("responsable", responsable)
  return await prisma.responsable.update({
    where: { alumnoId: idAlumno },
    data: data,
  });
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
