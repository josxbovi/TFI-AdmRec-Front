// src/pages/ClientPage.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UnifiedTable } from "../components/UnifiedTable";
import { getAllClientes } from "../services/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import "./ClientPage.css";

const ClientPage = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar clientes desde el backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllClientes();
        
        // Manejar diferentes formatos de respuesta
        let clientesData = [];
        if (Array.isArray(data)) {
          clientesData = data;
        } else if (data && Array.isArray(data.records)) {
          clientesData = data.records;
        } else if (data && Array.isArray(data.data)) {
          clientesData = data.data;
        } else if (data && Array.isArray(data.clientes)) {
          clientesData = data.clientes;
        }
        
        console.log('✅ Clientes cargados:', clientesData);
        setClientes(clientesData);
      } catch (err) {
        console.error('❌ Error al cargar clientes:', err);
        setError(err.message || 'Error al cargar los clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Column definitions
  const clientColumns = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      enableSorting: true,
      cell: ({ row }) => (
        <span className={row.original.estado === 'inactivo' ? 'cliente-inactivo-text' : ''}>
          {row.original.nombre}
        </span>
      ),
    },
    {
      accessorKey: "cuit",
      header: "CUIT",
      enableSorting: true,
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
    },
    {
      accessorKey: "descuento",
      header: "Descuento",
      cell: ({ row }) => (
        <span className="descuento-cell">
          {row.original.descuento ? `🎁 ${parseFloat(row.original.descuento)}%` : '-'}
        </span>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <span 
          className={`estado-badge ${row.original.estado === 'activo' ? 'activo' : 'inactivo'}`}
        >
          {row.original.estado === 'activo' ? '✅ Activo' : '🚫 Inactivo'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => (
        <Link 
          to={`/clientes/${row.original.id}`} 
          className="text-blue-600 hover:underline"
        >
          Ver Detalle
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="client-page">
        <Loading message="Cargando clientes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-page">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="client-page">
      <div className="client-page-header">
        <h1>Gestión de Clientes</h1>
        <Button 
          variant="primary" 
          onClick={() => navigate('/clientes/nuevo')}
        >
          ➕ Nuevo Cliente
        </Button>
      </div>
      
      {clientes.length === 0 ? (
        <div className="empty-state">
          <p>📋 No hay clientes registrados</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/clientes/nuevo')}
          >
            Crear Primer Cliente
          </Button>
        </div>
      ) : (
        <UnifiedTable
          data={clientes}
          columns={clientColumns}
          tableTitle="Lista de Clientes"
        />
      )}
    </div>
  );
};

export default ClientPage;
