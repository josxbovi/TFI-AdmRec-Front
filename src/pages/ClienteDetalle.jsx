import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClienteById } from '../services/api';
import Card from '../components/Card';
import { UnifiedTable } from '../components/UnifiedTable';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import './ClienteDetalle.css';

// Define columns for the projects table
const projectColumns = [
    { header: 'Nombre Proyecto', accessorKey: 'nombre_proyecto', enableSorting: true },
    { header: 'Descripción', accessorKey: 'descripcion' },
    { header: 'Fecha Inicio', accessorKey: 'fecha_inicio' },
    { header: 'Fecha Fin', accessorKey: 'fecha_fin' },
    { 
        header: 'Estado', 
        accessorKey: 'estado',
        cell: ({ row }) => (
            <span className={`estado-badge ${row.original.estado === 'activo' ? 'activo' : 'inactivo'}`}>
                {row.original.estado}
            </span>
        )
    },
];

const ClienteDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [clienteData, setClienteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getClienteById(id);
                console.log('✅ Cliente detalle cargado:', data);
                setClienteData(data);
            } catch (err) {
                console.error('❌ Error al cargar cliente:', err);
                setError(err.message || 'Error al cargar el cliente');
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    if (loading) {
        return (
            <div className="cliente-detalle-container">
                <Loading message="Cargando información del cliente..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="cliente-detalle-container">
                <ErrorMessage 
                    message={`Error al cargar el cliente: ${error}`} 
                    onRetry={() => window.location.reload()} 
                />
            </div>
        );
    }

    if (!clienteData) {
        return null;
    }

    return (
        <div className="cliente-detalle-container">
            <div className="detalle-header">
                <h1>Detalle del Cliente</h1>
                <Button 
                    variant="secondary" 
                    onClick={() => navigate('/clientes')}
                >
                    ← Volver a Clientes
                </Button>
            </div>

            <Card title="Información del Cliente">
                <div className="cliente-info-grid">
                    <div className="info-item">
                        <span className="info-label">Nombre:</span>
                        <span className="info-value">{clienteData.nombre}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">CUIT:</span>
                        <span className="info-value">{clienteData.cuit}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Teléfono:</span>
                        <span className="info-value">{clienteData.telefono}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{clienteData.email}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Dirección:</span>
                        <span className="info-value">{clienteData.direccion}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Estado:</span>
                        <span className={`estado-badge ${clienteData.estado === 'activo' ? 'activo' : 'inactivo'}`}>
                            {clienteData.estado}
                        </span>
                    </div>
                </div>
            </Card>

            <Card title={`Proyectos (${clienteData.proyectos?.length || 0})`}>
                {clienteData.proyectos && clienteData.proyectos.length > 0 ? (
                    <UnifiedTable
                        data={clienteData.proyectos}
                        columns={projectColumns}
                        tableTitle=""
                    />
                ) : (
                    <div className="empty-state">
                        <p>📁 Este cliente no tiene proyectos asociados</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ClienteDetalle;
