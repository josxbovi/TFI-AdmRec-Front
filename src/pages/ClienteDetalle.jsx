import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClienteById, getAllContratos, getAllFacturas, updateCliente, getAllAlertas, deleteAlerta } from '../services/api';
import Card from '../components/Card';
import { UnifiedTable } from '../components/UnifiedTable';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import './ClienteDetalle.css';

// Define columns for the projects table
const getProjectColumns = (navigate) => [
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
    {
        header: 'Acciones',
        accessorKey: 'id',
        cell: ({ row }) => (
            <Button
                variant="primary"
                onClick={() => navigate(`/proyectos/${row.original.id}`)}
            >
                Ver Detalle
            </Button>
        )
    }
];

// Define columns for the contracts table
const getContractColumns = (navigate) => [
    { 
        header: 'Fecha Inicio', 
        accessorKey: 'fechaInicio',
        cell: ({ row }) => {
            const fecha = row.original.fechaInicio;
            return fecha ? new Date(fecha).toLocaleDateString('es-AR') : 'N/A';
        }
    },
    { 
        header: 'Fecha Fin', 
        accessorKey: 'fechaFin',
        cell: ({ row }) => {
            const fecha = row.original.fechaFin;
            return fecha ? new Date(fecha).toLocaleDateString('es-AR') : 'N/A';
        }
    },
    { 
        header: 'Monto', 
        accessorKey: 'monto',
        cell: ({ row }) => {
            const monto = row.original.monto;
            return monto ? `$${Number(monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : 'N/A';
        }
    },
    { 
        header: 'Estado', 
        accessorKey: 'estado',
        cell: ({ row }) => {
            const estado = row.original.estado || 'desconocido';
            return (
                <span className={`estado-badge ${estado.toLowerCase()}`}>
                    {estado}
                </span>
            );
        }
    },
    {
        header: 'Acciones',
        accessorKey: 'id',
        cell: ({ row }) => (
            <Button
                variant="primary"
                onClick={() => navigate(`/contratos/${row.original.id}`)}
            >
                Ver Detalle
            </Button>
        )
    }
];

// Define columns for the invoices table
const getFacturaColumns = (navigate) => [
    { 
        header: 'Número', 
        accessorKey: 'numero',
        cell: ({ row }) => row.original.numero || 'N/A'
    },
    { 
        header: 'Fecha Emisión', 
        accessorKey: 'fecha_emision',
        cell: ({ row }) => {
            const fecha = row.original.fecha_emision;
            return fecha ? new Date(fecha).toLocaleDateString('es-AR') : 'N/A';
        }
    },
    { 
        header: 'Monto', 
        accessorKey: 'monto',
        cell: ({ row }) => {
            const monto = row.original.monto;
            return monto ? `$${Number(monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : 'N/A';
        }
    },
    { 
        header: 'Estado', 
        accessorKey: 'estado_pago',
        cell: ({ row }) => {
            const estado = row.original.estado_pago || 'desconocido';
            const badgeClass = 
                estado.toLowerCase() === 'pagada' ? 'activo' :
                estado.toLowerCase() === 'pendiente' ? 'en-progreso' :
                estado.toLowerCase() === 'vencida' ? 'inactivo' : '';
            return (
                <span className={`estado-badge ${badgeClass}`}>
                    {estado}
                </span>
            );
        }
    },
    { 
        header: 'Proyecto', 
        accessorKey: 'proyecto',
        cell: ({ row }) => row.original.proyecto?.nombre_proyecto || 'Sin proyecto'
    },
    {
        header: 'Acciones',
        accessorKey: 'id',
        cell: ({ row }) => (
            <Button
                variant="primary"
                onClick={() => navigate(`/facturas/${row.original.id}`)}
            >
                Ver Detalle
            </Button>
        )
    }
];

const ClienteDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [clienteData, setClienteData] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [alertas, setAlertas] = useState([]);
    const [loadingAlertas, setLoadingAlertas] = useState(false);
    const [resolvingAlertId, setResolvingAlertId] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Obtener datos del cliente
                const data = await getClienteById(id);
                console.log('✅ Cliente detalle cargado:', data);
                console.log('🔍 ¿Tiene contratos el cliente?', data.contratos);
                console.log('🔍 ¿Tiene proyectos el cliente?', data.proyectos);
                
                // Si el backend NO incluye los contratos, los obtenemos manualmente
                if (!data.contratos || data.contratos.length === 0) {
                    try {
                        const todosLosContratos = await getAllContratos();
                        console.log('✅ Todos los contratos:', todosLosContratos);
                        
                        // Extraer array de contratos (manejo diferentes formatos de respuesta)
                        let contratosArray = [];
                        if (Array.isArray(todosLosContratos)) {
                            contratosArray = todosLosContratos;
                        } else if (todosLosContratos && Array.isArray(todosLosContratos.records)) {
                            contratosArray = todosLosContratos.records;
                        } else if (todosLosContratos && Array.isArray(todosLosContratos.data)) {
                            contratosArray = todosLosContratos.data;
                        }
                        
                        // Filtrar contratos del cliente actual
                        const contratosDelCliente = contratosArray.filter(
                            contrato => contrato.clienteId === parseInt(id) || contrato.cliente?.id === parseInt(id)
                        );
                        
                        console.log('✅ Contratos del cliente filtrados:', contratosDelCliente);
                        
                        // Agregar contratos filtrados al cliente
                        data.contratos = contratosDelCliente;
                    } catch (contratoError) {
                        console.warn('⚠️ No se pudieron cargar los contratos:', contratoError);
                        data.contratos = [];
                    }
                }
                
                // Si el backend NO incluye las facturas, las obtenemos manualmente
                if (!data.facturas || data.facturas.length === 0) {
                    try {
                        const todasLasFacturas = await getAllFacturas();
                        console.log('✅ Todas las facturas:', todasLasFacturas);
                        
                        // Extraer array de facturas (manejo diferentes formatos de respuesta)
                        let facturasArray = [];
                        if (Array.isArray(todasLasFacturas)) {
                            facturasArray = todasLasFacturas;
                        } else if (todasLasFacturas && Array.isArray(todasLasFacturas.records)) {
                            facturasArray = todasLasFacturas.records;
                        } else if (todasLasFacturas && Array.isArray(todasLasFacturas.data)) {
                            facturasArray = todasLasFacturas.data;
                        }
                        
                        // Filtrar facturas del cliente actual
                        const facturasDelCliente = facturasArray.filter(
                            factura => factura.clienteId === parseInt(id) || factura.cliente?.id === parseInt(id)
                        );
                        
                        console.log('✅ Facturas del cliente filtradas:', facturasDelCliente);
                        
                        // Agregar facturas filtradas al cliente
                        data.facturas = facturasDelCliente;
                    } catch (facturaError) {
                        console.warn('⚠️ No se pudieron cargar las facturas:', facturaError);
                        data.facturas = [];
                    }
                }
                
                setClienteData(data);
                setOriginalData(JSON.parse(JSON.stringify(data)));
            } catch (err) {
                console.error('❌ Error al cargar cliente:', err);
                setError(err.message || 'Error al cargar el cliente');
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    // Cargar alertas del cliente
    useEffect(() => {
        const fetchAlertas = async () => {
            try {
                setLoadingAlertas(true);
                
                const response = await getAllAlertas();
                console.log('🔍 [ClienteDetalle] Respuesta completa de alertas:', response);
                
                // Manejar diferentes formatos de respuesta
                let alertasData = [];
                if (Array.isArray(response)) {
                    alertasData = response;
                } else if (response && Array.isArray(response.records)) {
                    alertasData = response.records;
                } else if (response && Array.isArray(response.data?.records)) {
                    alertasData = response.data.records;
                } else if (response && Array.isArray(response.data)) {
                    alertasData = response.data;
                }
                
                console.log('📋 [ClienteDetalle] Alertas parseadas:', alertasData);
                console.log('🔑 [ClienteDetalle] ID del cliente actual:', id, '(type:', typeof id, ')');
                
                // Log de cada alerta para debugging
                alertasData.forEach((alerta, index) => {
                    console.log(`📌 Alerta ${index + 1}:`, {
                        id: alerta.id,
                        clienteId: alerta.cliente?.id,
                        clienteNombre: alerta.cliente?.nombre,
                        mensaje: alerta.mensaje,
                        descripcion: alerta.descripcion
                    });
                });
                
                // Filtrar alertas del cliente actual
                const clienteIdNum = parseInt(id);
                
                const alertasDelCliente = alertasData.filter(alerta => {
                    // Las alertas tienen un objeto 'cliente' con 'id' dentro
                    const alertaClienteId = alerta.cliente?.id;
                    const match = alertaClienteId === clienteIdNum || 
                                  parseInt(alertaClienteId) === clienteIdNum;
                    
                    console.log(`🔍 Comparando: alerta.cliente.id=${alertaClienteId} con id=${id} -> match=${match}`);
                    return match;
                });
                
                console.log('✅ [ClienteDetalle] Alertas filtradas para el cliente:', alertasDelCliente);
                
                // Ordenar por fecha (más recientes primero)
                alertasDelCliente.sort((a, b) => new Date(b.fecha_alerta) - new Date(a.fecha_alerta));
                
                setAlertas(alertasDelCliente);
            } catch (err) {
                console.error('❌ Error al cargar alertas del cliente:', err);
                // No mostramos error para no molestar al usuario si las alertas fallan
            } finally {
                setLoadingAlertas(false);
            }
        };

        if (id) {
            fetchAlertas();
        }
    }, [id]);

    const handleResolverAlerta = async (alertaId) => {
        try {
            setResolvingAlertId(alertaId);
            console.log('🔔 Resolviendo alerta:', alertaId);
            
            await deleteAlerta(alertaId);
            
            // Actualizar la lista de alertas eliminando la resuelta
            setAlertas(prev => prev.filter(alerta => alerta.id !== alertaId));
            
            console.log('✅ Alerta resuelta exitosamente');
        } catch (err) {
            console.error('❌ Error al resolver alerta:', err);
            setError('No se pudo resolver la alerta. Intenta nuevamente.');
        } finally {
            setResolvingAlertId(null);
        }
    };

    const getPrioridadAlerta = (tipoAlerta) => {
        const tipo = tipoAlerta?.toLowerCase() || '';
        if (tipo.includes('urgente') || tipo.includes('vencido')) {
            return { clase: 'urgente', emoji: '🚨', label: 'URGENTE' };
        }
        if (tipo.includes('pendiente') || tipo.includes('proximo')) {
            return { clase: 'advertencia', emoji: '⚠️', label: 'ATENCIÓN' };
        }
        return { clase: 'info', emoji: 'ℹ️', label: 'INFO' };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validar descuento entre 0 y 100
        if (name === 'descuento') {
            const numValue = parseFloat(value);
            if (numValue < 0) {
                setClienteData(prev => ({ ...prev, [name]: 0 }));
                return;
            }
            if (numValue > 100) {
                setClienteData(prev => ({ ...prev, [name]: 100 }));
                return;
            }
        }
        
        setClienteData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setError(null);
        setSaving(true);

        try {
            const updateData = {
                nombre: clienteData.nombre,
                email: clienteData.email,
                telefono: clienteData.telefono,
                direccion: clienteData.direccion,
                cuit: clienteData.cuit,
                estado: clienteData.estado,
                descuento: parseFloat(clienteData.descuento || 0)
            };

            console.log('💾 Actualizando cliente:', updateData);
            
            await updateCliente(id, updateData);
            
            setSuccess(true);
            setIsEditing(false);
            setOriginalData(JSON.parse(JSON.stringify(clienteData)));
            
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('❌ Error al actualizar cliente:', err);
            setError(err.message || 'Error al actualizar el cliente');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setClienteData(JSON.parse(JSON.stringify(originalData)));
        setIsEditing(false);
        setError(null);
    };

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
                <div className="header-actions">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/clientes')}
                    >
                        ← Volver a Clientes
                    </Button>
                </div>
            </div>

            {success && (
                <div className="success-message">
                    ✅ Cliente actualizado exitosamente
                </div>
            )}

            {error && <ErrorMessage message={error} />}

            <Card title="Información del Cliente">
                {!isEditing ? (
                    <>
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
                            <div className="info-item descuento-item">
                                <span className="info-label">Descuento:</span>
                                <span className="info-value descuento-value">
                                    🎁 {clienteData.descuento || 0}%
                                </span>
                            </div>
                        </div>
                        <div className="card-actions">
                            <Button onClick={() => setIsEditing(true)}>
                                ✏️ Editar Cliente
                            </Button>
                        </div>
                    </>
                ) : (
                    <form className="cliente-edit-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre: *</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={clienteData.nombre}
                                    onChange={handleChange}
                                    disabled={saving}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cuit">CUIT: *</label>
                                <input
                                    type="text"
                                    id="cuit"
                                    name="cuit"
                                    value={clienteData.cuit}
                                    onChange={handleChange}
                                    disabled={saving}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono: *</label>
                                <input
                                    type="text"
                                    id="telefono"
                                    name="telefono"
                                    value={clienteData.telefono}
                                    onChange={handleChange}
                                    disabled={saving}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email: *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={clienteData.email}
                                    onChange={handleChange}
                                    disabled={saving}
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="direccion">Dirección: *</label>
                                <input
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    value={clienteData.direccion}
                                    onChange={handleChange}
                                    disabled={saving}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="estado">Estado: *</label>
                                <select
                                    id="estado"
                                    name="estado"
                                    value={clienteData.estado}
                                    onChange={handleChange}
                                    disabled={saving}
                                    required
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="descuento">Descuento (%) 🎁</label>
                                <input
                                    type="number"
                                    id="descuento"
                                    name="descuento"
                                    value={clienteData.descuento || 0}
                                    onChange={handleChange}
                                    disabled={saving}
                                    min="0"
                                    max="100"
                                    step="0.01"
                                />
                                <small className="form-hint">
                                    Descuento permanente (0-100%)
                                </small>
                            </div>
                        </div>
                        <div className="form-actions">
                            <Button 
                                type="button"
                                variant="secondary" 
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Guardando...' : '💾 Guardar'}
                            </Button>
                        </div>
                    </form>
                )}
            </Card>

            {/* Sección de Alertas del Cliente */}
            <Card title={`🔔 Alertas del Cliente (${alertas.length})`}>
                {loadingAlertas ? (
                    <div className="alertas-loading">
                        <Loading message="Cargando alertas..." />
                    </div>
                ) : alertas.length === 0 ? (
                    <div className="alertas-empty">
                        <p>✅ No hay alertas para este cliente</p>
                        <small>Todo está en orden</small>
                    </div>
                ) : (
                    <div className="cliente-alertas-list">
                        {alertas.map((alerta) => {
                            const prioridad = getPrioridadAlerta(alerta.tipo_alerta);
                            
                            return (
                                <div 
                                    key={alerta.id} 
                                    className={`cliente-alerta-item ${prioridad.clase}`}
                                >
                                    <div className="alerta-header">
                                        <div className="alerta-priority">
                                            <span className="priority-emoji">{prioridad.emoji}</span>
                                            <span className="priority-label">{prioridad.label}</span>
                                        </div>
                                        <span className="alerta-date">
                                            {new Date(alerta.fecha_alerta).toLocaleDateString('es-AR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    
                                    <div className="alerta-body">
                                        <h4 className="alerta-mensaje">{alerta.mensaje}</h4>
                                        <p className="alerta-descripcion">{alerta.descripcion}</p>
                                    </div>
                                    
                                    <div className="alerta-footer">
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => handleResolverAlerta(alerta.id)}
                                            disabled={resolvingAlertId === alerta.id}
                                        >
                                            {resolvingAlertId === alerta.id ? 'Resolviendo...' : '✓ Marcar como resuelta'}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            <Card title={`Proyectos (${clienteData.proyectos?.length || 0})`}>
                {clienteData.proyectos && clienteData.proyectos.length > 0 ? (
                    <UnifiedTable
                        data={clienteData.proyectos}
                        columns={getProjectColumns(navigate)}
                        tableTitle=""
                    />
                ) : (
                    <div className="empty-state">
                        <p>📁 Este cliente no tiene proyectos asociados</p>
                    </div>
                )}
            </Card>

            <Card title={`Contratos (${clienteData.contratos?.length || 0})`}>
                {clienteData.contratos && clienteData.contratos.length > 0 ? (
                    <UnifiedTable
                        data={clienteData.contratos}
                        columns={getContractColumns(navigate)}
                        tableTitle=""
                    />
                ) : (
                    <div className="empty-state">
                        <p>📄 Este cliente no tiene contratos asociados</p>
                    </div>
                )}
            </Card>

            <Card title={`Facturas (${clienteData.facturas?.length || 0})`}>
                {clienteData.facturas && clienteData.facturas.length > 0 ? (
                    <UnifiedTable
                        data={clienteData.facturas}
                        columns={getFacturaColumns(navigate)}
                        tableTitle=""
                    />
                ) : (
                    <div className="empty-state">
                        <p>📄 Este cliente no tiene facturas asociadas</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ClienteDetalle;
