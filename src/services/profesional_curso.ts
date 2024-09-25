'use server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Profesional_Curso = {
    id: number;
    profesionalId: number;
    cursoId: number;
}
export async function createProfesional_Curso(data: {
    cursoId: number;
    profesionalId: number;
}) {
  return await prisma.profesional_Curso.create({
    data,
  });
}

export async function getProfesionales_Curso(profesionalId: number) {
  return await prisma.profesional_Curso.findMany({
    where: {
      profesionalId: profesionalId,
    },
  });
}