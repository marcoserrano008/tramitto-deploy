import styles from './Header.module.scss';
import { useAuth } from "../../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import logoTramitto from "../../assets/images/logoTramitto.svg";
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import 'primeicons/primeicons.css';

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const menu = useRef<Menu>(null);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: handleLogout
    }
  ];

  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <img
          src={logoTramitto}
          alt="Logo Tramitto"
          className={styles.logoImage}
          onClick={() => navigate('/applicant')}
          style={{cursor: 'pointer'}}
        />
        <span className={styles.appName}>Tramitto</span>
      </div>

      <div className={styles.rightSection}>
        <i className={`pi pi-bell ${styles.iconBell}`}></i>

        {isAuthenticated ? (
          <>
          {user && user.imageUrl ? (
              <Avatar
                image={user.imageUrl}
                shape="circle"
                size="large"
                className={styles.avatarUser}
                onClick={(e) => menu.current && menu.current.toggle(e)}
              />
            ) : (
              <Avatar
                icon="pi pi-user"
                shape="circle"
                size="large"
                className={styles.avatarUser}
                onClick={(e) => menu.current && menu.current.toggle(e)}
              />
            )}
            <Menu model={menuItems} popup ref={menu} />
          </>
        ) : (
          <button className={styles.loginButton} onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
