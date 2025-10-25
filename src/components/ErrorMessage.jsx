import './ErrorMessage.css'

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <h3>Algo salió mal</h3>
      <p>{message || 'Ha ocurrido un error inesperado'}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

