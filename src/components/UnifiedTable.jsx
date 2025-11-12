// src/components/UnifiedTable.jsx

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import "./UnifiedTable.css";

import { ChevronUp, ChevronDown, Search } from "lucide-react";

export const UnifiedTable = ({
  data,
  columns: initialColumns,
  tableTitle = "",
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]); // Estado para el ordenamiento
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Índice de página actual (0-based)
    pageSize: 4, // Cantidad de elementos por página
  });

  // Las columnas deben ser memorizadas para evitar re-renderizados innecesarios
  const columns = useMemo(() => initialColumns, [initialColumns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Habilita el filtrado global
    getSortedRowModel: getSortedRowModel(), // Habilita el ordenamiento
    getPaginationRowModel: getPaginationRowModel(), // Habilita la paginación
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    // Puedes definir una función personalizada para el filtrado global
    // globalFilterFn: 'fuzzy', // o una función personalizada
  });

  const {
    getHeaderGroups,
    getRowModel,
    setPageIndex,
    getCanPreviousPage,
    getCanNextPage,
    previousPage,
    nextPage,
    getPageCount,
  } = table;

  return (
    <div className={`unified-table-container w-full mx-auto p-4`}>
      {" "}
      {/* Título de la Tabla */}
      {tableTitle && (
        <h2 className="h2-title text-[52px] font-light text-[#000000] mb-4">
          {tableTitle}
        </h2>
      )}
      {/* Input de Búsqueda Global */}
      <div className=" search-container relative mb-6">
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="unified-search-input w-full p-3 pl-10 border rounded-lg text-lg"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      {/* Tabla */}
      <table className=" min-w-full bg-white border-collapse">
        <thead className="border-b border-gray-300">
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()} // Manejador de ordenamiento
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ChevronUp size={16} />,
                        desc: <ChevronDown size={16} />,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                No se encontraron resultados.
              </td>
            </tr>
          ) : (
            getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Paginación */}
      <div className="flex justify-end items-center space-x-2 mt-4 text-sm">
        <button
          onClick={() => previousPage()}
          disabled={!getCanPreviousPage()}
          className="pagination-button"
        >
          &lt;
        </button>
        {/* Renderiza números de página */}
        <span className="flex items-center gap-1">
          <button
            onClick={() => setPageIndex(0)}
            className={`pagination-button ${
              pagination.pageIndex === 0 ? "active" : ""
            }`}
          >
            1
          </button>
          {getPageCount() > 1 && <span className="page-separator">...</span>}
          {getPageCount() > 1 &&
            pagination.pageIndex !== 0 &&
            pagination.pageIndex !== getPageCount() - 1 && (
              <button
                onClick={() => setPageIndex(pagination.pageIndex)}
                className="px-3 py-1 rounded-md bg-purple-500 text-white"
              >
                {pagination.pageIndex + 1}
              </button>
            )}
          {getPageCount() > 1 && (
            <span className="px-3 py-1 text-gray-600">...</span>
          )}
          {getPageCount() > 1 && (
            <button
              onClick={() => setPageIndex(getPageCount() - 1)}
              className={`px-3 py-1 rounded-md ${
                pagination.pageIndex === getPageCount() - 1
                  ? "bg-purple-500 text-white"
                  : "border"
              }`}
            >
              {getPageCount()}
            </button>
          )}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!getCanNextPage()}
          className="px-3 py-1 border rounded-md text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
