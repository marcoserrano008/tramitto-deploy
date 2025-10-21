"use client"

import React, {useEffect} from "react";

import { useState } from "react";
import UserValidation from "../IdentityValidationPage/components/UserValidation/UserValidation.tsx";
import styles from "./RegisterPage.module.scss";
import {RegisterRequest} from "../../../../types/RegisterRequest.interface.ts";
import axios from "axios";
import {ValidationResponse} from "../../../../types/ValidationResponse.interface.ts";
import {registerService} from "../../../../services/RegisterUser.http.service.ts";
import {useNavigate} from "react-router-dom";
import {faceValidationService} from "../../../../services/FaceValidation.http.service.ts";
import {getPersonaByDocumentService} from "../../../../services/GetPersonaByDocument.http.service.ts";
import {useToast} from "../../../../context/ToastContext.tsx";

type PageView = "form" | "validation"

interface FormData extends Partial<RegisterRequest> {
  confirmPassword: string
}

export default function RegisterPage() {
  const {showSuccess, showWarn} = useToast();
  const [currentView, setCurrentView] = useState<PageView>("form");
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    secondLastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    identificationNumber: "",
    isIdentityValidated: false,
    sisCode: undefined,
    birthdate: "",
  })

  const [autoLocked, setAutoLocked] = useState({
    firstName: false,
    lastName: false,
    secondLastName: false,
    birthdate: false,
    sisCode: false,
  });

  const handleStartValidation = () => {
    setCurrentView("validation")
    setFormError(null)
  }

  const toIsoDate = (dateStr: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr);
    if (m) {
      const [, dd, mm, yyyy] = m;
      return `${yyyy}-${mm}-${dd}`;
    }
    return dateStr;
  };


  useEffect(() => {
    console.log('formData actualizado:', formData);
  }, [formData]);


  const normalizeId = (id?: string | null): string =>
    (id ?? "").trim().replace(/^0+/, "") || "";

  const handleValidation = async (idCardImage: File, selfieImage: File) => {
    setIsProcessing(true);
    try {
      const formDataReq = new FormData();
      formDataReq.append("idImage", idCardImage);
      formDataReq.append("selfie", selfieImage);

      const validationData = await faceValidationService.verify(formDataReq);

      const normalizedId = normalizeId(validationData.idNumber);

      if (validationData.verified && normalizedId) {
        showSuccess('Validacion Exitosa', 'Se ha validado su identidad');

        setValidationResult(validationData);
        setFormData((prev) => ({
          ...prev,
          identificationNumber: normalizedId,
          isIdentityValidated: true,
        }));

        const numericDoc = Number(normalizedId);
        if (!Number.isNaN(numericDoc)) {
          try {
            const persona = await getPersonaByDocumentService.getPersona(numericDoc);
            console.log('persona fetched', persona);

            if (persona) {
              showSuccess('Datos Encontrados', 'Informacion autocompletada');

              const mappedFirstName = [persona.nombre1, persona.nombre2].filter(Boolean).join(" ").trim();
              const mappedLastName = persona.apellido1 || "";
              const mappedSecondLastName = persona.apellido2 || "";
              const mappedBirth = toIsoDate(persona.fechaDeNacimiento || "");
              const parsedSis = Number.parseInt(persona.codigoSis, 10);
              const mappedSis = Number.isNaN(parsedSis) ? undefined : parsedSis;
              const mappedEmail = persona.correo || "";

              setFormData(prev => {
                const next = {
                  ...prev,
                  firstName: prev.firstName || mappedFirstName,
                  lastName: prev.lastName || mappedLastName,
                  secondLastName: prev.secondLastName || mappedSecondLastName,
                  birthdate: prev.birthdate || mappedBirth,
                  sisCode: prev.sisCode ?? mappedSis,
                  email: prev.email || mappedEmail,
                };

                setAutoLocked(curr => ({
                  ...curr,
                  firstName: curr.firstName || (!prev.firstName && !!mappedFirstName),
                  lastName: curr.lastName || (!prev.lastName && !!mappedLastName),
                  secondLastName: curr.secondLastName || (!prev.secondLastName && !!mappedSecondLastName),
                  birthdate: curr.birthdate || (!prev.birthdate && !!mappedBirth),
                  sisCode: curr.sisCode || (prev.sisCode == null && mappedSis != null),
                }));

                return next;
              });
            } else {
              console.warn("No se encontró persona para el documento:", numericDoc);
            }
          } catch (personaErr) {
            console.error("No se pudo obtener datos de persona:", personaErr);
            showWarn('Datos no encontrados', 'No se pudo autocompletar');

          }
        } else {
          console.warn("El documento no es numérico; se omite autocompletado de persona.");
        }
      } else {
        setValidationResult({ ...validationData, verified: false });
      }

      setCurrentView("form");
    } catch (err) {
      console.error("Validation error:", err);
      let errorMessage = "Error durante la validación. Por favor, intenta nuevamente.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Server error:", err.response.status, err.response.data);
          errorMessage = `Error del servidor: ${err.response.status}. ${err.response.data?.message || ""}`;
        } else if (err.request) {
          console.error("Network error:", err.request);
          errorMessage = "Error de conexión. Verifica tu conexión a internet.";
        } else {
          console.error("Request setup error:", err.message);
          errorMessage = `Error en la solicitud: ${err.message}`;
        }
      }

      setValidationResult({
        verified: false,
        distance: 0,
        threshold: 0,
        model: "",
        idNumber: "",
      });
      setFormError(errorMessage);
      setCurrentView("form");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidationCancel = () => {
    setCurrentView("form")
  }

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    if ((autoLocked as any)[field]) return;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validationResult?.verified) {
      setFormError("Debes completar la validación de identidad antes de registrarte.")
      return
    }

    const requiredFields = ["firstName", "lastName", "email", "password", "confirmPassword", "birthdate", "sisCode"]
    const missingFields = requiredFields.filter((field) => {
      const value = formData[field as keyof FormData]
      return !value || (field === "sisCode" && (!value || value === 0))
    })

    if (missingFields.length > 0) {
      setFormError("Por favor, completa todos los campos requeridos.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden. Por favor, verifica que ambas contraseñas sean iguales.")
      return
    }

    if (formData.password && formData.password.length < 8) {
      setFormError("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    if (!formData.sisCode || formData.sisCode <= 0) {
      setFormError("El código SIS es requerido y debe ser un número válido.")
      return
    }

    setIsProcessing(true)
    setFormError(null)

    try {
      const registerData: RegisterRequest = {
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        secondLastName: formData.secondLastName || "",
        email: formData.email!,
        password: formData.password!,
        identificationNumber: formData.identificationNumber!,
        isIdentityValidated: formData.isIdentityValidated!,
        sisCode: formData.sisCode!,
        birthdate: formData.birthdate!,
      }

      const response = await registerService.register(registerData);

      console.log('Registration successful:', response.data)
      showSuccess('Registro Satisfactorio', `Bienvenido(a) ${formData.firstName}`);

      setRegistrationSuccess(true)

      navigate('/login', {
        state: {
          email: formData.email,
          message: 'Registro exitoso. Ahora puedes iniciar sesión con tu cuenta.'
        }
      });

    } catch (err) {
      console.error('Registration error:', err)

      if (axios.isAxiosError(err)) {
        // Handle specific API errors
        if (err.response?.status === 400) {
          setFormError(err.response.data?.message || "Datos inválidos. Por favor, verifica la información.")
        } else if (err.response?.status === 409) {
          setFormError("El email ya está registrado. Por favor, usa otro email.")
        } else if (err.response?.status === 500) {
          setFormError("Error del servidor. Por favor, intenta más tarde.")
        } else {
          setFormError(err.response?.data?.message || "Error al registrar el usuario. Por favor, intenta nuevamente.")
        }
      } else {
        setFormError("Error de conexión. Por favor, verifica tu conexión a internet.")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  if (currentView === "validation") {
    return <UserValidation onValidate={handleValidation} onCancel={handleValidationCancel} />
  }

  const isFormDisabled = !validationResult?.verified

  return (
    <article className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.registerCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconContainer}>
              <span className="pi pi-user"></span>
            </div>
            <h1 className={styles.title}>Registrarse</h1>
          </div>

          <div className={styles.content}>
            {/* Validation Section */}
            <div className={styles.validationSection}>
              <div className={styles.validationHeader}>
                <span className="pi pi-shield"></span>
                <h2 className={styles.validationTitle}>Validación de Identidad</h2>
              </div>

              {!validationResult && (
                <div className={styles.validationPending}>
                  <div className={styles.validationPendingContent}>
                    <div>
                      <p className={styles.validationMessage}>
                        <span className="pi pi-info-circle"></span>
                        Para completar tu registro, primero debes validar tu identidad.
                      </p>
                      <p className={styles.validationSubmessage}>
                        Este proceso incluye la verificación de tu cédula de identidad y una selfie.
                      </p>
                    </div>
                  </div>
                  <button className={styles.validateButton} onClick={handleStartValidation}>
                    Iniciar Validación
                  </button>
                </div>
              )}

              {validationResult?.verified && (
                <div className={styles.validationSuccess}>
                  <div className={styles.validationSuccessContent}>
                    <span className="pi pi-check-circle"></span>
                    <div className={styles.validationSuccessInfo}>
                      <p className={styles.validationMessage}>¡Validación exitosa!</p>
                      <p className={styles.validationSubmessage}>
                        {/*Carnet de Identidad: <strong>{validationResult.idNumber}</strong>*/}
                        Carnet de Identidad: <strong>
                        {validationResult.idNumber?.startsWith('0')
                          ? validationResult.idNumber.substring(1)
                          : validationResult.idNumber}
                      </strong>
                      </p>
                    </div>
                  </div>
                  <button className={styles.revalidateButton} onClick={handleStartValidation}>
                    Validar nuevamente
                  </button>
                </div>
              )}

              {validationResult?.verified && (
                <div className={styles.importantNotice}>
                  <div className={styles.importantNoticeContent}>
                    <span className="pi pi-info-circle"></span>
                    <div>
                      <p className={styles.noticeTitle}>Importante:</p>
                      <p className={styles.noticeMessage}>
                        Verifica que el número de identificación mostrado sea correcto. Si no coincide con tu cédula de
                        identidad, realiza nuevamente la validación con una foto más legible y con mejor iluminación.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/*  {validationResult && !validationResult.verified && (*/}
            {/*    <div className={styles.validationError}>*/}
            {/*      <div className={styles.validationErrorContent}>*/}
            {/*        <span className="pi pi-ban"></span>*/}
            {/*        <div>*/}
            {/*          <p className={styles.validationMessage}>No se detectaron coincidencias.</p>*/}
            {/*          <p className={styles.validationSubmessage}>Por favor intente nuevamente</p>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*      <button className={styles.retryButton} onClick={handleStartValidation}>*/}
            {/*        Intentar nuevamente*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*  /!* Modificacion idNumber *!/*/}
            {/*  {validationResult && !!!validationResult.idNumber && validationResult.verified && (*/}
            {/*    <div className={styles.validationError}>*/}
            {/*      <div className={styles.validationErrorContent}>*/}
            {/*        <div>*/}
            {/*          <p className={styles.validationSubmessage}>No se encontró un número en el carnet</p>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*</div>*/}

              {validationResult && (
                <>
                  {!validationResult.verified ? (
                    // Caso: No se detectó coincidencia facial
                    <div className={styles.validationError}>
                      <div className={styles.validationErrorContent}>
                        <span className="pi pi-ban"></span>
                        <div>
                          <p className={styles.validationMessage}>No se detectaron coincidencias en los rostros.</p>
                          <p className={styles.validationSubmessage}>Por favor, intente nuevamente.</p>
                        </div>
                      </div>
                      <button className={styles.retryButton} onClick={handleStartValidation}>
                        Intentar nuevamente
                      </button>
                    </div>
                  ) : !!!validationResult.idNumber ? (
                    // Caso: Validado pero sin número de carnet
                    <div className={styles.validationError}>
                      <div className={styles.validationErrorContent}>
                        <span className="pi pi-info-circle"></span>
                        <div>
                          <p className={styles.validationSubmessage}>No se encontró un número en el carnet.</p>
                        </div>
                      </div>
                      <button className={styles.retryButton} onClick={handleStartValidation}>
                        Intentar nuevamente
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>

              {/* Registration Form */}
            <div className={`${styles.formSection} ${validationResult?.verified ? styles.enabled : ''}`}>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Información Personal</h2>
                <p className={styles.formDescription}>
                  {isFormDisabled
                    ? "Completa la validación de identidad para habilitar el formulario."
                    : "Completa la siguiente información para finalizar tu registro."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Validated ID Number (Read-only) */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Carnet de Identidad:
                    {validationResult?.verified && <span className={styles.validatedBadge}>Validado</span>}
                  </label>
                  <div className={styles.validatedInputContainer}>
                    <input
                      type="text"
                      value={formData.identificationNumber || ""}
                      className={`${styles.input} ${styles.validatedInput}`}
                      placeholder={isFormDisabled ? "Pendiente de validación" : ""}
                      readOnly
                    />
                    {validationResult?.verified && <span className="pi pi-check-circle"></span>}
                  </div>
                </div>

                {/* Personal Information */}
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Nombre <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={styles.input}
                      disabled={isFormDisabled || autoLocked.firstName}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Apellido Paterno <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={styles.input}
                      disabled={isFormDisabled || autoLocked.lastName}
                      required
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Apellido Materno</label>
                  <input
                    type="text"
                    value={formData.secondLastName}
                    onChange={(e) => handleInputChange("secondLastName", e.target.value)}
                    className={styles.input}
                    disabled={isFormDisabled || autoLocked.secondLastName}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Fecha de Nacimiento <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => handleInputChange("birthdate", e.target.value)}
                    className={styles.input}
                    disabled={isFormDisabled || autoLocked.birthdate}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Código SIS <span className={styles.required}></span>
                  </label>
                  <input
                    type="number"
                    value={formData.sisCode || ""}
                    onChange={(e) => handleInputChange("sisCode", Number.parseInt(e.target.value) || 0)}
                    className={styles.input}
                    disabled={isFormDisabled || autoLocked.sisCode}
                    // required
                    min="1"
                    placeholder="Ingresa tu código SIS"
                  />
                  <p className={styles.inputHelp}>El código SIS es opcional.</p>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Correo Electrónico <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={styles.input}
                    disabled={isFormDisabled}
                    required
                  />
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Contraseña <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={styles.input}
                      disabled={isFormDisabled}
                      required
                      minLength={8}
                    />
                    <p className={styles.inputHelp}>La contraseña debe tener al menos 8 caracteres.</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Confirmar Contraseña <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`${styles.input} ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? styles.inputError
                          : ""
                      }`}
                      disabled={isFormDisabled}
                      required
                      minLength={8}
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className={styles.inputError}>Las contraseñas no coinciden.</p>
                    )}
                  </div>
                </div>

                {formError && <div className={styles.errorMessage}>{formError}</div>}

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitButton} disabled={isProcessing || isFormDisabled}>
                    {isProcessing ? "Registrando..." : "Completar Registro"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
