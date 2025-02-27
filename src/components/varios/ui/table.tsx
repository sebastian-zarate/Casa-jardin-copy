import React from 'react';
import defaultImage from "../../../../public/Images/default-no-image.png"; 


export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
  showImage?: boolean; // Nueva prop para controlar la columna de imagen
}

const defaultImageUrl = defaultImage.src; // Ruta de la imagen por defecto

//tabla generica
export function Table<T extends { id: string | number; imageUrl?: string }>({
  data,
  columns,
  actions,
  showImage = true, // Valor por defecto true
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            {showImage && (
              <th scope="col" className="px-4 py-3">
                Imagen
              </th>
            )}
            {columns.map((column) => (
              <th key={column.key.toString()} scope="col" className="px-4 py-3">
                {column.header}
              </th>
            ))}
            {actions && (
              <th scope="col" className="px-4 py-3">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
              {showImage && (
                <td className="px-6 py-4">
                  <img
                    src={item.imageUrl || defaultImageUrl}
                    alt="Imagen"
                    className="w-10 h-10 object-cover"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key.toString()} className="px-6 py-4">
                  {column.render ? column.render(item) : String(item[column.key as keyof T])}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}