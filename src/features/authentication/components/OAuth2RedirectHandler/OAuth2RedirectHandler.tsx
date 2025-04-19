import { useEffect, useState } from 'react';
import {Navigate} from 'react-router-dom';
import styles from './OAuth2RedirectHandler.module.scss';
import authService from "../../../../services/AuthService.ts";
import {useAuth} from "../../../../context/AuthContext.tsx";
import {RoleEnum} from "../../../../types/enum/Role.enum.ts";

const OAuth2RedirectHandler = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleOAuthSuccess } = useAuth();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);


  useEffect(() => {
    const processOAuth = async () => {
      try {
        console.log("OAuth redirect URL:", window.location.href);
        await authService.handleOAuthRedirect();
        const loggedInUser = await handleOAuthSuccess();
        if (loggedInUser && loggedInUser.role) {
          let path = "/";
          const userRole = loggedInUser.role as RoleEnum;

          switch (userRole) {
            case RoleEnum.APPLICANT:
              path = "/applicant";
              break;
            case RoleEnum.ADMINISTRATOR:
              path = "/administrator";
              break;
            case RoleEnum.ARCHIVES_MANAGER:
              path = "/archives-manager";
              break;
            case RoleEnum.GENERAL_SECRETARY:
              path = "/general-secretary";
              break;
            default:
              console.warn(
                `OAuth: Unknown role encountered: ${userRole}, redirecting to default.`,
              );
              path = "/";
          }

          setRedirectPath(path);
        } else {
          console.error("OAuth successful, but failed to retrieve user role for redirection.");
          setError("Authentication succeeded, but couldn't determine your role. Redirecting to profile.",);
          setRedirectPath("/profile");
        }

        setLoading(false);
      } catch (err: any) {
        console.error("OAuth processing error:", err);
        setError(err.message || "Failed to process authentication during OAuth flow.",);
        setLoading(false);
      }
    };

    processOAuth();
  }, [handleOAuthSuccess]);

  if (loading) {
    console.log('autenticating');
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Processing authentication...</p>
      </div>
    );
  }

  if (error && !redirectPath) {
    return (
      <div className={styles.errorContainer}>
        <h3>Authentication Error</h3>
        <p>{error}</p>
        <button onClick={() => (window.location.href = "/login")}>
          Back to Login
        </button>
      </div>
    );
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <div>Unexpected state after OAuth processing.</div>;
};

export default OAuth2RedirectHandler;
