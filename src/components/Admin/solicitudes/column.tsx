"use client"
import {ColumnDef} from "@tanstack/react-table";
import {Button, buttonVariants} from "@/components/ui/button";
import {SquareArrowOutUpRight, Trash2} from "lucide-react";
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
    estado: string; //leido, no leido
}

//defino las columnas que va a tener la tabla
export const createColumns= (
    onViewDetails: (solicitudId: number) => void,
    onDelete: (solicitudId: number) => void
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
              <>
                <Button
                  variant="link"
                  size="icon"
                  onClick={() => onViewDetails(solicitud.codigo)}
                  className="text-gray-600 hover:text-sky-600"
                >
                  <SquareArrowOutUpRight />
                </Button>
                <Button
                  variant="link"
                  size="icon"
                  onClick={() => onDelete(solicitud.codigo)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <Trash2/>
                </Button>
              </>
            );
        },
    },        
];
