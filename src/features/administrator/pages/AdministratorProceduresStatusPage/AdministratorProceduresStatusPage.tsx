import {ProcedureTypeEnum} from "../../../../types/enum/ProcedureType.enum.ts";
import {useEffect, useMemo, useState} from "react";
import {WorkflowStepNameEnum} from "../../../../types/enum/WorkflowStepName.enum.ts";
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import {useFetchProcedures} from "../../hooks/useFetchProcedures.ts";
import {useReviewProcedure} from "../../hooks/useReviewProcedure.ts";
import styles from "../AdministratorProceduresListPage/AdministratorProceduresListPage.module.scss";
import {Splitter, SplitterPanel} from "primereact/splitter";
import {Dropdown} from "primereact/dropdown";
import {InputSwitch, InputSwitchChangeEvent} from "primereact/inputswitch";
import {Calendar} from "primereact/calendar";
import AdminProceduresTable
  from "../AdministratorProceduresListPage/components/AdminProceduresTable/AdminProceduresTable.tsx";
import DocumentPreview from "../AdministratorProceduresListPage/components/DocumentPreview/DocumentPreview.tsx";
import {PROCEDURE_TYPE_LABEL} from "../../../../types/record/ProcedureTypeLabel.ts";

function AdministratorProceduresStatusPage() {
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<WorkflowStepNameEnum>(WorkflowStepNameEnum.ADMIN_REVIEW);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureResponse | null>(null);
  const [dates, setDates] = useState(undefined)
  const [isFilteredByDate, setIsFilteredByDate] = useState<boolean>(false);

  const procedureTypes = [
    {name: 'Todos los tramites', value: ProcedureTypeEnum.ALL},
    {name: 'Legalización de Diploma de bachiller', value: ProcedureTypeEnum.HIGH_SCHOOL_DIPLOMA},
    {name: 'Legalización de Diploma Académico', value: ProcedureTypeEnum.ACADEMIC_DIPLOMA},
    {name: 'Legalización de Título en Provisión Nacional', value: ProcedureTypeEnum.NATIONAL_PROVISION_DEGREE}
  ];

  const [selectedProcedureType, setSelectedProcedureType] = useState<ProcedureTypeEnum>(ProcedureTypeEnum.ALL);
  const selectedProcedureTypeLabel = useMemo(() => PROCEDURE_TYPE_LABEL[selectedProcedureType], [selectedProcedureType]);

  const {
    procedures,
    loading: loadingProcedures,
    error: fetchError,
    refetch: refetchProcedures,
  } = useFetchProcedures(selectedWorkflowStep, selectedProcedureType);

  const {
    handleReview,
    isReviewing,
    reviewError,
  } = useReviewProcedure({onSuccess: refetchProcedures});

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
        <span className={styles.proceduresListTitle}>Revisión Final</span>
        <span className={styles.proceduresListSubtitle}>{selectedProcedureTypeLabel}</span>
      </section>


      <section className={styles.proceduresListSplitterContainer}>
        {isReviewing && (
          <div className="loading-spinner">Procesando revisión...</div>
        )}

        <Splitter>
          <SplitterPanel className={styles.proceduresListSplitterLeft} size={70} minSize={30}>

            <section className={styles.filterListContainer}>
              <div className={styles.filterListRow}>
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
                    disabled={!isFilteredByDate}
                  />
                </div>
              </div>
            </section>


            <AdminProceduresTable
              procedures={procedures}
              onProcedureSelect={handleProcedureSelect}
              selectedProcedureId={selectedProcedure?.id || null}
              showProcedureColumn={false}
            />
          </SplitterPanel>

          <SplitterPanel className={styles.proceduresListSlitterRight} size={30} minSize={30}>
            <DocumentPreview
              selectedProcedure={selectedProcedure}
              onReview={handleReview}
            />
          </SplitterPanel>
        </Splitter>
      </section>
    </div>
  );
}

export default AdministratorProceduresStatusPage;
