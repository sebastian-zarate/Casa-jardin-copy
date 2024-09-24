"use server"

import { API } from "@/helpers/Api";
import { PrismaClient } from "@prisma/client";
import { addProvincias, getApiProvinciaById } from "./provincia";
import { addLocalidad, getApiLocalidadByName } from "./localidad";

const prisma = new PrismaClient();
export type Direccion = {
  id: number;
  calle: string;
  numero: number;
  localidadId:number
}


export async function updateDireccionByIdUser(userId: number, data: {
  calle: string;
  numero: number;
  localidadId:number
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
  // Crear la estructura de datos de la provincia
  const DireccionData: any = {
    id: Number(direccion?.id) || Number(direccion2?.id),
    calle: data.calle,
    numero: data.numero,
    localidadId: data.localidadId,
  };

  // Actualizar la provincia
  return await prisma.localidad.update({
    where: { id: DireccionData.id },
    data: DireccionData
  });
}
//función para devolver true o false dependiendo de si las calle y numeros pasados existen o no
  export async function getApiDireccionesEstado(Calle: string, numero: number): Promise<boolean> {
    let estado = false;
    try {
      const response = await fetch(`${API}calles?nombre=${Calle}`);
      const data = await response.json();
      if (data.calles && data.calles.some((calle: any) =>  calle.nombre.toLocaleUpperCase() === Calle.toLocaleUpperCase())) {
        estado = true;
        
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return estado;
  }

//agrego una dirección a la DB
  export async function addDireccion(data: {
    calle: string;
    numero: number;
    localidadId:number;
    }) {

    try{
      const direccion = await prisma.direccion.create({ 
        data: data
       })
       return direccion
    } catch(error){
      console.error("Error fetching data:", error);
    }

  }
  //obtengo dirección por ID
  export async function getDireccionById(DireccionId:number) {
    return await prisma.direccion.findUnique({
      where:{
        id:DireccionId
      }
    })
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
  