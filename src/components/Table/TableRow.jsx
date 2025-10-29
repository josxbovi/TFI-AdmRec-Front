// TableRow.jsx
// Recibe un objeto de datos (item) y la configuración de las columnas (columns)
export const TableRow = ({ item, columns }) => {
  return (
    <div className="table-row-container flex items-center justify-between relative self-stretch w-full flex-[0_0_auto] py-2 border-b border-gray-100">
      {columns.map((col, index) => {
        // Obtenemos el valor de la propiedad especificada en 'accessor' (ej: item['nombre'])
        const cellValue = item[col.accessor];

        // Renderizado condicional si se proporciona una función de renderizado
        // Esto permite crear "Link item", "Edit Colum", etc.
        const content = col.Cell
          ? col.Cell({ value: cellValue, row: item })
          : cellValue;

        return (
          <div
            key={index}
            className={`table-cell text-sm p-2 ${
              col.cellClassName || ""
            }`}
            data-label={col.header}
            style={{ flexBasis: col.width, flexShrink: 0 }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};
