import React from 'react';

/**
 * Configuración de columnas para la Tabla de Clientes.
 * Cada objeto define una columna:
 * - header: El texto que se mostrará en la cabecera.
 * - accessor: La clave del objeto de datos (data) de donde se extrae el valor.
 * - Cell (Opcional): Una función para renderizar contenido personalizado (ej. enlaces, botones).
 */
export const clientColumns = [
  {
    header: "Nombre",
    accessor: "nombre",
    width: "15%",
  },
  {
    header: "CUIT",
    accessor: "cuit",
    width: "15%",
  },
  {
    header: "Teléfono",
    accessor: "telefono",
    width: "15%",
  },
  {
    header: "Email",
    accessor: "email",
    width: "15%",
  },
  {
    header: "Proyectos",
    accessor: "proyectos",
    width: "15%",
    // Renderiza el valor como un enlace (Link item)
    Cell: ({ value, row }) => (
      <a
        href={`/clientes/${row.id}/proyectos`}
        className="text-blue-600 hover:underline"
      >
        {value} Proyectos
      </a>
    ),
  },
  {
    header: "Historial",
    accessor: "historial",
    width: "15%",
    // Renderiza un enlace genérico de "Historial"
    Cell: () => (
      <a href="/historial" className="text-blue-600 hover:underline">
        ver
      </a>
    ),
  },
  {
    header: "Editar",
    accessor: "editar",
    width: "10%",
    // Renderiza un botón o ícono para editar
    Cell: () => (
      <button className="text-gray-500 hover:text-gray-900">⚙️</button>
    ),
  },
];
