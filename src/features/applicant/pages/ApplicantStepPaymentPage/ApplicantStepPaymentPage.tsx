import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useProcedurePayment} from "../../hooks/useProcedurePayment.ts";
import React, {useEffect} from "react";
import {PaymentDetails} from "../../../../types/PaymentDetails.interface.ts";
import styles from './ApplicantStepPaymentPage.module.scss';
import {ProcedureTypeEnum} from "../../../../types/enum/ProcedureType.enum.ts";
import {useProcedureTypeData} from "../../hooks/useProcedureTypeData.ts";
import {urlToProcedureEnum} from "../../../../types/urlToProcedureEnum.ts";
import {Steps} from "primereact/steps";
import {MenuItem} from "primereact/menuitem";
import {procedureSteps} from "../../../../types/procedureSteps.ts";
import {useAuth} from "../../../../context/AuthContext.tsx";
import ProceduresHeader from "../../components/ProceduresHeader/ProceduresHeader.tsx";
import {Image} from 'primereact/image';
import generatedQrImage from '../../../../assets/images/qr-payment.png';
import paymentCheckGif from '../../../../assets/images/payment-check.gif';


function ApplicantStepPaymentPage() {
  const {procedureType} = useParams<{ procedureType: string }>();
  const {user} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const procedureTypeEnum: ProcedureTypeEnum | undefined = procedureType ? urlToProcedureEnum[procedureType] : undefined;
  const {procedure, loading, error} = useProcedureTypeData(procedureTypeEnum as ProcedureTypeEnum);

  const items: MenuItem[] = procedureSteps.filter((step) => step.path !== '')
    .map((step) => ({label: step.name}));

  const paymentDetails: PaymentDetails = location.state?.paymentDetails || {
    amount: 0,
    currency: 'BOB',
    procedureType: procedureType || '',
    procedureName: '',
    procedureId: 0
  };

  const {
    createdProcedure,
    creationLoading,
    creationError,
    paymentProcessing,
    paymentSuccess,
    paymentError,
    paymentResponse,
    handlePayment
  } = useProcedurePayment(paymentDetails);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPathEnd = pathSegments[pathSegments.length - 1];
  const currentStepIndex = procedureSteps.findIndex((step: {
    path: string,
    name: string
  }) => step.path === currentPathEnd);
  const stepsActiveIndex = currentStepIndex === 0 ? -1 : currentStepIndex - 1;

  useEffect(() => {
    if (paymentSuccess && paymentResponse) {
      const timer = setTimeout(() => {
        navigate('../subir-archivos', {
          state: {procedureData: paymentResponse}
        });
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, paymentResponse, navigate]);

  if (creationLoading) {
    return <div>Creating your procedure...</div>;
  }

  if (creationError) {
    return <div className="error-message">{creationError}</div>;
  }

  if (loading) return <div>Loading procedure information...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!procedure) return <div>No procedure information found</div>;

  return (
    <article className={styles.mainContainer}>
      <section className={styles.proceduresListHeader}>
        <ProceduresHeader procedure={procedure} createdProcedure={createdProcedure!} user={user!}/>
      </section>

      {stepsActiveIndex > -1 && <Steps model={items} activeIndex={stepsActiveIndex}/>}

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left sidebar */}
          <div className={styles.sidebar}>
            {/* Step header */}
            <div className={styles.stepHeader}>
              <div className={styles.stepLabel}>Paso</div>
              <div className={styles.stepNumber}>1</div>
            </div>

            {/* Payment type */}
            <div className={styles.paymentType}>
              <h2 className={styles.paymentTypeTitle}>Pagar Tramite</h2>
            </div>

            {/* Recommendations */}
            <div className={styles.recommendations}>
              <h3 className={styles.recommendationsTitle}>Recomendaciones:</h3>
              <p className={styles.recommendationsIntro}>Antes de realizar el pago, ten en cuenta:</p>

              <ul className={styles.recommendationsList}>
                <li className={styles.recommendationItem}>
                  <span className={styles.bullet}>•</span>
                  <span>
                    El valorado tiene un costo de {paymentDetails.amount} {paymentDetails.currency}.
                  </span>
                </li>
                <li className={styles.recommendationItem}>
                  <span className={styles.bullet}>•</span>
                  <span>El pago debe realizarse exclusivamente mediante QR.</span>
                </li>
                <li className={styles.recommendationItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Escanea el QR con una app bancaria.</span>
                </li>
                <li className={styles.recommendationItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Tras realizar el pago, descarga o toma captura del comprobante.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className={styles.mainContent}>
            <div className={styles.paymentHeader}>
              <div className={styles.iconContainer}>

                <i className="pi pi-money-bill" style={{fontSize: "1.5rem", color: "#004e9a"}}></i>

              </div>
              <h2 className={styles.paymentTitle}>Pago</h2>
            </div>

            <p className={styles.paymentDescription}>Realiza el pago escaneando el siguiente código QR:</p>

            <div className={styles.paymentDetails}>

              <div className={styles.paymentDetail}>
                <span className={styles.detailLabel}>Monto:</span>
                <span>
                  {paymentDetails.amount} {paymentDetails.currency}
                </span>
              </div>
              <div className={styles.paymentDetail}>
                <span className={styles.detailLabel}>Método de pago:</span>
                <span>Código QR</span>
              </div>
            </div>



            {/* QR Code */}
            <div className={styles.qrContainer}>
              <div className={styles.qrCode}>
                {paymentSuccess ? (
                  <div className={styles.successQr}>
                    <img src={paymentCheckGif}
                         alt="Pago exitoso"
                         width={400}
                         className={styles.successGif}/>
                  </div>
                ) : (
                  <Image src={generatedQrImage}
                         alt={`Código QR para pago de ${paymentDetails.amount} ${paymentDetails.currency}`} width="400"
                         preview/>
                )}
              </div>
              {!paymentSuccess && <button className={styles.downloadButton}>Descargar QR</button>}
            </div>

            {/* Instructions */}
            {!paymentSuccess && (
              <div className={styles.instructions}>
                <h3 className={styles.instructionsTitle}>Instrucciones:</h3>
                <ol className={styles.instructionsList}>
                  <li className={styles.instructionItem}>
                    <div className={styles.instructionNumber}>1</div>
                    <span>Abre la app de tu banco.</span>
                  </li>
                  <li className={styles.instructionItem}>
                    <div className={styles.instructionNumber}>2</div>
                    <span>Selecciona la opción "Escanear QR".</span>
                  </li>
                  <li className={styles.instructionItem}>
                    <div className={styles.instructionNumber}>3</div>
                    <span>Escanea el código QR que aparece a continuación.</span>
                  </li>
                  <li className={styles.instructionItem}>
                    <div className={styles.instructionNumber}>4</div>
                    <span>Confirma el pago y guarda el comprobante.</span>
                  </li>
                </ol>
              </div>
            )}

            {/* Payment status messages */}
            {paymentError && <div className={styles.paymentError}>{paymentError}</div>}

            {paymentSuccess && (
              <div className={styles.paymentSuccess}>
                <p>¡Pago exitoso! ID de transacción: {paymentResponse?.payment?.transactionId}</p>
                <p>Redirigiendo al siguiente paso...</p>
              </div>
            )}

            {/* Footer note */}
            <div className={styles.footerNote}>
              <p>* Una vez confirmado el pago, se habilitará el siguiente paso.</p>
            </div>

            {/* Action buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.cancelButton}>Cancelar</button>
              <button
                className={styles.verifyButton}
                onClick={handlePayment}
                disabled={paymentProcessing || paymentSuccess}
              >
                {paymentProcessing ? "Procesando..." : paymentSuccess ? "Pago Exitoso" : "Verificar pago"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ApplicantStepPaymentPage;
