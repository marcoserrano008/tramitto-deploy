import AdminProceduresTable from "./components/AdminProceduresTable/AdminProceduresTable.tsx";
import {useFetchProcedures} from "../../hooks/useFetchProcedures.ts";
import {useReviewProcedure} from "../../hooks/useReviewProcedure.ts";
import {WorkflowStepNameEnum} from "../../../../types/enum/WorkflowStepName.enum.ts";
import {useEffect, useState} from "react";
import DocumentPreview from "./components/DocumentPreview/DocumentPreview.tsx";
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import './AdministratorProceduresListPage.scss';
import {Splitter, SplitterPanel} from "primereact/splitter";
import styles from './AdministratorProceduresListPage.module.scss';
import {ProcedureTypeEnum} from "../../../../types/enum/ProcedureType.enum.ts";
import {Calendar} from "primereact/calendar";
import {InputSwitch, InputSwitchChangeEvent} from "primereact/inputswitch";
import {useParams} from "react-router-dom";
import {urlToProcedureEnum} from "../../../../types/urlToProcedureEnum.ts";
import {useProcedureTypeData} from "../../../applicant/hooks/useProcedureTypeData.ts";
import {useToast} from "../../../../context/ToastContext.tsx";
import { ProgressSpinner } from 'primereact/progressspinner';

function AdministratorProceduresListPage() {
  const {showSuccess} = useToast();
  const {procedureType} = useParams<{ procedureType: string }>();
  const procedureTypeEnum: ProcedureTypeEnum | undefined = procedureType ? urlToProcedureEnum[procedureType] : undefined;
  const {procedure} = useProcedureTypeData(procedureTypeEnum as ProcedureTypeEnum);

  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureResponse | null>(null);
  const [dates, setDates] = useState(undefined)
  const [isFilteredByDate, setIsFilteredByDate] = useState<boolean>(false);

  const {
    procedures,
    loading: loadingProcedures,
    error: fetchError,
    refetch: refetchProcedures,
  } = useFetchProcedures(WorkflowStepNameEnum.ADMIN_REVIEW, procedureTypeEnum!);

  const {handleReview, isReviewing, reviewError} = useReviewProcedure({
    onSuccess: () => {
      refetchProcedures();
      setSelectedProcedure(null);
      showSuccess('Revision', 'Completada');
    }
  });

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
          <SplitterPanel className={styles.proceduresListSplitterLeft} size={60} minSize={30}>
            <section className={styles.filterListContainer}>
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
              showProcedureColumn={false}
            />
          </SplitterPanel>

          <SplitterPanel className={styles.proceduresListSlitterRight} size={40} minSize={30}>
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

export default AdministratorProceduresListPage;
