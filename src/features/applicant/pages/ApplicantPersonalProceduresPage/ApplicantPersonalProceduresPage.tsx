// import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
// import ProceduresTable from "./components/ProceduresTable/ProceduresTable.tsx";
// import {useCallback, useEffect, useState} from "react";
// import {proceduresByUserIdService} from "../../../../services/ProceduresByUserId.http.service.ts";
// import {useAuth} from "../../../../context/AuthContext.tsx";
// import './ApplicantPersonalProceduresPage.scss'; // Asegúrate de tener este import
// import styles
//   from "../../../administrator/pages/AdministratorProceduresListPage/AdministratorProceduresListPage.module.scss";
// import {useLocation} from "react-router-dom";
//
// const ApplicantPersonalProceduresPage = () => {
//   const auth = useAuth();
//   const location = useLocation();
//
//   const selectedProcedureId =
//     (location.state as { selectedProcedureId?: number } | null)?.selectedProcedureId;
//
//   const [procedures, setProcedures] = useState<ProcedureResponse[]>([]);
//   const [procedureError, setProcedureError] = useState<string | null>(null);
//   const [proceduresLoading, setProceduresLoading] = useState<boolean>(true);
//
//   const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
//
//   // --- LOGICA DE CARGA DE DATOS ---
//   const fetchProcedures = useCallback(async () => {
//     if (!auth.user) {
//       setProcedureError('You must be logged in to see procedures');
//       setProceduresLoading(false);
//       return;
//     }
//     try {
//       const response: ProcedureResponse[] = await proceduresByUserIdService.getProcedures(auth.user.id);
//       setProcedures(response);
//     } catch (error) {
//       console.error(error);
//       setProcedureError('Failed to fetch procedures');
//     } finally {
//       setProceduresLoading(false);
//     }
//   }, [auth.user]);
//
//   useEffect(() => {
//     fetchProcedures();
//   }, [fetchProcedures]);
//
//
//   // --- LOGICA DEL MODAL ---
//
//   // Función unificada para cerrar: Cierra el modal Y recarga la tabla
//   const handleCloseModal = useCallback(() => {
//     setShowSuccessModal(false);
//     fetchProcedures();
//   }, [fetchProcedures]);
//
//   // 1. Abrir Modal a los 4 segundos
//   useEffect(() => {
//     let timer: number | undefined;
//     if (selectedProcedureId) {
//       timer = window.setTimeout(() => {
//         setShowSuccessModal(true);
//       }, 4000);
//     }
//     return () => window.clearTimeout(timer);
//   }, [selectedProcedureId]);
//
//   // 2. Cerrar Modal automáticamente a los 5 segundos
//   useEffect(() => {
//     let timer: number | undefined;
//     if (showSuccessModal) {
//       timer = window.setTimeout(() => {
//         handleCloseModal(); // Usamos la misma función que el botón X
//       }, 5000);
//     }
//     // Si el usuario cierra manual antes de los 5s, esto limpia el timer para evitar dobles llamadas
//     return () => window.clearTimeout(timer);
//   }, [showSuccessModal, handleCloseModal]);
//
//
//   if (proceduresLoading) return <div>Loading procedures...</div>;
//   if (procedureError) return <div>Error loading procedures...</div>;
//
//   return (
//     <div className="applicant-personal-procedures-container">
//
//       {/* --- MODAL AMIGABLE --- */}
//       {showSuccessModal && (
//         <div className="success-modal-overlay">
//           <div className="success-modal-content">
//             {/* Botón X */}
//             <button
//               className="close-modal-btn"
//               onClick={handleCloseModal}
//               aria-label="Cerrar"
//             >
//               <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M13 1L1 13M1 1L13 13" stroke="#666" strokeWidth="2" strokeLinecap="round"
//                       strokeLinejoin="round"/>
//               </svg>
//             </button>
//
//             {/* Ícono de Check Verde */}
//             <div className="success-icon-container">
//               <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path
//                   d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
//                   stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M22 4L12 14.01L9 11.01" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"
//                       strokeLinejoin="round"/>
//               </svg>
//             </div>
//
//             <h3 className="modal-title">¡Trámite Aprobado!</h3>
//             <p className="modal-message">
//               Su trámite número: <strong>{selectedProcedureId}</strong> ha sido aprobado exitosamente.
//             </p>
//           </div>
//         </div>
//       )}
//
//       <section className={styles.proceduresListHeader}>
//         <span className={styles.proceduresListTitle}>Mis trámites</span>
//         <span className={styles.proceduresListSubtitle}>Legalizaciones</span>
//       </section>
//       <section className="applicant-personal-procedures-table">
//         <ProceduresTable
//           procedures={procedures}
//           defaultExpandedRows={selectedProcedureId ? [selectedProcedureId] : []}
//           highlightId={selectedProcedureId}
//         />
//       </section>
//     </div>
//   );
// }
//
// export default ApplicantPersonalProceduresPage;
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import ProceduresTable from "./components/ProceduresTable/ProceduresTable.tsx";
import {useCallback, useEffect, useState} from "react";
import {proceduresByUserIdService} from "../../../../services/ProceduresByUserId.http.service.ts";
import {useAuth} from "../../../../context/AuthContext.tsx";
import './ApplicantPersonalProceduresPage.scss';
import styles
  from "../../../administrator/pages/AdministratorProceduresListPage/AdministratorProceduresListPage.module.scss";
import {useLocation} from "react-router-dom";

const ApplicantPersonalProceduresPage = () => {
  const auth = useAuth();
  const location = useLocation();

  const selectedProcedureId =
    (location.state as { selectedProcedureId?: number } | null)?.selectedProcedureId;

  const [procedures, setProcedures] = useState<ProcedureResponse[]>([]);
  const [procedureError, setProcedureError] = useState<string | null>(null);
  const [proceduresLoading, setProceduresLoading] = useState<boolean>(true);

  const [showProcessingModal, setShowProcessingModal] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  // --- LOGICA DE CARGA DE DATOS ---
  const fetchProcedures = useCallback(async () => {
    if (!auth.user) {
      setProcedureError('You must be logged in to see procedures');
      setProceduresLoading(false);
      return;
    }
    try {
      const response: ProcedureResponse[] = await proceduresByUserIdService.getProcedures(auth.user.id);
      setProcedures(response);
    } catch (error) {
      console.error(error);
      setProcedureError('Failed to fetch procedures');
    } finally {
      setProceduresLoading(false);
    }
  }, [auth.user]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  // --- LOGICA DEL MODAL DE PROCESAMIENTO ---

  // 1. Abrir Modal INSTANTÁNEAMENTE cuando hay selectedProcedureId
  useEffect(() => {
    if (selectedProcedureId) {
      setShowProcessingModal(true);
      setCountdown(5); // Resetear contador
    }
  }, [selectedProcedureId]);

  // 2. Countdown de 5 segundos
  useEffect(() => {
    if (showProcessingModal && countdown > 0) {
      const timer = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => window.clearTimeout(timer);
    } else if (showProcessingModal && countdown === 0) {
      // Cerrar modal, recargar y descargar documento automáticamente
      setShowProcessingModal(false);
      fetchProcedures();

      // Descargar el documento automáticamente
      const selectedProcedure = procedures.find(p => p.id === selectedProcedureId);
      if (selectedProcedure) {
        const documentId = selectedProcedure.documents.at(-1)?.documentId;
        if (documentId) {
          // Importar la función handlePreview con autoDownload=true
          import('../../../../utils/documentActions.ts').then(({ handlePreview }) => {
            handlePreview(documentId, selectedProcedure, true);
          });
        }
      }
    }
  }, [showProcessingModal, countdown, fetchProcedures, procedures, selectedProcedureId]);

  const handleCloseModal = useCallback(() => {
    setShowProcessingModal(false);
    fetchProcedures();
  }, [fetchProcedures]);

  if (proceduresLoading) return <div>Loading procedures...</div>;
  if (procedureError) return <div>Error loading procedures...</div>;

  return (
    <div className="applicant-personal-procedures-container">

      {/* --- MODAL DE PROCESAMIENTO CON TEMPORIZADOR --- */}
      {showProcessingModal && (
        <div className="processing-modal-overlay">
          <div className="processing-modal-content">
            {/* Botón X */}
            <button
              className="close-modal-btn"
              onClick={handleCloseModal}
              aria-label="Cerrar"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#666" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Temporizador Circular Animado */}
            <div className="timer-container">
              <svg className="timer-svg" width="120" height="120" viewBox="0 0 120 120">
                {/* Círculo de fondo */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Círculo de progreso */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="339.292"
                  strokeDashoffset={339.292 * (countdown / 5)}
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '60px 60px',
                    transition: 'stroke-dashoffset 1s linear'
                  }}
                />
              </svg>
              {/* Número del countdown */}
              <div className="timer-number">{countdown}</div>
            </div>

            <h3 className="modal-title">Procesando trámite</h3>
            <p className="modal-message">
              Su trámite número: <strong>{selectedProcedureId}</strong> está siendo procesado.
            </p>
            <p className="modal-subtitle">Cerrando en {countdown} segundo{countdown !== 1 ? 's' : ''}...</p>
          </div>
        </div>
      )}

      <section className={styles.proceduresListHeader}>
        <span className={styles.proceduresListTitle}>Mis trámites</span>
        <span className={styles.proceduresListSubtitle}>Legalizaciones</span>
      </section>
      <section className="applicant-personal-procedures-table">
        <ProceduresTable
          procedures={procedures}
          defaultExpandedRows={selectedProcedureId ? [selectedProcedureId] : []}
          highlightId={selectedProcedureId}
        />
      </section>
    </div>
  );
}

export default ApplicantPersonalProceduresPage;