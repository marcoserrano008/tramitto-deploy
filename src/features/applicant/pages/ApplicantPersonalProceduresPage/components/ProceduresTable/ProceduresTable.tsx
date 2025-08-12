import {useEffect, useRef, useState} from "react";
import {ProcedureResponse} from "../../../../../../types/ProcedureResponse.interface.ts";
import "./ProceduresTable.css";
import {Tag} from "primereact/tag";
import {useNavigate} from "react-router-dom";
import {handlePreview} from "../../../../../../utils/documentActions.ts";
import React from "react";
import styles from "./ProceduresTable.module.scss";

type ProceduresTableProps = {
  procedures: ProcedureResponse[];
  defaultExpandedRows?: number[];
  highlightId?: number;
};

const ProceduresTable: React.FC<ProceduresTableProps> = ({
                                                           procedures,
                                                           defaultExpandedRows = [],
                                                           highlightId,
                                                         }) => {
  //TODO: Change this value to an enum
  const PROCEDURE_TYPE_MAP: Record<number, string> = {
    1: "diploma-bachiller",
    2: "diploma-academico",
    3: "titulo-provision",
  }

  const getProcedureRoute = (procedureTypeId: number): string => PROCEDURE_TYPE_MAP[procedureTypeId] ?? "unknown"

  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    setExpandedRows(defaultExpandedRows);
  }, [defaultExpandedRows]);

  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});
  useEffect(() => {
    if (highlightId && rowRefs.current[highlightId]) {
      rowRefs.current[highlightId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightId, procedures]);

  const toggleRow = (procedureId: number) => {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(procedureId)) {
        return prevExpandedRows.filter((id) => id !== procedureId)
      } else {
        return [...prevExpandedRows, procedureId]
      }
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate()} de ${getMonthName(date.getMonth())} de ${date.getFullYear()}`
  }

  const getMonthName = (monthIndex: number) => {
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ]
    return months[monthIndex]
  }

  const handleUploadNewFile = (procedure: ProcedureResponse) => {
    const procedureRouter = getProcedureRoute(procedure.procedureTypeId)

    navigate(`../informacion-tramite/${procedureRouter}/subir-archivos`, {
      state: { procedureData: procedure },
    })
  }

  const handleSendDocument = (procedure: ProcedureResponse) => {
    const procedureRouter = getProcedureRoute(procedure.procedureTypeId)

    navigate(`../informacion-tramite/${procedureRouter}/subir-archivos`, {
      state: { procedureData: procedure },
    })
  }

  const handlePaymentCheck = (procedure: ProcedureResponse) => {
    const url: string  = `https://cajas.dev.umss.edu.bo/comprobante/${procedure.payment.transactionId}`;
    window.open(url, '_blank');
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
        return <div>{procedure.status}</div>
    }
  }

  const getExpandedContent = (procedure: ProcedureResponse) => {
    switch (procedure.status) {
      case "COMPLETED": {
        const documentId: string | undefined = procedure.documents.at(-1)?.documentId

        return (
          <div className={styles.expandedContent}>
            <div className={styles.documentInfo}>
              Diploma de Bachiller legalizado el{" "}
              {formatDate(procedure.workflowSteps[0]?.completedAt || procedure.createdAt)}
            </div>
            <button
              className={`${styles.button} ${styles.downloadBtn}`}
              onClick={() => documentId && handlePreview(documentId)}
            >
              Descargar Documento
            </button>

          </div>
        )
      }

      case "REJECTED": {
        const lastStep = procedure.workflowSteps[procedure.workflowSteps.length - 1]
        const documentId: string | undefined = procedure.documents.at(-1)?.documentId

        return (
          <div className={styles.expandedContent}>
            <div className={styles.rejectionReason}>
              <strong>Motivo de rechazo:</strong>
              <ul className={styles.rejectionList}>
                {lastStep?.rejectionReasons?.map((reason, index) => <li key={index}>{reason}</li>) || (
                  <li>No se especificó un motivo</li>
                )}
              </ul>
            </div>
            <div className={styles.actionButtons}>
              <button
                className={`${styles.button} ${styles.viewBtn}`}
                onClick={() => documentId && handlePreview(documentId)}
              >
                Abrir Documento
              </button>
              <button className={`${styles.button} ${styles.uploadBtn}`} onClick={() => handleUploadNewFile(procedure)}>
                Subir nuevo archivo
              </button>
              <button
                className={`${styles.button} ${styles.paymentBtn}`}
                onClick={() => handlePaymentCheck(procedure)}
              >
                Descargar Comprobante de pago
              </button>
            </div>
          </div>
        )
      }

      case "ADMIN_REVIEW":
      case "ARCHIVES_REVIEW":
      case "SECRETARY_REVIEW":
      case "ADMIN_FINAL_REVIEW": {
        const documentId: string | undefined = procedure.documents.at(-1)?.documentId

        return (
          <div className={styles.expandedContent}>
            <button
              className={`${styles.button} ${styles.viewBtn}`}
              onClick={() => documentId && handlePreview(documentId)}
            >
              Abrir Documento
            </button>
            <button
              className={`${styles.button} ${styles.paymentBtn}`}
              onClick={() => handlePaymentCheck(procedure)}
            >
              Descargar Comprobante de pago
            </button>
          </div>
        )
      }

      case "DRAFT": {
        return (
          <div className={styles.expandedContent}>
            <div className={styles.actionButtons}>
              <button className={`${styles.button} ${styles.uploadBtn}`} onClick={() => handleSendDocument(procedure)}>
                Enviar Documento
              </button>
              <button
                className={`${styles.button} ${styles.paymentBtn}`}
                onClick={() => handlePaymentCheck(procedure)}
              >
                Descargar Comprobante de pago
              </button>
            </div>
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className={styles.proceduresTableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.proceduresTable}>
          <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>Código</th>
            <th className={styles.headerCell}>Trámite</th>
            <th className={styles.headerCell}>Fecha de inicio</th>
            <th className={styles.headerCell}>Estado</th>
            <th className={styles.headerCell}></th>
          </tr>
          </thead>
          <tbody>
          {procedures.map((procedure: ProcedureResponse) => (
            <React.Fragment key={procedure.id}>
              <tr
                ref={el => (rowRefs.current[procedure.id] = el)}
                className={`${styles.procedureRow} ${
                  procedure.status === 'REJECTED' ? styles.rejected : ''
                } ${expandedRows.includes(procedure.id) ? styles.expanded : ''} ${
                  highlightId === procedure.id ? styles.highlight : ''
                }`}
                onClick={() => toggleRow(procedure.id)}
              >
                <td className={styles.cell}>{`TR-${procedure.id}`}</td>
                <td className={styles.cell}>{procedure.procedureTypeName}</td>
                <td className={styles.cell}>{formatDate(procedure.createdAt)}</td>
                <td className={styles.cell}>{getStatusDisplay(procedure)}</td>
                <td className={styles.cell}>
              <span className={styles.expandIcon}>
                {expandedRows.includes(procedure.id) ? '▲' : '▼'}
              </span>
                </td>
              </tr>
              {expandedRows.includes(procedure.id) && (
                <tr className={styles.expandedRow}>
                  <td colSpan={5} className={styles.expandedCell}>
                    {getExpandedContent(procedure)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProceduresTable
