import {ProcedureResponse} from "../../../../../../types/ProcedureResponse.interface.ts";
import "./AdminProceduresTable.css"
import styles from "./AdminProceduresTable.module.scss";
import {Paginator} from "primereact/paginator";

interface AdminProceduresTableProps {
  procedures: ProcedureResponse[];
  onProcedureSelect: (procedure: ProcedureResponse) => void;
  selectedProcedureId: number | null;
  showProcedureColumn: boolean;
}

function AdminProceduresTable({
                                procedures,
                                onProcedureSelect,
                                selectedProcedureId,
                                showProcedureColumn = true
                              }: AdminProceduresTableProps) {
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
          <div className={styles.statusCompleted}>
            <span className="status-icon">●</span> Completado
          </div>
        );
      case "REJECTED":
        return (
          <div className={styles.statusRejected}>
            <span className="status-icon">✕</span> Rechazado
          </div>
        );
      case "ADMIN_REVIEW":
      case "ARCHIVES_REVIEW":
      case "SECRETARY_REVIEW":
      case "ADMIN_FINAL_REVIEW":
        return (
          <div className={styles.statusReview}>
            <span className="status-icon">⟳</span> En revisión
          </div>
        );

      case "PENDING":
        return (
          <div className={styles.statusPending}>
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
    <div>
      {procedures.length === 0 ? (
        <p className={styles.noDocumentSelected}>No existen tramites pendientes</p>
      ) : (
        <div className={styles.adminProceduresTableContainer}>
          <table className={styles.proceduresTable}>
            <thead>
            <tr>
              <th>ID</th>
              {showProcedureColumn && <th>Trámite</th>}
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Nombre(s)</th>
              <th>Fecha de recepción</th>
              <th>Estado</th>
            </tr>
            </thead>
            <tbody>
            {procedures.map((procedure) => (
              <tr
                key={procedure.id}
                className={`${styles.procedureRow} ${
                  selectedProcedureId === procedure.id ? styles.selected : ""
                }`}
                onClick={() => onProcedureSelect(procedure)}
              >
                <td>TR-{procedure.id}</td>
                {showProcedureColumn && <td>{procedure.procedureTypeName}</td>}
                <td>{procedure.user.lastName}</td>
                <td>{procedure.user.secondLastName || "-"}</td>
                <td>{procedure.user.firstName}</td>
                <td>{formatDate(getSendDate(procedure))}</td>
                <td>{getStatusDisplay(procedure.status)}</td>
              </tr>
            ))}
            </tbody>
          </table>
          <Paginator first={0} rows={10} totalRecords={10}/>
        </div>
      )}
    </div>
  );
}

export default AdminProceduresTable;


