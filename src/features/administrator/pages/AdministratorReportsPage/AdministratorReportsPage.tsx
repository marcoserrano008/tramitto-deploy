import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';
import styles from './AdministratorReportsPage.module.scss';
import 'primeicons/primeicons.css';

type ReportFilter = {
  dateRange: Date[] | null;
  documentType: string;
  status: string;
};

type ChartData = {
  labels: string[];
  datasets: any[];
};

type ReportSummary = {
  totalProcessed: number;
  approved: number;
  rejected: number;
  pending: number;
  avgProcessingTime: string;
};

type DetailedReport = {
  id: number;
  applicantName: string;
  documentType: string;
  status: string;
  submissionDate: string;
  reviewDate: string;
  processingTime: string;
  reviewer: string;
};

const AdministratorReportsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: null,
    documentType: 'Todos',
    status: 'Todos'
  });

  // graficos fake
  const [monthlyChart, setMonthlyChart] = useState<ChartData>({} as ChartData);
  const [statusChart, setStatusChart] = useState<ChartData>({} as ChartData);
  const [documentTypeChart, setDocumentTypeChart] = useState<ChartData>({} as ChartData);
  const [processingTimeChart, setProcessingTimeChart] = useState<ChartData>({} as ChartData);

  const [reportSummary, setReportSummary] = useState<ReportSummary>({} as ReportSummary);
  const [detailedReports, setDetailedReports] = useState<DetailedReport[]>([]);

  // filtros
  const documentTypes = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Diploma de Bachiller', value: 'Diploma de Bachiller' },
    { label: 'Diploma Académico', value: 'Diploma Académico' },
    { label: 'Título Provisión Nacional', value: 'Título Provisión Nacional' }
  ];

  const statusOptions = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Aprobado', value: 'Aprobado' },
    { label: 'Rechazado', value: 'Rechazado' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En Revisión', value: 'En Revisión' }
  ];

  useEffect(() => {
    loadReportsData();
  }, [filters]);

  const loadReportsData = () => {
    //  gráfico mensual
    const monthlyData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Aprobados',
          backgroundColor: '#52C41A',
          data: [45, 52, 38, 67, 71, 55]
        },
        {
          label: 'Rechazados',
          backgroundColor: '#FF4D4F',
          data: [8, 12, 6, 15, 9, 11]
        },
        {
          label: 'Pendientes',
          backgroundColor: '#FF9500',
          data: [15, 18, 22, 12, 16, 23]
        }
      ]
    };

    //  gráfico de estado
    const statusData = {
      labels: ['Aprobados', 'Rechazados', 'Pendientes', 'En Revisión'],
      datasets: [{
        data: [328, 61, 89, 45],
        backgroundColor: ['#52C41A', '#FF4D4F', '#FF9500', '#1890FF'],
        borderWidth: 0
      }]
    };

    // gráfico por tipo de documento
    const documentData = {
      labels: ['Diploma Bachiller', 'Diploma Académico', 'Título Provisión'],
      datasets: [{
        label: 'Cantidad Procesada',
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
        data: [195, 180, 148]
      }]
    };

    //  tiempo de procesamiento que no creo que sirva
    const processingData = {
      labels: ['1-2 días', '3-5 días', '6-10 días', '+10 días'],
      datasets: [{
        data: [156, 248, 85, 34],
        backgroundColor: ['#52C41A', '#1890FF', '#FF9500', '#FF4D4F'],
        borderWidth: 0
      }]
    };

    setMonthlyChart(monthlyData);
    setStatusChart(statusData);
    setDocumentTypeChart(documentData);
    setProcessingTimeChart(processingData);

    // vatos de resumen
    setReportSummary({
      totalProcessed: 523,
      approved: 328,
      rejected: 61,
      pending: 89,
      avgProcessingTime: '4.2 días'
    });

    // datos detallados para la tabla
    const detailedData: DetailedReport[] = [
      {
        id: 1,
        applicantName: "María González López",
        documentType: "Diploma Académico",
        status: "Aprobado",
        submissionDate: "2024-05-15",
        reviewDate: "2024-05-18",
        processingTime: "3 días",
        reviewer: "Admin. Rodriguez"
      },
      {
        id: 2,
        applicantName: "Carlos Mendoza Silva",
        documentType: "Título Provisión Nacional",
        status: "Rechazado",
        submissionDate: "2024-05-14",
        reviewDate: "2024-05-16",
        processingTime: "2 días",
        reviewer: "Admin. Martinez"
      },
      {
        id: 3,
        applicantName: "Ana Torres Vega",
        documentType: "Diploma de Bachiller",
        status: "Aprobado",
        submissionDate: "2024-05-13",
        reviewDate: "2024-05-17",
        processingTime: "4 días",
        reviewer: "Admin. García"
      },
      {
        id: 4,
        applicantName: "Luis Ramírez Castro",
        documentType: "Diploma Académico",
        status: "Pendiente",
        submissionDate: "2024-05-12",
        reviewDate: "-",
        processingTime: "8 días",
        reviewer: "-"
      },
      {
        id: 5,
        applicantName: "Isabel Morales Vega",
        documentType: "Diploma de Bachiller",
        status: "En Revisión",
        submissionDate: "2024-05-11",
        reviewDate: "-",
        processingTime: "9 días",
        reviewer: "Admin. López"
      }
    ];

    setDetailedReports(detailedData);
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057',
          font: {
            family: 'Roboto, sans-serif'
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
          font: {
            family: 'Roboto, sans-serif'
          }
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057',
          font: {
            family: 'Roboto, sans-serif'
          }
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#495057',
          font: {
            family: 'Roboto, sans-serif'
          }
        }
      }
    }
  };

  const statusBodyTemplate = (rowData: DetailedReport) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case 'Aprobado': return 'success';
        case 'Rechazado': return 'danger';
        case 'Pendiente': return 'warning';
        case 'En Revisión': return 'info';
        default: return 'secondary';
      }
    };

    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  const exportToExcel = () => {
    // esto no sirve
    console.log('Exportando a Excel...');
  };

  const exportToPDF = () => {
    // esto tampoco sirve aun
    console.log('Exportando a PDF...');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <Button
            icon="pi pi-arrow-left"
            className="p-button-text p-button-plain"
            onClick={() => navigate('/administrator/home')}
            tooltip="Volver al inicio"
          />
          <div className={styles.headerText}>
            <h1>Reportes y Estadísticas</h1>
            <p>Análisis detallado del procesamiento de documentos académicos</p>
          </div>
        </div>
        <div className={styles.exportButtons}>
          <Button
            label="Exportar Excel"
            icon="pi pi-file-excel"
            className="p-button-success"
            onClick={exportToExcel}
          />
          <Button
            label="Exportar PDF"
            icon="pi pi-file-pdf"
            className="p-button-danger"
            onClick={exportToPDF}
          />
        </div>
      </div>

      {/* filtros */}
      <Card className={styles.filtersCard}>
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label>Rango de Fechas:</label>
            <Calendar
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.value as Date[]})}
              selectionMode="range"
              readOnlyInput
              placeholder="Seleccionar fechas"
              className={styles.calendarFilter}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Tipo de Documento:</label>
            <Dropdown
              value={filters.documentType}
              options={documentTypes}
              onChange={(e) => setFilters({...filters, documentType: e.value})}
              className={styles.dropdownFilter}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Estado:</label>
            <Dropdown
              value={filters.status}
              options={statusOptions}
              onChange={(e) => setFilters({...filters, status: e.value})}
              className={styles.dropdownFilter}
            />
          </div>
          <Button
            label="Limpiar Filtros"
            icon="pi pi-times"
            className="p-button-outlined"
            onClick={() => setFilters({dateRange: null, documentType: 'Todos', status: 'Todos'})}
          />
        </div>
      </Card>

      {/* resumen de estadísticas */}
      <div className={styles.summaryCards}>
        <Card className={styles.summaryCard}>
          <div className={styles.summaryContent}>
            <div className={styles.summaryIcon} style={{backgroundColor: '#1890FF20'}}>
              <i className="pi pi-file" style={{color: '#1890FF'}}></i>
            </div>
            <div className={styles.summaryData}>
              <h3>{reportSummary.totalProcessed}</h3>
              <p>Total Procesados</p>
            </div>
          </div>
        </Card>
        <Card className={styles.summaryCard}>
          <div className={styles.summaryContent}>
            <div className={styles.summaryIcon} style={{backgroundColor: '#52C41A20'}}>
              <i className="pi pi-check-circle" style={{color: '#52C41A'}}></i>
            </div>
            <div className={styles.summaryData}>
              <h3>{reportSummary.approved}</h3>
              <p>Aprobados</p>
            </div>
          </div>
        </Card>
        <Card className={styles.summaryCard}>
          <div className={styles.summaryContent}>
            <div className={styles.summaryIcon} style={{backgroundColor: '#FF4D4F20'}}>
              <i className="pi pi-times-circle" style={{color: '#FF4D4F'}}></i>
            </div>
            <div className={styles.summaryData}>
              <h3>{reportSummary.rejected}</h3>
              <p>Rechazados</p>
            </div>
          </div>
        </Card>
        <Card className={styles.summaryCard}>
          <div className={styles.summaryContent}>
            <div className={styles.summaryIcon} style={{backgroundColor: '#FF950020'}}>
              <i className="pi pi-clock" style={{color: '#FF9500'}}></i>
            </div>
            <div className={styles.summaryData}>
              <h3>{reportSummary.avgProcessingTime}</h3>
              <p>Tiempo Promedio</p>
            </div>
          </div>
        </Card>
      </div>

      {/* gráficos */}
      <div className={styles.chartsGrid}>
        <Card title="Procesamiento Mensual" className={styles.chartCard}>
          <Chart type="bar" data={monthlyChart} options={chartOptions} />
        </Card>

        <Card title="Estado de Documentos" className={styles.chartCard}>
          <Chart type="pie" data={statusChart} options={pieChartOptions} />
        </Card>

        <Card title="Documentos por Tipo" className={styles.chartCard}>
          <Chart type="bar" data={documentTypeChart} options={chartOptions} />
        </Card>

        <Card title="Tiempo de Procesamiento" className={styles.chartCard}>
          <Chart type="doughnut" data={processingTimeChart} options={pieChartOptions} />
        </Card>
      </div>

      <Card title="Reporte Detallado" className={styles.tableCard}>
        <DataTable
          value={detailedReports}
          paginator
          rows={10}
          dataKey="id"
          filterDisplay="menu"
          emptyMessage="No se encontraron registros."
          className={styles.reportTable}
        >
          <Column field="applicantName" header="Solicitante" sortable style={{minWidth: '200px'}} />
          <Column field="documentType" header="Tipo de Documento" sortable style={{minWidth: '180px'}} />
          <Column field="status" header="Estado" body={statusBodyTemplate} sortable style={{minWidth: '120px'}} />
          <Column field="submissionDate" header="Fecha Envío" sortable style={{minWidth: '140px'}} />
          <Column field="reviewDate" header="Fecha Revisión" sortable style={{minWidth: '140px'}} />
          <Column field="processingTime" header="Tiempo Procesamiento" sortable style={{minWidth: '160px'}} />
          <Column field="reviewer" header="Revisor" sortable style={{minWidth: '150px'}} />
        </DataTable>
      </Card>
    </div>
  );
};

export default AdministratorReportsPage;