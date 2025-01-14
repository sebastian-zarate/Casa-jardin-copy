"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

//para manejar el filtro
const ESTADOS = {
  "all": "Todos",
  "Aceptada": "Aceptada",
  "Rechazada": "Rechazada",
  "Parcialmente Aprobada": "Parcialmente Aprobada",
  "No Leída": "No Leída",
} as const


export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
    if (value === "all") {
      setColumnFilters([])
    } else {
      setColumnFilters([{ id: "estado", value }])
    }
  }

  const colores: {[key: string]: string} = {
    "Aceptada": "text-green-600",
    "Rechazada": "text-red-600",
    "Parcialmente Aprobada": "text-yellow-600",
    "No Leída": "text-gray-600",
  }

  return (
    <div className="rounded-md border">
      <div className="flex items-center gap-4 p-4 border-b-2 border-slate-200">
              <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Filtrar por estado:</span>
                  <Select value={selectedFilter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ESTADOS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <span className={value !== "all" ? colores[value] : ""}>
                            {label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedFilter !== "all" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange("all")}
                    className="ml-2"
                  >
                    Limpiar filtro
                  </Button>
                )}
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Buscar por nombre..."
            value={(table.getColumn("alumno")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("alumno")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id}
                    className={cell.column.id === "estado" ? `font-bold ${colores[cell.getValue() as string]}` : ""}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sin Resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}