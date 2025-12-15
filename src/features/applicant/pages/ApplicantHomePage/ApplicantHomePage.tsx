import {Button} from 'primereact/button';
import {useNavigate} from 'react-router-dom';
import styles from './ApplicantHomePage.module.scss';
import 'primeicons/primeicons.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logoTramitto from "../../../../../public/logoTramitto.svg";
import ProceduresTable from "../ApplicantPersonalProceduresPage/components/ProceduresTable/ProceduresTable.tsx";
import {useCallback, useEffect, useState} from "react";
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import {proceduresByUserIdService} from "../../../../services/ProceduresByUserId.http.service.ts";
import {useAuth} from "../../../../context/AuthContext.tsx";

type ProcessItem = {
  title: string;
  subtitle: string;
  route: string;
};

type RecentProcess = {
  id: string;
  type: string;
  date: string;
  status: 'En proceso' | 'Completado' | 'Pendiente' | 'Rechazado';
};

const processItems: ProcessItem[] = [
  {
    title: 'Legalización',
    subtitle: 'Diploma de Bachiller',
    route: '/usuario/informacion-tramite/diploma-bachiller'
  },
  {
    title: 'Legalización',
    subtitle: 'Diploma Académico',
    route: '/usuario/informacion-tramite/diploma-academico'
  },
  {
    title: 'Legalización',
    subtitle: 'Título Provisión Nacional',
    route: '/usuario/informacion-tramite/titulo-provision'
  },
];

// Datos de ejemplo - En producción vendrían de una API
const recentProcesses: RecentProcess[] = [
  {
    id: 'TR-2024-001',
    type: 'Diploma de Bachiller',
    date: '15/12/2024',
    status: 'En proceso'
  },
  {
    id: 'TR-2024-002',
    type: 'Diploma Académico',
    date: '10/12/2024',
    status: 'Completado'
  },
  {
    id: 'TR-2024-003',
    type: 'Título Provisión Nacional',
    date: '05/12/2024',
    status: 'Pendiente'
  },
];

const ApplicantHomePage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleNavigation = (route: string) => {
    navigate(route);
  };
  const [procedures, setProcedures] = useState<ProcedureResponse[]>([]);

  const fetchProcedures = useCallback(async () => {
    if (!auth.user) {
      //setProcedureError('You must be logged in to see procedures');
      //setProceduresLoading(false);
      return;
    }
    try {
      const response: ProcedureResponse[] = await proceduresByUserIdService.getProcedures(auth.user.id);
      setProcedures(response);
    } catch (error) {
      console.error(error);
      //setProcedureError('Failed to fetch procedures');
    } finally {
      //setProceduresLoading(false);
    }
  }, [auth.user]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Bienvenido al Sistema de Información de Trámites</h1>
          <p>Digitaliza y gestiona tus documentos académicos de forma rápida y segura.</p>
        </div>
        <div className={styles.heroLogos}>
          <img src={logoTramitto} alt="Logo Tramitto" className={styles.logoImage}/>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.processWrapper}>
          <span className={styles.processLabel}>Trámites</span>
          <div className={styles.processCards}>
            {processItems.map((item, index) => (
              <div key={`${item.subtitle}-${index}`} className={styles.processCard}>
                <div className={styles.processCardHeader}>
                  <div className={styles.processCardIcon}>
                    <i className="pi pi-file" style={{fontSize: "1.5rem", color: "#004e9a"}}></i>
                  </div>
                </div>
                <div className={styles.processCardContent}>
                  <div className={styles.processCardTitle}>{item.title}</div>
                  <div className={styles.processCardSubtitle}>{item.subtitle}</div>
                  <Button
                    label="Iniciar"
                    className={styles.processCardButton}
                    onClick={() => handleNavigation(item.route)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.recentWrapper}>
          <span className={styles.recentLabel}>Trámites Recientes</span>
          <div className={styles.tableContainer}>
            {recentProcesses.length > 0 ? (
              <ProceduresTable
                procedures={procedures}
                defaultExpandedRows={[]}
                limit={4}
              />
            ) : (
              <div className={styles.emptyState}>
                <i className="pi pi-inbox" style={{fontSize: "3rem", color: "#BFBFBF"}}></i>
                <p>No tienes trámites recientes</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ApplicantHomePage;