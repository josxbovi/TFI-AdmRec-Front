import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientForm from '../components/ClientForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { createCliente } from '../services/api';
import './NuevoCliente.css';

const NuevoCliente = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (clientData) => {
    setLoading(true);
    setError(null);
    try {
      await createCliente(clientData);
      // Idealmente, mostrar un mensaje de éxito antes de redirigir
      alert('Cliente creado con éxito!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nuevo-cliente-page">
      <div className="nuevo-cliente-header">
        <h1>Registrar Nuevo Cliente</h1>
        <p>Complete el formulario para añadir un nuevo cliente al sistema.</p>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      <div className="form-container">
        {loading ? (
          <Loading message="Guardando cliente..." />
        ) : (
          <ClientForm onSubmit={handleSubmit} isLoading={loading} />
        )}
      </div>
    </div>
  );
};

export default NuevoCliente;
