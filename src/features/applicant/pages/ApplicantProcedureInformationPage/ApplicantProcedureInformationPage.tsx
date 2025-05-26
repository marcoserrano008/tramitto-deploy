import {useNavigate, useParams} from 'react-router-dom';
import styles from './ApplicantProcedureInformationPage.module.scss';
import {ProcedureTypeEnum} from "../../../../types/enum/ProcedureType.enum.ts";
import {useProcedureTypeData} from "../../hooks/useProcedureTypeData.ts";
import {PaymentDetails} from "../../../../types/PaymentDetails.interface.ts";
import {urlToProcedureEnum} from "../../../../types/urlToProcedureEnum.ts";
import {Image} from "primereact/image";
import exampleDiplomaBachiller from "../../../../assets/images/diplomaBachiller.png";

function ApplicantProcedureInformationPage() {
  const {procedureType} = useParams<{ procedureType: string }>();
  const navigate = useNavigate();

  const procedureTypeEnum: ProcedureTypeEnum | undefined = procedureType ? urlToProcedureEnum[procedureType] : undefined;
  const {procedure, loading, error, procedureId} = useProcedureTypeData(procedureTypeEnum as ProcedureTypeEnum);

  const handleStartProcedure = () => {
    const paymentDetails: PaymentDetails = {
      amount: 100,
      currency: 'BOB',
      procedureType: procedureType!,
      procedureName: '',
      procedureId: procedureId!,
    };

    navigate('pagos', {state: {paymentDetails}});
  };

  if (loading) return <div>Loading procedure information...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!procedure) return <div>No procedure information found</div>;

  const stepDescriptions = [
    "Realiza el pago del trámite mediante QR",
    "Sube el documento a ser legalizado escaneado en formato PDF"
  ];

  return (
    <article className={styles.mainContainer}>
      <section className={styles.proceduresListHeader}>
        <span className={styles.proceduresListTitle}>Legalizaciones</span>
        <span className={styles.proceduresListSubtitle}>{procedure.name}</span>
      </section>

      <section className={styles.container}>
        <div className={styles.procedureCard}>
          {/* Left sidebar with steps */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <div className={styles.stepsHeader}>
                <h2 className={styles.stepsHeaderTitle}>Pasos del trámite</h2>
              </div>

              <div className={styles.stepsList}>
                {procedure.steps.map((step, index) => (
                  <div key={index} className={styles.stepItem}>
                    <div className={styles.stepNumberContainer}>
                      <div className={styles.stepNumber}>{index + 1}</div>
                      {index < procedure.steps.length - 1 && <div className={styles.stepConnector}></div>}
                    </div>
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{step}</h3>
                      <p className={styles.stepDescription}>
                        {stepDescriptions[index] || "Sin descripción disponible"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/*<div className={styles.sidebarHelp}>*/}
            {/*  <div className={styles.helpIcon}>*/}
            {/*    <i className="pi pi-question-circle"></i>*/}
            {/*  </div>*/}
            {/*  <div className={styles.helpContent}>*/}
            {/*    <h3 className={styles.helpTitle}>¿Necesitas ayuda?</h3>*/}
            {/*    <p className={styles.helpText}>*/}
            {/*      Si tienes dudas sobre este trámite, puedes contactar a nuestro equipo de soporte.*/}
            {/*    </p>*/}
            {/*    <button className={styles.helpButton}>Contactar soporte</button>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <section className={`${styles.infoSection} ${styles.documentSection}`}>
              <div className={styles.infoContent}>
                <div className={styles.documentExample}>
                  <div className={styles.documentExampleHeader}>
                    {/*<i className="pi pi-info-circle"></i>*/}
                    <h4 className={styles.documentExampleTitle}>Ejemplo de documento</h4>
                  </div>
                  <div className={styles.documentExampleContent}>
                    <div className={styles.documentImageContainer}>
                      <Image src={exampleDiplomaBachiller}
                             alt={`Image sample`} width="220" height="300"
                             preview/>
                    </div>
                    {/*<p className={styles.documentExampleText}>*/}
                    {/*  Tu diploma debe ser legible y mostrar claramente todos los sellos y firmas oficiales.*/}
                    {/*</p>*/}
                  </div>
                </div>
              </div>
            </section>
            <div className={styles.importantNote}>
              <div className={styles.importantHeader}>
                <div className={styles.warningIcon}>⚠️</div>
                <h4 className={styles.importantTitle}>Importante:</h4>
              </div>
              <p className={styles.importantText}>
                Tu documento debe ser legible y mostrar claramente todos los sellos y firmas oficiales.
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className={styles.mainContent}>
            <div className={styles.contentHeader}>
              <div className={styles.contentHeaderIcon}>
                <i className="pi pi-file-pdf"></i>
              </div>
              <h1 className={styles.contentHeaderTitle}>Información del trámite</h1>
            </div>

            <div className={styles.quickInfo}>
              <div className={styles.quickInfoItem}>
                <i className={`${styles.quickInfoIcon} pi pi-calendar-clock`}></i>
                <div>
                  <span className={styles.quickInfoLabel}>Duración</span>
                  <span className={styles.quickInfoValue}>1 día</span>
                </div>
              </div>
              <div className={styles.quickInfoItem}>
                <i className={`${styles.quickInfoIcon} pi pi-money-bill`}></i>
                <div>
                  <span className={styles.quickInfoLabel}>Costo</span>
                  <span className={styles.quickInfoValue}>{procedure.cost} Bs.</span>
                </div>
              </div>
              <div className={styles.quickInfoItem}>
                <i className={`${styles.quickInfoIcon} pi pi-qrcode`}></i>
                <div>
                  <span className={styles.quickInfoLabel}>Pago</span>
                  <span className={styles.quickInfoValue}>Código QR</span>
                </div>
              </div>
            </div>

            {/* Process section */}
            <section className={`${styles.infoSection} ${styles.processSection}`}>
              <div className={styles.infoHeader}>
                <h2 className={styles.infoTitle}>PROCESO</h2>
              </div>
              <div className={styles.infoContent}>
                <div className={styles.processTimeline}>
                  <div className={styles.processStep}>
                    <div className={styles.processStepIcon}>1</div>
                    <div className={styles.processStepContent}>
                      <h4 className={styles.processStepTitle}>Pago</h4>
                      <p className={styles.processStepDescription}>
                        Realiza el pago del trámite mediante código QR por un valor de {procedure.cost}.
                      </p>
                    </div>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepIcon}>2</div>
                    <div className={styles.processStepContent}>
                      <h4 className={styles.processStepTitle}>Carga de documentos</h4>
                      <p className={styles.processStepDescription}>
                        Sube los documentos requeridos en formato digital según las especificaciones.
                      </p>
                    </div>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepIcon}>3</div>
                    <div className={styles.processStepContent}>
                      <h4 className={styles.processStepTitle}>Verificación</h4>
                      <p className={styles.processStepDescription}>
                        Nuestro equipo verificará la autenticidad de los documentos presentados.
                      </p>
                    </div>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepIcon}>4</div>
                    <div className={styles.processStepContent}>
                      <h4 className={styles.processStepTitle}>Legalización</h4>
                      <p className={styles.processStepDescription}>
                        Se procederá a la legalización oficial de tu Diploma de Bachiller.
                      </p>
                    </div>
                  </div>
                  <div className={styles.processStep}>
                    <div className={styles.processStepIcon}>5</div>
                    <div className={styles.processStepContent}>
                      <h4 className={styles.processStepTitle}>Entrega</h4>
                      <p className={styles.processStepDescription}>
                        Recibirás una notificación cuando tu documento legalizado esté disponible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Start button */}
            <div className={styles.startButtonContainer}>
              <div className={styles.startButtonInfo}>
                <p className={styles.startButtonText}>
                  Al iniciar el trámite, aceptas los términos y condiciones del servicio.
                </p>
              </div>
              <button className={styles.startButton} onClick={handleStartProcedure}>
                Empezar trámite
              </button>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}

export default ApplicantProcedureInformationPage;
