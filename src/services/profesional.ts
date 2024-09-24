'use server'
import { Curso, PrismaClient, Profesional_Curso } from "@prisma/client";

const prisma = new PrismaClient();

export type Profesional = {
    id: number;
    nombre: string;
    apellido: string;
    especialidad: string;
    email: string;
    telefono: number;
    password: string;
    direccionId: number;
  }

export async function getProfesionales() {
  return await prisma.profesional.findMany();
}

export async function getProfesionalById(id: number) {
  return await prisma.profesional.findUnique({
    where: {
      id,
    },
  });
}

export async function createProfesional(data: {
    nombre: string;
    apellido: string;
    especialidad: string;
    email: string;
    telefono: number;
    password: string;
    direccionId: number;
}) {
  return await prisma.profesional.create({
    data,
  });
}

export async function updateProfesional(id: number, data: {
    nombre?: string;
    apellido?: string;
    especialidad?: string;
    email?: string;
    telefono?: number;
    password?: string;
    direccionId?: number;
}) {
  return await prisma.profesional.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteProfesional(id: number) {
  return await prisma.profesional.delete({
    where: {
      id,
    },
  });
}
