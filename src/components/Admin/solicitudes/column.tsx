"use client"
import {ColumnDef} from "@tanstack/react-table";

export type SolicitudData = {
    codigo: number;
    alumno: string; //nombre y apellido
    email: string;
    estado: string; //pendiente, no pendiente
}

//defino las columnas que va a tener la tabla
export const columns: ColumnDef<SolicitudData>[] = [
    {
        accessorKey: 'codigo',
        header: 'Código',
    },
    {
        accessorKey: 'alumno',
        header: 'Alumno',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
    },
];
