import styles from './Header.module.scss'
import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>Your App Name</div>

      <div className={styles.navLinks}>
        {/* Your existing navigation links */}
      </div>

      <div className={styles.authButtons}>
        {isAuthenticated ? (
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className={styles.loginButton}
            onClick={handleLogin}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
