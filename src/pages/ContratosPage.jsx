import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllContratos } from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { UnifiedTable } from "../components/UnifiedTable";
import "./ContratosPage.css";

const ContratosPage = () => {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllContratos();
        console.log("✅ Contratos obtenidos:", response);

        // Manejar diferentes formatos de respuesta
        let contratosData = [];
        if (Array.isArray(response)) {
          contratosData = response;
        } else if (response && Array.isArray(response.records)) {
          contratosData = response.records;
        } else if (response && Array.isArray(response.data)) {
          contratosData = response.data;
        }

        setContratos(contratosData);
      } catch (err) {
        console.error("❌ Error al cargar contratos:", err);
        setError(err.message || "Error al cargar los contratos");
      } finally {
        setLoading(false);
      }
    };

    fetchContratos();
  }, []);

  // Definir columnas de la tabla
  const columns = [
    {
      header: "Cliente",
      accessorKey: "cliente.nombre",
      cell: ({ row }) => row.original.cliente?.nombre || "N/A",
    },
    {
      header: "Fecha Inicio",
      accessorKey: "fechaInicio",
      cell: ({ row }) => {
        const fecha = row.original.fechaInicio;
        return fecha ? new Date(fecha).toLocaleDateString("es-AR") : "N/A";
      },
    },
    {
      header: "Fecha Fin",
      accessorKey: "fechaFin",
      cell: ({ row }) => {
        const fecha = row.original.fechaFin;
        return fecha ? new Date(fecha).toLocaleDateString("es-AR") : "N/A";
      },
    },
    {
      header: "Monto",
      accessorKey: "monto",
      cell: ({ row }) => {
        const monto = row.original.monto;
        return monto
          ? `$${Number(monto).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}`
          : "N/A";
      },
    },
    {
      header: "Estado",
      accessorKey: "estado",
      cell: ({ row }) => {
        const estado = row.original.estado || "desconocido";
        return (
          <span className={`estado-badge ${estado.toLowerCase()}`}>
            {estado}
          </span>
        );
      },
    },
    {
      header: "Acciones",
      accessorKey: "id",
      cell: ({ row }) => (
        <Button
          variant="primary"
          onClick={() => navigate(`/contratos/${row.original.id}`)}
        >
          Ver Detalle
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="contratos-page">
        <Loading message="Cargando contratos..." />
      </div>
    );
  }

  return (
    <div className="contratos-page">
      <div className="contratos-header">
        <div>
          <h1>Gestión de Contratos</h1>
          <p>Administra los contratos de tus clientes</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/contratos/nuevo")}>
          + Nuevo Contrato
        </Button>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      <Card>
        {contratos.length > 0 ? (
          <UnifiedTable data={contratos} columns={columns} tableTitle="" />
        ) : (
          <div className="empty-state">
            <p>📄 No hay contratos registrados</p>
            <small>
              Crea tu primer contrato haciendo click en "Nuevo Contrato"
            </small>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContratosPage;
