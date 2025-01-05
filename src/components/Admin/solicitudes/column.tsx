"use client"
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export type SolicitudData = {
    codigo: number;
    alumno: string; //nombre y apellido
    email: string;
    estado: string; //pendiente, no pendiente
}

//defino las columnas que va a tener la tabla
export const createColumns= (
    onViewDetails: (solicitudId: number) => void,
    onAccept: (solicitudId: number) => void,
    onReject: (solicitudId: number) => void
    ): ColumnDef<SolicitudData>[] => [
    
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
    {
        header: 'Acciones',
        id: 'acciones',
        cell: ({ row }) => {
            const solicitud = row.original; //variable que contiene la fila actual
            return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => onViewDetails(solicitud.codigo)}
                    >
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-green-600" onClick={() => onAccept(solicitud.codigo)}>Aceptar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onReject(solicitud.codigo)}>Rechazar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },        
];
