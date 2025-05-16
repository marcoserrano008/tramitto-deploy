import AdminProceduresTable from "./components/AdminProceduresTable/AdminProceduresTable.tsx";
import {useFetchProcedures} from "../../hooks/useFetchProcedures.ts";
import {useReviewProcedure} from "../../hooks/useReviewProcedure.ts";
import {WorkflowStepNameEnum} from "../../../../types/enum/WorkflowStepName.enum.ts";
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import DocumentPreview from "./components/DocumentPreview/DocumentPreview.tsx";
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import './AdministratorProceduresListPage.scss';
import {Splitter, SplitterPanel} from "primereact/splitter";
import styles from './AdministratorProceduresListPage.module.scss';
import {ProcedureTypeEnum} from "../../../../types/enum/ProcedureType.enum.ts";
import {Calendar} from "primereact/calendar";
import {InputSwitch, InputSwitchChangeEvent} from "primereact/inputswitch";

function AdministratorProceduresListPage() {
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<WorkflowStepNameEnum>(WorkflowStepNameEnum.ADMIN_REVIEW);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureResponse | null>(null);
  const [dates, setDates] = useState(undefined)
  const [isFilteredByDate, setIsFilteredByDate] = useState<boolean>(false);

  const workflowStepOptions = [
    {name: 'Primera Revision', value: WorkflowStepNameEnum.ADMIN_REVIEW},
    {name: 'Revision Final', value: WorkflowStepNameEnum.ADMIN_FINAL_REVIEW}
  ];

  const procedureTypes = [
    {name: 'Todos', value: ProcedureTypeEnum.ALL},
    {name: 'Diploma de bachiller', value: ProcedureTypeEnum.HIGH_SCHOOL_DIPLOMA},
    {name: 'Diploma Académico', value: ProcedureTypeEnum.HIGH_SCHOOL_DIPLOMA},
    {name: 'Titulo en Provisión Nacional', value: ProcedureTypeEnum.NATIONAL_PROVISION_DEGREE}
  ];

  const [selectedProcedureType, setSelectedProcedureType] = useState<ProcedureTypeEnum>(ProcedureTypeEnum.ALL);

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
  };

  const handleProcedureSelect = (procedure: ProcedureResponse) => {
    setSelectedProcedure(procedure);
  };

  useEffect(() => {
    if (!isFilteredByDate) setDates(undefined);
  }, [isFilteredByDate]);


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
      <section className={styles.proceduresListHeader}>
        <span className={styles.proceduresListTitle}>Tramites</span>
        <span className={styles.proceduresListSubtitle}>Legalizaciones</span>
      </section>


      <section className={styles.proceduresListSplitterContainer}>
        {isReviewing && (
          <div className="loading-spinner">Procesando revisión...</div>
        )}

        {procedures.length === 0 ? (
          <p>No hay trámites pendientes de revisión...</p>
        ) : (
          <Splitter>
            <SplitterPanel className={styles.proceduresListSplitterLeft} size={70} minSize={30}>

              <section className={styles.filterListContainer}>
                <div className={styles.filterListRow}>
                  <div className={styles.filterListField}>
                    <label htmlFor="workflow-step">Tipo de revisión:</label>
                    <Dropdown
                      id="workflow-step"
                      value={selectedWorkflowStep}
                      onChange={handleWorkflowStepChange}
                      options={workflowStepOptions}
                      optionLabel="name"
                      placeholder="Seleccionar tipo de revisión"
                    />
                  </div>

                  <div className={styles.filterListField}>
                    <label htmlFor="procedure-type">Tipo de trámite:</label>
                    <Dropdown
                      id="procedure-type"
                      value={selectedProcedureType}
                      onChange={(e) => setSelectedProcedureType(e.value)}
                      options={procedureTypes}
                      optionLabel="name"
                      placeholder="Seleccionar tipo de trámite"
                    />
                  </div>
                </div>

                <div className={styles.filterListRow}>
                  <div className={styles.filterListSwitchField}>
                    <label htmlFor="date-filter-switch">Filtrar por fecha</label>
                    <InputSwitch
                      id="date-filter-switch"
                      checked={isFilteredByDate}
                      onChange={(e: InputSwitchChangeEvent) => setIsFilteredByDate(e.value)}
                    />
                  </div>

                  <div className={styles.filterListCalendarField}>
                    <label htmlFor="date-filter">Seleccionar periodo:</label>
                    <Calendar
                      id="date-filter"
                      value={dates}
                      onChange={(e) => setDates(e.value)}
                      selectionMode="range"
                      readOnlyInput
                      hideOnRangeSelection
                      showIcon
                      /* ←-- disables the Calendar and grey-out styles */
                      disabled={!isFilteredByDate}
                    />
                  </div>
                </div>
              </section>


              <AdminProceduresTable
                procedures={procedures}
                onProcedureSelect={handleProcedureSelect}
                selectedProcedureId={selectedProcedure?.id || null}
              />
            </SplitterPanel>

            <SplitterPanel className={styles.proceduresListSlitterRight} size={30} minSize={30}>
              <DocumentPreview
                selectedProcedure={selectedProcedure}
                onReview={handleReview}
              />
            </SplitterPanel>
          </Splitter>
        )}


      </section>

    </div>
  );
}

export default AdministratorProceduresListPage;
