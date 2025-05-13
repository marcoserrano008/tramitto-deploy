import React, {useState} from "react";
import {ProcedureResponse} from "../../../../../../types/ProcedureResponse.interface.ts";
import "./ProceduresTable.css";
import {Tag} from "primereact/tag";
import {useNavigate} from "react-router-dom";

interface ProceduresTableProps {
  procedures: ProcedureResponse[];
}

function ProceduresTable({procedures}: ProceduresTableProps) {

  //TODO: Change this value to an enum
  const PROCEDURE_TYPE_MAP: Record<string, string> = {
    'legalizacion diploma de bachiller 5': 'diploma-bachiller',
    'legalizacion diploma academico': 'diploma-academico',
    'legalizacion titulo en provision nacional': 'titulo-provision',
  };

  const getProcedureRoute = (name: string): string => PROCEDURE_TYPE_MAP[name.toLowerCase().trim()] ?? 'unknown';

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
    const procedureRouter = getProcedureRoute(procedure.procedureTypeName);

    navigate(`../procedure-information/${procedureRouter}/upload-document`, {
      state: { procedureData: procedure }
    });
  };

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
      default:
        return <div>{procedure.status}</div>;
    }
  };

  const getExpandedContent = (procedure: ProcedureResponse) => {
    switch (procedure.status) {
      case "COMPLETED":
        return (
          <div className="expanded-content">
            <div className="document-info">
              Diploma de Bachiller legalizado el{" "}
              {formatDate(procedure.workflowSteps[0]?.completedAt || procedure.createdAt)}
            </div>
            <button className="download-btn">Descargar PDF</button>
          </div>
        );

      case "REJECTED": { // <--- Add opening brace here
        // Now these declarations are scoped only to this case block
        const lastStep = procedure.workflowSteps[procedure.workflowSteps.length - 1];
        // const lastDocument = procedure.documents[procedure.documents.length - 1]; // You weren't using this, maybe remove?

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
              <button className="view-btn">Visualizar documento</button>
              <button className="upload-btn" onClick={() => handleUploadNewFile(procedure)}>Subir nuevo archivo</button>
            </div>
          </div>
        );
      } // <--- Add closing brace here

      case "ADMIN_REVIEW":
        return (
          <div className="expanded-content">
            <button className="view-btn">Visualizar documento</button>
          </div>
        );

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
