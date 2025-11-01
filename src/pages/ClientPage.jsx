// src/pages/ClientPage.jsx (o ProjectsPage.jsx, etc.)

import React from "react";
import { UnifiedTable } from "../components/UnifiedTable";
import { clientColumns } from "../utils/tableConfigs"; // Importa las columnas de clientes

// Datos de ejemplo (normalmente vendrían de una API)
const MOCK_CLIENT_DATA = [
  {
    id: 1,
    nombre: "Empresa Alfa",
    cuit: "20-11111111-1",
    telefono: "123456789",
    email: "alfa@example.com",
    proyectos: 5,
  },
  {
    id: 2,
    nombre: "Cliente Beta",
    cuit: "27-22222222-2",
    telefono: "987654321",
    email: "beta@example.net",
    proyectos: 2,
  },
  {
    id: 3,
    nombre: "Soluciones Gamma",
    cuit: "30-33333333-3",
    telefono: "456789123",
    email: "gamma@example.com",
    proyectos: 8,
  },
  {
    id: 4,
    nombre: "Innovaciones Delta",
    cuit: "20-44444444-4",
    telefono: "789123456",
    email: "delta@example.org",
    proyectos: 1,
  },
  {
    id: 5,
    nombre: "Redes Epsilon",
    cuit: "27-55555555-5",
    telefono: "321654987",
    email: "epsilon@example.com",
    proyectos: 3,
  },
  {
    id: 6,
    nombre: "Tecnologías Zeta",
    cuit: "30-66666666-6",
    telefono: "654789321",
    email: "zeta@example.net",
    proyectos: 7,
  },
  {
    id: 7,
    nombre: "Sistemas Eta",
    cuit: "20-77777777-7",
    telefono: "159263487",
    email: "eta@example.com",
    proyectos: 4,
  },
  {
    id: 8,
    nombre: "Proyectos Theta",
    cuit: "27-88888888-8",
    telefono: "753159842",
    email: "theta@example.org",
    proyectos: 6,
  },
  {
    id: 9,
    nombre: "Consulting Iota",
    cuit: "30-99999999-9",
    telefono: "246813579",
    email: "iota@example.com",
    proyectos: 2,
  },
  {
    id: 10,
    nombre: "Global Kappa",
    cuit: "20-10101010-0",
    telefono: "975318642",
    email: "kappa@example.net",
    proyectos: 9,
  },
  // Agrega más datos para ver la paginación
  {
    id: 11,
    nombre: "Local Lambda",
    cuit: "27-11223344-5",
    telefono: "112233445",
    email: "lambda@example.com",
    proyectos: 1,
  },
  {
    id: 12,
    nombre: "Servicios Mu",
    cuit: "30-44556677-8",
    telefono: "445566778",
    email: "mu@example.net",
    proyectos: 6,
  },
];

const ClientPage = () => {
  return (
    <div>
      {/* Usar el componente de tabla unificado */}
      <UnifiedTable
        data={MOCK_CLIENT_DATA}
        columns={clientColumns} // Le pasamos la configuración de columnas de clientes
        tableTitle="Clientes" // El título para el h2
      />
      {/* Si tuvieras una página de proyectos, sería:
      <UnifiedTable
        data={MOCK_PROJECT_DATA}
        columns={projectColumns} // Le pasamos la configuración de columnas de proyectos
        tableTitle="Proyectos"
      />
      */}
    </div>
  );
};

export default ClientPage;
