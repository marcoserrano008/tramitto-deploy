import {useLocation, useNavigate} from 'react-router-dom';
import React, {useEffect, useRef, useState} from "react";
import {FileResponse} from "../../../../types/FileResponse.interface.ts";
import {DocumentTypeEnum} from "../../../../types/enum/DocumentType.enum.ts";
import axios from "axios";
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import {ProcedureStatusEnum} from "../../../../types/enum/ProcedureStatus.enum.ts";
import styles from './ApplicantStepUploadDocumentPage.module.scss';
import {procedureSteps} from "../../../../types/procedureSteps.ts";
import {Steps} from "primereact/steps";
import {MenuItem} from "primereact/menuitem";
import ProceduresHeader from "../../components/ProceduresHeader/ProceduresHeader.tsx";
import {useAuth} from "../../../../context/AuthContext.tsx";
import {Image} from "primereact/image";
import {buildUrl} from "../../../../services/Url.service.ts";
import {useToast} from "../../../../context/ToastContext.tsx";
import {ProcedureTypeResponse} from "../../../../types/ProcedureTypeResponse.interface.ts";

type UploadProps = {
  procedure: ProcedureTypeResponse;
  procedureData: ProcedureResponse;
  onBackToSearch?: () => void;
};

function ApplicantStepUploadDocumentPage({
                                           procedure,
                                           procedureData,
                                           onBackToSearch,
                                         }: UploadProps) {
  const {showSuccess} = useToast();
  const {user} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const documentType = DocumentTypeEnum.PROCEDURE_DOCUMENT;

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPathEnd = pathSegments[pathSegments.length - 1];
  const currentStepIndex = procedureSteps.findIndex((step: {
    path: string,
    name: string
  }) => step.path === currentPathEnd);
  const stepsActiveIndex = currentStepIndex === 0 ? -1 : currentStepIndex - 1;
  const items: MenuItem[] = procedureSteps.filter((step) => step.path !== '')
    .map((step) => ({label: step.name}));

  useEffect(() => {
    if (!procedureData) {
      setError('Missing procedure data. Unable to continue.');
    }
  }, [procedureData]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const fileUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(fileUrl);

    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleProcessDocument = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (!procedureData) {
      setError('Missing procedure data. Please return and try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Upload the document
      setCurrentStep('Uploading document...');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('description', `Document for procedure: ${procedureData.id}`);

      const uploadResponse = await axios.post<FileResponse>(
        'http://165.1.120.191:3000/api/v1/document/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Step 2: Attach document to procedure
      setCurrentStep('Attaching document to procedure...');
      await axios.post(
        'http://165.1.120.191:3000/api/v1/procedures/documents/attach',
        {
          procedureId: procedureData.id,
          documentType: documentType,
          documentId: uploadResponse.data.id
        }
      );

      if (procedureData.status == ProcedureStatusEnum.REJECTED) {
        setCurrentStep('Subiendo documento...');
        await axios.post(
          'http://165.1.120.191:3000/api/v1/procedures/re-submit',
          {procedureId: procedureData.id}
        );
      } else {
        // Step 3: Submit procedure for review
        setCurrentStep('Subiendo documento...');
        await axios.post(
          'http://165.1.120.191:3000/api/v1/procedures/submit-for-review',
          {procedureId: procedureData.id}
        );
      }

      // Success - redirect to personal procedures
      setCurrentStep('Documento enviado! Redireccionando...');
      setTimeout(() => {
        navigate('/usuario/personal-procedures', {
          replace: true,
          state: { selectedProcedureId: procedureData.id }
        });
      }, 1000);
      showSuccess('Tramite enviado', 'Enviado correctamente');

    } catch (error) {
      console.error('Error processing document:', error);
      setError(`Failed during step: ${currentStep}. Please try again.`);
      setIsProcessing(false);
    }
  };


  if (error && !procedureData) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/usuario/personal-procedures')}
          className="btn-primary"
        >
          Return to My Procedures
        </button>
      </div>
    );
  }

  return (
    <article className={styles.mainContainer}>
      <section className={styles.proceduresListHeader}>
        <ProceduresHeader procedure={procedure!} createdProcedure={procedureData} user={user!}/>
      </section>

      <div className={styles.stepsContainer}>
        {stepsActiveIndex > -1 && <Steps model={items} activeIndex={stepsActiveIndex}/>}
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left sidebar */}
          <div className={styles.sidebar}>
            {/* Step header */}
            <div className={styles.stepHeader}>
              <div className={styles.stepLabel}>Paso</div>
              <div className={styles.stepNumber}>2</div>
            </div>

            {/* Document type */}
            <div className={styles.uploadType}>
              <h2 className={styles.uploadTypeTitle}>Buscar Documento</h2>
            </div>

            {/* Recommendations */}
            <section className={`${styles.infoSection} ${styles.recommendationsSection}`}>
              <div className={styles.infoHeader}>
                <i className={`pi pi-info-circle ${styles.infoHeaderIcon}`}></i>
                <h3 className={styles.infoTitle}>Recomendaciones</h3>
              </div>
              <div className={styles.infoContent}>
                <p className={styles.recommendationsIntro}>Antes de subir el documento, ten en cuenta:</p>
                <ul className={styles.recommendationsList}>
                  <li className={styles.recommendationItem}>
                    <span className={styles.bullet}>•</span>
                    <span>El documento debe estar en formato PDF.</span>
                  </li>
                  <li className={styles.recommendationItem}>
                    <span className={styles.bullet}>•</span>
                    <span>El tamaño máximo permitido es de 5MB.</span>
                  </li>
                  <li className={styles.recommendationItem}>
                    <span className={styles.bullet}>•</span>
                    <span>Asegúrate que el documento sea legible y esté completo.</span>
                  </li>
                  <li className={styles.recommendationItem}>
                    <span className={styles.bullet}>•</span>
                    <span>Verifica que la información sea correcta antes de procesar.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className={`${styles.documentSection}`}>
              <div className={styles.documentExampleContent}>
                <div className={styles.documentExample}>
                  <div className={styles.documentExampleHeader}>
                    {/*<i className="pi pi-info-circle"></i>*/}
                    <h4 className={styles.documentExampleTitle}>Documento de Ejemplo</h4>
                  </div>
                  <p className={styles.sampleDocumentDescription}>Tu documento debe ser similar al siguiente
                    ejemplo:</p>
                  <div className={styles.sampleImageContainer}>
                    <div className={styles.documentImageContainer}>
                      {procedure?.imageId &&
                          <Image src={buildUrl(procedure?.imageId)}
                                 alt={`Image sample`} width="220" height="300"
                                 preview/>
                      }
                    </div>
                  </div>
                  <p className={styles.sampleDocumentNote}>
                    Asegúrate que todos los campos estén visibles y la imagen sea clara.
                  </p>
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
            <div className={styles.documentHeader}>
              <div className={styles.iconContainer}>
                <i className="pi pi-file-arrow-up" style={{fontSize: "1.5rem", color: "#004e9a"}}></i>
              </div>
              <h2 className={styles.documentTitle}>Buscar Documento</h2>
            </div>

            {procedureData && (
              <div className={styles.procedureInfo}>
                <div className={styles.procedureInfoGrid}>
                  <div className={styles.procedureDetail}>
                    <span className={styles.detailLabel}>Trámite:</span>
                    <span className={styles.detailValue}>{procedureData.procedureTypeName}</span>
                  </div>
                  <div className={styles.procedureDetail}>
                    <span className={styles.detailLabel}>Numero de tramite:</span>
                    <span className={styles.detailValue}>{procedureData.id}</span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.uploadSection}>
              <h3 className={styles.uploadSectionTitle}>Subir Documento Requerido</h3>

              <div className={styles.fileInputContainer}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={isProcessing}
                  accept=".pdf"
                  style={{display: "none"}}
                />

                {!selectedFile && (
                  <div className={styles.dropZone} onClick={() => fileInputRef.current?.click()}>
                    <div className={styles.dropZoneContent}>
                      <i className="pi pi-cloud-upload" style={{fontSize: "1.5rem", color: "#004e9a"}}></i>
                      <p className={styles.dropZoneText}>Haz clic para seleccionar un archivo</p>
                      <p className={styles.dropZoneSubtext}>o arrastra y suelta aquí</p>
                      <p className={styles.dropZoneFormats}>PDF (max. 5MB)</p>
                    </div>
                  </div>
                )}

                {selectedFile && (
                  <div className={styles.selectedFileInfo}>
                    <i className="pi pi-file-check" style={{fontSize: "1.5rem", color: "#004e9a"}}></i>
                    <span className={styles.fileName}>{selectedFile.name}</span>
                    <span className={styles.fileSize}>({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                    <button
                      className={styles.changeFileButton}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      Cambiar
                    </button>
                  </div>
                )}
              </div>

              {/* Preview section appears immediately after file selection */}
              {previewUrl && selectedFile && (
                <div className={styles.documentPreview}>
                  <h4 className={styles.previewTitle}>Vista Previa del Documento</h4>
                  <div className={styles.previewContainer}>
                    {selectedFile.type.startsWith("image/") ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Vista previa del documento"
                        className={styles.imagePreview}
                      />
                    ) : selectedFile.type === "application/pdf" ? (
                      <iframe src={previewUrl} className={styles.pdfPreview} title="Vista previa del PDF"/>
                    ) : (
                      <p className={styles.noPreviewMessage}>Vista previa no disponible para este tipo de archivo.</p>
                    )}
                  </div>
                </div>
              )}

              {error && <div className={styles.errorMessage}>{error}</div>}

              {isProcessing && (
                <div className={styles.progressIndicator}>
                  <div className={styles.spinner}></div>
                  <p className={styles.processingStep}>{currentStep}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className={styles.actionButtons}>
                <div className={styles.actionButtonsLeft}>
                  <p className={styles.paymentFooterText}>
                    Presiona "Enviar tramite" para completar el proceso.
                  </p>
                  <button className={styles.cancelButton} onClick={onBackToSearch}>Buscar nuevamente</button>
                </div>
                <button
                  className={styles.processButton}
                  onClick={handleProcessDocument}
                  disabled={!selectedFile || isProcessing}
                >
                  {isProcessing ? currentStep : "Enviar tramite"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ApplicantStepUploadDocumentPage;