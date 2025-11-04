import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getClientById } from '../services/api'; // Assuming this service function exists
import Card from '../components/Card';
import UnifiedTable from '../components/UnifiedTable';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './ClienteDetalle.css';

// Define columns for the projects table
const projectColumns = [
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Descripción', accessorKey: 'descripcion' },
    { header: 'Fecha de Inicio', accessorKey: 'fecha_inicio' },
    { header: 'Fecha de Finalización', accessorKey: 'fecha_finalizacion' },
];

const ClienteDetalle = () => {
    const { id } = useParams();
    const { data: clienteData, loading, error } = useFetch(() => getClientById(id));

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorMessage message={`Error al cargar el cliente: ${error.message}`} />;
    }

    if (!clienteData) {
        return null;
    }

    return (
        <div className="cliente-detalle-container">
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
                        <span className="info-value">{clienteData.estado}</span>
                    </div>
                </div>
            </Card>

            <Card title="Proyectos">
                <UnifiedTable
                    data={clienteData.proyectos || []}
                    columns={projectColumns}
                />
            </Card>
        </div>
    );
};

export default ClienteDetalle;
