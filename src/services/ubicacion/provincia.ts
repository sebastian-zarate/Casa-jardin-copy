"use server"
import { API } from "@/helpers/Api";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { getRolById } from "../rol";

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
  return await prisma.provincia.findUnique({
    where: {
      id: Number(ProvinciasId),
    },
  });
}
export async function getProvinciasByName(ProvinciasName: string) {
  return await prisma.provincia.findFirst({
    where: {
      nombre: ProvinciasName,
    },
  });
}

export async function addProvincias(data: {
  nombre: string;
  nacionalidadId: number;
}) {
  console.log("CREANDO PROVINCIA")
  let estado = false
  const provincias = await getProvincias();
  for (let index = 0; index < provincias.length; index++) {
    if (provincias[index].nombre === data.nombre) {
      estado = true
      return provincias[index];
    }
  }
  if(!estado){
    const prov = await prisma.provincia.create({
      data: data
    });
    return prov;
  } 
}

export async function updateProvinciaById(id:number, data: {
  nombre: string;
  nacionalidadId: number;
}) {
  console.log("actualizo direccion")
  const newProvincia = {
    id: id,
    nombre: data.nombre,
    nacionalidadId: data.nacionalidadId,
  }
  return await prisma.provincia.update({
    where: { id },
    data: newProvincia
  });  
}
