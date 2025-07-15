"use client"

import type React from "react"
import {useRef, useState} from "react"

import {Image} from "primereact/image";
import styles from "./UserProfile.module.scss"
import defaultAvatar from '../../../../../../assets/images/default-avatar.png';

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  secondLastName?: string
  isIdentityValidated?: boolean
  sisCode?: number
  birthdate?: string // ISO date string
  avatarId?: string
}

export interface UserResponse {
  id: number
  email: string
  firstName: string
  lastName: string
  imageUrl: string
  role: string
  secondLastName: string
  avatarId: string
  identificationNumber: string
  isIdentityValidated: boolean
  sisCode: number
  birthdate: string // ISO date string
}

export interface FileResponse {
  id: string
  filename: string
  fileDownloadUri: string
  fileType: string
  size: number
}

interface UserProfileProps {
  user: UserResponse
  onUpdate: (userId: number, data: UpdateUserRequest) => Promise<void>
  onUploadImage: (file: File) => Promise<FileResponse>
}

type ViewMode = "view" | "edit"

export default function UserProfile({user, onUpdate, onUploadImage}: UserProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("view")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form data state with preloaded values
  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: user.firstName,
    lastName: user.lastName,
    secondLastName: user.secondLastName,
    isIdentityValidated: user.isIdentityValidated,
    sisCode: user.sisCode,
    birthdate: user.birthdate,
    avatarId: user.avatarId,
  })

  const handleInputChange = (field: keyof UpdateUserRequest, value: string | number | boolean) => {
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

  const handleEditMode = () => {
    setViewMode("edit")
    setError(null)
    // Reset form data to current user data
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      secondLastName: user.secondLastName,
      isIdentityValidated: user.isIdentityValidated,
      sisCode: user.sisCode,
      birthdate: user.birthdate,
      avatarId: user.avatarId,
    })
  }

  const handleCancelEdit = () => {
    setViewMode("view")
    setError(null)
    removeSelectedImage()
    // Reset form data
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      secondLastName: user.secondLastName,
      isIdentityValidated: user.isIdentityValidated,
      sisCode: user.sisCode,
      birthdate: user.birthdate,
      avatarId: user.avatarId,
    })
  }

  const validateForm = (): string | null => {
    // Validate SIS code if provided
    if (formData.sisCode !== undefined && formData.sisCode !== null && formData.sisCode <= 0) {
      return "El código SIS debe ser un número válido mayor a 0"
    }

    // Validate birthdate if provided
    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()

      if (age < 18) {
        return "Debes ser mayor de 18 años"
      }

      if (birthDate > today) {
        return "La fecha de nacimiento no puede ser futura"
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

      // Upload new image if selected
      if (selectedImage) {
        const imageResponse = await onUploadImage(selectedImage)
        updateData.avatarId = imageResponse.id
      }

      // Remove unchanged fields to only send modified data
      const changedData: UpdateUserRequest = {}

      if (updateData.firstName !== user.firstName) changedData.firstName = updateData.firstName
      if (updateData.lastName !== user.lastName) changedData.lastName = updateData.lastName
      if (updateData.secondLastName !== user.secondLastName) changedData.secondLastName = updateData.secondLastName
      if (updateData.isIdentityValidated !== user.isIdentityValidated)
        changedData.isIdentityValidated = updateData.isIdentityValidated
      if (updateData.sisCode !== user.sisCode) changedData.sisCode = updateData.sisCode
      if (updateData.birthdate !== user.birthdate) changedData.birthdate = updateData.birthdate
      if (updateData.avatarId !== user.avatarId) changedData.avatarId = updateData.avatarId

      // Only send update if there are changes
      if (Object.keys(changedData).length > 0) {
        await onUpdate(user.id, changedData)
        setViewMode("view")
        removeSelectedImage()
      } else {
        setError("No se detectaron cambios para guardar")
      }
    } catch (err) {
      setError("Error al actualizar el perfil. Por favor, intenta nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <article className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.avatarContainer}>
                {/*<Image*/}
                {/*  src={*/}
                {/*    viewMode === "edit" && imagePreview*/}
                {/*      ? imagePreview*/}
                {/*      : user.imageUrl || "/placeholder.svg?height=80&width=80"*/}
                {/*  }*/}
                {/*  alt="Avatar del usuario"*/}
                {/*  width="80"*/}
                {/*  height="80"*/}
                {/*  className={styles.headerAvatar}*/}
                {/*/>*/}
                <section className={styles.headerAvatar}>
                  <Image
                    src={defaultAvatar}
                    alt="Avatar del usuario"
                    width="70"
                    height="70"
                  />
                </section>

                {viewMode === "edit" && (
                  <button
                    type="button"
                    className={styles.changeAvatarButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="pi pi-camera" style={{fontSize: '1rem'}}></i>
                  </button>
                )}
              </div>
              <div className={styles.headerInfo}>
                <h1 className={styles.userName}>
                  {user.firstName} {user.lastName} {user.secondLastName}
                </h1>
                <p className={styles.userEmail}>{user.email}</p>
                <div className={styles.userBadges}>
                  <span className={styles.roleBadge}>{user.role}</span>
                  <span
                    className={`${styles.statusBadge} ${user.isIdentityValidated ? styles.validated : styles.pending}`}
                  >
                    {user.isIdentityValidated ? "✓ Verificado" : "⏳ Pendiente"}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.headerActions}>
              {viewMode === "view" ? (
                <button className={styles.editButton} onClick={handleEditMode}>
                  <i className="pi pi-user-edit" style={{fontSize: '1.2rem'}}></i>
                  <span>Editar Perfil</span>
                </button>
              ) : (
                <div className={styles.editActions}>
                  <button className={styles.cancelButton} onClick={handleCancelEdit} disabled={isProcessing}>
                    Cancelar
                  </button>
                  <button className={styles.saveButton} onClick={handleSubmit} disabled={isProcessing}>
                    <i className="pi pi-save" style={{fontSize: '1rem'}}></i>
                    {isProcessing ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {viewMode === "view" ? (
              // View Mode
              <div className={styles.viewContent}>
                {/* Personal Information */}
                <section className={styles.infoSection}>
                  <h2 className={styles.sectionTitle}>
                    <i className="pi pi-user" style={{fontSize: '1.2rem'}}></i>
                    Información Personal
                  </h2>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Nombre Completo</span>
                      <span className={styles.infoValue}>
                        {user.firstName} {user.lastName} {user.secondLastName || ""}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Fecha de Nacimiento</span>
                      <span className={styles.infoValue}>{formatDate(user.birthdate)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Código SIS</span>
                      <span className={styles.infoValue}>{user.sisCode}</span>
                    </div>
                  </div>
                </section>

                {/* Account Information */}
                <section className={styles.infoSection}>
                  <h2 className={styles.sectionTitle}>
                    <i className="pi pi-shield" style={{fontSize: '1.2rem'}}></i>
                    Información de la Cuenta
                  </h2>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>ID de Usuario</span>
                      <span className={styles.infoValue}>#{user.id}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Correo Electrónico</span>
                      <span className={styles.infoValue}>{user.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Número de Identificación</span>
                      <span className={styles.infoValue}>{user.identificationNumber}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Rol</span>
                      <span className={styles.roleBadge}>{user.role}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Estado de Verificación</span>
                      <span
                        className={`${styles.statusBadge} ${user.isIdentityValidated ? styles.validated : styles.pending}`}
                      >
                        {user.isIdentityValidated ? "✓ Identidad Verificada" : "⏳ Verificación Pendiente"}
                      </span>
                    </div>
                  </div>
                </section>

                {!user.isIdentityValidated && (
                  <div className={styles.verificationNotice}>
                    <span className={styles.noticeIcon}>
                      <i className="pi pi-shield" style={{fontSize: '1.2rem'}}></i>
                    </span>
                    <div className={styles.noticeContent}>
                      <h3 className={styles.noticeTitle}>Verificación de Identidad Pendiente</h3>
                      <p className={styles.noticeText}>
                        Para acceder a todas las funcionalidades, completa el proceso de verificación de identidad con
                        tu cédula y selfie.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className={styles.editContent}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className={styles.fileInput}
                />

                {/* Personal Information */}
                <section className={styles.editSection}>
                  <h2 className={styles.sectionTitle}>
                    <i className="pi pi-user" style={{fontSize: '1.2rem'}}></i>
                    Información Personal
                  </h2>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Nombre</label>
                      <input
                        type="text"
                        value={formData.firstName || ""}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={styles.input}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Apellido Paterno</label>
                      <input
                        type="text"
                        value={formData.lastName || ""}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={styles.input}
                        placeholder="Tu apellido paterno"
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Apellido Materno</label>
                    <input
                      type="text"
                      value={formData.secondLastName || ""}
                      onChange={(e) => handleInputChange("secondLastName", e.target.value)}
                      className={styles.input}
                      placeholder="Tu apellido materno (opcional)"
                    />
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Fecha de Nacimiento</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.inputIcon}>
                          <i className="pi pi-calendar" style={{fontSize: '1.2rem'}}></i>
                        </span>
                        <input
                          type="date"
                          value={formData.birthdate || ""}
                          onChange={(e) => handleInputChange("birthdate", e.target.value)}
                          className={styles.inputWithIconField}
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Código SIS</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.inputIcon}>
                          <i className="pi pi-hashtag" style={{fontSize: '1.2rem'}}></i>
                        </span>

                        <input
                          type="number"
                          value={formData.sisCode || ""}
                          onChange={(e) => handleInputChange("sisCode", Number.parseInt(e.target.value) || 0)}
                          className={styles.inputWithIconField}
                          min="1"
                          placeholder="Tu código SIS"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Account Information (Read-only in edit mode) */}
                <section className={styles.editSection}>
                  <h2 className={styles.sectionTitle}>
                    <i className="pi pi-shield" style={{fontSize: '1.2rem'}}></i>
                    Información de la Cuenta
                  </h2>

                  <div className={styles.readOnlyNotice}>
                    <p>Los siguientes campos no se pueden modificar:</p>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Correo Electrónico</label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.inputIcon}>
                          <i className="pi pi-envelope" style={{fontSize: '1.2rem'}}></i>
                        </span>

                        <input
                          type="email"
                          value={user.email}
                          className={`${styles.inputWithIconField} ${styles.readOnlyInput}`}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Número de Identificación</label>
                      <div className={styles.inputWithIcon}>

                        <span className={styles.inputIcon}>
                          <i className="pi pi-shield" style={{fontSize: '1.2rem'}}></i>
                        </span>
                        <input
                          type="text"
                          value={user.identificationNumber}
                          className={`${styles.inputWithIconField} ${styles.readOnlyInput}`}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {error && <div className={styles.errorMessage}>{error}</div>}
              </form>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
