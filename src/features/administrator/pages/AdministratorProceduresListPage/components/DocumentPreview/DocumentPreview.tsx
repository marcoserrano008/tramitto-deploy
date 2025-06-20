import {useEffect, useState} from 'react';
import {ProcedureResponse} from "../../../../../../types/ProcedureResponse.interface.ts";
import {WorkflowReviewRequest} from "../../../../../../types/WorkflowReviewRequest.interface.ts";
import {WorkflowStepStatusEnum} from "../../../../../../types/enum/WorkflowStepStatus.enum.ts";
import "../AdminProceduresTable/AdminProceduresTable.css";
import styles from './DocumentPreview.module.scss';
import {ProgressSpinner} from 'primereact/progressspinner';
import {useAuth} from "../../../../../../context/AuthContext.tsx";
import {ProcedureStatusEnum} from "../../../../../../types/enum/ProcedureStatus.enum.ts";
import {RoleEnum} from "../../../../../../types/enum/Role.enum.ts";
import {formatDateTime} from "../../../../../../utils/formatDateTime.ts";

interface DocumentPreviewProps {
  selectedProcedure: ProcedureResponse | null;
  onReview?: (workflowReviewRequest: WorkflowReviewRequest) => void;
  isReviewing?: boolean;
  showActions?: boolean;
}

function DocumentPreview({selectedProcedure, onReview, isReviewing, showActions}: DocumentPreviewProps) {
  const {user} = useAuth();
  const [showRejectionForm, setShowRejectionForm] = useState<boolean>(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [currentReason, setCurrentReason] = useState<string>('');

  const COMMON_REJECTION_REASONS: string[] = [
    'Documento no legible',
    'Documento presenta raspaduras',
    'Documento no valido',
    'Formato de archivo no válido',
    'Fecha de vencimiento expirada',
    'Información inconsistente',
  ];

  const addReason = (reason: string) => {
    const trimmedReason = reason.trim();
    if (trimmedReason && !rejectionReasons.includes(trimmedReason)) {
      setRejectionReasons([...rejectionReasons, trimmedReason]);
      setCurrentReason('');
    }
  };

  const removeReason = (indexToRemove: number) => {
    setRejectionReasons(
      rejectionReasons.filter((_, index) => index !== indexToRemove)
    );
  };

  const addCommonReason = (reason: string) => {
    if (!rejectionReasons.includes(reason)) {
      setRejectionReasons([...rejectionReasons, reason]);
    }
  };

  const handleApproveClick = () => {
    if (selectedProcedure && onReview) {
      onReview({
        workflowStepId:
        selectedProcedure.workflowSteps[selectedProcedure.workflowSteps.length - 1].id,
        decision: WorkflowStepStatusEnum.APPROVED,
        notes: 'admin first approve',
      });
    }
  };

  const handleRejectClick = () => {
    setShowRejectionForm(true);
  };

  const handleRejectSubmit = () => {
    if (selectedProcedure && onReview && rejectionReasons.length > 0) {
      onReview({
        workflowStepId:
        selectedProcedure.workflowSteps[selectedProcedure.workflowSteps.length - 1].id,
        decision: WorkflowStepStatusEnum.REJECTED,
        notes: 'admin rejected',
        rejectionReasons: rejectionReasons,
      });
      setShowRejectionForm(false);
      setRejectionReasons([]);
      setCurrentReason('');
    }
  };

  useEffect(() => {
    // Clear previous blob URL to prevent memory leaks
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }

    if (!!selectedProcedure && selectedProcedure?.documents?.length > 0) {
      fetchPdfAndCreateBlobUrl(selectedProcedure.documents[0].documentId);
    }
  }, [selectedProcedure]);

  const fetchPdfAndCreateBlobUrl = async (documentId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/document/${documentId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfBlobUrl(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  if (!selectedProcedure) {
    return (
      <div className="document-preview-container">
        <p className="no-document-selected">Seleccione un trámite para ver su documento</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.previewHeader}>
        <h3 className={styles.title}>Vista previa del documento</h3>

        <div className={styles.applicantInfo}>
          <span className={styles.infoLabel}>Solicitante:</span>
          <span className={styles.infoValue}>
                {`${selectedProcedure.user.firstName} ${selectedProcedure.user.lastName} ${selectedProcedure.user.secondLastName ?? ''}`}
              </span>
        </div>
      </header>

      <section className={styles.documentViewer}>
        {selectedProcedure.documents.length > 0 ? (
          pdfBlobUrl ? (
            <>
              <div className={styles.viewerControls}>
                <a
                  href={pdfBlobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.newWindowLink}
                >
                  <section className={styles.newWindowLinkText}>
                    <span>Abrir en nueva ventana</span>
                    <span className="pi pi-window-maximize"></span>
                  </section>


                </a>
              </div>

              <div className={styles.pdfContainer}>
                <iframe
                  src={pdfBlobUrl}
                  title="PDF Preview"
                  className={styles.pdfViewer}
                />
              </div>
            </>
          ) : (
            <div className={styles.loading}>
              <div className={styles.loadingContent}>
                <div className={styles.loadingSpinner}></div>
                <span>Cargando documento...</span>
              </div>
            </div>
          )
        ) : (
          <div className={styles.noDocument}>
            <div className={styles.noDocumentContent}>
              <span>No hay documentos disponibles para este trámite</span>
            </div>
          </div>
        )}
      </section>

      {/* ===== Actions / Rejection ===== */}
      {showActions &&
          <footer className={styles.footer}>
            {!showRejectionForm ? (
              <div className={styles.actionButtons}>
                <button className={styles.approveBtn} onClick={handleApproveClick}>
                  <span className="pi pi-check"></span>
                  <span>{user?.role === RoleEnum.ARCHIVES_MANAGER ? 'Firmar' : 'Aprobar'}</span>
                </button>
                {!(user?.role === RoleEnum.ARCHIVES_MANAGER) && (
                    <button className={styles.rejectBtn} onClick={handleRejectClick}>
                        <span className="pi pi-times"></span>
                        <span>Rechazar</span>
                    </button>)}
              </div>
            ) : (
              <div className={styles.rejectionForm}>
                <h4 className={styles.rejectionTitle}>Motivos de rechazo</h4>

                {/* Current rejection reasons list */}
                {rejectionReasons.length > 0 && (
                  <div className={styles.reasonsList}>
                    <h5 className={styles.reasonsListTitle}>Motivos seleccionados:</h5>
                    {rejectionReasons.map((reason, index) => (
                      <div key={index} className={styles.reasonItem}>
                        <span className={styles.reasonText}>{reason}</span>
                        <button
                          type="button"
                          className={styles.removeReasonBtn}
                          onClick={() => removeReason(index)}
                          aria-label={`Eliminar motivo: ${reason}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Common rejection reasons */}
                <div className={styles.commonReasons}>
                  <h5 className={styles.commonReasonsTitle}>Motivos comunes:</h5>
                  <div className={styles.commonReasonsGrid}>
                    {COMMON_REJECTION_REASONS.map((reason, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`${styles.commonReasonBtn} ${
                          rejectionReasons.includes(reason) ? styles.selected : ''
                        }`}
                        onClick={() => addCommonReason(reason)}
                        disabled={rejectionReasons.includes(reason)}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom reason input */}
                <div className={styles.customReasonSection}>
                  <h5 className={styles.customReasonTitle}>Agregar motivo personalizado:</h5>
                  <div className={styles.customReasonInput}>
                <textarea
                  value={currentReason}
                  onChange={(e) => setCurrentReason(e.target.value)}
                  placeholder="Escriba un motivo personalizado..."
                  rows={2}
                  className={styles.rejectionTextarea}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addReason(currentReason);
                    }
                  }}
                />
                    <button
                      type="button"
                      className={styles.addReasonBtn}
                      onClick={() => addReason(currentReason)}
                      disabled={!currentReason.trim()}
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Form buttons */}
                <div className={styles.formButtons}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    disabled={isReviewing}
                    onClick={() => {
                      setShowRejectionForm(false);
                      setRejectionReasons([]);
                      setCurrentReason('');
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={styles.submitBtn}
                    disabled={rejectionReasons.length === 0 || isReviewing}
                    onClick={handleRejectSubmit}
                  >
                    Enviar ({rejectionReasons.length} motivo{rejectionReasons.length !== 1 ? 's' : ''})
                  </button>
                </div>

                {/* Add loading overlay/spinner if needed */}
                {isReviewing && (
                  <div className={styles.loadingOverlay}>
                    <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8"
                                     fill="var(--surface-ground)"
                                     animationDuration=".5s"/>
                    <p>Procesando revisión...</p>
                  </div>
                )}
              </div>
            )}
          </footer>
      }
      {!showActions && selectedProcedure.workflowSteps[0].rejectionReasons?.length > 0 &&
          <footer className={styles.rejectionFooter}>
              <div className={styles.rejectionHeader}>
                  <i className="pi pi-exclamation-triangle" style={{color: '#e74c3c'}}></i>
                  <span className={styles.rejectionTitle}>Razones de Rechazo</span>
              </div>
              <div className={styles.rejectionList}>
                {selectedProcedure.workflowSteps[0].rejectionReasons.map((reason, index) => (
                  <div key={index} className={styles.rejectionItem}>
                    <div className={styles.rejectionBullet}>
                      <i className="pi pi-times-circle"></i>
                    </div>
                    <div className={styles.rejectionContent}>
                      <span className={styles.reasonText}>{reason}</span>
                    </div>
                  </div>
                ))}
              </div>
          </footer>
      }
      {
        !showActions &&
        selectedProcedure.status === ProcedureStatusEnum.COMPLETED &&
        (user?.role === RoleEnum.ADMINISTRATOR || user?.role === RoleEnum.ARCHIVES_MANAGER) && (
          <footer className={styles.singleSignature}>
            <div className={styles.signatureHeader}>
              <div className={styles.signatureIcon}>📋</div>
              <div>
                <div className={styles.signatureSubtitle}>Autorizado por</div>
                <h4 className={styles.signatureRole}>Jefe de Archivos</h4>
              </div>
            </div>

            <div className={styles.signatureMessage}>
              ✅ Este trámite ha sido firmado digitalmente por el jefe de archivos
            </div>

            <div className={styles.signatureFooter}>
              <div className={styles.signatureDate}>
                <span className={styles.dateIcon}>🕒</span>
                Firmado el {formatDateTime(selectedProcedure.updatedAt)}
              </div>
            </div>
          </footer>
        )
      }
    </div>
  );
}

export default DocumentPreview;
