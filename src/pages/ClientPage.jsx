import { Table } from "../components/Table/Table"; 
import { clientColumns } from "../utils/tableConfigs"; 

// Datos de prueba
// TO DO: conectar con el backend para obtener datos reales
const clientData = [
  {
    id: 1,
    nombre: "Juan Pérez",
    cuit: "20-12345678-9",
    telefono: "381-4555666",
    email: "juan@example.com",
    proyectos: 5,
  },
  {
    id: 2,
    nombre: "Ana Gómez",
    cuit: "27-98765432-1",
    telefono: "381-4777888",
    email: "ana@example.net",
    proyectos: 2,
  },
  // ... más datos
];

const ClientPage = () => {
  return (
    <div>
      <h1
        className="text-[32px] font-light mb-[35px]"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        Clientes
      </h1>
      <Table columns={clientColumns} data={clientData} />
    </div>
  );
};

export default ClientPage;
