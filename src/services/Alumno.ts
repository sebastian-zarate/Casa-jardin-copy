"use server"

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../helpers/hashPassword";
import { verifyPassword } from "../helpers/hashPassword";
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
// Crear Alumnos
export async function createAlumno(data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  dni: number;
  telefono: number;
  pais: number;
  provincia: number;
  localidad: number;
  calle: string;
}) {
  // Encriptar la contraseña

  const hashedPassword = await hashPassword(data.password);

  // Verificar que el país, provincia y localidad existen
  const paisExiste = await prisma.nacionalidad.findUnique({
    where: { id: data.pais },
  });
  
  if (!paisExiste) {
    throw new Error("El país seleccionado no es válido.");
  }

  // Verificar que la provincia existe y pertenece al país
  const provinciaExiste = await prisma.provincia.findUnique({
    where: { id: data.provincia },
    include: { nacionalidad: true }, // Incluye la nacionalidad asociada para validación
  });

  if (!provinciaExiste) {
    throw new Error("La provincia seleccionada no es válida.");
  }

  if (provinciaExiste.nacionalidad.id !== data.pais) {
    throw new Error("La provincia seleccionada no es válida para el país indicado.");
  }

  // Verificar que la localidad existe y pertenece a la provincia
  const localidadExiste = await prisma.localidad.findUnique({
    where: { id: data.localidad },
    include: { provincia: true }, // Incluye la provincia asociada para validación
  });

  if (!localidadExiste) {
    throw new Error("La localidad seleccionada no es válida.");
  }

  if (localidadExiste.provincia.id !== data.provincia) {
    throw new Error("La localidad seleccionada no es válida para la provincia indicada.");
  }

  // Crear la dirección del alumno con la localidad seleccionada y la calle
  const nuevaDireccion = await prisma.direccion.create({
    data: {
      calle: data.calle,
      localidadId: data.localidad,
    },
  });

  // Crear el alumno con la dirección creada anteriormente y la contraseña encriptada con bcrypt  
  const alumnoData: any = {
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    password: hashedPassword,
    dni: data.dni,
    telefono: data.telefono,
    direccionId: nuevaDireccion.id,
  };

  // Guardar el alumno
  return await prisma.alumno.create({
    data: alumnoData,
  });
}



// en esta funsion se obtienen los paises
// para poder mostrarlos en el formulario de registro
export async function getPaises() {
  return await prisma.nacionalidad.findMany({
    select: {
      id: true,
      nombre: true,
    },
  });
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



  