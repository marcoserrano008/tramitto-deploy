import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './AdministratorHomePage.module.scss';
import 'primeicons/primeicons.css';
import logoTramitto from "../../../../assets/images/logoTramitto.svg";
import logoUMSS from "../../../../assets/images/logoUMSS.svg";
import {getProcedureCounters} from "../../../../services/GetCountersByStatus.http.service.ts";
import {ProcedureStatusEnum} from "../../../../types/enum/ProcedureStatus.enum.ts";

type StatsItem = {
  icon: string;
  title: string;
  value: string;
  color: string;
};

type ProcessItem = {
  procedureTypeId: number;
  title: string;
  subtitle: string;
  route: string;
  pendingCount: number;
  newTodayCount: number;
};

type ReviewItem = {
  id: number;
  applicantName: string;
  documentType: string;
  status: string;
  submissionDate: string;
  reviewDate?: string;
  reviewer?: string;
};

const statsItems: StatsItem[] = [
  { icon: 'pi pi-clock', title: 'Pendientes de Revisión', value: '23', color: '#FF9500' },
  { icon: 'pi pi-check-circle', title: 'Aprobados Hoy', value: '15', color: '#52C41A' },
  { icon: 'pi pi-times-circle', title: 'Rechazados Hoy', value: '3', color: '#FF4D4F' },
  { icon: 'pi pi-file', title: 'Total Procesados', value: '1,247', color: '#1890FF' },
];

const processItems: ProcessItem[] = [
  {
    procedureTypeId: 1,
    title: 'Legalización',
    subtitle: 'Diploma de Bachiller',
    route: '/admin/solicitudes/diploma-bachiller',
    pendingCount: 8,
    newTodayCount: 5
  },
  {
    procedureTypeId: 2,
    title: 'Legalización',
    subtitle: 'Diploma Académico',
    route: '/admin/solicitudes/diploma-academico',
    pendingCount: 12,
    newTodayCount: 7
  },
  {
    procedureTypeId: 3,
    title: 'Legalización',
    subtitle: 'Título Provisión Nacional',
    route: '/admin/solicitudes/titulo-provision',
    pendingCount: 3,
    newTodayCount: 3
  },
];

const AdminHomePage = () => {
  const navigate = useNavigate();
  const [reviewHistory, setReviewHistory] = useState<ReviewItem[]>([]);
  const [reportChartData, setReportChartData] = useState<any>({});
  const [reportChartOptions, setReportChartOptions] = useState<any>({});
  const [items, setItems] = useState<ProcessItem[]>(processItems);

  useEffect(() => {
    // desde aqui la tabla
    const sampleData: ReviewItem[] = [
      {
        id: 1,
        applicantName: "Juan Pérez García",
        documentType: "Diploma de Bachiller",
        status: "Pendiente",
        submissionDate: "2024-05-20",
      },
      {
        id: 2,
        applicantName: "María González López",
        documentType: "Diploma Académico",
        status: "Aprobado",
        submissionDate: "2024-05-19",
        reviewDate: "2024-05-20",
        reviewer: "Admin. Rodriguez"
      },
      {
        id: 3,
        applicantName: "Carlos Mendoza Silva",
        documentType: "Título Provisión Nacional",
        status: "Rechazado",
        submissionDate: "2024-05-18",
        reviewDate: "2024-05-19",
        reviewer: "Admin. Martinez"
      },
      {
        id: 4,
        applicantName: "Ana Torres Vega",
        documentType: "Diploma de Bachiller",
        status: "En Revisión",
        submissionDate: "2024-05-17",
      },
      {
        id: 5,
        applicantName: "Luis Ramírez Castro",
        documentType: "Diploma Académico",
        status: "Aprobado",
        submissionDate: "2024-05-16",
        reviewDate: "2024-05-17",
        reviewer: "Admin. García"
      }
    ];
    setReviewHistory(sampleData);

    // Datos de reporte gráfico
    const data = {
      labels: ['Diploma Bachiller', 'Diploma Académico', 'Título Provisión'],
      datasets: [
        {
          label: 'Solicitudes Procesadas',
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
          data: [35, 50, 20]
        }
      ]
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };

    setReportChartData(data);
    setReportChartOptions(options);

  }, []);
  //hasta aqui los reportes

  useEffect(() => {
  getProcedureCounters(ProcedureStatusEnum.ADMIN_REVIEW).then(counters => {
    setItems(prev =>
      prev.map(item => {
        const match = counters.find(c => c.procedureTypeId === item.procedureTypeId);
        return {
          ...item,
          pendingCount: match?.total ?? 0,
          newTodayCount: match?.today ?? 0
        };
      })
    );
  });
}, []);

  //parte de la tabla
  const statusBodyTemplate = (rowData: ReviewItem) => {
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

  const actionBodyTemplate = (rowData: ReviewItem) => {
    return (
      <div className={styles.actionButtons}>
        <Button
          icon="pi pi-eye"
          className="p-button-text p-button-info"
          tooltip="Ver detalles"
          onClick={() => navigate(`/admin/revision/${rowData.id}`)}
        />
        {rowData.status === 'Pendiente' && (
          <Button
            icon="pi pi-pencil"
            className="p-button-text p-button-warning"
            tooltip="Editar"
            onClick={() => navigate(`/admin/revisar/${rowData.id}`)}
          />
        )}
      </div>
    );
  };
  //hasta aqui la tabña

  const procedureRoutes: Record<string, string> = {
    'Diploma de Bachiller': '/administrator/procedures-list/diploma-bachiller',
    'Diploma Académico': '/administrator/procedures-list/diploma-academico',
    'Título Provisión Nacional': '/administrator/procedures-list/titulo-provision'
  };

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Panel de Administración</h1>
          <p>Gestiona y supervisa las solicitudes de legalización de documentos académicos.</p>
        </div>
        <div className={styles.heroLogos}>
          <img src={logoTramitto} alt="Logo Tramitto" className={styles.logoImage}/>
          <img src={logoUMSS} alt="Logo UMSS" className={styles.logoImage}/>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.statsCards}>
          {statsItems.map((item, index) => (
            <div key={`${item.title}-${index}`} className={styles.statsCard}>
              <div className={styles.statsCardIcon} style={{backgroundColor: `${item.color}20`}}>
                <i className={`${item.icon} ${styles.statsIcon}`} style={{color: item.color}}></i>
              </div>
              <div className={styles.statsCardContent}>
                <div className={styles.statsCardValue}>{item.value}</div>
                <div className={styles.statsCardTitle}>{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.processWrapper}>
          <span className={styles.processLabel}>Trámites</span>
          <div className={styles.processCards}>
            {items.map((item, index) => (
              <div key={`${item.subtitle}-${index}`} className={styles.processCard}>
                <div className={styles.processCardHeader}>
                  <div className={styles.processCardIcon}>
                    <i className="pi pi-file" style={{fontSize: "1.5rem", color: "#004e9a"}}></i>
                  </div>
                </div>
                <div className={styles.processCardContent}>
                  <div className={styles.processCardTitle}>{item.title}</div>
                  <div className={styles.processCardSubtitle}>{item.subtitle}</div>
                  <div className={styles.processCardStats}>
                    <div className={styles.processCardStat}>
                      <span className={styles.statLabel}>Solicitudes pendientes:</span>
                      <span className={styles.statValue}>{item.pendingCount}</span>
                    </div>
                    <div className={styles.processCardStat}>
                      <span className={styles.statLabel}>Solicitudes nuevas hoy:</span>
                      <span className={`${styles.statValue} ${styles.newToday}`}>{item.newTodayCount}</span>
                    </div>
                  </div>
                  <Button
                    label="Revisar"
                    className={styles.processCardButton}
                    onClick={() => navigate(procedureRoutes[item.subtitle] || '/administrator/procedures-list')}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.processWrapper}>
          <span className={styles.processLabel}>Historial de Revisión</span>
          <div className={styles.tableContainer}>
            <DataTable
              value={reviewHistory}
              paginator
              rows={10}
              dataKey="id"
              filterDisplay="menu"
              emptyMessage="No se encontraron registros."
              className={styles.reviewTable}
            >
              <Column
                field="applicantName"
                header="Solicitante"
                sortable
                style={{minWidth: '200px'}}
              />
              <Column
                field="documentType"
                header="Tipo de Documento"
                sortable
                style={{minWidth: '180px'}}
              />
              <Column
                field="status"
                header="Estado"
                body={statusBodyTemplate}
                sortable
                style={{minWidth: '120px'}}
              />
              <Column
                field="submissionDate"
                header="Fecha de Envío"
                sortable
                style={{minWidth: '140px'}}
              />
              <Column
                field="reviewDate"
                header="Fecha de Revisión"
                sortable
                style={{minWidth: '140px'}}
              />
              <Column
                field="reviewer"
                header="Revisor"
                sortable
                style={{minWidth: '150px'}}
              />
              <Column
                body={actionBodyTemplate}
                header="Acciones"
                style={{minWidth: '100px'}}
              />
            </DataTable>
          </div>
          <div style={{marginTop: '1rem', textAlign: 'right'}}>
            <Button
              label="Ver historial"
              className="p-button-outlined p-button-primary"
              onClick={() => navigate('/admin/historial')}
            />
          </div>
        </div>
      </section>

      <section className={styles.reportesSection}>
        <div className={styles.processWrapper}>
          <span className={styles.processLabel}>Reportes</span>
          <div className={styles.reportChartContainer}>
            <Chart type="bar" data={reportChartData} options={reportChartOptions} className={styles.reportChart} />
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <Button
              label="Ver reportes"
              className="p-button-outlined p-button-primary"
              onClick={() => navigate('/admin/reports')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminHomePage;