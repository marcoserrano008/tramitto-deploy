import {useEffect, useMemo, useState} from "react";
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import styles from "../AdministratorProceduresListPage/AdministratorProceduresListPage.module.scss";
import {Splitter, SplitterPanel} from "primereact/splitter";
import {Dropdown} from "primereact/dropdown";
import {InputSwitch, InputSwitchChangeEvent} from "primereact/inputswitch";
import {Calendar} from "primereact/calendar";
import AdminProceduresTable
  from "../AdministratorProceduresListPage/components/AdminProceduresTable/AdminProceduresTable.tsx";
import DocumentPreview from "../AdministratorProceduresListPage/components/DocumentPreview/DocumentPreview.tsx";
import {ProcedureStatusEnum} from "../../../../types/enum/ProcedureStatus.enum.ts";
import {getAdminProceduresService} from "../../../../services/GetAdminProcedures.http.service.ts";
import {PROCEDURE_STATUS_OPTIONS} from "../../../../types/options/ProcedureStatusOptions.ts";

function AdministratorProceduresStatusPage() {
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureResponse | null>(null);
  const [dates, setDates] = useState(undefined)
  const [isFilteredByDate, setIsFilteredByDate] = useState<boolean>(false);

  const procedureStatuses = [
    {name: 'Todos', value: 'ALL'},
    {name: 'Revision Jefe de archivos', value: ProcedureStatusEnum.ARCHIVES_REVIEW},
    {name: 'Completados', value: ProcedureStatusEnum.COMPLETED},
    {name: 'Rechazados', value: ProcedureStatusEnum.REJECTED},
  ];

  type StatusFilter = typeof PROCEDURE_STATUS_OPTIONS[number]['value'];
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('ALL');

  const selectedStatusLabel = useMemo(() => {
    const match = PROCEDURE_STATUS_OPTIONS.find((s) => s.value === selectedStatus);
    return match?.label ?? '';
  }, [selectedStatus]);

  const [procedures, setProcedures] = useState<ProcedureResponse[]>([]);
  const [loadingProcedures, setLoadingProcedures] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoadingProcedures(true);
      setFetchError(null);
      try {
        const data = await getAdminProceduresService.getProcedures(selectedStatus === 'ALL' ? undefined : selectedStatus);
        if (!cancelled) setProcedures(data);
      } catch (e: any) {
        if (!cancelled) setFetchError(e.message ?? 'Error al obtener trámites');
      } finally {
        if (!cancelled) setLoadingProcedures(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [selectedStatus]);

  const handleReview = () => {

  }

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

  return (
    <div className="admin-page">
      <section className={styles.proceduresListHeader}>
        <span className={styles.proceduresListTitle}>Historial de revisión</span>
        <span className={styles.proceduresListSubtitle}>{selectedStatusLabel}</span>
      </section>


      <section className={styles.proceduresListSplitterContainer}>
        <Splitter>
          <SplitterPanel className={styles.proceduresListSplitterLeft} size={70} minSize={30}>

            <section className={styles.filterListContainer}>
              <div className={styles.filterListRow}>
                <div className={styles.filterListField}>
                  <label htmlFor="procedure-type">Tipo de trámite:</label>
                  <Dropdown
                    id="procedure-status"
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.value)
                      setSelectedProcedure(null)
                    }}
                    options={procedureStatuses}
                    optionLabel="name"
                    placeholder="Seleccionar estado"
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
              showUpdatedColumn={true}
            />
          </SplitterPanel>

          <SplitterPanel className={styles.proceduresListSlitterRight} size={30} minSize={30}>
            <DocumentPreview
              selectedProcedure={selectedProcedure}
              onReview={handleReview}
              showActions={false}
            />
          </SplitterPanel>
        </Splitter>
      </section>
    </div>
  );
}

export default AdministratorProceduresStatusPage;
