import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientPage from './pages/ClientPage'
import ClienteDetalle from './pages/ClienteDetalle'
import ProyectoDetalle from './pages/ProyectoDetalle'
import ContratosPage from './pages/ContratosPage'
import ContratoDetalle from './pages/ContratoDetalle'
import NuevoUsuario from './pages/NuevoUsuario'
import NuevoProyecto from './pages/NuevoProyecto'
import NuevoCliente from './pages/NuevoCliente'
import NuevoContrato from './pages/NuevoContrato'
import NuevaFactura from './pages/NuevaFactura'
import FacturaDetalle from './pages/FacturaDetalle'
import ReportesPage from './pages/ReportesPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Rutas públicas */}
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
            
            {/* Ruta solo para administradores */}
            <Route 
              path="/usuarios/nuevo" 
              element={
                <AdminRoute>
                  <NuevoUsuario />
                </AdminRoute>
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
              path="/proyectos/:id" 
              element={
                <ProtectedRoute>
                  <ProyectoDetalle />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/contratos" 
              element={
                <ProtectedRoute>
                  <ContratosPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/contratos/nuevo" 
              element={
                <ProtectedRoute>
                  <NuevoContrato />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/contratos/:id" 
              element={
                <ProtectedRoute>
                  <ContratoDetalle />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/facturas/nuevo" 
              element={
                <ProtectedRoute>
                  <NuevaFactura />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/facturas/:id" 
              element={
                <ProtectedRoute>
                  <FacturaDetalle />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reportes" 
              element={
                <AdminRoute>
                  <ReportesPage />
                </AdminRoute>
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

