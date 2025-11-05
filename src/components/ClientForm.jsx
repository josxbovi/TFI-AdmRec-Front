import { useState } from 'react';
import Button from './Button';
import './ClientForm.css';

const ClientForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    cuit: '',
    estado: 'activo',
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
          <label htmlFor="nombre">
            Razón Social / Nombre <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Empresa SA"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cuit">
            CUIT <span className="required">*</span>
          </label>
          <input
            type="text"
            id="cuit"
            name="cuit"
            value={formData.cuit}
            onChange={handleChange}
            placeholder="Ej: 20-12345678-9"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">
            Teléfono <span className="required">*</span>
          </label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ej: 3811234567"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ej: contacto@empresa.com"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="direccion">
            Dirección <span className="required">*</span>
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ej: Calle Falsa 123, Ciudad"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">
            Estado <span className="required">*</span>
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            disabled={isLoading}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
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
