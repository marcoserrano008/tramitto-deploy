import AdminProceduresTable from "./components/AdminProceduresTable/AdminProceduresTable.tsx";
import {useFetchProcedures} from "../../hooks/useFetchProcedures.ts";
import {useReviewProcedure} from "../../hooks/useReviewProcedure.ts";
import {WorkflowStepNameEnum} from "../../../../types/enum/WorkflowStepName.enum.ts";
import {useState} from "react";
import {Dropdown} from "primereact/dropdown";

function AdministratorProceduresListPage() {
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<WorkflowStepNameEnum>(WorkflowStepNameEnum.ADMIN_REVIEW);

  const workflowStepOptions = [
    {name: 'Primera Revision', value: WorkflowStepNameEnum.ADMIN_REVIEW},
    {name: 'Revision Final', value: WorkflowStepNameEnum.ADMIN_FINAL_REVIEW}
  ];

  const {
    procedures,
    loading: loadingProcedures,
    error: fetchError,
    refetch: refetchProcedures,
  } = useFetchProcedures(selectedWorkflowStep);

  const {
    handleReview,
    isReviewing,
    reviewError,
  } = useReviewProcedure({onSuccess: refetchProcedures});

  const handleWorkflowStepChange = (event: any) => {
    setSelectedWorkflowStep(event.value);
    // The hook will automatically refetch when the dependency changes
  };

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

      <div className="workflow-selector">
        <label htmlFor="workflow-step">Tipo de revisión: </label>
        <Dropdown
          id="workflow-step"
          value={selectedWorkflowStep}
          onChange={handleWorkflowStepChange}
          options={workflowStepOptions}
          optionLabel="name"
          placeholder="Seleccionar tipo de revisión"
          className="w-full md:w-20rem"
        />
      </div>

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

export default AdministratorProceduresListPage;
