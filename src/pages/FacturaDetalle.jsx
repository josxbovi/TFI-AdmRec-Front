import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFacturaById, updateFactura, deleteFactura, getFacturaPDF } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './FacturaDetalle.css';

const FacturaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [facturaData, setFacturaData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getFacturaById(id);
        console.log('✅ Factura cargada:', response);

        // Manejar diferentes formatos de respuesta
        let factura = null;
        if (response && response.records) {
          factura = Array.isArray(response.records) ? response.records[0] : response.records;
        } else if (response && response.data) {
          factura = response.data;
        } else {
          factura = response;
        }

        // Formatear fecha para input type="date"
        if (factura.fecha_emision) {
          factura.fecha_emision = new Date(factura.fecha_emision).toISOString().split('T')[0];
        }

        setFacturaData(factura);
        setOriginalData(JSON.parse(JSON.stringify(factura)));
      } catch (err) {
        console.error('❌ Error al cargar factura:', err);
        setError(err.message || 'Error al cargar la factura');
      } finally {
        setLoading(false);
      }
    };

    fetchFactura();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacturaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!facturaData.fecha_emision) {
      setError('La fecha de emisión es obligatoria');
      return false;
    }
    if (!facturaData.monto || parseFloat(facturaData.monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      return false;
    }
    if (!facturaData.estado_pago) {
      setError('El estado de pago es obligatorio');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const updatedData = {
        fecha_emision: facturaData.fecha_emision,
        monto: parseFloat(facturaData.monto),
        estado_pago: facturaData.estado_pago,
        descripcion: facturaData.descripcion || ''
      };

      console.log('💾 Guardando cambios:', updatedData);

      await updateFactura(id, updatedData);

      setSuccess(true);
      setIsEditing(false);
      setOriginalData(JSON.parse(JSON.stringify(facturaData)));

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('❌ Error al actualizar factura:', err);
      setError(err.message || 'Error al actualizar la factura');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFacturaData(JSON.parse(JSON.stringify(originalData)));
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta factura? Esta acción es irreversible.')) {
      return;
    }

    setLoading(true);

    try {
      await deleteFactura(id);
      alert('✅ Factura eliminada correctamente');
      
      // Redirigir al detalle del cliente
      if (facturaData.cliente?.id) {
        navigate(`/clientes/${facturaData.cliente.id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('❌ Error al eliminar factura:', err);
      setError(err.message || 'Error al eliminar la factura');
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📥 Descargando PDF de factura:', id);
      
      const blob = await getFacturaPDF(id);
      
      console.log('📦 Tipo de respuesta recibida:', typeof blob, blob);
      console.log('📦 ¿Es un Blob?', blob instanceof Blob);
      
      // Crear un Blob si no lo es (por si acaso)
      let pdfBlob = blob;
      if (!(blob instanceof Blob)) {
        console.log('⚠️ Convirtiendo respuesta a Blob...');
        pdfBlob = new Blob([blob], { type: 'application/pdf' });
      }
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Factura-${facturaData.numero || id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      setTimeout(() => {
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log('✅ PDF descargado exitosamente');
    } catch (err) {
      console.error('❌ Error al descargar PDF:', err);
      setError('Error al descargar el PDF. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pagada':
        return 'badge-success';
      case 'pendiente':
        return 'badge-warning';
      case 'vencida':
        return 'badge-danger';
      case 'anulada':
        return 'badge-secondary';
      default:
        return 'badge-default';
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !facturaData) {
    return (
      <div className="factura-detalle-container">
        <ErrorMessage message={error} />
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  if (!facturaData) {
    return (
      <div className="factura-detalle-container">
        <p>No se encontró la factura</p>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="factura-detalle-container">
      <div className="factura-detalle-header">
        <h1>📄 Detalle de Factura</h1>
        <div className="header-actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Volver
          </Button>
          <Button onClick={handleDownloadPDF} disabled={loading}>
            📥 Descargar PDF
          </Button>
        </div>
      </div>

      {success && (
        <div className="success-message">
          ✅ Factura actualizada exitosamente
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {/* Información General */}
      <Card title="Información General">
        <div className="info-grid">
          <div className="info-item">
            <label>Número de Factura:</label>
            <span className="info-value">{facturaData.numero || 'N/A'}</span>
          </div>

          <div className="info-item">
            <label>Estado:</label>
            <span className={`badge ${getEstadoBadgeClass(facturaData.estado_pago)}`}>
              {facturaData.estado_pago}
            </span>
          </div>

          <div className="info-item">
            <label>Cliente:</label>
            <span className="info-value">
              {facturaData.cliente ? (
                <span
                  className="cliente-link"
                  onClick={() => navigate(`/clientes/${facturaData.cliente.id}`)}
                >
                  {facturaData.cliente.nombre} (CUIT: {facturaData.cliente.cuit})
                </span>
              ) : (
                'N/A'
              )}
            </span>
          </div>

          <div className="info-item">
            <label>Proyecto:</label>
            <span className="info-value">
              {facturaData.proyecto ? (
                <span
                  className="proyecto-link"
                  onClick={() => navigate(`/proyectos/${facturaData.proyecto.id}`)}
                >
                  {facturaData.proyecto.nombre_proyecto}
                </span>
              ) : (
                'Sin proyecto asociado'
              )}
            </span>
          </div>
        </div>
      </Card>

      {/* Formulario Editable */}
      <Card title="Datos de la Factura">
        <form className="factura-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fecha_emision">Fecha de Emisión: *</label>
              <input
                type="date"
                id="fecha_emision"
                name="fecha_emision"
                className="form-input"
                value={facturaData.fecha_emision || ''}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="monto">Monto Total: *</label>
              <input
                type="number"
                id="monto"
                name="monto"
                className="form-input"
                value={facturaData.monto || ''}
                onChange={handleChange}
                disabled={!isEditing}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estado_pago">Estado de Pago: *</label>
              <select
                id="estado_pago"
                name="estado_pago"
                className="form-select"
                value={facturaData.estado_pago || ''}
                onChange={handleChange}
                disabled={!isEditing}
                required
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagada">Pagada</option>
                <option value="Vencida">Vencida</option>
                <option value="Anulada">Anulada</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="form-textarea"
                value={facturaData.descripcion || ''}
                onChange={handleChange}
                disabled={!isEditing}
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)}>
                  ✏️ Editar
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  🗑️ Borrar
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  💾 Guardar
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>

      {/* Información de Auditoría */}
      {(facturaData.createdAt || facturaData.updatedAt) && (
        <Card title="Información de Auditoría">
          <div className="audit-info">
            {facturaData.createdAt && (
              <p>
                <strong>Fecha de creación:</strong>{' '}
                {new Date(facturaData.createdAt).toLocaleString('es-AR')}
              </p>
            )}
            {facturaData.updatedAt && (
              <p>
                <strong>Última modificación:</strong>{' '}
                {new Date(facturaData.updatedAt).toLocaleString('es-AR')}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FacturaDetalle;

