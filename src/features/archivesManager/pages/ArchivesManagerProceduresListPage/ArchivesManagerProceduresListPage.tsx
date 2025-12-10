import {useFetchProcedures} from "../../../administrator/hooks/useFetchProcedures.ts";
import {WorkflowStepNameEnum} from "../../../../types/enum/WorkflowStepName.enum.ts";
import {useReviewProcedure} from "../../../administrator/hooks/useReviewProcedure.ts";
import AdminProceduresTable
  from "../../../administrator/pages/AdministratorProceduresListPage/components/AdminProceduresTable/AdminProceduresTable.tsx";
import styles
  from "../../../administrator/pages/AdministratorProceduresListPage/AdministratorProceduresListPage.module.scss";
import {Splitter, SplitterPanel} from "primereact/splitter";
import {Dropdown} from "primereact/dropdown";
import {InputSwitch, InputSwitchChangeEvent} from "primereact/inputswitch";
import {Calendar} from "primereact/calendar";
import DocumentPreview
  from "../../../administrator/pages/AdministratorProceduresListPage/components/DocumentPreview/DocumentPreview.tsx";
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import {useEffect, useState} from "react";
import {ProcedureTypeEnum} from "../../../../types/enum/ProcedureType.enum.ts";
import {useParams} from "react-router-dom";
import {urlToProcedureEnum} from "../../../../types/urlToProcedureEnum.ts";
import '../../../administrator/pages/AdministratorProceduresListPage/AdministratorProceduresListPage.scss';
import {ProgressSpinner} from "primereact/progressspinner";
import {useToast} from "../../../../context/ToastContext.tsx";
import {useProcedureTypeData} from "../../../applicant/hooks/useProcedureTypeData.ts";

type DateRangeValue = (Date | null)[] | null | undefined;

const ArchivesManagerProceduresListPage = () => {
  const {showSuccess} = useToast();
  const {procedureType} = useParams<{ procedureType: string }>();
  const procedureTypeEnum: ProcedureTypeEnum | undefined = procedureType ? urlToProcedureEnum[procedureType] : undefined;
  const {procedure} = useProcedureTypeData(procedureTypeEnum as ProcedureTypeEnum);

  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<WorkflowStepNameEnum>(WorkflowStepNameEnum.ARCHIVES_REVIEW);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureResponse | null>(null);
  const [dates, setDates] = useState<DateRangeValue>(undefined);
  const [isFilteredByDate, setIsFilteredByDate] = useState<boolean>(false);

  const {
    procedures,
    loading: loadingProcedures,
    error: fetchError,
    refetch: refetchProcedures,
  } = useFetchProcedures(WorkflowStepNameEnum.ARCHIVES_REVIEW, procedureTypeEnum!);

  const {handleReview, isReviewing, reviewError} = useReviewProcedure({
    onSuccess: () => {
      refetchProcedures();
      setSelectedProcedure(null);
      showSuccess('Revision', 'Completada');
    }
  });

  const handleWorkflowStepChange = (event: any) => {
    setSelectedWorkflowStep(event.value);
  };

  const handleProcedureSelect = (procedure: ProcedureResponse) => {
    setSelectedProcedure(procedure);
  };

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
        <span className={styles.proceduresListTitle}>Trámites</span>
        <span className={styles.proceduresListSubtitle}>{procedure?.name}</span>
      </section>


      <section className={styles.proceduresListSplitterContainer}>
        {isReviewing && (
          <div className="review-overlay">
            <div className="review-overlay-content">
              <ProgressSpinner
                style={{width: "30px", height: "30px"}}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
              <span className="review-message">Procesando revisión...</span>
            </div>
          </div>
        )}

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
                    onChange={(e) => setDates(e.value as DateRangeValue)}
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
              showProcedureColumn={true}
            />
          </SplitterPanel>

          <SplitterPanel className={styles.proceduresListSlitterRight} size={30} minSize={30}>
            <DocumentPreview
              selectedProcedure={selectedProcedure}
              onReview={handleReview}
              isReviewing={isReviewing}
              showActions={true}
            />
          </SplitterPanel>
        </Splitter>
      </section>

    </div>
  );
}
export default ArchivesManagerProceduresListPage;
