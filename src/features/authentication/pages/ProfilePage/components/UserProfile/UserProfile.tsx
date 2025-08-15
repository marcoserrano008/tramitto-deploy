"use client"

import type React from "react"
import {useRef, useState} from "react"

import {Image} from "primereact/image";
import styles from "./UserProfile.module.scss"
import defaultAvatar from '../../../../../../assets/images/default-avatar.png';
import {UserResponse} from "../../../../../../types/User.interface.ts";
import {FileResponse} from "../../../../../../types/FileResponse.interface.ts";
import {UpdateUserRequest} from "../../../../../../types/UpdateUserRequest.ts";
import {faceValidationService} from "../../../../../../services/FaceValidation.http.service.ts";
import {getPersonaByDocumentService} from "../../../../../../services/GetPersonaByDocument.http.service.ts";
import UserValidation from "../../../IdentityValidationPage/components/UserValidation/UserValidation.tsx";
import {useToast} from "../../../../../../context/ToastContext.tsx";

interface UserProfileProps {
  user: UserResponse
  onUpdate: (userId: number, data: UpdateUserRequest) => Promise<void>
  onUploadImage: (file: File) => Promise<FileResponse>
}

type ViewMode = "view" | "edit"

type LockableField =
  | "firstName"
  | "lastName"
  | "secondLastName"
  | "birthdate"
  | "sisCode"
  | "identificationNumber";

type LockedState = Record<LockableField, boolean>;

export default function UserProfile({user, onUpdate, onUploadImage}: UserProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("view")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const {showSuccess, showWarn} = useToast();

  const [showValidation, setShowValidation] = useState(false);

  const [locked, setLocked] = useState<LockedState>({
    firstName: user.isIdentityValidated,
    lastName: user.isIdentityValidated,
    secondLastName: user.isIdentityValidated,
    birthdate: user.isIdentityValidated,
    sisCode: user.isIdentityValidated,
    identificationNumber: true,
  });

  const normalizeId = (id?: string | null): string =>
    (id ?? "").trim().replace(/^0+/, "") || "";

  const toIsoDate = (dateStr: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr);
    if (m) {
      const [, dd, mm, yyyy] = m;
      return `${yyyy}-${mm}-${dd}`;
    }
    return dateStr;
  };

  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: user.firstName,
    lastName: user.lastName,
    secondLastName: user.secondLastName,
    isIdentityValidated: user.isIdentityValidated,
    identificationNumber: user.identificationNumber,
    sisCode: user.sisCode,
    birthdate: user.birthdate,
    avatarId: user.avatarId,
  });

  const effectiveId = formData.identificationNumber ?? user.identificationNumber;
  const effectiveValidated = formData.isIdentityValidated || user.isIdentityValidated;

  const handleInputChange = (field: keyof UpdateUserRequest, value: string | number | boolean) => {
    if (
      (field === "firstName" && locked.firstName) ||
      (field === "lastName" && locked.lastName) ||
      (field === "secondLastName" && locked.secondLastName) ||
      (field === "birthdate" && locked.birthdate) ||
      (field === "sisCode" && locked.sisCode) ||
      (field === "identificationNumber" && locked.identificationNumber)
    ) {
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      secondLastName: user.secondLastName,
      isIdentityValidated: user.isIdentityValidated,
      identificationNumber: user.identificationNumber,
      sisCode: user.sisCode,
      birthdate: user.birthdate,
      avatarId: user.avatarId,
    });
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
      identificationNumber: user.identificationNumber,
      sisCode: user.sisCode,
      birthdate: user.birthdate,
      avatarId: user.avatarId,
    });
  }

  const validateForm = (): string | null => {
    if (formData.sisCode !== undefined && formData.sisCode !== null && formData.sisCode <= 0) {
      return "El código SIS debe ser un número válido mayor a 0"
    }

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

      if (updateData.identificationNumber) {
        updateData.identificationNumber = normalizeId(updateData.identificationNumber);
      }

      // Remove unchanged fields to only send modified data
      const changedData: UpdateUserRequest = {}

      if (updateData.firstName !== user.firstName) changedData.firstName = updateData.firstName
      if (updateData.lastName !== user.lastName) changedData.lastName = updateData.lastName
      if (updateData.secondLastName !== user.secondLastName) changedData.secondLastName = updateData.secondLastName
      if (updateData.isIdentityValidated !== user.isIdentityValidated)
        changedData.isIdentityValidated = updateData.isIdentityValidated

      if (updateData.identificationNumber !== user.identificationNumber) {
        changedData.identificationNumber = updateData.identificationNumber;
      }
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

  const handleOpenValidation = () => {
    setShowValidation(true);
    setError(null);
  };

  const handleValidationCancel = () => {
    setShowValidation(false);
  };

  const handleIdentityValidation = async (idCardImage: File, selfieImage: File) => {
    setIsProcessing(true);
    try {
      const formDataReq = new FormData();
      formDataReq.append("idImage", idCardImage);
      formDataReq.append("selfie", selfieImage);

      const validationData = await faceValidationService.verify(formDataReq);
      const normalizedId = normalizeId(validationData.idNumber);

      if (!(validationData.verified && normalizedId)) {
        setError("No se pudo validar tu identidad. Intenta nuevamente.");
        showWarn('No se pudo validar tu identidad', 'Intenta nuevamente');

        return;
      }
      showSuccess('Identidad validada', 'Puede guardar sus datos');

      setError("");
      setFormData(prev => ({
        ...prev,
        identificationNumber: normalizedId,
        isIdentityValidated: true,
      }));

      const numericDoc = Number(normalizedId);
      const persona = await getPersonaByDocumentService.getPersona(numericDoc);

      showSuccess('Datos Encontrados', 'Informacion autocompletada');

      const mappedFirstName = persona ? [persona.nombre1, persona.nombre2].filter(Boolean).join(" ").trim() : "";
      const mappedLastName = persona?.apellido1 ?? "";
      const mappedSecondLastName = persona?.apellido2 ?? "";
      const mappedBirth = persona?.fechaDeNacimiento ? toIsoDate(persona.fechaDeNacimiento) : "";
      const parsedSis = persona?.codigoSis ? Number.parseInt(persona.codigoSis, 10) : undefined;
      const mappedSis = Number.isNaN(parsedSis as number) ? undefined : parsedSis;

      setFormData((prev) => {
        const next = {
          ...prev,
          identificationNumber: normalizedId,
          firstName: mappedFirstName || prev.firstName,
          lastName: mappedLastName || prev.lastName,
          secondLastName: mappedSecondLastName || prev.secondLastName,
          birthdate: mappedBirth || prev.birthdate,
          sisCode: mappedSis ?? prev.sisCode,
          isIdentityValidated: true,
        };

        setLocked((curr) => ({
          ...curr,
          identificationNumber: true,
          firstName: curr.firstName || !!(persona && (persona.nombre1 || persona.nombre2)),
          lastName: curr.lastName || !!(persona && persona.apellido1),
          secondLastName: curr.secondLastName || !!(persona && persona.apellido2),
          birthdate: curr.birthdate || !!(persona && persona.fechaDeNacimiento),
          sisCode: curr.sisCode || !!(persona && persona.codigoSis && !Number.isNaN(Number.parseInt(persona.codigoSis, 10))),
        }));

        return next;
      });

      setViewMode("edit");
      setShowValidation(false);

    } catch (err) {
      console.error("Error en validación:", err);
      setError("Ocurrió un error al validar la identidad.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (showValidation) {
    return (
      <UserValidation
        onValidate={handleIdentityValidation}
        onCancel={handleValidationCancel}
      />
    );
  }

  return (
    <article className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.avatarContainer}>
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
                  <span className={`${styles.statusBadge} ${effectiveValidated ? styles.validated : styles.pending}`}>
                    {effectiveValidated ? "✓ Verificado" : "⏳ Pendiente"}
                  </span>

                </div>
              </div>
            </div>
            <div className={styles.headerActions}>
              {viewMode === "view" ? (
                <div className={styles.updateOptions}>
                <button className={styles.editButton} onClick={handleEditMode}>
                    <i className="pi pi-user-edit" style={{fontSize: '1.2rem'}}></i>
                    <span>Editar Perfil</span>
                  </button>
                  {!user.isIdentityValidated &&
                      <div>
                          <button className={styles.editButton} onClick={handleOpenValidation}>
                              <i className="pi pi-shield" style={{fontSize: '1.2rem'}}/>
                              <span>Validar identidad</span>
                          </button>
                      </div>
                  }
                </div>
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
                      <span className={styles.infoValue}>{user.id}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Correo Electrónico</span>
                      <span className={styles.infoValue}>{user.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Número de Identificación</span>
                      <span className={styles.infoValue}>{effectiveId}</span>
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
                      <label className={styles.label}>
                        Nombre {locked.firstName && <i className="pi pi-lock" title="Validado, no editable"/>}
                      </label>                      <input
                        type="text"
                        value={formData.firstName || ""}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={styles.input}
                        placeholder="Tu nombre"
                        disabled={isProcessing || locked.firstName}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Apellido Paterno {locked.lastName && <i className="pi pi-lock" title="Validado, no editable"/>}
                      </label>
                      <input
                        type="text"
                        value={formData.lastName || ""}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={styles.input}
                        placeholder="Tu apellido paterno"
                        disabled={isProcessing || locked.lastName}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Apellido Materno {locked.secondLastName && <i className="pi pi-lock" title="Validado, no editable"/>}
                    </label>
                    <input
                      type="text"
                      value={formData.secondLastName || ""}
                      onChange={(e) => handleInputChange("secondLastName", e.target.value)}
                      className={styles.input}
                      placeholder="Tu apellido materno (opcional)"
                      disabled={isProcessing || locked.secondLastName}
                    />
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Fecha de Nacimiento {locked.birthdate && <i className="pi pi-lock" title="Validado, no editable"/>}
                      </label>
                      <div className={styles.inputWithIcon}>
                        <span className={styles.inputIcon}>
                          <i className="pi pi-calendar" style={{fontSize: '1.2rem'}}></i>
                        </span>
                        <input
                          type="date"
                          value={formData.birthdate || ""}
                          onChange={(e) => handleInputChange("birthdate", e.target.value)}
                          className={styles.inputWithIconField}
                          disabled={isProcessing || locked.birthdate}
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Código SIS {locked.sisCode && <i className="pi pi-lock" title="Validado, no editable"/>}
                      </label>
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
                          disabled={isProcessing || locked.sisCode}
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
                          value={effectiveId || ""}
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
