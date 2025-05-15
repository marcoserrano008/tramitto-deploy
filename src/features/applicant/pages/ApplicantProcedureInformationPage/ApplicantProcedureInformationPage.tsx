import {useNavigate, useParams} from 'react-router-dom';
import styles from './ApplicantProcedureInformationPage.module.scss';
import {Button} from "primereact/button";
import {ProcedureTypeEnum} from "../../../../types/enum/ProcedureType.enum.ts";
import {useProcedureTypeData} from "../../hooks/useProcedureTypeData.ts";
import {PaymentDetails} from "../../../../types/PaymentDetails.interface.ts";

const URL_TO_PROCEDURE_ENUM: Record<string, ProcedureTypeEnum> = {
  'diploma-bachiller': ProcedureTypeEnum.HIGH_SCHOOL_DIPLOMA,
  'diploma-academico': ProcedureTypeEnum.ACADEMIC_DIPLOMA,
  'titulo-provision': ProcedureTypeEnum.NATIONAL_PROVISION_DEGREE
};

function ApplicantProcedureInformationPage() {
  const {procedureType} = useParams<{ procedureType: string }>();
  const navigate = useNavigate();

  const procedureTypeEnum: ProcedureTypeEnum | undefined = procedureType ? URL_TO_PROCEDURE_ENUM[procedureType] : undefined;
  const {procedure, loading, error, procedureId} = useProcedureTypeData(procedureTypeEnum as ProcedureTypeEnum);

  const handleStartProcedure = () => {
    const paymentDetails: PaymentDetails = {
      amount: 100,
      currency: 'BOB',
      procedureType: procedureType!,
      procedureName: '',
      procedureId: procedureId!,
    };

    navigate('payment', {state: {paymentDetails}});
  };

  if (loading) return <div>Loading procedure information...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!procedure) return <div>No procedure information found</div>;

  return (
    <div className={styles.container}>
      <main className={styles.procedureContainer}>
        <section className={styles.procedureTitle}>
          <label>{procedure.name}</label>
        </section>

        <section className={styles.stepsContainer}>
          <label className={styles.stepsTitle}>Pasos del tramite</label>

          <section className={styles.steps}>
            {procedure.steps.map((step: string) => (
              <label>{step}</label>
            ))}
          </section>
        </section>

        <section className={styles.information}>
          <section className={styles.informationDetail}>
            <label className={styles.informationTitle}>REQUISITOS</label>
            <section>
              <ul>
                {procedure.requirements.map((requirement: string) => (
                  <li>{requirement}</li>
                ))}
              </ul>
            </section>
          </section>

          <section className={styles.informationDetail}>
            <label className={styles.informationTitle}>DURACION</label>
            <span>Informacion sobre la duracion</span>
          </section>

          <section className={styles.informationDetail}>
            <label className={styles.informationTitle}>COSTO</label>
            <span>El tramite tiene un costo de {procedure.cost}</span>
          </section>

          <section className={styles.informationDetail}>
            <label className={styles.informationTitle}>METODO DE PAGO</label>
            <span>El pago se realizara por QR</span>
          </section>

          <section className={styles.startButtonContainer}>
            <Button className={styles.startButton} onClick={handleStartProcedure}>Start Procedure</Button>
          </section>

        </section>
      </main>
    </div>
  );
}

export default ApplicantProcedureInformationPage;
