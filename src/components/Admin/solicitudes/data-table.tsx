"use client"
import React, {useState}from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  //eventos de la tabla
  getFilteredRowModel,
  ColumnFilter,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [filterActive, setFilterActive] = useState(false)  // Nuevo estado para controlar el filtro
  
    
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), //principal
    onColumnFiltersChange: setColumnFilters, //filtrado
    getFilteredRowModel: getFilteredRowModel(), //filtrado
    state: {
        columnFilters,
    },
  })

  const toggleFilter = () => {
    if (filterActive) {
      setColumnFilters([])  // Limpia el filtro
    } else {
      setColumnFilters([{ id: "estado", value: "No leída" }])  // Aplica el filtro
    }
    setFilterActive(!filterActive)  // Alterna el estado
  }

  return (
    <div className="rounded-md border">
       <div className="flex items-center py-4">
        <button  
        className="max-w-sm bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 mx-1 rounded" 
        onClick={toggleFilter}
        > {filterActive ? "Mostrar todas" : "Filtrar leídas"}
        </button>
      </div> 
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
