import {useFetchProcedures} from "../../../administrator/hooks/useFetchProcedures.ts";
import {WorkflowStepNameEnum} from "../../../../types/enum/WorkflowStepName.enum.ts";
import {useReviewProcedure} from "../../../administrator/hooks/useReviewProcedure.ts";
import AdminProceduresTable
  from "../../../administrator/pages/AdministratorProceduresListPage/components/AdminProceduresTable/AdminProceduresTable.tsx";

const GeneralSecretaryProceduresListPage = () => {

  const {
    procedures,
    loading: loadingProcedures,
    error: fetchError,
    refetch: refetchProcedures,
  } = useFetchProcedures(WorkflowStepNameEnum.SECRETARY_REVIEW);

  const {
    handleReview,
    isReviewing,
    reviewError,
  } = useReviewProcedure({onSuccess: refetchProcedures});

  if (loadingProcedures) {
    return <div className="loading-spinner">Cargando trámites...</div>;
  }

  if (fetchError) {
    return <div className="error-message">{fetchError}</div>;
  }

  if (reviewError) {
    alert(reviewError);
  }

  return (
    <div className="admin-page">
      <h1>Panel de Administrador</h1>
      <h2>Trámites Pendientes de Revisión</h2>
      {isReviewing && (
        <div className="loading-spinner">Procesando revisión...</div>
      )}
      {procedures.length === 0 ? (
        <p>No hay trámites pendientes de revisión.</p>
      ) : (
        <AdminProceduresTable
          procedures={procedures}
          onReview={handleReview}
        />
      )}
    </div>
  );
}
export default GeneralSecretaryProceduresListPage;