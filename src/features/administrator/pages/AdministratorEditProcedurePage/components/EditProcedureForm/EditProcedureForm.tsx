"use client"

import React, {useEffect} from "react";
import {useRef, useState} from "react";
import styles from "./EditProcedureForm.module.scss";
import {Image} from "primereact/image";
import {ProcedureTypeResponse} from "../../../../../../types/ProcedureTypeResponse.interface.ts";
import {UpdateProcedureTypeRequest} from "../../../../../../types/UpdateProcedureRequest.interface.ts";
import {FileResponse} from "../../../../../../types/FileResponse.interface.ts";
import {buildUrl} from "../../../../../../services/Url.service.ts";
import { Button } from 'primereact/button';

interface EditProcedureProps {
  procedure: ProcedureTypeResponse
  onUpdate: (data: UpdateProcedureTypeRequest) => Promise<void>
  onUploadImage: (file: File) => Promise<FileResponse | void>
  onBack: () => void
  onCancel: () => void
}

interface ProcedureFormData {
  name: string
  description: string
  cost: number
  durationDays: number
  imageId: string
  steps: string[]
  requirements: string[]
}

export default function EditProcedureForm({procedure, onUpdate, onUploadImage, onBack, onCancel}: EditProcedureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageId, setCurrentImageId] = useState<string>(procedure.imageId)


  const [baselineData, setBaselineData] = useState<ProcedureFormData>({
    name: procedure.name,
    description: procedure.description,
    cost: procedure.cost!,
    durationDays: procedure.durationDays,
    imageId: procedure.imageId,
    steps: procedure.steps,
    requirements: procedure.requirements
  })

  useEffect(() => {
    setCurrentImageId(procedure.imageId)
  }, [procedure.imageId])

  useEffect(() => {
    const newData = {
      name: procedure.name,
      description: procedure.description,
      cost: procedure.cost!,
      durationDays: procedure.durationDays,
      imageId: procedure.imageId,
      steps: procedure.steps,
      requirements: procedure.requirements
    }
    setFormData(newData)
    setBaselineData(newData)
  }, [procedure])

  // Form data state with preloaded values
  const [formData, setFormData] = useState<ProcedureFormData>({
    name: procedure.name,
    description: procedure.description,
    cost: procedure.cost!,
    durationDays: procedure.durationDays,
    steps: [...procedure.steps],
    requirements: [...procedure.requirements],
    imageId: procedure.imageId,
  })

  const handleInputChange = (field: keyof UpdateProcedureTypeRequest, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen (JPG, PNG, etc.)")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo no debe superar los 5MB")
      return
    }

    setSelectedImage(file)
    const fileUrl = URL.createObjectURL(file)
    setImagePreview(fileUrl)
    setError(null)
  }

  const removeSelectedImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // const addStep = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     steps: [...(prev.steps || []), ""],
  //   }))
  // }
  //
  // const updateStep = (index: number, value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     steps: prev.steps?.map((step, i) => (i === index ? value : step)) || [],
  //   }))
  // }
  //
  // const removeStep = (index: number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     steps: prev.steps?.filter((_, i) => i !== index) || [],
  //   }))
  // }
  //
  // const addRequirement = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     requirements: [...(prev.requirements || []), ""],
  //   }))
  // }
  //
  // const updateRequirement = (index: number, value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     requirements: prev.requirements?.map((req, i) => (i === index ? value : req)) || [],
  //   }))
  // }
  //
  // const removeRequirement = (index: number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     requirements: prev.requirements?.filter((_, i) => i !== index) || [],
  //   }))
  // }
  //
  const validateForm = (): string | null => {
    // All fields are optional, but if provided, they should meet certain criteria

    // Validate name if provided
    if (formData.name && formData.name.length > 100) {
      return "El nombre no puede superar los 100 caracteres"
    }

    // Validate cost if provided
    if (formData.cost !== undefined && formData.cost !== null) {
      if (formData.cost <= 0) {
        return "El costo debe ser mayor a 0"
      }
      if (formData.cost > 999.99) {
        return "El costo no puede superar los 999.99"
      }
    }

    // Validate duration if provided
    if (formData.durationDays !== undefined && formData.durationDays !== null && formData.durationDays < 1) {
      return "La duración debe ser de al menos 1 día"
    }

    // Validate steps if provided
    if (formData.steps && formData.steps.length > 0) {
      const emptySteps = formData.steps.filter((step) => !step.trim())
      if (emptySteps.length > 0) {
        return "Los pasos no pueden estar vacíos"
      }
    }

    // Validate requirements if provided
    if (formData.requirements && formData.requirements.length > 0) {
      const emptyRequirements = formData.requirements.filter((req) => !req.trim())
      if (emptyRequirements.length > 0) {
        return "Los requisitos no pueden estar vacíos"
      }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const updateData = {...formData}
      let newImageId: string = baselineData.imageId // Use baseline instead of procedure

      // Upload new image if selected
      if (selectedImage) {
        const imageResponse: FileResponse | void = await onUploadImage(selectedImage)
        if (imageResponse?.id) {
          updateData.imageId = imageResponse.id
          newImageId = imageResponse.id
        }
      }

// Build the update request with only changed fields
      const changedData: UpdateProcedureTypeRequest = {}

      if (updateData.name !== baselineData.name) changedData.name = updateData.name
      if (updateData.description !== baselineData.description) changedData.description = updateData.description
      if (updateData.cost !== baselineData.cost) changedData.cost = updateData.cost
      if (updateData.durationDays !== baselineData.durationDays) changedData.durationDays = updateData.durationDays
      if (updateData.imageId !== baselineData.imageId) changedData.imageId = updateData.imageId

      // Check if arrays have changed
      const stepsChanged =
        JSON.stringify(updateData.steps) !== JSON.stringify(baselineData.steps) ||
        updateData.steps?.length !== baselineData.steps.length
      if (stepsChanged) changedData.steps = updateData.steps

      const requirementsChanged =
        JSON.stringify(updateData.requirements) !== JSON.stringify(baselineData.requirements) ||
        updateData.requirements?.length !== baselineData.requirements.length
      if (requirementsChanged) changedData.requirements = updateData.requirements

      // Only send update if there are changes
      if (Object.keys(changedData).length > 0) {
        await onUpdate(changedData)

        // Update both formData and baselineData after successful update
        setFormData(updateData)
        setBaselineData(updateData)

        // Clear the "Nueva Imagen" section after successful update
        if (selectedImage && newImageId) {
          setCurrentImageId(newImageId)
          setSelectedImage(null)
          setImagePreview(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }
      } else {
        setError("No se detectaron cambios para guardar")
      }
    } catch (err) {
      setError("Error al actualizar el procedimiento. Por favor, intenta nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <article className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.editCard}>
          {/* Left sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <Button label="Volver a la lista" icon="pi pi-arrow-left" size="small" onClick={onBack} outlined/>
              <h2 className={styles.sidebarTitle}>Información del Procedimiento</h2>
            </div>

            <div className={styles.procedureInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>ID:</span>
                <span className={styles.infoValue}>{procedure.id}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Estado:</span>
                <span className={`${styles.statusBadge} ${procedure.active ? styles.active : styles.inactive}`}>
                  {procedure.active ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Creado:</span>
                <span className={styles.infoValue}>{new Date(procedure.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Actualizado:</span>
                <span className={styles.infoValue}>{new Date(procedure.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className={styles.guidelines}>
              <h3 className={styles.guidelinesTitle}>Pautas de Edición:</h3>
              <ul className={styles.guidelinesList}>
                <li className={styles.guidelineItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Todos los campos son opcionales</span>
                </li>
                <li className={styles.guidelineItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Solo se enviarán los campos modificados</span>
                </li>
                <li className={styles.guidelineItem}>
                  <span className={styles.bullet}>•</span>
                  <span>El nombre no puede superar los 100 caracteres</span>
                </li>
                <li className={styles.guidelineItem}>
                  <span className={styles.bullet}>•</span>
                  <span>El costo debe ser mayor a 0 si se especifica</span>
                </li>
                <li className={styles.guidelineItem}>
                  <span className={styles.bullet}>•</span>
                  <span>Las imágenes no deben superar los 5MB</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className={styles.mainContent}>
            <div className={styles.editHeader}>
              <div className={styles.iconContainer}>
                <i className={`pi pi-file-edit ${styles.icon}`}></i>
              </div>
              <div className={styles.headerContent}>
                <h2 className={styles.editTitle}>Editar: {procedure.name}</h2>
                <p className={styles.editSubtitle}>Modifica solo los campos que necesites cambiar</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Basic Information */}
              <section className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Información Básica</h3>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nombre</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={styles.input}
                    maxLength={100}
                    placeholder="Nombre del procedimiento"
                  />
                  <p className={styles.inputHelp}>{(formData.name || "").length}/100 caracteres</p>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Descripción</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Descripción detallada del procedimiento"
                  />
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Costo (Bs.)</label>
                    <div className={styles.inputWithIcon}>
                      <i className={`pi pi-money-bill ${styles.inputIcon}`}></i>
                      <input
                        type="number"
                        value={formData.cost || ""}
                        onChange={(e) => handleInputChange("cost", Number.parseFloat(e.target.value) || 0)}
                        className={styles.inputWithIconField}
                        min="0.01"
                        max="99999999.99"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Duración (días)</label>
                    <div className={styles.inputWithIcon}>
                      <i className={`pi pi-calendar ${styles.inputIcon}`}></i>
                      <input
                        type="number"
                        value={formData.durationDays || ""}
                        onChange={(e) => handleInputChange("durationDays", Number.parseInt(e.target.value) || 1)}
                        className={styles.inputWithIconField}
                        min="1"
                        placeholder="1"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Image Upload */}
              <section className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Imagen del Procedimiento</h3>

                <div className={styles.imageUploadContainer}>
                  <div className={styles.currentImageContainer}>
                    <h4 className={styles.imageLabel}>Imagen Actual</h4>
                    <div className={styles.imageWrapper}>
                      <Image src={buildUrl(currentImageId)}
                             className={styles.nextImage}
                             alt={`Image sample`}
                             width="200"
                             preview/>
                    </div>
                  </div>

                  <div className={styles.newImageContainer}>
                    <h4 className={styles.imageLabel}>Nueva Imagen (Opcional)</h4>
                    <div className={styles.uploadArea}>
                      {imagePreview ? (
                        <div className={styles.previewContainer}>
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Vista previa de nueva imagen"
                            width="200"
                            className={styles.previewImage}
                            preview
                          />
                          <button type="button" className={styles.removeImageButton} onClick={removeSelectedImage}>
                            <i className="pi pi-times"></i>
                          </button>
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder} onClick={() => fileInputRef.current?.click()}>
                          <i className={`pi pi-image ${styles.uploadIcon}`}></i>

                          <p className={styles.uploadText}>Haz clic para seleccionar una nueva imagen</p>
                          <p className={styles.uploadSubtext}>JPG, PNG (max. 5MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className={styles.fileInput}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/*/!* Steps *!/*/}
              {/*<section className={styles.formSection}>*/}
              {/*  <div className={styles.sectionHeader}>*/}
              {/*    <h3 className={styles.sectionTitle}>Pasos del Procedimiento</h3>*/}
              {/*    <button type="button" className={styles.addButton} onClick={addStep}>*/}
              {/*      <i className="pi pi-plus"></i>*/}
              {/*      Agregar Paso*/}
              {/*    </button>*/}
              {/*  </div>*/}

              {/*  <div className={styles.listContainer}>*/}
              {/*    {formData.steps?.map((step, index) => (*/}
              {/*      <div key={index} className={styles.listItem}>*/}
              {/*        <div className={styles.listItemNumber}>{index + 1}</div>*/}
              {/*        <input*/}
              {/*          type="text"*/}
              {/*          value={step}*/}
              {/*          onChange={(e) => updateStep(index, e.target.value)}*/}
              {/*          className={styles.listInput}*/}
              {/*          placeholder={`Paso ${index + 1}`}*/}
              {/*        />*/}
              {/*        <button type="button" className={styles.removeButton} onClick={() => removeStep(index)}>*/}
              {/*          <i className="pi pi-delete-left"></i>*/}
              {/*        </button>*/}
              {/*      </div>*/}
              {/*    ))}*/}
              {/*  </div>*/}
              {/*</section>*/}

              {/*/!* Requirements *!/*/}
              {/*<section className={styles.formSection}>*/}
              {/*  <div className={styles.sectionHeader}>*/}
              {/*    <h3 className={styles.sectionTitle}>Requisitos</h3>*/}
              {/*    <button type="button" className={styles.addButton} onClick={addRequirement}>*/}
              {/*      <i className="pi pi-plus"></i>*/}
              {/*      Agregar Requisito*/}
              {/*    </button>*/}
              {/*  </div>*/}

              {/*  <div className={styles.listContainer}>*/}
              {/*    {formData.requirements?.map((requirement, index) => (*/}
              {/*      <div key={index} className={styles.listItem}>*/}
              {/*        <div className={styles.listItemNumber}>{index + 1}</div>*/}
              {/*        <input*/}
              {/*          type="text"*/}
              {/*          value={requirement}*/}
              {/*          onChange={(e) => updateRequirement(index, e.target.value)}*/}
              {/*          className={styles.listInput}*/}
              {/*          placeholder={`Requisito ${index + 1}`}*/}
              {/*        />*/}
              {/*        <button type="button" className={styles.removeButton} onClick={() => removeRequirement(index)}>*/}
              {/*          <i className="pi pi-delete-left"></i>*/}
              {/*        </button>*/}
              {/*      </div>*/}
              {/*    ))}*/}
              {/*  </div>*/}
              {/*</section>*/}

              {error && <div className={styles.errorMessage}>{error}</div>}

              {/* Action buttons */}
              <div className={styles.actionButtons}>
                <button type="button" className={styles.cancelButton} onClick={onBack} disabled={isProcessing}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton} disabled={isProcessing}>
                  {isProcessing ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  )
}
