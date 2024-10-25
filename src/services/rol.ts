"use server"

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Crear Alumnos
export async function createRol(data: {
    nombre: string;

}) {
  return await prisma.rol.create({
    data: data,
  });
}

export async function getRoles() {
    return await prisma.rol.findMany();
}

export async function getRolById(id: number) {
    return await prisma.rol.findUnique({
        where: {
            id: id
        }
    });
}
