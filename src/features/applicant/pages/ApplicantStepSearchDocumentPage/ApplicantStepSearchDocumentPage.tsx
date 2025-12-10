"use client"

import React, {useEffect, useState} from "react"
import styles from "./ApplicantStepSearchDocumentPage.module.scss"
import {UmssDocument} from "../../../../types/UmssDocument.interface.ts";
import {DocumentProcedureTypeEnum} from "../../../../types/enum/DocumentProcedureType.enum.ts";
import {useToast} from "../../../../context/ToastContext.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../context/AuthContext.tsx";
import axios from "axios";
import {ProcedureStatusEnum} from "../../../../types/enum/ProcedureStatus.enum.ts";
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import {DocumentTypeEnum} from "../../../../types/enum/DocumentType.enum.ts";
import {umssDocumentsSugestions} from "../../../../services/UmssDocumentsSugestions.http.service.ts";
import {umssDocument} from "../../../../services/UmssDocuments.http.service.ts";
import {ProcedureTypeResponse} from "../../../../types/ProcedureTypeResponse.interface.ts";
import ProceduresHeader from "../../components/ProceduresHeader/ProceduresHeader.tsx";
import {Steps} from "primereact/steps";
import {procedureSteps} from "../../../../types/procedureSteps.ts";
import {MenuItem} from "primereact/menuitem";
import {buildUrl} from "../../../../services/Url.service.ts";

const formatProcedureType = (type: DocumentProcedureTypeEnum): string => {
  switch (type) {
    case DocumentProcedureTypeEnum.LEGALIZACION_DIPLOMA_BACHILLER:
      return "Legalización de Diploma de Bachiller"
    case DocumentProcedureTypeEnum.LEGALIZACION_DIPLOMA_ACADEMICO:
      return "Legalización de Diploma Académico"
    case DocumentProcedureTypeEnum.LEGALIZACION_TITULO_PROVISION_NACIONAL:
      return "Legalización de Título en Provisión Nacional"
    default:
      return type
  }
}

type SearchProps = {
  procedure: ProcedureTypeResponse;
  procedureData: ProcedureResponse;
  onManualUpload?: () => void;
};

export default function ApplicantStepSearchDocumentPage({
                                                          procedure,
                                                          procedureData,
                                                          onManualUpload,
                                                        }: SearchProps) {
  const {showSuccess} = useToast();
  const {user} = useAuth();

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const documentType = DocumentTypeEnum.PROCEDURE_DOCUMENT;

  const [documentNumber, setDocumentNumber] = useState("")
  const [gestion, setGestion] = useState<number | undefined>(undefined)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<UmssDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<UmssDocument | null>(null)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPathEnd = pathSegments[pathSegments.length - 1];
  const currentStepIndex = procedureSteps.findIndex((step: {
    path: string,
    name: string
  }) => step.path === currentPathEnd);
  const stepsActiveIndex = currentStepIndex === 0 ? -1 : currentStepIndex - 1;
  const items: MenuItem[] = procedureSteps.filter((step) => step.path !== '')
    .map((step) => ({label: step.name}));

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestions()
  }, [])

  useEffect(() => {
    let objectUrl: string | null = null;

    if (!selectedDocument) {
      setPreviewUrl(null);
      return;
    }

    (async () => {
      try {
        const res = await fetch(buildUrl(selectedDocument.idArchivo), {
          // include auth if needed:
          // credentials: 'include',
          headers: {Accept: 'application/pdf'},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (e) {
        console.error(e);
        setPreviewUrl(null);
      }
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selectedDocument]);

  const loadSuggestions = async () => {
    if (!user) {
      setError("No existe usuario registrado");
      return;
    }

    if (!procedure) {
      setError("No existe el tramite")
      return;
    }

    setIsLoadingSuggestions(true)
    const suggestions: UmssDocument[] = await umssDocumentsSugestions.get(user?.sisCode, procedure?.procedureType)
    setSuggestions(suggestions)
    setIsLoadingSuggestions(false)
  }

  const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

  const handleSearch = async () => {
    if (!documentNumber.trim()) return;

    if (!user) {
      setError("No existe usuario registrado");
      return;
    }
    if (!procedure) {
      setError("No existe el tramite");
      return;
    }
    if (!gestion) {
      setError("No se indico una gestion");
      return;
    }

    setIsSearching(true);
    setError(null);

    const minDelay = delay(300);

    try {
      console.log(isProcessing);
      console.log(isProcessing);
      console.log(isProcessing);
      const foundDocument = await umssDocument.get(
        documentNumber,
        user.sisCode,
        gestion,
        procedure.procedureType
      );

      if (foundDocument) {
        setSelectedDocument(foundDocument);
      } else {
        setError("No se encontró ningún documento con los criterios especificados");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 404) {
          setError("No se encontró ningún documento con los criterios especificados");
        } else if (status === 400) {
          setError("Solicitud inválida. Verifica los datos ingresados.");
        } else {
          setError("Ocurrió un error al consultar el servicio.");
        }
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      await minDelay;
      setIsSearching(false);
    }
  };

  const handleSelectDocument = (document: UmssDocument) => {
    setSelectedDocument(document)
  }

  const handleSendDocument = async () => {
    if (!selectedDocument) {
      setError('Please select a document to upload');
      return;
    }

    if (!procedureData) {
      setError('Missing procedure data. Please return and try again.');
      return;
    }

    setIsProcessing(true)
    setError(null);

    try {

      // Step 2: Attach document to procedure
      setCurrentStep('Attaching document to procedure...');
      await axios.post(
        'http://165.1.120.191:3000/api/v1/procedures/documents/attach',
        {
          procedureId: procedureData.id,
          documentType: documentType,
          documentId: selectedDocument.idArchivo
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
      setIsProcessing(false);
      setError(`Failed during step: ${currentStep}. Please try again.`);
    }
  }

  const handleUpload = () => {
    console.log('handling upload')
    onManualUpload?.();
  }

  const handleCancel = () => {
    // navigate("/usuario/personal-procedures");
    setSelectedDocument(null);
    setError("");
    setDocumentNumber("");
    setGestion(2000);
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

            {/* Search type */}
            <div className={styles.searchType}>
              <h2 className={styles.searchTypeTitle}>Buscar Documento</h2>
            </div>

            {/* Recommendations */}
            <div className={`${styles.infoSection} ${styles.recommendationsSection}`}>
              <div className={styles.infoHeader}>
                <i className={`pi pi-info-circle ${styles.infoHeaderIcon}`}></i>
                <h3 className={styles.infoTitle}>Recomendaciones</h3>
              </div>

              <div className={styles.infoContent}>
                <p className={styles.recommendationsIntro}>Antes de buscar tu documento:</p>

                <ul className={styles.recommendationsList}>
                  <li className={styles.recommendationItem}>
                    <span className={styles.bullet}>•</span>
                    <span>Ingresa el código de documento completo sin espacios.</span>
                  </li>
                  <li className={styles.recommendationItem}>
                    <span className={styles.bullet}>•</span>
                    <span>La gestión se refiere al año del trámite (ej: 2024).</span>
                  </li>
                  <li className={styles.recommendationItem}>
                    <span className={styles.bullet}>•</span>
                    <span>Si no encuentras tu documento, podrás subirlo manualmente.</span>
                  </li>
                </ul>
              </div>

            </div>

            {!!suggestions.length && (
              <div className={styles.suggestionsSection}>
                <div className={styles.suggestionsHeader}>
                  <i className="pi pi-search" style={{fontSize: '1.25rem'}}></i>
                  <h3 className={styles.suggestionsTitle}>Documento Disponible</h3>
                </div>
                <p className={styles.suggestionsDescription}>
                  {suggestions.length > 0
                    ? "Se encontró un documento, seleccionalo para continuar rápidamente:"
                    : "Cargando tus documentos..."}
                </p>

                {isLoadingSuggestions ? (
                  <div className={styles.suggestionsLoading}>
                    <div className={styles.loadingSpinner}></div>
                    <span>Cargando tus documentos...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className={styles.suggestionsList}>
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={`${styles.suggestionItem} ${suggestion.id === selectedDocument?.id ? styles.featuredSuggestion : ""}`}
                        onClick={() => handleSelectDocument(suggestion)}
                      >
                        <div className={styles.suggestionIcon}>
                          <i className="pi pi-file" style={{fontSize: '1.1rem'}}></i>
                        </div>
                        <div className={styles.suggestionContent}>
                          <div className={styles.suggestionHeader}>
                            <div className={styles.suggestionNumber}>Código: {suggestion.codigoDocumento}</div>
                            <div className={styles.suggestionBadge}>
                              <i className="pi pi-calendar" style={{fontSize: '0.6rem'}}></i>
                              {suggestion.gestion}
                            </div>
                          </div>
                          <div className={styles.suggestionDescription}>{suggestion.descripcion}</div>
                          <div className={styles.suggestionDetails}>
                            <div className={styles.suggestionType}>
                              {formatProcedureType(suggestion.tipoProcedimiento)}
                            </div>
                            <div className={styles.suggestionMeta}>
                              <i className="pi pi-user" style={{fontSize: '0.6rem'}}></i>
                              CI: {suggestion.carnetIdentidad}
                              {suggestion.complemento && ` ${suggestion.complemento}`}
                            </div>
                          </div>
                        </div>
                        <div className={styles.suggestionAction}>
                          <i className="pi pi-arrow-right" style={{fontSize: '0.8rem'}}></i>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noSuggestions}>
                    {/*<FileText size={24} className={styles.noSuggestionsIcon} />*/}
                    <span>No hay documentos disponibles</span>
                  </div>
                )}
              </div>
            )
            }
          </div>

          {/* Main content */}
          <div className={styles.mainContent}>
            <div className={styles.searchHeader}>
              <div className={styles.iconContainer}>
                <i className="pi pi-search" style={{fontSize: "1.5rem", color: "#004e9a"}}></i>
              </div>
              <h2 className={styles.searchTitle}>Buscar Documento</h2>
            </div>

            {procedureData && (
              <div className={styles.procedureInfo}>
                <div className={styles.procedureInfoGrid}>
                  <div className={styles.procedureDetail}>
                    <span className={styles.detailLabel}>Trámite:</span>
                    <span className={styles.detailValue}>{procedureData.procedureTypeName}</span>
                  </div>
                  <div className={styles.procedureDetail}>
                    <span className={styles.detailLabel}>Numero de trámite:</span>
                    <span className={styles.detailValue}>{procedureData.id}</span>
                  </div>
                </div>
              </div>
            )}

            <p className={styles.searchDescription}>Busca tu documento por código:</p>

            <div className={styles.searchForm}>
              <div className={styles.searchInputs}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Código de Documento <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className={styles.searchInput}
                    placeholder="Ej: 34689"
                    disabled={isSearching}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Gestión (Año)</label>
                  <input
                    type="number"
                    value={gestion}
                    onChange={(e) => {
                      setGestion(parseInt(e.target.value, 10));
                    }}
                    className={styles.searchInput}
                    placeholder="Ej: 2024"
                    disabled={isSearching}
                  />
                </div>
              </div>

              <button
                className={styles.searchButton}
                onClick={handleSearch}
                disabled={isSearching || !documentNumber.trim()}
              >
                {isSearching ? (
                  <>
                    <div className={styles.searchSpinner}></div>
                    Buscando documento...
                  </>
                ) : (
                  <>
                    <i className="pi pi-search" style={{fontSize: '1rem'}}></i>
                    Buscar Documento
                  </>
                )}
              </button>
            </div>

            {error && !selectedDocument && (
              <div className={styles.errorMessage}>
                {/*<AlertCircle size={20} />*/}
                <span>{error}</span>
              </div>
            )}

            {selectedDocument && (
              <div className={styles.selectedDocumentSection}>
                <div className={styles.selectedDocumentHeader}>
                  <i className="pi pi-check-circle" style={{fontSize: '1.25rem'}}></i>
                  <h3 className={styles.selectedDocumentTitle}>Documento Encontrado</h3>
                </div>

                <div className={styles.selectedDocumentCard}>
                  <div className={styles.selectedDocumentContent}>
                    <h4 className={styles.selectedDocumentNumber}>Código de
                      Documento: {selectedDocument.codigoDocumento}</h4>
                    <div className={styles.selectedDocumentDetails}>
                      <span>Gestión: {selectedDocument.gestion}</span>
                      <span>Tipo: {formatProcedureType(selectedDocument.tipoProcedimiento)}</span>
                      <span>
                        CI: {selectedDocument.carnetIdentidad}
                        {selectedDocument.complemento && ` ${selectedDocument.complemento}`}
                      </span>
                      <span>Código SIS: {selectedDocument.codigoSis}</span>
                    </div>
                    {selectedDocument.descripcion && (
                      <div className={styles.selectedDocumentDescription}>{selectedDocument.descripcion}</div>
                    )}
                  </div>
                </div>

                {previewUrl && selectedDocument && (
                  <div className={styles.documentPreview}>
                    <h4 className={styles.previewTitle}>Vista Previa del Documento</h4>
                    <div className={styles.previewContainer}>
                      <iframe src={previewUrl} className={styles.pdfPreview} title="Vista previa del PDF"/>
                    </div>
                  </div>
                )}

                <div className={styles.confirmationNote}>
                  <p>¿Es este tu documento? Si es correcto, puedes iniciar el trámite.</p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.cancelButton}
                      disabled={isProcessing}
                      onClick={handleCancel}>Limpiar
              </button>

              {selectedDocument ? (
                <button className={styles.continueButton}
                        disabled={!selectedDocument || isProcessing}
                        onClick={handleSendDocument}>
                  {isProcessing ? (
                    <>
                      <div className={styles.searchSpinner}></div>
                      Enviando tramite...
                    </>
                  ) : (
                    <>
                      <i className="pi pi-arrow-right" style={{fontSize: '1rem'}}></i>
                      Iniciar Trámite
                    </>
                  )}
                </button>
              ) : (
                <button className={styles.uploadButton}
                        onClick={handleUpload}>
                  <i className="pi pi-upload" style={{fontSize: '1rem'}}></i>
                  Subir mi Documento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
