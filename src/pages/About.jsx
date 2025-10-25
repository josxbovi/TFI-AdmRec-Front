import './About.css'

const About = () => {
  return (
    <div className="about">
      <h1>Acerca del Proyecto</h1>
      
      <div className="card">
        <h2>TFI - Administración de Recursos</h2>
        <p>
          Esta es una aplicación frontend desarrollada con React que consume servicios
          de un backend para la administración de recursos.
        </p>
      </div>

      <div className="card">
        <h2>Tecnologías Utilizadas</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <h3>React</h3>
            <p>Biblioteca para construir interfaces de usuario</p>
          </div>
          <div className="tech-item">
            <h3>Vite</h3>
            <p>Build tool moderno y rápido</p>
          </div>
          <div className="tech-item">
            <h3>React Router</h3>
            <p>Navegación entre páginas</p>
          </div>
          <div className="tech-item">
            <h3>Axios</h3>
            <p>Cliente HTTP para APIs REST</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

