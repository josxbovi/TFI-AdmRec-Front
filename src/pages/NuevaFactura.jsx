import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFactura, getClienteByCuit, createAlerta } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './NuevaFactura.css';

const NuevaFactura = () => {
  const navigate = useNavigate();
  
  // Estados para el flujo de búsqueda
  const [step, setStep] = useState(1); // 1: buscar cliente, 2: seleccionar proyecto, 3: llenar formulario
  const [clienteCuit, setClienteCuit] = useState('');
  const [clienteData, setClienteData] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    fecha_emision: new Date().toISOString().split('T')[0],
    monto: '',
    estado_pago: 'Pendiente',
    descripcion: '',
    clienteId: null,
    proyectoId: null
  });
  
  // Estados para descuento
  const [montoOriginal, setMontoOriginal] = useState(0);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [montoFinal, setMontoFinal] = useState(0);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Buscar cliente por CUIT
  const handleSearchCliente = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await getClienteByCuit(clienteCuit);
      console.log('✅ Cliente encontrado:', response);
      
      let cliente = null;
      
      if (Array.isArray(response)) {
        cliente = response[0];
      } else if (response && response.data) {
        cliente = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (response && response.records) {
        cliente = Array.isArray(response.records) ? response.records[0] : response.records;
      } else {
        cliente = response;
      }

      if (!cliente) {
        setError('No se encontró ningún cliente con ese CUIT');
        return;
      }

      // Verificar que el cliente esté activo
      if (cliente.estado?.toLowerCase() !== 'activo') {
        setError('⚠️ Este cliente está INACTIVO. No se pueden crear facturas para clientes dados de baja.');
        setClienteData(null);
        return;
      }

      setClienteData(cliente);
      setFormData(prev => ({ ...prev, clienteId: cliente.id }));
      
      // Cargar proyectos del cliente (vienen en la respuesta del GET cliente por CUIT)
      if (cliente.proyectos && Array.isArray(cliente.proyectos)) {
        setProyectos(cliente.proyectos);
      } else {
        setProyectos([]);
      }
      
      setStep(2); // Avanzar al paso de selección de proyecto
    } catch (err) {
      console.error('❌ Error al buscar cliente:', err);
      setError(err.message || 'Error al buscar el cliente');
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar proyecto
  const handleSelectProyecto = (proyecto) => {
    setSelectedProyecto(proyecto);
    setFormData(prev => ({ 
      ...prev, 
      proyectoId: proyecto ? proyecto.id : null 
    }));
    setStep(3); // Avanzar al formulario
  };

  // Calcular monto con descuento
  const calcularMontoConDescuento = (monto) => {
    if (!clienteData || !monto || parseFloat(monto) <= 0) {
      setMontoOriginal(0);
      setDescuentoAplicado(0);
      setMontoFinal(0);
      return;
    }

    const montoNum = parseFloat(monto);
    const descuentoPorcentaje = parseFloat(clienteData.descuento || 0);
    const descuentoMonto = (montoNum * descuentoPorcentaje) / 100;
    const montoConDescuento = montoNum - descuentoMonto;

    setMontoOriginal(montoNum);
    setDescuentoAplicado(descuentoMonto);
    setMontoFinal(montoConDescuento);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambió el monto, recalcular descuento
    if (name === 'monto') {
      calcularMontoConDescuento(value);
    }
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.fecha_emision) {
      setError('La fecha de emisión es obligatoria');
      return false;
    }
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      return false;
    }
    if (!formData.estado_pago) {
      setError('El estado de pago es obligatorio');
      return false;
    }
    if (!formData.proyectoId) {
      setError('Debe seleccionar un proyecto asociado');
      return false;
    }
    return true;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar - usar monto final con descuento aplicado
      const facturaData = {
        fecha_emision: formData.fecha_emision,
        monto: montoFinal > 0 ? montoFinal : parseFloat(formData.monto), // Enviar monto con descuento
        estado_pago: formData.estado_pago,
        descripcion: formData.descripcion || '',
        clienteId: formData.clienteId,
        proyectoId: formData.proyectoId // Obligatorio
      };

      console.log('📄 Enviando factura:', facturaData);
      console.log('💰 Descuento aplicado:', {
        montoOriginal,
        descuentoPorcentaje: clienteData?.descuento || 0,
        descuentoAplicado,
        montoFinal
      });
      
      const facturaCreada = await createFactura(facturaData);
      console.log('✅ Factura creada:', facturaCreada);
      
      // Generar alerta automática si el estado es "pendiente" o "vencida"
      try {
        if (formData.estado_pago.toLowerCase() === 'pendiente' || formData.estado_pago.toLowerCase() === 'vencida') {
          const tipoAlerta = formData.estado_pago.toLowerCase() === 'vencida' ? 'pago_vencido' : 'pago_pendiente'
          const emoji = formData.estado_pago.toLowerCase() === 'vencida' ? '🚨' : '💰'
          const mensajeAlerta = `${emoji} Factura #${facturaCreada.id || ''} - ${formData.estado_pago} - ${clienteData.nombre}`
          
          const alertaData = {
            mensaje: mensajeAlerta,
            tipo_alerta: tipoAlerta,
            fecha_alerta: new Date().toISOString(),
            descripcion: `Factura #${facturaCreada.id || ''} por $${montoFinal > 0 ? montoFinal.toLocaleString('es-AR') : parseFloat(formData.monto).toLocaleString('es-AR')} - Cliente: ${clienteData.nombre} (CUIT: ${clienteData.cuit}) - Proyecto: ${selectedProyecto?.nombre_proyecto} - Estado: ${formData.estado_pago}`,
            clienteId: formData.clienteId
          }

          console.log('🔔 Generando alerta automática:', alertaData)
          await createAlerta(alertaData)
          console.log('✅ Alerta creada exitosamente')
        }
      } catch (alertaError) {
        console.warn('⚠️ No se pudo crear la alerta automática:', alertaError)
        // No bloqueamos el proceso si falla la creación de la alerta
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/clientes/${formData.clienteId}`);
      }, 1500);
    } catch (err) {
      console.error('❌ Error al crear factura:', err);
      setError(err.message || 'Error al crear la factura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nueva-factura-container">
      <div className="nueva-factura-header">
        <h1>📄 Nueva Factura</h1>
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </div>

      {success && (
        <div className="success-message">
          ✅ Factura creada exitosamente
        </div>
      )}

      {/* PASO 1: Buscar Cliente */}
      {step === 1 && (
        <Card title="Paso 1: Buscar Cliente por CUIT">
          <form onSubmit={handleSearchCliente} className="search-form">
            <div className="form-group">
              <label htmlFor="clienteCuit">CUIT del Cliente:</label>
              <input
                type="text"
                id="clienteCuit"
                className="form-input"
                value={clienteCuit}
                onChange={(e) => setClienteCuit(e.target.value)}
                placeholder="Ej: 20-12345678-9"
                required
              />
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="form-actions">
              <Button type="submit" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar Cliente'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* PASO 2: Seleccionar Proyecto */}
      {step === 2 && clienteData && (
        <>
          <Card title="Cliente Encontrado">
            <div className="cliente-info">
              <p><strong>Nombre:</strong> {clienteData.nombre}</p>
              <p><strong>CUIT:</strong> {clienteData.cuit}</p>
              <p><strong>Email:</strong> {clienteData.email}</p>
              <p><strong>Teléfono:</strong> {clienteData.telefono}</p>
            </div>
          </Card>

          <Card title="Paso 2: Seleccionar Proyecto *">
            {proyectos.length > 0 ? (
              <div className="proyectos-list">
                {proyectos.map((proyecto) => (
                  <div 
                    key={proyecto.id} 
                    className="proyecto-option"
                    onClick={() => handleSelectProyecto(proyecto)}
                  >
                    <div className="proyecto-radio">
                      <input 
                        type="radio" 
                        name="proyecto" 
                        id={`proyecto-${proyecto.id}`}
                        checked={selectedProyecto?.id === proyecto.id}
                        readOnly
                      />
                    </div>
                    <label htmlFor={`proyecto-${proyecto.id}`} className="proyecto-label">
                      <strong>{proyecto.nombre_proyecto}</strong>
                      <span className="proyecto-description">
                        Estado: {proyecto.estado} | 
                        Inicio: {new Date(proyecto.fecha_inicio).toLocaleDateString()}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-proyectos">
                <p>⚠️ Este cliente no tiene proyectos asociados.</p>
                <p>No es posible crear una factura sin un proyecto asociado.</p>
                <p className="hint">Por favor, crea primero un proyecto para este cliente.</p>
              </div>
            )}

            <div className="form-actions">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Volver a búsqueda
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* PASO 3: Formulario de Factura */}
      {step === 3 && (
        <>
          <Card title="Cliente y Proyecto Seleccionados">
            <div className="selection-info">
              <p><strong>Cliente:</strong> {clienteData.nombre} (CUIT: {clienteData.cuit})</p>
              {clienteData.descuento > 0 && (
                <p className="descuento-info">
                  🎁 <strong>Descuento del cliente:</strong> {clienteData.descuento}%
                </p>
              )}
              <p><strong>Proyecto:</strong> {selectedProyecto?.nombre_proyecto}</p>
            </div>
          </Card>

          <Card title="Paso 3: Datos de la Factura">
            <form onSubmit={handleSubmit} className="factura-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fecha_emision">Fecha de Emisión: *</label>
                  <input
                    type="date"
                    id="fecha_emision"
                    name="fecha_emision"
                    className="form-input"
                    value={formData.fecha_emision}
                    onChange={handleChange}
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
                    value={formData.monto}
                    onChange={handleChange}
                    placeholder="Ej: 100000"
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
                    value={formData.estado_pago}
                    onChange={handleChange}
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
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción de la factura..."
                    rows="4"
                  />
                </div>
              </div>

              {/* Mostrar cálculo de descuento si hay descuento */}
              {clienteData.descuento > 0 && montoOriginal > 0 && (
                <div className="descuento-calculo">
                  <h4>💰 Cálculo del Descuento</h4>
                  <div className="calculo-detalle">
                    <div className="calculo-row">
                      <span>Monto original:</span>
                      <span className="monto-original">
                        ${montoOriginal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="calculo-row descuento-row">
                      <span>Descuento ({clienteData.descuento}%):</span>
                      <span className="monto-descuento">
                        -${descuentoAplicado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="calculo-separator"></div>
                    <div className="calculo-row total-row">
                      <span><strong>Monto final:</strong></span>
                      <span className="monto-final">
                        <strong>${montoFinal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </span>
                    </div>
                  </div>
                  <p className="descuento-nota">
                    ℹ️ El descuento se aplicará automáticamente a la factura
                  </p>
                </div>
              )}

              {error && <ErrorMessage message={error} />}

              <div className="form-actions">
                <Button variant="secondary" onClick={() => setStep(2)} disabled={loading}>
                  Volver
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Factura'}
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}

      {loading && <Loading />}
    </div>
  );
};

export default NuevaFactura;

