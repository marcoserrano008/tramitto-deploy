import { useEffect, useState } from 'react';
import {Navigate} from 'react-router-dom';
import styles from './OAuth2RedirectHandler.module.scss';
import authService from "../../../../services/AuthService.ts";
import {useAuth} from "../../../../context/AuthContext.tsx";

const OAuth2RedirectHandler = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleOAuthSuccess } = useAuth();

  useEffect(() => {
    const processOAuth = async () => {
      try {
        console.log("OAuth redirect URL:", window.location.href);

        // Handle the redirect and get user data
        await authService.handleOAuthRedirect();
        await handleOAuthSuccess();
        setLoading(false);
      } catch (err) {
        console.error("OAuth error:", err);
        setError('Failed to process authentication');
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

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Authentication Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.href = '/login'}>
          Back to Login
        </button>
      </div>
    );
  }

  // Redirect to profile page
  return <Navigate to="/profile" />;
};

export default OAuth2RedirectHandler;
