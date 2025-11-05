import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientPage from './pages/ClientPage'
import ClienteDetalle from './pages/ClienteDetalle'
import NuevoUsuario from './pages/NuevoUsuario'
import NuevoProyecto from './pages/NuevoProyecto'
import NuevoCliente from './pages/NuevoCliente'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/usuarios/nuevo" 
              element={
                <ProtectedRoute>
                  <NuevoUsuario />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/proyectos/nuevo" 
              element={
                <ProtectedRoute>
                  <NuevoProyecto />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/clientes/nuevo" 
              element={
                <ProtectedRoute>
                  <NuevoCliente />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas de módulos (protegidas) - placeholder por ahora */}
            <Route 
              path="/clientes" 
              element={
                <ProtectedRoute>
                  <ClientPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/clientes/:id" 
              element={
                <ProtectedRoute>
                  <ClienteDetalle />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/contratos" 
              element={
                <ProtectedRoute>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Módulo de Contratos</h1>
                    <p>En construcción...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/facturas" 
              element={
                <ProtectedRoute>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Módulo de Facturas</h1>
                    <p>En construcción...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reportes" 
              element={
                <ProtectedRoute>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Módulo de Reportes</h1>
                    <p>En construcción...</p>
                  </div>
                </ProtectedRoute>
              } 
            />

            {/* Ruta por defecto - redirigir a login si no existe */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App

