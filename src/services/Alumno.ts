"use server"

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../helpers/hashPassword";
import { verifyPassword } from "../helpers/hashPassword";
import { encrypt, getUserFromCookie } from "@/helpers/jwt";
import { cookies } from "next/headers";
const prisma = new PrismaClient();

// Definir el tipo Alumno
export type Alumno = {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  telefono: number;
  email: string;
  password: string;
  direccionId?: number;
  rolId: number;
  fechaNacimiento?: Date;
  mayoriaEdad?: Boolean
};


// Crear Alumnos
export async function createAlumno(data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;

}) {
  // Verificar si el email ya existe en la base de datos
  const existingAlumno = await prisma.alumno.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingAlumno) {
    // El email ya existe
    return "El email ya está registrado";
  }

  // Encriptar la contraseña
  const hashedPassword = await hashPassword(data.password);

  // Crear el objeto de datos del alumno
  const alumnoData = {
    ...data,
    password: hashedPassword,
    rolId: 2
  };

  // Guardar el alumno
  return await prisma.alumno.create({
    data: alumnoData,
  });
}




// valida los datos del alumno para iniciar sesión
export async function login(email: string, password: string) {
  const alumno = await prisma.alumno.findUnique({ where: { email } });
  // verifica si el alumno existe y si la contraseña es correcta
  if (alumno && await verifyPassword(password, alumno.password)) {
    // Contraseña correcta
    //duración de la sesión
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const sesion = await encrypt({ email: alumno.email, rolId: alumno.rolId, expires })
    //setea la cookie de la sesión
    cookies().set("user", sesion, { expires, httpOnly: true });
    return true;

  } else {
    // Contraseña incorrecta
    /* throw new Error("Email o contraseña incorrectos"); */
    return false;
  }
}



// Modificar Alumno
export async function updateAlumno(id: number, data: {
  nombre: string;
  apellido: string;
  dni: number;
  telefono: number;
  email: string;
  direccionId?: number;
  fechaNacimiento?: Date;
  mayoriaEdad?: Boolean

}) {
  // Verificar si el alumno existe
  const alumno = await prisma.alumno.findUnique({ where: { id } });
  if (!alumno) {
    throw new Error("El alumno no existe.");
  }
  let alumnoData: any = {};
  console.log(data, alumno);

    // Actualizar el alumno


    alumnoData = {
    id: id,
    nombre: data.nombre,
    apellido: data.apellido,
    dni: (data.dni),
    telefono: data.telefono,
    direccionId: data.direccionId
  }
  console.log(alumnoData);
  return await prisma.alumno.update({
    where: { id },
    data: alumnoData,
  });
}

export async function getAlumnoById(id: number) {
  return await prisma.alumno.findUnique({
    where: { id },
  });
}
export async function getAlumnoByCookie() {
  const user = await getUserFromCookie();
  if (user && user.email) {
    const email: any = user.email;
    const alumno = await prisma.alumno.findUnique({
      where: {
        email: email
      }
    });
    return alumno;
  } else return null;
}

// Obtener Alumnos
export async function getAlumnos() {
  return await prisma.alumno.findMany();
}

export async function deleteAlumno(id: number) {
  await prisma.alumno_Curso.deleteMany({
    where: { alumnoId: id }
  })
  return await prisma.alumno.delete({
    where: { id },
  });
}

//get by email
export async function getAlumnoByEmail(email: string) {
  return await prisma.alumno.findUnique({
    where: {
      email: email,
    },
  });
}
