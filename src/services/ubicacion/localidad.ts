"use server"
import axios from "axios";
import { API } from "@/helpers/Api";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export type Localidad = {
  id: number;
  nombre: string;
  provinciaId: number
}


// en esta funcion se obtienen los Localidades
// para poder mostrarlos en el formulario de registro
export async function getLocalidades() {
    return await prisma.nacionalidad.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });
}
//añado una localidad
export async function addLocalidad(data: {
  nombre: string;
  provinciaId: number}) {

  try{
    const localidad = await prisma.localidad.create({ 
      data: data
     })
     return localidad
  } catch(error){
    console.error("Error fetching data:", error);
  }
}
//actualizo una localidad
export async function updateLocalidadByIdUser(userId: number, data: {
  nombre: string;
  provinciaId: number;
}) {
  // Verificar si la provincia existe
  const alumno = await prisma.alumno.findUnique({ where: { id: userId } });
  const profesional = await prisma.profesional.findUnique({ where: { id: userId } });
  if (!alumno) {
    if (!profesional) {
      throw new Error("El usuario no existe.");
    }
  }
  const direccion = await prisma.direccion.findUnique({ where: { id: Number(alumno?.direccionId )} });
  const direccion2 = await prisma.direccion.findUnique({ where: { id: Number(profesional?.direccionId )} });
  if (!direccion) {
    if (!direccion2) {
      throw new Error("La dirección no existe.");
    }
  }
  const localidad1 = await prisma.localidad.findUnique({ where: { id: Number(direccion?.localidadId) } });
  const localidad2 = await prisma.localidad.findUnique({ where: { id: Number(direccion2?.localidadId) } });
  if (!localidad1) {
    if (!localidad2) {
      throw new Error("La localidad no existe.");
    }
  }
  // Crear la estructura de datos de la provincia
  const LocalidadData: any = {
    id: Number(localidad1?.id) || Number(localidad2?.id),
    nombre: data.nombre,
    provinciaId: data.provinciaId,
  };

  // Actualizar la provincia
  return await prisma.localidad.update({
    where: { id: LocalidadData.id },
    data: LocalidadData,
  });
}


export async function getLocalidadById(LocalidadId: number) {
    return await prisma.nacionalidad.findUnique({
      where: {
        id: Number(LocalidadId),
      },
    });
}


// Esta función obtiene el nombre de una localidad específica por su ID y el ID de su provincia desde una API externa
export async function getApiLocalidadByName(provinciaId: number, localidadId: number) {
  let localidadLista;
  try {
    // Realiza una solicitud GET a la API externa para obtener la lista de localidades de una provincia específica
    const response = await axios.get(API + `localidades?provincia=${provinciaId}&max=900`);
    localidadLista = response.data.localidades;
  } catch (error) {
    // Manejo de errores en caso de que la solicitud falle
    console.error('Error al obtener las provincias:', error);
  }

  console.log(localidadLista);

  let localidad;
  // Itera sobre la lista de localidades para encontrar la localidad con el ID especificado
  for (let index = 0; index < localidadLista.length; index++) {
    if (Number(localidadLista[index].id) === localidadId) {
      localidad = localidadLista[index].nombre;
    }
  }

  console.log(localidad);
  // Retorna el nombre de la localidad encontrada
  return localidad;
}


