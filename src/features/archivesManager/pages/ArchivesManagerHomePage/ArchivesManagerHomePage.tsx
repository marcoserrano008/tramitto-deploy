import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './ArchivesManagerHomePage.module.scss';
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

type SignatureItem = {
  id: number;
  applicantName: string;
  documentType: string;
  status: string;
  submissionDate: string;
  signatureDate?: string;
  signedBy?: string;
};

const statsItems: StatsItem[] = [
  { icon: 'pi pi-clock', title: 'Pendientes de Firma', value: '18', color: '#FF9500' },
  { icon: 'pi pi-check-circle', title: 'Firmados Hoy', value: '12', color: '#52C41A' },
  { icon: 'pi pi-file-edit', title: 'Total Firmados', value: '2,451', color: '#1890FF' },
];

const processItems: ProcessItem[] = [
  {
    procedureTypeId: 1,
    title: 'Legalización',
    subtitle: 'Diploma de Bachiller',
    route: '/archives-manager/procedures-list/diploma-bachiller',
    pendingCount: 6,
    newTodayCount: 4
  },
  {
    procedureTypeId: 2,
    title: 'Legalización',
    subtitle: 'Diploma Académico',
    route: '/archives-manager/procedures-list/diploma-academico',
    pendingCount: 9,
    newTodayCount: 5
  },
  {
    procedureTypeId: 3,
    title: 'Legalización',
    subtitle: 'Título Provisión Nacional',
    route: '/archives-manager/procedures-list/titulo-provision',
    pendingCount: 3,
    newTodayCount: 3
  },
];

const ArchivesManagerHomePage = () => {
  const navigate = useNavigate();
  const [signatureHistory, setSignatureHistory] = useState<SignatureItem[]>([]);
  const [items, setItems] = useState<ProcessItem[]>(processItems);

  useEffect(() => {
    // datos fake
    const sampleData: SignatureItem[] = [
      {
        id: 1,
        applicantName: "Pedro Morales Vega",
        documentType: "Diploma de Bachiller",
        status: "Pendiente",
        submissionDate: "2024-05-20",
      },
      {
        id: 2,
        applicantName: "Carmen Silva Ramos",
        documentType: "Diploma Académico",
        status: "Firmado",
        submissionDate: "2024-05-19",
        signatureDate: "2024-05-20",
        signedBy: "Jefe Archivos - López"
      },
      {
        id: 3,
        applicantName: "Roberto Fernández Cruz",
        documentType: "Título Provisión Nacional",
        status: "Rechazado",
        submissionDate: "2024-05-18",
        signatureDate: "2024-05-19",
        signedBy: "Jefe Archivos - López"
      },
      {
        id: 4,
        applicantName: "Isabella Mendoza Torres",
        documentType: "Diploma de Bachiller",
        status: "En Proceso",
        submissionDate: "2024-05-17",
      },
      {
        id: 5,
        applicantName: "Diego Vargas Medina",
        documentType: "Diploma Académico",
        status: "Firmado",
        submissionDate: "2024-05-16",
        signatureDate: "2024-05-17",
        signedBy: "Jefe Archivos - López"
      }
    ];
    setSignatureHistory(sampleData);
  }, []);

  useEffect(() => {
    getProcedureCounters(ProcedureStatusEnum.ARCHIVES_REVIEW).then(counters => {
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

  // tabla fake
  const statusBodyTemplate = (rowData: SignatureItem) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case 'Firmado': return 'success';
        case 'Rechazado': return 'danger';
        case 'Pendiente': return 'warning';
        case 'En Proceso': return 'info';
        default: return 'secondary';
      }
    };

    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  const actionBodyTemplate = (rowData: SignatureItem) => {
    return (
      <div className={styles.actionButtons}>
        <Button
          icon="pi pi-eye"
          className="p-button-text p-button-info"
          tooltip="Ver detalles"
          onClick={() => navigate(`/archives-manager/revision/${rowData.id}`)}
        />
        {rowData.status === 'Pendiente' && (
          <Button
            icon="pi pi-file-edit"
            className="p-button-text p-button-warning"
            tooltip="Firmar"
            onClick={() => navigate(`/archives-manager/firmar/${rowData.id}`)}
          />
        )}
      </div>
    );
  };

  const procedureRoutes: Record<string, string> = {
    'Diploma de Bachiller': '/archives-manager/procedures-list/diploma-bachiller',
    'Diploma Académico': '/archives-manager/procedures-list/diploma-academico',
    'Título Provisión Nacional': '/archives-manager/procedures-list/titulo-provision'
  };

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Panel Jefe de Archivos</h1>
          <p>Gestiona y firma los documentos académicos legalizados para su validación final.</p>
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
          <span className={styles.processLabel}>Documentos por Firmar</span>
          <div className={styles.processCards}>
            {items.map((item, index) => (
              <div key={`${item.subtitle}-${index}`} className={styles.processCard}>
                <div className={styles.processCardHeader}>
                  <div className={styles.processCardIcon}>
                    <i className="pi pi-file-edit" style={{fontSize: "1.5rem", color: "#004e9a"}}></i>
                  </div>
                </div>
                <div className={styles.processCardContent}>
                  <div className={styles.processCardTitle}>{item.title}</div>
                  <div className={styles.processCardSubtitle}>{item.subtitle}</div>
                  <div className={styles.processCardStats}>
                    <div className={styles.processCardStat}>
                      <span className={styles.statLabel}>Documentos pendientes:</span>
                      <span className={styles.statValue}>{item.pendingCount}</span>
                    </div>
                    <div className={styles.processCardStat}>
                      <span className={styles.statLabel}>Documentos nuevos hoy:</span>
                      <span className={`${styles.statValue} ${styles.newToday}`}>{item.newTodayCount}</span>
                    </div>
                  </div>
                  <Button
                    label="Revisar"
                    className={styles.processCardButton}
                    onClick={() => navigate(procedureRoutes[item.subtitle] || '/archives-manager/procedures-list')}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.processWrapper}>
          <span className={styles.processLabel}>Historial de Firmas</span>
          <div className={styles.tableContainer}>
            <DataTable
              value={signatureHistory}
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
                field="signatureDate"
                header="Fecha de Firma"
                sortable
                style={{minWidth: '140px'}}
              />
              <Column
                field="signedBy"
                header="Firmado por"
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
              label="Ver historial completo"
              className="p-button-outlined p-button-primary"
              onClick={() => navigate('/archives-manager/historial-firmas')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ArchivesManagerHomePage;