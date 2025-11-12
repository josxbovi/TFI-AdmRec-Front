import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  getAllClientes,
  getAllFacturas,
  getAllContratos,
} from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ReportesPage.css";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ReportesPage = () => {
  // Estados para datos
  const [clientes, setClientes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [contratos, setContratos] = useState([]);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("facturacion"); // 'facturacion', 'clientes', 'contratos'
  const [exportingPDF, setExportingPDF] = useState(false);

  // Estados de filtros
  const [filtroFecha, setFiltroFecha] = useState("mes-actual");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Referencias para exportar PDF
  const reporteRef = useRef();

  // Cargar todos los datos al montar
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [clientesRes, facturasRes, contratosRes] = await Promise.all([
        getAllClientes(),
        getAllFacturas(),
        getAllContratos(),
      ]);

      // Procesar clientes
      let clientesArray = [];
      if (Array.isArray(clientesRes)) {
        clientesArray = clientesRes;
      } else if (clientesRes?.records) {
        clientesArray = clientesRes.records;
      } else if (clientesRes?.data) {
        clientesArray = clientesRes.data;
      }

      // Procesar facturas
      let facturasArray = [];
      if (Array.isArray(facturasRes)) {
        facturasArray = facturasRes;
      } else if (facturasRes?.records) {
        facturasArray = facturasRes.records;
      } else if (facturasRes?.data) {
        facturasArray = facturasRes.data;
      }

      // Procesar contratos
      let contratosArray = [];
      if (Array.isArray(contratosRes)) {
        contratosArray = contratosRes;
      } else if (contratosRes?.records) {
        contratosArray = contratosRes.records;
      } else if (contratosRes?.data) {
        contratosArray = contratosRes.data;
      }

      setClientes(clientesArray);
      setFacturas(facturasArray);
      setContratos(contratosArray);

      console.log("✅ Datos cargados:", {
        clientes: clientesArray.length,
        facturas: facturasArray.length,
        contratos: contratosArray.length,
      });
    } catch (err) {
      console.error("❌ Error al cargar datos:", err);
      setError(err.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Calcular rango de fechas según filtro
  const getRangoFechas = () => {
    const hoy = new Date();
    let inicio, fin;

    switch (filtroFecha) {
      case "mes-actual":
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        break;
      case "trimestre":
        const mesActual = hoy.getMonth();
        const trimestreInicio = Math.floor(mesActual / 3) * 3;
        inicio = new Date(hoy.getFullYear(), trimestreInicio, 1);
        fin = new Date(hoy.getFullYear(), trimestreInicio + 3, 0);
        break;
      case "año":
        inicio = new Date(hoy.getFullYear(), 0, 1);
        fin = new Date(hoy.getFullYear(), 11, 31);
        break;
      case "personalizado":
        inicio = fechaInicio ? new Date(fechaInicio) : null;
        fin = fechaFin ? new Date(fechaFin) : null;
        break;
      default:
        return { inicio: null, fin: null };
    }

    return { inicio, fin };
  };

  // Filtrar facturas por fecha
  const getFacturasFiltradas = () => {
    const { inicio, fin } = getRangoFechas();
    if (!inicio || !fin) return facturas;

    return facturas.filter((factura) => {
      const fecha = new Date(factura.fecha_emision);
      return fecha >= inicio && fecha <= fin;
    });
  };

  // Filtrar contratos por fecha
  const getContratosFiltrados = () => {
    const { inicio, fin } = getRangoFechas();
    if (!inicio || !fin) return contratos;

    return contratos.filter((contrato) => {
      const fechaInicio = new Date(contrato.fechaInicio);
      return fechaInicio >= inicio && fechaInicio <= fin;
    });
  };

  // ========== DATOS PARA GRÁFICOS - FACTURACIÓN ==========
  const getFacturacionData = () => {
    const facturasFiltradas = getFacturasFiltradas();

    // Agrupar por estado
    const porEstado = {
      Pagada: 0,
      Pendiente: 0,
      Vencida: 0,
      Anulada: 0,
    };

    facturasFiltradas.forEach((factura) => {
      const estado = factura.estado_pago || "Pendiente";
      if (porEstado.hasOwnProperty(estado)) {
        porEstado[estado] += parseFloat(factura.monto || 0);
      }
    });

    return {
      labels: Object.keys(porEstado),
      datasets: [
        {
          label: "Monto ($)",
          data: Object.values(porEstado),
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)", // Pagada - verde
            "rgba(255, 206, 86, 0.6)", // Pendiente - amarillo
            "rgba(255, 99, 132, 0.6)", // Vencida - rojo
            "rgba(201, 203, 207, 0.6)", // Anulada - gris
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(201, 203, 207, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getFacturacionStats = () => {
    const facturasFiltradas = getFacturasFiltradas();

    const total = facturasFiltradas.reduce(
      (sum, f) => sum + parseFloat(f.monto || 0),
      0
    );
    const pagadas = facturasFiltradas
      .filter((f) => f.estado_pago === "Pagada")
      .reduce((sum, f) => sum + parseFloat(f.monto || 0), 0);
    const pendientes = facturasFiltradas
      .filter((f) => f.estado_pago === "Pendiente")
      .reduce((sum, f) => sum + parseFloat(f.monto || 0), 0);
    const vencidas = facturasFiltradas
      .filter((f) => f.estado_pago === "Vencida")
      .reduce((sum, f) => sum + parseFloat(f.monto || 0), 0);

    return {
      total,
      pagadas,
      pendientes,
      vencidas,
      cantidad: facturasFiltradas.length,
    };
  };

  // ========== DATOS PARA GRÁFICOS - CLIENTES ==========
  const getClientesData = () => {
    const activos = clientes.filter((c) => c.estado === "activo").length;
    const inactivos = clientes.filter((c) => c.estado === "inactivo").length;

    return {
      labels: ["Activos", "Inactivos"],
      datasets: [
        {
          label: "Cantidad de Clientes",
          data: [activos, inactivos],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    };
  };

  const getTopClientes = () => {
    const facturasFiltradas = getFacturasFiltradas();

    // Agrupar facturación por cliente
    const facturacionPorCliente = {};

    facturasFiltradas.forEach((factura) => {
      const clienteId = factura.cliente?.id || factura.clienteId;
      const clienteNombre = factura.cliente?.nombre || `Cliente ${clienteId}`;

      if (!facturacionPorCliente[clienteId]) {
        facturacionPorCliente[clienteId] = {
          nombre: clienteNombre,
          total: 0,
        };
      }

      facturacionPorCliente[clienteId].total += parseFloat(factura.monto || 0);
    });

    // Convertir a array y ordenar
    const topClientes = Object.values(facturacionPorCliente)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      labels: topClientes.map((c) => c.nombre),
      datasets: [
        {
          label: "Facturación ($)",
          data: topClientes.map((c) => c.total),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const getClientesStats = () => {
    const activos = clientes.filter((c) => c.estado === "activo").length;
    const inactivos = clientes.filter((c) => c.estado === "inactivo").length;
    const total = clientes.length;

    return { total, activos, inactivos };
  };

  // ========== DATOS PARA GRÁFICOS - CONTRATOS ==========
  const getContratosData = () => {
    const contratosFiltrados = getContratosFiltrados();

    const porEstado = {
      activo: 0,
      vencido: 0,
      pendiente: 0,
    };

    contratosFiltrados.forEach((contrato) => {
      const estado = contrato.estado?.toLowerCase() || "pendiente";
      if (porEstado.hasOwnProperty(estado)) {
        porEstado[estado]++;
      }
    });

    return {
      labels: ["Activo", "Vencido", "Pendiente"],
      datasets: [
        {
          label: "Cantidad de Contratos",
          data: [porEstado.activo, porEstado.vencido, porEstado.pendiente],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getContratosStats = () => {
    const contratosFiltrados = getContratosFiltrados();

    const total = contratosFiltrados.length;
    const activos = contratosFiltrados.filter(
      (c) => c.estado === "activo"
    ).length;
    const vencidos = contratosFiltrados.filter(
      (c) => c.estado === "vencido"
    ).length;
    const pendientes = contratosFiltrados.filter(
      (c) => c.estado === "pendiente"
    ).length;

    const montoTotal = contratosFiltrados.reduce(
      (sum, c) => sum + parseFloat(c.monto || 0),
      0
    );

    return { total, activos, vencidos, pendientes, montoTotal };
  };

  // ========== EXPORTAR A PDF ==========
  const handleExportPDF = async () => {
    try {
      setExportingPDF(true);

      const element = reporteRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const tabName =
        activeTab === "facturacion"
          ? "Facturacion"
          : activeTab === "clientes"
          ? "Clientes"
          : "Contratos";
      pdf.save(
        `Reporte-${tabName}-${new Date().toISOString().split("T")[0]}.pdf`
      );

      console.log("✅ PDF exportado exitosamente");
    } catch (err) {
      console.error("❌ Error al exportar PDF:", err);
      alert("Error al exportar PDF. Por favor, intenta nuevamente.");
    } finally {
      setExportingPDF(false);
    }
  };

  // ========== RENDER ==========
  if (loading) {
    return (
      <div className="reportes-container">
        <Loading message="Cargando datos para reportes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="reportes-container">
        <ErrorMessage message={error} onRetry={fetchAllData} />
      </div>
    );
  }

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h1>📊 Reportes Ejecutivos</h1>
        <Button onClick={handleExportPDF} disabled={exportingPDF}>
          {exportingPDF ? "Exportando..." : "📥 Exportar a PDF"}
        </Button>
      </div>

      {/* Filtros */}
      <Card title="Filtros">
        <div className="filtros-container">
          <div className="filtro-grupo">
            <label htmlFor="filtro-fecha">Período:</label>
            <select
              id="filtro-fecha"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="filtro-select"
            >
              <option value="mes-actual">Mes Actual</option>
              <option value="trimestre">Último Trimestre</option>
              <option value="año">Año Actual</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>

          {filtroFecha === "personalizado" && (
            <>
              <div className="filtro-grupo">
                <label htmlFor="fecha-inicio">Desde:</label>
                <input
                  type="date"
                  id="fecha-inicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="filtro-input"
                />
              </div>
              <div className="filtro-grupo">
                <label htmlFor="fecha-fin">Hasta:</label>
                <input
                  type="date"
                  id="fecha-fin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="filtro-input"
                />
              </div>
            </>
          )}

          <Button onClick={fetchAllData} variant="secondary">
            🔄 Actualizar
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="reportes-tabs">
        <button
          className={`tab-button ${
            activeTab === "facturacion" ? "active" : ""
          }`}
          onClick={() => setActiveTab("facturacion")}
        >
          📊 Facturación
        </button>
        <button
          className={`tab-button ${activeTab === "clientes" ? "active" : ""}`}
          onClick={() => setActiveTab("clientes")}
        >
          👥 Clientes
        </button>
        <button
          className={`tab-button ${activeTab === "contratos" ? "active" : ""}`}
          onClick={() => setActiveTab("contratos")}
        >
          📋 Contratos
        </button>
      </div>

      {/* Contenido del reporte */}
      <div ref={reporteRef} className="reporte-contenido">
        {activeTab === "facturacion" && (
          <ReporteFacturacion
            data={getFacturacionData()}
            stats={getFacturacionStats()}
          />
        )}

        {activeTab === "clientes" && (
          <ReporteClientes
            data={getClientesData()}
            topClientes={getTopClientes()}
            stats={getClientesStats()}
          />
        )}

        {activeTab === "contratos" && (
          <ReporteContratos
            data={getContratosData()}
            stats={getContratosStats()}
          />
        )}
      </div>
    </div>
  );
};

// ========== COMPONENTES DE REPORTES ==========

const ReporteFacturacion = ({ data, stats }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Facturación por Estado de Pago" },
    },
  };

  return (
    <div className="reporte-section">
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Facturado</h3>
            <p className="stat-number">
              $
              {stats.total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <small>{stats.cantidad} facturas</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon success">✅</div>
          <div className="stat-content">
            <h3>Pagadas</h3>
            <p className="stat-number">
              $
              {stats.pagadas.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div className="stat-content">
            <h3>Pendientes</h3>
            <p className="stat-number">
              $
              {stats.pendientes.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon danger">⚠️</div>
          <div className="stat-content">
            <h3>Vencidas</h3>
            <p className="stat-number">
              $
              {stats.vencidas.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </Card>
      </div>

      <Card title="Gráfico de Facturación">
        <div className="chart-container">
          <Bar data={data} options={chartOptions} />
        </div>
      </Card>
    </div>
  );
};

const ReporteClientes = ({ data, topClientes, stats }) => {
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Distribución de Clientes por Estado" },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Top 5 Clientes por Facturación" },
    },
    indexAxis: "y",
  };

  return (
    <div className="reporte-section">
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Clientes</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </Card>

        <Card className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Activos</h3>
            <p className="stat-number">{stats.activos}</p>
          </div>
        </Card>

        <Card className="stat-card danger">
          <div className="stat-icon">⭕</div>
          <div className="stat-content">
            <h3>Inactivos</h3>
            <p className="stat-number">{stats.inactivos}</p>
          </div>
        </Card>
      </div>

      <div className="charts-row">
        <Card title="Estado de Clientes" className="chart-card">
          <div className="chart-container-small">
            <Pie data={data} options={pieOptions} />
          </div>
        </Card>

        <Card title="Top Clientes" className="chart-card">
          <div className="chart-container-small">
            <Bar data={topClientes} options={barOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
};

const ReporteContratos = ({ data, stats }) => {
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Contratos por Estado" },
    },
  };

  return (
    <div className="reporte-section">
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Total Contratos</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </Card>

        <Card className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Activos</h3>
            <p className="stat-number">{stats.activos}</p>
          </div>
        </Card>

        <Card className="stat-card danger">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Vencidos</h3>
            <p className="stat-number">{stats.vencidos}</p>
          </div>
        </Card>

        <Card className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pendientes</h3>
            <p className="stat-number">{stats.pendientes}</p>
          </div>
        </Card>
      </div>

      <Card title="Valor Total de Contratos">
        <div className="monto-total">
          <h2>
            $
            {stats.montoTotal.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </h2>
        </div>
      </Card>

      <Card title="Gráfico de Distribución">
        <div className="chart-container">
          <Pie data={data} options={pieOptions} />
        </div>
      </Card>
    </div>
  );
};

export default ReportesPage;
