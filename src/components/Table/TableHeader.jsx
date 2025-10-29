// TableHeader.jsx
// Recibe la prop 'columns' que es un array de configuraciones
export const TableHeader = ({ columns }) => {
  return (
    <div className="table-header-container flex items-center justify-between relative self-stretch w-full flex-[0_0_auto] mb-2 font-medium border-b border-gray-300 pb-2">
      {columns.map((col, index) => (
        <div
          key={index}
          className={`table-header-item text-sm p-2 ${
            col.headerClassName || ""
          }`}
          style={{ flexBasis: col.width, flexShrink: 0 }}
        >
          {/* Muestra el título definido en la configuración */}
          {col.header}
        </div>
      ))}
    </div>
  );
};
