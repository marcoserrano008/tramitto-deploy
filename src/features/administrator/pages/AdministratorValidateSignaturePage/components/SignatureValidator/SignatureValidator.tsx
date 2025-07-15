"use client"

import React, {useCallback, useMemo, useRef, useState} from "react"
import styles from "./SignatureValidator.module.scss"
import {VerifySignaturesResponse} from "../../../../../../types/VerifySignaturesResponse.interface.ts";
import {verifyPdfSignatureService} from "../../../../../../services/VerifyPdfSignature.http.service.ts";

interface PdfSignatureValidatorProps {
  onVerify?: (result: VerifySignaturesResponse) => void
}

export default function SignatureValidator({onVerify}: PdfSignatureValidatorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerifySignaturesResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isAnyDocumentIntact = useMemo(
    () => verificationResult?.signatures?.some(sig => sig.documentIntact) ?? false,
    [verificationResult]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo no debe superar los 10MB")
      return
    }

    setSelectedFile(file)
    setError(null)
    setVerificationResult(null)

    // Create URL for PDF viewer
    const url = URL.createObjectURL(file)
    setFileUrl(url)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
        setError(null)
        setVerificationResult(null)
        const url = URL.createObjectURL(file)
        setFileUrl(url)
      } else {
        setError("Solo se permiten archivos PDF")
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const removeFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
    setSelectedFile(null)
    setFileUrl(null)
    setVerificationResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const verifySignatures = useCallback(async () => {
    if (!selectedFile) return;

    setIsVerifying(true);
    setError(null);

    try {
      const result = await verifyPdfSignatureService.verify(selectedFile);
      setVerificationResult(result);
      onVerify?.(result);
    } catch (err) {
      console.error("Error verifying signatures:", err);
      setError(
        "Error al verificar las firmas. Por favor, intenta nuevamente.",
      );
    } finally {
      setIsVerifying(false);
    }
  }, [selectedFile, onVerify]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const extractCommonName = (distinguishedName: string) => {
    const cnMatch = distinguishedName.match(/CN=([^,]+)/)
    return cnMatch ? cnMatch[1] : distinguishedName
  }

  const extractEmail = (distinguishedName: string) => {
    const emailMatch = distinguishedName.match(/E=([^,]+)/)
    return emailMatch ? emailMatch[1] : null
  }

  const extractOrganization = (distinguishedName: string) => {
    const orgMatch = distinguishedName.match(/O=([^,]+)/)
    return orgMatch ? orgMatch[1] : null
  }

  const extractOrganizationalUnit = (distinguishedName: string) => {
    const ouMatch = distinguishedName.match(/OU=([^,]+)/)
    return ouMatch ? ouMatch[1] : null
  }

  const extractTitle = (distinguishedName: string) => {
    const titleMatch = distinguishedName.match(/T=([^,]+)/)
    return titleMatch ? titleMatch[1] : null
  }

  const extractSerialNumber = (distinguishedName: string) => {
    const serialMatch = distinguishedName.match(/SERIALNUMBER=([^,]+)/)
    return serialMatch ? serialMatch[1] : null
  }

  return (
    <article className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.validatorCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconContainer}>
              <i className="pi pi-shield" style={{fontSize: '2rem'}}></i>
            </div>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Validar firmas</h1>
              <p className={styles.subtitle}>Verificar la autenticidad de las firmas digitales</p>
            </div>
          </div>

          {/* Upload Section */}
          {!selectedFile && (
            <div className={styles.uploadSection}>
              <div
                className={styles.dropZone}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={styles.dropZoneContent}>
                  <i className="pi pi-upload" style={{ fontSize: '3rem' }}></i>
                  <h3 className={styles.dropZoneTitle}>Selecciona un documento PDF</h3>
                  <p className={styles.dropZoneText}>Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
                  <p className={styles.dropZoneSubtext}>Solo archivos PDF (máx. 10MB)</p>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,application/pdf"
                className={styles.fileInput}
              />
            </div>
          )}

          {/* Main Content */}
          {selectedFile && (
            <div className={styles.mainContent}>
              {/* Document Info Bar */}
              <div className={styles.documentInfo}>
                <div className={styles.documentDetails}>
                  <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem' }}></i>
                  <div className={styles.documentMeta}>
                    <span className={styles.documentName}>{selectedFile.name}</span>
                    <span className={styles.documentSize}>{formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>
                <div className={styles.documentActions}>
                  <button className={styles.verifyButton} onClick={verifySignatures} disabled={isVerifying}>
                    {isVerifying ? (
                      <>
                        <i className="pi pi-clock" style={{fontSize: '1.25rem'}}></i>
                        Verificando...
                      </>
                    ) : (
                      <>
                        <i className="pi pi-shield" style={{fontSize: '1.25rem'}}></i>
                        Verificar Firmas
                      </>
                    )}
                  </button>
                  <button className={styles.removeButton} onClick={removeFile}>
                    <i className="pi pi-times" style={{ fontSize: '1rem' }}></i>
                  </button>
                </div>
              </div>

              <div className={styles.contentLayout}>
                {/* PDF Viewer */}
                <div className={styles.pdfViewer}>
                  <div className={styles.viewerHeader}>
                    <h3 className={styles.viewerTitle}>Vista del Documento</h3>
                    {fileUrl && (
                      <a href={fileUrl} download={selectedFile.name} className={styles.downloadButton}>
                        <i className="pi pi-download" style={{ fontSize: '1.25rem' }}></i>
                        Descargar
                      </a>
                    )}
                  </div>
                  <div className={styles.viewerContainer}>
                    {fileUrl ? (
                      <iframe src={fileUrl} className={styles.pdfFrame} title="Vista del PDF"/>
                    ) : (
                      <div className={styles.viewerPlaceholder}>
                        <i className="pi pi-file-pdf" style={{ fontSize: '3rem' }}></i>
                        <p>Cargando vista del documento...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signatures Panel */}
                <div className={styles.signaturesPanel}>
                  <div className={styles.panelHeader}>
                    <h3 className={styles.panelTitle}>Información de Firmas</h3>
                  </div>

                  <div className={styles.panelContent}>
                    {!verificationResult && !isVerifying && (
                      <div className={styles.noVerification}>
                        <i className="pi pi-shield" style={{fontSize: '2rem'}}></i>
                        <p className={styles.noVerificationText}>
                          Haz clic en "Verificar Firmas" para analizar el documento
                        </p>
                      </div>
                    )}

                    {isVerifying && (
                      <div className={styles.verifying}>
                        <div className={styles.spinner}></div>
                        <p className={styles.verifyingText}>Verificando firmas digitales...</p>
                      </div>
                    )}

                    {verificationResult && (
                      <div className={styles.verificationResults}>
                        {/* Summary */}
                        <div className={styles.resultSummary}>
                          <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Estado General:</span>
                            <span
                              className={`${styles.summaryValue} ${
                                verificationResult.allSignaturesValid ? styles.valid : styles.invalid
                              }`}
                            >
                              {verificationResult.allSignaturesValid ? (
                                <>
                                  <i className="pi pi-check-circle" style={{ fontSize: '1rem' }}></i>
                                  Todas las firmas son válidas
                                </>
                              ) : (
                                <>
                                  <i className="pi pi-times-circle" style={{ fontSize: '1rem' }}></i>
                                  No cuenta con firmas
                                </>
                              )}
                            </span>
                          </div>
                          <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Total de Firmas:</span>
                            <span className={styles.summaryValue}>{verificationResult.totalSignatures}</span>
                          </div>
                          <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Tiene Firmas:</span>
                            <span className={styles.summaryValue}>
                              {verificationResult.hasSingatures ? "Sí" : "No"}
                            </span>
                          </div>
                        </div>

                        {/* Signatures List */}
                        {verificationResult.signatures.length > 0 && (
                          <div className={styles.signaturesList}>
                            <h4 className={styles.signaturesListTitle}>Detalles de las Firmas</h4>
                            {verificationResult.signatures.map((signature, index) => (
                              <div key={index} className={styles.signatureCard}>
                                <div className={styles.signatureHeader}>
                                  <div className={styles.signatureInfo}>
                                    <i className="pi pi-user" style={{ fontSize: '1.25rem' }}></i>
                                    <div className={styles.signerDetails}>
                                      <h5 className={styles.signerName}>{extractCommonName(signature.signerName)}</h5>
                                      {extractEmail(signature.signerName) && (
                                        <p className={styles.signerEmail}>{extractEmail(signature.signerName)}</p>
                                      )}
                                      {extractOrganization(signature.signerName) && (
                                        <p className={styles.signerOrganization}>
                                          <strong>Organización:</strong> {extractOrganization(signature.signerName)}
                                        </p>
                                      )}
                                      {/*{extractOrganizationalUnit(signature.signerName) && (*/}
                                      {/*  <p className={styles.signerUnit}>*/}
                                      {/*    <strong>Unidad:</strong> {extractOrganizationalUnit(signature.signerName)}*/}
                                      {/*  </p>*/}
                                      {/*)}*/}
                                      {extractTitle(signature.signerName) && (
                                        <p className={styles.signerTitle}>
                                          <strong>Cargo:</strong> {extractOrganizationalUnit(signature.signerName)}
                                        </p>
                                      )}
                                      {extractSerialNumber(signature.signerName) && (
                                        <p className={styles.signerCI}>
                                          <strong>CI:</strong> {extractSerialNumber(signature.signerName)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className={styles.signatureStatus}>
                                    {signature.certificateValid ? (
                                      <span className={styles.statusValid}>
                                  <i className="pi pi-check-circle" style={{ fontSize: '1rem' }}></i>
                                        Válida
                                      </span>
                                    ) : (
                                      <span className={styles.statusInvalid}>
                                  <i className="pi pi-times-circle" style={{ fontSize: '1rem' }}></i>
                                        Inválida
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className={styles.signatureDetails}>
                                  <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Fecha de Firma:</span>
                                    <span className={styles.detailValue}>{formatDate(signature.signedAt)}</span>
                                  </div>
                                  {/*<div className={styles.detailRow}>*/}
                                  {/*  <span className={styles.detailLabel}>Algoritmo:</span>*/}
                                  {/*  <span className={styles.detailValue}>{signature.algorithm}</span>*/}
                                  {/*</div>*/}
                                  {signature.reason && (
                                    <div className={styles.detailRow}>
                                      <span className={styles.detailLabel}>Razón:</span>
                                      <span className={styles.detailValue}>{signature.reason}</span>
                                    </div>
                                  )}
                                  {signature.location && (
                                    <div className={styles.detailRow}>
                                      <span className={styles.detailLabel}>Ubicación:</span>
                                      <span className={styles.detailValue}>{signature.location}</span>
                                    </div>
                                  )}
                                </div>

                                <div className={styles.certificateInfo}>
                                  <h6 className={styles.certificateTitle}>Información del Certificado</h6>
                                  <div className={styles.certificateDetails}>
                                    <div className={styles.detailRow}>
                                      <span className={styles.detailLabel}>Estado del Certificado:</span>
                                      <span
                                        className={`${styles.detailValue} ${
                                          signature.certificateValid ? styles.valid : styles.invalid
                                        }`}
                                      >
                                        {signature.certificateValid ? "Válido" : "Inválido"}
                                      </span>
                                    </div>
                                    <div className={styles.detailRow}>
                                      <span className={styles.detailLabel}>Documento Íntegro:</span>
                                      <span
                                        className={`${styles.detailValue} ${
                                          isAnyDocumentIntact ? styles.valid : styles.invalid
                                        }`}
                                      >
                                        {isAnyDocumentIntact ? "Sí" : "No"}
                                      </span>
                                    </div>
                                    <div className={styles.detailRow}>
                                      <span className={styles.detailLabel}>Válido Desde:</span>
                                      <span className={styles.detailValue}>
                                        {formatDate(signature.certificateValidFrom)}
                                      </span>
                                    </div>
                                    <div className={styles.detailRow}>
                                      <span className={styles.detailLabel}>Válido Hasta:</span>
                                      <span className={styles.detailValue}>
                                        {formatDate(signature.certificateValidTo)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {verificationResult.errorMessage && (
                          <div className={styles.errorResult}>
                            {/*<AlertCircle size={20} />*/}
                            <span>{verificationResult.errorMessage}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
