import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import ProceduresTable from "./components/ProceduresTable/ProceduresTable.tsx";
import {useEffect, useState} from "react";
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

  useEffect(() => {
    const fetchProcedures = async () => {
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
    }

    fetchProcedures();
  }, [auth.user]);


  if (proceduresLoading) {
    return <div>Loading procedures...</div>
  }

  if (procedureError) {
    return <div>Error loading procedures...</div>
  }

  return (
    <div className="applicant-personal-procedures-container">
      <section className={styles.proceduresListHeader}>
        <span className={styles.proceduresListTitle}>Mis tramites</span>
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
