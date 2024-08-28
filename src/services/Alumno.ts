"use server"

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../helpers/hashPassword";
import { verifyPassword } from "../helpers/hashPassword";
import exp from "constants";
const prisma = new PrismaClient();

export type Alumno = {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  telefono: number;
  password: string;
}

// Crear Alumnos
export async function createAlumno(data: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    dni?: number;
    telefono?: number;
    direccionId?: number;
  }) {
    // Encriptar la contraseña
    const hashedPassword = await hashPassword(data.password);
  
    // Crear la estructura de datos del alumno
    const alumnoData: any = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      password: hashedPassword,
      dni: data.dni,
      telefono: data.telefono,
    };
  
    if (data.direccionId) {
      // Verificar si el direccionId existe en la base de datos
      const direccionExiste = await prisma.direccion.findUnique({
        where: { id: data.direccionId },
      });
      // por si no existe la direccion
      if (!direccionExiste) {
        throw new Error("El direccionId no es válido.");
      }
      alumnoData.direccionId = data.direccionId;
    }
  
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
      return alumno;
    } else {
      // Contraseña incorrecta
      throw new Error("Email o contraseña incorrectos");
    }
  }

// Modificar Alumno
export async function updateAlumno(id: number, data: {
    nombre: string;
    apellido: string;
    dni: string;
    telefono: number;
    pais: string;
    provincia: string;
    localidad: string;
    calle: string;
    numero: number;

  }) {
    // Verificar si el alumno existe
    const alumno = await prisma.alumno.findUnique({ where: { id } });
    if (!alumno) {
      throw new Error("El alumno no existe.");
    }
  
    // Crear la estructura de datos del alumno
    const alumnoData: any = {
      id: id,
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      telefono: data.telefono,
      pais: data.pais,
      provincia: data.provincia,
      localidad: data.localidad,
      calle: data.calle,
      numero: data.numero,
    };
  
    // Actualizar el alumno
    return await prisma.alumno.update({
      where: { id },
      data: alumnoData,
    });
  }