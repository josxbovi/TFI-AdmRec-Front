// src/utils/tableConfigs.js

import React from "react";
import { Pencil } from "lucide-react"; // Icono de lápiz para editar

/**
 * Configuraciones de columnas para diferentes tipos de tablas.
 * Utiliza el formato de TanStack Table.
 *
 * `accessorKey`: La clave en el objeto de datos para esta columna.
 * `header`: El texto que se muestra en la cabecera.
 * `cell`: (Opcional) Una función para renderizar el contenido de la celda.
 * `enableSorting`: (Opcional) Booleano para habilitar/deshabilitar ordenamiento.
 */

// --- Configuraciones de Clientes ---
export const clientColumns = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    enableSorting: true, // Habilitar ordenamiento
  },
  {
    accessorKey: "cuit",
    header: "CUIT",
    enableSorting: true,
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
    // cell: info => <span className="hidden md:table-cell">{info.getValue()}</span> // Ocultar en móvil si es necesario
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorKey: "proyectos",
    header: "Proyectos",
    cell: (info) => (
      <a
        href={`/clientes/${info.row.original.id}/proyectos`}
        className="text-blue-600 hover:underline"
      >
        Link item ({info.getValue()})
      </a>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "historial",
    header: "Historial",
    cell: () => (
      <a href="/historial" className="text-blue-600 hover:underline">
        Link item
      </a>
    ),
  },
  {
    accessorKey: "editar",
    header: "Editar",
    cell: ({ row }) => (
      <button
        onClick={() =>
          alert(
            `Editar cliente ${row.original.nombre} (ID: ${row.original.id})`
          )
        }
        className="text-gray-500 hover:text-gray-900"
      >
        <Pencil size={18} /> {/* Ícono de lápiz */}
      </button>
    ),
  },
];

// --- Ejemplo de Configuraciones de Proyectos (para reutilización) ---
export const projectColumns = [
  {
    accessorKey: "projectId",
    header: "ID Proyecto",
    enableSorting: true,
  },
  {
    accessorKey: "projectName",
    header: "Nombre del Proyecto",
    enableSorting: true,
  },
  {
    accessorKey: "clientName",
    header: "Cliente",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: (info) => (
      <span
        className={`px-2 py-1 rounded ${
          info.getValue() === "Activo"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {info.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Fecha Inicio",
    enableSorting: true,
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <button
        onClick={() => alert(`Ver detalles de ${row.original.projectName}`)}
        className="text-blue-500 hover:underline"
      >
        Ver
      </button>
    ),
  },
];
