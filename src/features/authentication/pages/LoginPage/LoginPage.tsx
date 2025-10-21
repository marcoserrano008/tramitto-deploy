import {FormEvent, useEffect, useState} from "react";
import authService from "../../../../services/Auth.http.service.ts";
import styles from "./LoginPage.module.scss";
import {useAuth} from "../../../../context/AuthContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {RoleEnum} from "../../../../types/enum/Role.enum.ts";
import {classNames} from "primereact/utils";
import {Password} from "primereact/password";
import logoTramitto from "../../../../../public/logoTramitto.svg";

interface LoginState {
  email?: string
  message?: string
}

const LoginPage = () => {
  const location = useLocation()
  const state = location.state as LoginState

  const [email, setEmail] = useState(state?.email || "")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(state?.message || "")
  const [isSuccess, setIsSuccess] = useState(!!state?.message)

  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (state?.message) {
      const timer = setTimeout(() => {
        setMessage("")
        setIsSuccess(false)
        navigate(location.pathname, { replace: true, state: {} })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [state?.message, navigate, location.pathname])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)

    try {
      const loggedInUser = await login(email, password)

      if (loggedInUser && loggedInUser.role) {
        setIsSuccess(true)
        setMessage("Login successful! Redirecting...")

        let redirectPath = "/"
        const userRole = loggedInUser.role as RoleEnum

        switch (userRole) {
          case RoleEnum.APPLICANT:
            redirectPath = "/usuario"
            break
          case RoleEnum.ADMINISTRATOR:
            redirectPath = "/administrator"
            break
          case RoleEnum.ARCHIVES_MANAGER:
            redirectPath = "/archives-manager"
            break
          case RoleEnum.GENERAL_SECRETARY:
            redirectPath = "/general-secretary"
            break
          default:
            console.warn(`Unknown role encountered: ${userRole}`)
            redirectPath = "/"
        }
        navigate(redirectPath, { replace: true })
      } else {
        throw new Error("Login successful, but user data or role is missing.")
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsSuccess(false)
      setMessage("Contraseña y/o usuario invalido")
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    authService.initiateGoogleLogin()
  }

  const navigateToRegisterPage = () => {
    navigate("/register")
  }

  const handleForgotPassword = () => {
    console.log("Olvidaste tu contraseña clicked")
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.brandingPanel}>
        <div className={styles.brandingContent}>
          <div className={styles.logoSection}>
            <div className={styles.logoPlaceholder}>
              <img src={logoTramitto} alt="Logo Tramitto" className={styles.logoImage}/>
            </div>
          </div>

          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>¡Bienvenido a Tramitto!</h2>
            <p className={styles.welcomeText}>
              Accede a tu cuenta para gestionar tus documentos de forma inteligente, segura y sin complicaciones.
              Todo lo que necesitas, al alcance de un clic.
            </p>
          </div>

          <div className={styles.featuresSection}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Organización Inteligente</h3>
                <p className={styles.featureText}>Centraliza y encuentra tus documentos al instante</p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Máxima Seguridad</h3>
                <p className={styles.featureText}>Tus datos protegidos con tecnología avanzada</p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Disponibilidad Total</h3>
                <p className={styles.featureText}>Accede desde cualquier lugar, en cualquier momento</p>
              </div>
            </div>
          </div>

          <div className={styles.decorativeShapes}>
            <div className={styles.shape1}></div>
            <div className={styles.shape2}></div>
          </div>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.loginForm}>
          <h2>Iniciar Sesión</h2>

          {message && <div className={isSuccess ? styles.successMessage : styles.errorMessage}>{message}</div>}

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Ingresa tu correo"
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <Password
                inputId="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                toggleMask
                feedback={false}
                className={styles.passwordField}
                inputClassName={styles.passwordInput}
                required
              />
              <div className={styles.forgotPassword}>
                <button type="button" onClick={handleForgotPassword} className={styles.forgotPasswordLink}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <button type="submit" disabled={loading} className={styles.loginButton}>
                {loading ? "Loading..." : "Ingresar"}
              </button>
            </div>
          </form>

          <div className={styles.divider}>
            <span>o también</span>
          </div>

          <button onClick={handleGoogleLogin} className={styles.googleButton} disabled={loading}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Ingresar con Google
          </button>
          <button onClick={navigateToRegisterPage} className={classNames(styles.loginButton, styles.registerButton)}>
            Registrarse
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage