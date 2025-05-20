import styles from './ProceduresHeader.module.scss';
import {Tag} from "primereact/tag";
import React from "react";

interface User {
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
}

interface CreatedProcedure {
  id?: number | string;
  createdAt?: string;   // ISO 8601
  status?: string;
}

interface Procedure {
  name?: string;
}

interface ProceduresHeaderProps {
  procedure: Procedure;
  createdProcedure: CreatedProcedure;
  user: User;
}

const ProceduresHeader: React.FC<ProceduresHeaderProps> = ({procedure, createdProcedure, user,}) => {
  const formattedDate = createdProcedure?.createdAt ? new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(createdProcedure.createdAt)) : '';

  return (
    <section className={styles.proceduresListHeader}>
      <span className={styles.proceduresListTitle}>{procedure?.name}</span>

      <section className={styles.headerColumns}>
        <section className={styles.headerColumn}>
          <section className={styles.headerRow}>
            <label className={styles.headerLabel}>Código de trámite:</label>
            <span className={styles.headerContent}>TR-{createdProcedure?.id}</span>
          </section>

          <section className={styles.headerRow}>
            <label className={styles.headerLabel}>Fecha de inicio:</label>
            <span className={styles.headerContent}>{formattedDate}</span>
          </section>
        </section>

        <section className={styles.headerColumn}>
          <section className={styles.headerRow}>
            <label className={styles.headerLabel}>Usuario:</label>
            <span className={styles.headerContent}>
              {user?.firstName} {user?.lastName} {user?.secondLastName}
            </span>
          </section>

          <section className={styles.headerRow}>
            <label className={styles.headerLabel}>Estado del trámite:</label>
            <Tag className={styles.headerTag} severity="info" icon="pi pi-exclamation-triangle" value="No enviado"></Tag>          </section>
        </section>
      </section>
    </section>
  );
};

export default ProceduresHeader;