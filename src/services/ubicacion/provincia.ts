"use server"
import { API } from "@/helpers/Api";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
export type Provincia = {
  id: number;
  nombre: string;
  nacionalidadId: number;
}


export async function getProvincias() {
    return await prisma.nacionalidad.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });
}

export async function getProvinciasById(ProvinciasId: number) {
    return await prisma.nacionalidad.findUnique({
      where: {
        id: Number(ProvinciasId),
      },
    });
}

export async function addProvincias(data: {  
    nombre: string;
    nacionalidadId: number;}) {

   try{
    const prov = await prisma.provincia.create({
      data: data
    });
    return prov;
  } catch(error){
    console.error("Error fetching data:", error);
  }
}

// Actualizar una provincia
export async function updateProvinciasByIdUser(userId: number, data: {
  nombre: string;
  nacionalidadId: number;
}) {
  // Verificar si la provincia existe
  const alumno = await prisma.alumno.findUnique({ where: { id: userId } });
  console.log(alumno);
  const profesional = await prisma.profesional.findUnique({ where: { id: userId } });
  console.log(profesional);
  if (!alumno) {
    if (!profesional) {
      throw new Error("El usuario no existe.");
    }
  }
  const direccion = await prisma.direccion.findUnique({ where: { id: Number(alumno?.direccionId )} });
  const direccion2 = await prisma.direccion.findUnique({ where: { id: Number(profesional?.direccionId )} });
  console.log(direccion);
  console.log(direccion2);
  if (!direccion) {
    if (!direccion2) {
      throw new Error("La dirección no existe.");
    }
  }
  const localidad = await prisma.localidad.findUnique({ where: { id: Number(direccion?.localidadId) } });
  const localidad2 = await prisma.localidad.findUnique({ where: { id: Number(direccion2?.localidadId) } });
  console.log(localidad);
  console.log(localidad2);
  if (!localidad) {
    if (!localidad2) {
      throw new Error("La localidad no existe.");
    }
  }
  const provincia = await prisma.provincia.findUnique({ where: { id: Number(localidad?.provinciaId) } });
  const provincia2 = await prisma.provincia.findUnique({ where: { id: Number(localidad2?.provinciaId) } });
  if (!provincia) {
    if (!provincia2) {
      throw new Error("La provincia no existe.");
    }
  }
  // Crear la estructura de datos de la provincia
}

export async function getApiProvinciaById(ProvinciaId: number) {
  let provinciasLista;
  try {
    // Realiza una solicitud GET a la API para obtener la lista de provincias
    const response = await axios.get(API + 'provincias');
    provinciasLista = response.data.provincias;
  } catch (error) {
    // Registra un mensaje de error si la solicitud falla
    console.error('Error al obtener las provincias:', error);
  }

  // Inicializa una variable para almacenar la provincia coincidente
  let provincia;
  // Itera a través de la lista de provincias para encontrar la que tenga el ID coincidente
  for (let index = 0; index < provinciasLista.length; index++) {
    if (Number(provinciasLista[index].id) === ProvinciaId) {
      provincia = provinciasLista[index].nombre;
    }
  }

  // Devuelve el nombre de la provincia coincidente
  return provincia;
}