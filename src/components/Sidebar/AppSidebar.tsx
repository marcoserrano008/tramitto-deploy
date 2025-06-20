import {MenuItem} from "primereact/menuitem";
import {PanelMenu} from "primereact/panelmenu";

import styles from './AppSidebar.module.scss';
import {classNames} from "primereact/utils";
import {useEffect, useMemo, useRef, useState} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import {getMenuItemsByRole} from "./utils/menuItems.ts";
import {RoleEnum} from "../../types/enum/Role.enum.ts";

function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const items: MenuItem[] = useMemo(() => {
    if (!isAuthenticated || !user?.role) {
      return [];
    }
    return getMenuItemsByRole(user.role as RoleEnum);
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles['sidebar-wrapper'])}>
      <div
        ref={sidebarRef}
        className={classNames(styles['sidebar-container'], {
          [styles.open]: isOpen,
          [styles.closed]: !isOpen,
        })}
      >
        <PanelMenu model={items} className="w-full md:w-20rem"/>
        <button
          onClick={handleToggleSidebar}
          aria-label={isOpen ? 'Hide sidebar' : 'Show sidebar'}
          className={classNames(
            styles['toggle-button'],
            {[styles.open]: isOpen}
          )}
        >
          <span className={styles.bar}/>
          <span className={styles.bar}/>
          <span className={styles.bar}/>
        </button>
      </div>

    </div>
  );
}

export default AppSidebar;