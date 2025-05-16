import { useState, useEffect } from 'react';
import {ProcedureResponse} from "../../../../../../types/ProcedureResponse.interface.ts";
import {WorkflowReviewRequest} from "../../../../../../types/WorkflowReviewRequest.interface.ts";
import {WorkflowStepStatusEnum} from "../../../../../../types/enum/WorkflowStepStatus.enum.ts";
import "../AdminProceduresTable/AdminProceduresTable.css";
import styles from './DocumentPreview.module.scss';


interface DocumentPreviewProps {
  selectedProcedure: ProcedureResponse | null;
  onReview?: (workflowReviewRequest: WorkflowReviewRequest) => void;
}

function DocumentPreview({ selectedProcedure, onReview }: DocumentPreviewProps) {
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectionForm, setShowRejectionForm] = useState<boolean>(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

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
    if (selectedProcedure && onReview && rejectionReason.trim()) {
      onReview({
        workflowStepId:
        selectedProcedure.workflowSteps[selectedProcedure.workflowSteps.length - 1].id,
        decision: WorkflowStepStatusEnum.REJECTED,
        notes: 'admin rejected',
        rejectionReasons: [rejectionReason],
      });
      setShowRejectionForm(false);
      setRejectionReason("");
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
      <footer className={styles.footer}>
        {!showRejectionForm ? (
          <div className={styles.actionButtons}>
            <button className={styles.approveBtn} onClick={handleApproveClick}>
              <span className="pi pi-check"></span>
              <span>Aprobar</span>
            </button>
            <button className={styles.rejectBtn} onClick={handleRejectClick}>
              <span className="pi pi-times"></span>
              <span>Rechazar</span>
            </button>
          </div>
        ) : (
          <div className={styles.rejectionForm}>
            <h4 className={styles.rejectionTitle}>Motivo de rechazo</h4>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Describa el motivo de rechazo..."
              rows={4}
              className={styles.rejectionTextarea}
            />
            <div className={styles.formButtons}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setShowRejectionForm(false);
                  setRejectionReason('');
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.submitBtn}
                disabled={!rejectionReason.trim()}
                onClick={() => rejectionReason.trim() && handleRejectSubmit()}
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}

export default DocumentPreview;
