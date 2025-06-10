"use client"

import type React from "react";

import { useState } from "react";
import UserValidation from "../IdentityValidationPage/components/UserValidation/UserValidation.tsx";
import styles from "./RegisterPage.module.scss";
import {RegisterRequest} from "../../../../types/RegisterRequest.interface.ts";
import axios from "axios";
import {ValidationResponse} from "../../../../types/ValidationResponse.interface.ts";
import {registerService} from "../../../../services/RegisterUser.http.service.ts";
import {useNavigate} from "react-router-dom";

type PageView = "form" | "validation"

interface FormData extends Partial<RegisterRequest> {
  confirmPassword: string
}

export default function RegisterPage() {
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

  const handleStartValidation = () => {
    setCurrentView("validation")
    setFormError(null)
  }

  const handleValidation = async (idCardImage: File, selfieImage: File) => {
    setIsProcessing(true);

    try {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("idImage", idCardImage);
      formData.append("selfie", selfieImage);

      // Make API call to real validation endpoint using axios
      const response = await axios.post<ValidationResponse>(
        "http://localhost:3000/api/v1/procedures/face-validation/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 seconds timeout for file upload
        }
      );

      const validationData = response.data;

      if (validationData.verified && validationData.idNumber) {
        setValidationResult(validationData);
        setFormData((prev) => ({
          ...prev,
          identificationNumber: validationData.idNumber?.startsWith('0')
              ? validationData.idNumber.substring(1)
              : validationData.idNumber || "",
          isIdentityValidated: true,
        }));
      } else {
        setValidationResult({
          ...validationData,
          verified: false,
        });
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

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "password", "confirmPassword", "birthdate", "sisCode"]
    const missingFields = requiredFields.filter((field) => {
      const value = formData[field as keyof FormData]
      return !value || (field === "sisCode" && (!value || value === 0))
    })

    if (missingFields.length > 0) {
      setFormError("Por favor, completa todos los campos requeridos.")
      return
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden. Por favor, verifica que ambas contraseñas sean iguales.")
      return
    }

    // Validate password length
    if (formData.password && formData.password.length < 8) {
      setFormError("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    // Validate SIS code
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

              {validationResult && !validationResult.verified && (
                <div className={styles.validationError}>
                  <div className={styles.validationErrorContent}>
                    <span className="pi pi-ban"></span>
                    <div>
                      <p className={styles.validationMessage}>Validación fallida</p>
                      <p className={styles.validationSubmessage}>Por favor intente nuevamente</p>
                    </div>
                  </div>
                  <button className={styles.retryButton} onClick={handleStartValidation}>
                    Intentar nuevamente
                  </button>
                </div>
              )}
              {/* Modificacion idNumber */}
              {validationResult && !validationResult.idNumber && (
                <div className={styles.validationError}>
                  <div className={styles.validationErrorContent}>
                    <div>
                      <p className={styles.validationSubmessage}>No se encontró un número en el carnet</p>
                    </div>
                  </div>
                </div>
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
                      disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Código SIS <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.sisCode || ""}
                    onChange={(e) => handleInputChange("sisCode", Number.parseInt(e.target.value) || 0)}
                    className={styles.input}
                    disabled={isFormDisabled}
                    required
                    min="1"
                    placeholder="Ingresa tu código SIS"
                  />
                  <p className={styles.inputHelp}>El código SIS es requerido para completar el registro.</p>
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
