import {useState} from "react";
import {ProcedureResponse} from "../../../../../../types/ProcedureResponse.interface.ts";
import "./ProceduresTable.css";
import {Tag} from "primereact/tag";
import {useNavigate} from "react-router-dom";
import {handlePreview} from "../../../../../../utils/documentActions.ts";
import React from "react";

interface ProceduresTableProps {
  procedures: ProcedureResponse[];
}

function ProceduresTable({procedures}: ProceduresTableProps) {

  //TODO: Change this value to an enum
  const PROCEDURE_TYPE_MAP: Record<number, string> = {
    1: 'diploma-bachiller',
    2: 'diploma-academico',
    3: 'titulo-provision',
  };

  const getProcedureRoute = (procedureTypeId: number): string => PROCEDURE_TYPE_MAP[procedureTypeId] ?? 'unknown';

  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleRow = (procedureId: number) => {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(procedureId)) {
        return prevExpandedRows.filter((id) => id !== procedureId);
      } else {
        return [...prevExpandedRows, procedureId];
      }
    });
  };

  const formatDate = (dateString: string) => {
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

  const handleUploadNewFile = (procedure: ProcedureResponse) => {
    const procedureRouter = getProcedureRoute(procedure.procedureTypeId);

    navigate(`../informacion-tramite/${procedureRouter}/subir-archivos`, {
      state: {procedureData: procedure}
    });
  };

  const handleSendDocument = (procedure: ProcedureResponse) => {
    const procedureRouter = getProcedureRoute(procedure.procedureTypeId);

    navigate(`../informacion-tramite/${procedureRouter}/subir-archivos`, {
      state: {procedureData: procedure}
    });
  }

  const getStatusDisplay = (procedure: ProcedureResponse) => {
    switch (procedure.status) {
      case "COMPLETED":
        return (
          <div className="status-completed">
            <Tag className="mr-2" icon="pi pi-check" severity="success" value="Completado"></Tag>
          </div>
        );
      case "REJECTED":
        return (
          <div className="status-rejected">
            <Tag icon="pi pi-times" severity="danger" value="Rechazado"></Tag>
          </div>
        );
      case "ADMIN_REVIEW":
      case "ARCHIVES_REVIEW":
      case "SECRETARY_REVIEW":
      case "ADMIN_FINAL_REVIEW":
        return (
          <div className="status-review">
            <Tag className="mr-2" icon="pi pi-user" value="En revision"></Tag>
          </div>
        );
      case "PENDING":
        return (
          <div className="status-pending">
            <span className="status-icon">⌛</span> Pendiente
          </div>
        );
      case "DRAFT":
        return (
          <div className="status-pending">
            <Tag className="mr-2" severity="info" icon="pi pi-exclamation-triangle" value="No enviado"></Tag>
          </div>
        );
      default:
        return <div>{procedure.status}</div>;
    }
  };

  const getExpandedContent = (procedure: ProcedureResponse) => {
    switch (procedure.status) {
      case "COMPLETED": {
        const documentId: string | undefined = procedure.documents.at(-1)?.documentId;

        return (
          <div className="expanded-content">
            <div className="document-info">
              Diploma de Bachiller legalizado el{" "}
              {formatDate(procedure.workflowSteps[0]?.completedAt || procedure.createdAt)}
            </div>
            <button className="download-btn" onClick={() => documentId && handlePreview(documentId)}>Abrir Documento
            </button>
          </div>
        );
      }

      case "REJECTED": {
        const lastStep = procedure.workflowSteps[procedure.workflowSteps.length - 1];
        const documentId: string | undefined = procedure.documents.at(-1)?.documentId;

        return (
          <div className="expanded-content">
            <div className="rejection-reason">
              <strong>Motivo de rechazo:</strong>
              <ul>
                {/* Ensure lastStep exists before accessing rejectionReasons */}
                {lastStep?.rejectionReasons?.map((reason, index) => (
                  <li key={index}>{reason}</li>
                )) || <li>No se especificó un motivo</li>}
              </ul>
            </div>
            <div className="action-buttons">
              <button className="view-btn" onClick={() => documentId && handlePreview(documentId)}>Abrir Documento
              </button>
              <button className="upload-btn" onClick={() => handleUploadNewFile(procedure)}>Subir nuevo archivo</button>
            </div>
          </div>
        );
      }

      case "ADMIN_REVIEW":
      case "ARCHIVES_REVIEW":
      case "SECRETARY_REVIEW":
      case "ADMIN_FINAL_REVIEW": {
        const documentId: string | undefined = procedure.documents.at(-1)?.documentId;

        return (
          <div className="expanded-content">
            <button className="view-btn" onClick={() => documentId && handlePreview(documentId)}>Abrir Documento
            </button>
          </div>
        );
      }

      case "DRAFT": {
        return (
          <div className="expanded-content">
            <div className="action-buttons">
              <button className="upload-btn" onClick={() => handleSendDocument(procedure)}>Enviar Documento</button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="procedures-table-container">
      <table className="procedures-table">
        <thead>
        <tr>
          <th>Código</th>
          <th>Trámite</th>
          <th>Fecha de inicio</th>
          <th>Estado</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {procedures.map((procedure: ProcedureResponse) => (
          <React.Fragment key={procedure.id}>
            <tr
              className={
                procedure.status === "REJECTED"
                  ? "procedure-row rejected"
                  : "procedure-row"
              }
              onClick={() => toggleRow(procedure.id)}
            >
              <td>{`TR-${procedure.id}`}</td>
              <td>{procedure.procedureTypeName}</td>
              <td>{formatDate(procedure.createdAt)}</td>
              <td>
                {getStatusDisplay(procedure)}
              </td>
              <td>
                <span className="expand-icon">
                    {expandedRows.includes(procedure.id) ? "▲" : "▼"}
                  </span>
              </td>

            </tr>
            {expandedRows.includes(procedure.id) && (
              <tr className="expanded-row">
                <td colSpan={5}>
                  {getExpandedContent(procedure)}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProceduresTable;
