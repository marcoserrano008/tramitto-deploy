"use client"

import type React from "react";

import { useRef, useState } from "react";
import styles from "./UserValidation.module.scss";
import {Image} from "primereact/image";
import exampleSelfie from "../../../../../../assets/images/example_selfie.webp";
import exampleCi from "../../../../../../assets/images/example_ci.webp";
import backExampleCi from "../../../../../../assets/images/back_example_ci.png";

interface UserValidationProps {
  onValidate: (idCardImage: File, selfieImage: File) => Promise<void>
  onCancel: () => void
}

type CameraMode = "idCard" | "idCardBack" | "selfie" | null

export default function UserValidation({ onValidate, onCancel }: UserValidationProps) {
  const idCardInputRef = useRef<HTMLInputElement>(null)
  const idCardBackInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [idCardImage, setIdCardImage] = useState<File | null>(null)
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null)
  const [idCardBackImage, setIdCardBackImage] = useState<File | null>(null)
  const [idCardBackPreview, setIdCardBackPreview] = useState<string | null>(null)
  const [selfieImage, setSelfieImage] = useState<File | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [cameraMode, setCameraMode] = useState<CameraMode>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleIdCardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen (JPG, PNG)")
      return
    }

    setIdCardImage(file)
    const fileUrl = URL.createObjectURL(file)
    setIdCardPreview(fileUrl)
    setError(null)
  }

  const handleIdCardBackUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen (JPG, PNG)")
      return
    }

    setIdCardBackImage(file)
    const fileUrl = URL.createObjectURL(file)
    setIdCardBackPreview(fileUrl)
    setError(null)
  }

  const handleSelfieUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen (JPG, PNG)")
      return
    }

    setSelfieImage(file)
    const fileUrl = URL.createObjectURL(file)
    setSelfiePreview(fileUrl)
    setError(null)
  }

  const openCamera = async (mode: CameraMode) => {
    try {
      setCameraMode(mode)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode === "selfie" ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("No se pudo acceder a la cámara. Por favor, permite el acceso o sube una imagen manualmente.")
      setCameraMode(null)
    }
  }

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraMode) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return

        // Stop the camera stream
        const stream = video.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }

        // Create a File from the blob
        const fileName = cameraMode === "idCard" ? "cedula_frente.jpg"
          : cameraMode === "idCardBack" ? "cedula_reverso.jpg"
            : "selfie.jpg"
        const photoFile = new File([blob], fileName, { type: "image/jpeg" })

        // Create and set preview URL
        const previewUrl = URL.createObjectURL(blob)

        if (cameraMode === "idCard") {
          setIdCardImage(photoFile)
          setIdCardPreview(previewUrl)
        } else if (cameraMode === "idCardBack") {
          setIdCardBackImage(photoFile)
          setIdCardBackPreview(previewUrl)
        } else if (cameraMode === "selfie") {
          setSelfieImage(photoFile)
          setSelfiePreview(previewUrl)
        }

        // Close camera interface
        setCameraMode(null)
      },
      "image/jpeg",
      0.9,
    )
  }

  const closeCamera = () => {
    if (!videoRef.current) return

    const stream = videoRef.current.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }

    setCameraMode(null)
  }

  const removeIdCardImage = () => {
    if (idCardPreview) {
      URL.revokeObjectURL(idCardPreview)
    }
    setIdCardImage(null)
    setIdCardPreview(null)
    if (idCardInputRef.current) {
      idCardInputRef.current.value = ""
    }
  }

  const removeIdCardBackImage = () => {
    if (idCardBackPreview) {
      URL.revokeObjectURL(idCardBackPreview)
    }
    setIdCardBackImage(null)
    setIdCardBackPreview(null)
    if (idCardBackInputRef.current) {
      idCardBackInputRef.current.value = ""
    }
  }

  const removeSelfieImage = () => {
    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview)
    }
    setSelfieImage(null)
    setSelfiePreview(null)
    if (selfieInputRef.current) {
      selfieInputRef.current.value = ""
    }
  }

  const handleValidate = async () => {
    if (!idCardImage || !selfieImage) {
      setError("Por favor, sube ambas imágenes para continuar.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      await onValidate(idCardImage, selfieImage)
    } catch (err) {
      setError("Ocurrió un error durante la validación. Por favor, intenta nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <article className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.validationCard}>
          {/* Camera Modal */}
          {cameraMode && (
            <div className={styles.cameraModal}>
              <div className={styles.cameraModalContent}>
                <div className={styles.cameraModalHeader}>
                  <h3 className={styles.cameraModalTitle}>
                    {cameraMode === "idCard" ? "Fotografiar Cédula de Identidad (Frente)"
                      : cameraMode === "idCardBack" ? "Fotografiar Cédula de Identidad (Reverso)"
                        : "Tomar Selfie"}
                  </h3>
                  <button className={styles.cameraModalClose} onClick={closeCamera}>
                    <i className="pi pi-times" style={{fontSize: '1.5rem'}}></i>
                  </button>
                </div>
                <div className={styles.cameraContainer}>
                  <video ref={videoRef} className={styles.cameraVideo} autoPlay playsInline muted />
                  <div className={styles.cameraOverlay}>
                    {(cameraMode === "idCard" || cameraMode === "idCardBack") && (
                      <div className={styles.idCardGuide}>
                        <div className={styles.idCardFrame}></div>
                        <p className={styles.cameraInstructions}>
                          Coloca tu cédula dentro del marco y asegúrate de que esté bien iluminada
                        </p>
                      </div>
                    )}
                    {cameraMode === "selfie" && (
                      <div className={styles.selfieGuide}>
                        <div className={styles.selfieFrame}></div>
                        <p className={styles.cameraInstructions}>
                          Centra tu rostro en el círculo y mantén una expresión neutra
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={styles.cameraControls}>
                    <button className={styles.cameraButton} onClick={takePhoto}>
                      <i className="pi pi-camera" style={{fontSize: '1.5rem'}}></i>
                    </button>
                    <button className={styles.cancelCameraButton} onClick={closeCamera}>
                      <i className="pi pi-times" style={{fontSize: '1.5rem'}}></i>
                    </button>
                  </div>
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              </div>
            </div>
          )}

          {/* Left sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Validar identidad</h2>
            </div>

            <div className={styles.recommendations}>
              <h3 className={styles.recommendationsTitle}>Recomendaciones:</h3>
              <p className={styles.recommendationsIntro}>Antes de continuar, ten en cuenta:</p>

              <ul className={styles.recommendationsList}>
                <li className={styles.recommendationItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Iluminación y fondo neutro</span>
                </li>
                <li className={styles.recommendationItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Documento legible y sin reflejos</span>
                </li>
                <li className={styles.recommendationItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Tu Cédula de Identidad debe estar vigente, no se aceptarán documentos vencidos.</span>
                </li>
                <li className={styles.recommendationItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Las fotos deben tomarse en el momento</span>
                </li>
                <li className={styles.recommendationItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Posición correcta en la selfie</span>
                </li>
              </ul>
            </div>


          </div>

          {/* Main content */}
          <div className={styles.mainContent}>
            <div className={styles.validationHeader}>
              <div className={styles.iconContainer}>
                <i className="pi pi-shield" style={{fontSize: '1.5rem'}}></i>
              </div>
              <h2 className={styles.validationTitle}>Validación</h2>
            </div>

            <p className={styles.validationDescription}>Para validar tu identidad, sube los siguientes documentos:</p>

            {/* ID Card Upload Section */}
            <section className={styles.uploadSection}>
              <div className={styles.uploadHeader}>
                <div className={styles.stepNumber}>1</div>
                <h3 className={styles.uploadTitle}>Cédula de Identidad (Anverso)</h3>
              </div>

              <div className={styles.uploadWarning}>
                <i className="pi pi-info-circle" style={{fontSize: '1.5rem'}}></i>
                <span>Recuerda que debe estar vigente (no se aceptarán documentos vencidos).</span>
              </div>

              <p className={styles.uploadInstructions}>
                Toma una foto o sube una imagen del frente de tu Cédula de Identidad.
              </p>

              <div className={styles.uploadContainer}>
                <div className={styles.exampleContainer}>
                  <h4 className={styles.exampleLabel}>EJEMPLO</h4>
                  <div className={styles.exampleImageWrapper}>
                    <Image
                      src={exampleCi}
                      alt="Ejemplo de cédula de identidad"
                      width="300"
                      height="180"
                      preview
                      className={styles.exampleImage}
                    />
                  </div>
                </div>

                <div className={styles.uploadPreviewContainer}>
                  <h4 className={styles.uploadPreviewLabel}>FRENTE</h4>
                  <div className={`${styles.uploadPreviewWrapper} ${idCardPreview ? styles.hasPreview : ""}`}>
                    {idCardPreview ? (
                      <>
                        <Image
                          src={idCardPreview || "/placeholder.svg"}
                          alt="Vista previa de cédula"
                          width="300"
                          height="200"
                          preview
                          className={styles.previewImage}
                        />
                        <button className={styles.removeImageButton} onClick={removeIdCardImage}>
                          <i className="pi pi-times" style={{fontSize: '1.5rem'}}></i>
                        </button>
                      </>
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <i className="pi pi-upload" style={{fontSize: '2rem'}}></i>
                        <button className={styles.uploadButton} onClick={() => idCardInputRef.current?.click()}>
                          Subir archivo
                        </button>
                        <span className={styles.uploadHint}>JPG, PNG hasta 5MB</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={idCardInputRef}
                      onChange={handleIdCardUpload}
                      accept="image/*"
                      className={styles.fileInput}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.uploadSection}>
              <div className={styles.uploadHeader}>
                <div className={styles.stepNumber}>2</div>
                <h3 className={styles.uploadTitle}>Cédula de Identidad (Reverso)</h3>
              </div>

              <div className={styles.uploadWarning}>
                <i className="pi pi-info-circle" style={{fontSize: '1.5rem'}}></i>
                <span>Recuerda que debe estar vigente (no se aceptarán documentos vencidos).</span>
              </div>

              <p className={styles.uploadInstructions}>
                Toma una foto o sube una imagen del reverso de tu Cédula de Identidad.
              </p>

              <div className={styles.uploadContainer}>
                <div className={styles.exampleContainer}>
                  <h4 className={styles.exampleLabel}>EJEMPLO</h4>
                  <div className={styles.exampleImageWrapper}>
                    <Image
                      src={backExampleCi}
                      alt="Ejemplo de cédula de identidad"
                      width="300"
                      height="180"
                      preview
                      className={styles.exampleImage}
                    />
                  </div>
                </div>

                <div className={styles.uploadPreviewContainer}>
                  <h4 className={styles.uploadPreviewLabel}>REVERSO</h4>
                  <div className={`${styles.uploadPreviewWrapper} ${idCardBackPreview ? styles.hasPreview : ""}`}>
                    {idCardBackPreview ? (
                      <>
                        <Image
                          src={idCardBackPreview || "/placeholder.svg"}
                          alt="Vista previa de cédula reverso"
                          width="300"
                          height="200"
                          preview
                          className={styles.previewImage}
                        />
                        <button className={styles.removeImageButton} onClick={removeIdCardBackImage}>
                          <i className="pi pi-times" style={{fontSize: '1.5rem'}}></i>
                        </button>
                      </>
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <i className="pi pi-upload" style={{fontSize: '2rem'}}></i>
                        <button className={styles.uploadButton} onClick={() => idCardBackInputRef.current?.click()}>
                          Subir archivo
                        </button>
                        <span className={styles.uploadHint}>JPG, PNG hasta 5MB</span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={idCardBackInputRef}
                      onChange={handleIdCardBackUpload}
                      accept="image/*"
                      className={styles.fileInput}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Selfie Upload Section */}
            <section className={styles.uploadSection}>
              <div className={styles.uploadHeader}>
                <div className={styles.stepNumber}>3</div>
                <h3 className={styles.uploadTitle}>Selfie (Frente)</h3>
              </div>

              <p className={styles.uploadInstructions}>
                La foto debe tomarse en este momento desde la cámara de tu dispositivo.
                <br/>
                Tómate una foto de frente, mirando a la cámara con rostro neutro.
              </p>

              <div className={styles.uploadContainer}>
                <div className={styles.exampleContainer}>
                  <h4 className={styles.exampleLabel}>EJEMPLO</h4>
                  <div className={styles.exampleImageWrapper}>
                    <Image
                      src={exampleSelfie}
                      alt="Ejemplo de selfie"
                      width="300"
                      height="200"
                      preview
                      className={styles.exampleImage}
                    />
                  </div>
                </div>

                <div className={styles.uploadPreviewContainer}>
                  <h4 className={styles.uploadPreviewLabel}>SELFIE FRONTAL</h4>
                  <div
                    className={`${styles.uploadPreviewWrapper} ${styles.selfiePreviewWrapper} ${
                      selfiePreview ? styles.hasPreview : ""
                    }`}
                  >
                    {selfiePreview ? (
                      <>
                        <Image
                          src={selfiePreview || "/placeholder.svg"}
                          alt="Vista previa de selfie"
                          width="200"
                          height="200"
                          preview
                          className={styles.previewImage}
                        />
                        <button className={styles.removeImageButton} onClick={removeSelfieImage}>
                          <i className="pi pi-times" style={{fontSize: '1.5rem'}}></i>
                        </button>
                      </>
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <i className="pi pi-camera" style={{fontSize: '1.5rem'}}></i>
                        <button className={styles.takePhotoButton} onClick={() => openCamera("selfie")}>
                          Tomar foto
                        </button>
                        <span className={styles.orText}>o</span>
                        <button className={styles.uploadButton} onClick={() => selfieInputRef.current?.click()}>
                          Subir archivo
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={selfieInputRef}
                      onChange={handleSelfieUpload}
                      accept="image/*"
                      className={styles.fileInput}
                    />
                  </div>
                </div>
              </div>
            </section>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.validationNote}>
              * Al completar la validación con éxito, se registrará el usuario.
            </div>

            {/* Action buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.cancelButton} onClick={onCancel} disabled={isProcessing}>
                Cancelar
              </button>
              <button
                className={styles.validateButton}
                onClick={handleValidate}
                disabled={!idCardImage || !selfieImage || isProcessing}
              >
                {isProcessing ? "Procesando..." : "Validar información"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}