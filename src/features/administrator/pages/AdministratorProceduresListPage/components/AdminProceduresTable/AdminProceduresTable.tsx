import {useEffect, useState} from "react";
import {ProcedureResponse} from "../../../../../../types/ProcedureResponse.interface.ts";
import "./AdminProceduresTable.css"
import {WorkflowReviewRequest} from "../../../../../../types/WorkflowReviewRequest.interface.ts";
import {WorkflowStepStatusEnum} from "../../../../../../types/enum/WorkflowStepStatus.enum.ts";

interface AdminProceduresTableProps {
  procedures: ProcedureResponse[];
  onReview?: (workflowReviewRequest: WorkflowReviewRequest) => void;
}

function AdminProceduresTable({procedures, onReview}: AdminProceduresTableProps) {
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureResponse | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectionForm, setShowRejectionForm] = useState<boolean>(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const handleApproveClick = () => {
    if (selectedProcedure && onReview) {
      onReview({
        workflowStepId: selectedProcedure.workflowSteps[selectedProcedure.workflowSteps.length - 1].id,
        decision: WorkflowStepStatusEnum.APPROVED,
        notes: 'admin first approve'
      });
    }
  };

  const handleRejectClick = () => {
    setShowRejectionForm(true);
  };

  const handleRejectSubmit = () => {
    if (selectedProcedure && onReview && rejectionReason.trim()) {
      onReview({
        workflowStepId: selectedProcedure.workflowSteps[selectedProcedure.workflowSteps.length - 1].id,
        decision: WorkflowStepStatusEnum.REJECTED,
        notes: 'admin rejected',
        rejectionReasons: [rejectionReason]
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return `${date.getDate()} de ${getMonthName(date.getMonth())} de ${date.getFullYear()}`;
  };

  const getMonthName = (monthIndex: number) => {
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return months[monthIndex];
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <div className="status-completed">
            <span className="status-icon">●</span> Completado
          </div>
        );
      case "REJECTED":
        return (
          <div className="status-rejected">
            <span className="status-icon">✕</span> Rechazado
          </div>
        );
      case "ADMIN_REVIEW":
        return (
          <div className="status-review">
            <span className="status-icon">⟳</span> En revisión
          </div>
        );
      case "ARCHIVES_REVIEW":
        return (
          <div className="status-review">
            <span className="status-icon">⟳</span> Revisión de archivos
          </div>
        );
      case "SECRETARY_REVIEW":
        return (
          <div className="status-review">
            <span className="status-icon">⟳</span> Revisión de secretaría
          </div>
        );
      case "ADMIN_FINAL_REVIEW":
        return (
          <div className="status-review">
            <span className="status-icon">⟳</span> Revisión final
          </div>
        );
      case "PENDING":
        return (
          <div className="status-pending">
            <span className="status-icon">⌛</span> Pendiente
          </div>
        );
      default:
        return <div>{status}</div>;
    }
  };

  const getSendDate = (procedure: ProcedureResponse) => {
    // Get the startedAt date from the last workflow step
    if (procedure.workflowSteps && procedure.workflowSteps.length > 0) {
      // Find the latest workflow step with a startedAt date
      const latestStep = [...procedure.workflowSteps]
        .filter(step => step.startedAt)
        .sort((a, b) => {
          if (!a.startedAt || !b.startedAt) return 0;
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
        })[0];

      return latestStep?.startedAt || procedure.createdAt;
    }

    return procedure.createdAt;
  };

  // Function to handle document preview
  // const getDocumentPreviewUrl = (documentId: string) => {
  //   return `http://localhost:3000/api/v1/document/${documentId}`;
  // };



  return (
    <div className="admin-procedures-container">
      <div className="admin-procedures-table-container">
        <table className="procedures-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Trámite</th>
            <th>Apellido</th>
            <th>Segundo Apellido</th>
            <th>Nombre</th>
            <th>Fecha de envío</th>
            <th>Estado</th>
          </tr>
          </thead>
          <tbody>
          {procedures.map((procedure) => (
            <tr
              key={procedure.id}
              className={`procedure-row ${selectedProcedure?.id === procedure.id ? 'selected' : ''}`}
              onClick={() => setSelectedProcedure(procedure)}
            >
              <td>{procedure.id}</td>
              <td>{procedure.procedureTypeName}</td>
              <td>{procedure.user.lastName}</td>
              <td>{procedure.user.secondLastName || '-'}</td>
              <td>{procedure.user.firstName}</td>
              <td>{formatDate(getSendDate(procedure))}</td>
              <td>{getStatusDisplay(procedure.status)}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {selectedProcedure && (
        <div className="document-preview-container">
          <div className="preview-header">
            <h3>Vista previa del documento</h3>
            <div className="applicant-info">
              <p>
                <strong>Solicitante:</strong> {selectedProcedure.user.firstName}{" "}
                {selectedProcedure.user.lastName}{" "}
                {selectedProcedure.user.secondLastName || ""}
              </p>
              <p>
                <strong>Email:</strong> {selectedProcedure.user.email}
              </p>
            </div>
          </div>

          <div className="document-viewer">
            {selectedProcedure.documents.length > 0 ? (
              pdfBlobUrl ? (
                // Use a React Fragment (<>...</>) to group multiple elements
                <>
                  {/* --- Added Control Section --- */}
                  <div className="viewer-controls" style={{marginBottom: '10px'}}>
                    <a
                      href={pdfBlobUrl}
                      target="_blank" // Opens the link in a new tab/window
                      rel="noopener noreferrer" // Security best practice for target="_blank"
                      className="open-new-window-link" // Optional: for styling the link
                      style={{ /* Add any inline styles or use CSS */}}
                    >
                      Abrir en nueva ventana {/* Or "Open in New Window" */}
                    </a>
                    {/* You could add other controls here later (e.g., download) */}
                  </div>
                  {/* --- End of Added Control Section --- */}

                  <iframe
                    src={pdfBlobUrl}
                    title="PDF Preview"
                    width="100%"
                    height="600px" // Consider making height dynamic or responsive
                    className="pdf-viewer"
                  />
                </>
              ) : (
                <div className="loading-pdf">Cargando documento...</div>
              )
            ) : (
              <div className="no-document">
                <p>No hay documentos disponibles para este trámite</p>
              </div>
            )}
          </div>

          {!showRejectionForm ? (
            <div className="action-buttons">
              <button
                className="approve-btn"
                onClick={handleApproveClick}
              >
                Aprobar
              </button>
              <button
                className="reject-btn"
                onClick={handleRejectClick}
              >
                Rechazar
              </button>
            </div>
          ) : (
            <div className="rejection-form">
              <h4>Motivo de rechazo</h4>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Describa el motivo de rechazo..."
                rows={4}
                className="rejection-textarea"
              />
              <div className="form-buttons">
                <button
                  className="submit-btn"
                  onClick={handleRejectSubmit}
                  disabled={!rejectionReason.trim()}
                >
                  Enviar
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowRejectionForm(false);
                    setRejectionReason("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProceduresTable;
