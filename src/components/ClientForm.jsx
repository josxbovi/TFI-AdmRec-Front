import { useState } from 'react';
import Button from './Button';
import './ClientForm.css';

const ClientForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    razonSocial: '',
    cuit: '',
    nombreContacto: '',
    apellidoContacto: '',
    email: '',
    telefono: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="razonSocial">Razón Social</label>
          <input
            type="text"
            id="razonSocial"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cuit">CUIT</label>
          <input
            type="text"
            id="cuit"
            name="cuit"
            value={formData.cuit}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nombreContacto">Nombre del Contacto</label>
          <input
            type="text"
            id="nombreContacto"
            name="nombreContacto"
            value={formData.nombreContacto}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellidoContacto">Apellido del Contacto</label>
          <input
            type="text"
            id="apellidoContacto"
            name="apellidoContacto"
            value={formData.apellidoContacto}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="email">Email de Contacto</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Cliente'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
