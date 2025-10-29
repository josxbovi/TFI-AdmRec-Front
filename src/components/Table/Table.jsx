// Table.jsx (Componente principal y reutilizable)
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import './Table.css';

export const Table = ({ columns, data, className = "" }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 p-4">No hay datos para mostrar.</div>;
  }

  return (
    <div className={`custom-table-container w-[912px] ${className}`}>

      {/* 1. Cabecera de la tabla */}
      <TableHeader columns={columns} />

      {/* 2. Filas de la tabla: Iteramos sobre los datos */}
      <div className="table-body">
        {data.map((item, rowIndex) => (
          // Pasamos el objeto de datos (item) y la configuración de las columnas (columns)
          <TableRow key={rowIndex} item={item} columns={columns} />
        ))}
      </div>
    </div>
  );
};
