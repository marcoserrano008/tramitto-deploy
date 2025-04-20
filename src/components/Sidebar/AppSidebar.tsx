import {MenuItem} from "primereact/menuitem";
import {PanelMenu} from "primereact/panelmenu";

import styles from './AppSidebar.module.scss';
import {classNames} from "primereact/utils";
import {useMemo, useState} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import {getMenuItemsByRole} from "./utils/menuItems.ts";
import {RoleEnum} from "../../types/enum/Role.enum.ts";

function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const items: MenuItem[] = useMemo(() => {
    if (!isAuthenticated || !user?.role) {
      return [];
    }
    return getMenuItemsByRole(user.role as RoleEnum);
  }, [isAuthenticated, user]);

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles['sidebar-wrapper'])}>
      <div
        className={classNames(styles['sidebar-container'], {
          [styles.open]: isOpen,
          [styles.closed]: !isOpen,
        })}
      >
        <PanelMenu model={items} className="w-full md:w-20rem"/>
        <button
          onClick={handleToggleSidebar}
          className={classNames(styles['toggle-button'])}
        >
          {isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
        </button>
      </div>

    </div>
  );
}

export default AppSidebar;