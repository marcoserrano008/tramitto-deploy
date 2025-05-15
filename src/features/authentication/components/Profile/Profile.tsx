import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.scss';
import authService from "../../../../services/Auth.http.service.ts";
import {useAuth} from "../../../../context/AuthContext.tsx";

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get the token
    const accessToken = authService.getAccessToken();
    setToken(accessToken);
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h2>Authentication Successful!</h2>

        <div className={styles.tokenInfo}>
          <h3>Your JWT Token:</h3>
          <div className={styles.tokenDisplay}>
            <code>{token}</code>
          </div>
        </div>

        <p className={styles.successText}>
          You have successfully authenticated with the backend server.
        </p>

        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
