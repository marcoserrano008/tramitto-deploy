import {ProcedureResponse} from "../../../../../../types/ProcedureResponse.interface.ts";
import "./AdminProceduresTable.css"

interface AdminProceduresTableProps {
  procedures: ProcedureResponse[];
  onProcedureSelect: (procedure: ProcedureResponse) => void;
  selectedProcedureId: number | null;
}

function AdminProceduresTable({procedures, onProcedureSelect, selectedProcedureId}: AdminProceduresTableProps) {
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
    if (procedure.workflowSteps && procedure.workflowSteps.length > 0) {
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

  return (
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
            className={`procedure-row ${selectedProcedureId === procedure.id ? 'selected' : ''}`}
            onClick={() => onProcedureSelect(procedure)}
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
  );
}

export default AdminProceduresTable;


