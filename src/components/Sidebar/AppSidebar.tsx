import {MenuItem} from "primereact/menuitem";
import {PanelMenu} from "primereact/panelmenu";

import styles from './AppSidebar.module.scss';
import {classNames} from "primereact/utils";
import {useState} from "react";

function AppSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const items: MenuItem[] = [
    {
      label: 'Legalizaciones',
      icon: 'pi pi-palette',
      items: [
        {
          label: 'Diploma Academico',
          icon: 'pi pi-eraser',
          url: '/theming'
        },
        {
          label: 'Titulo en provision Nacional',
          icon: 'pi pi-heart',
          url: '/unstyled'
        },
        {
          label: 'Diploma de bachiller',
          icon: 'pi pi-heart',
          url: '/unstyled'
        }
      ]
    },
    {
      label: 'Preguntas frecuentes',
      icon: 'pi pi-link',
    },
  ];

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Toggle Button */}
      {

      }
      {/*<button onClick={handleToggleSidebar}>*/}
      {/*  {isOpen ? 'Hide Sidebar' : 'Show Sidebar'}*/}
      {/*</button>*/}

      {/* Sidebar Container */}
      <div
        className={classNames(
          styles['sidebar-container'],
          {[styles.open]: isOpen},
          {[styles.closed]: !isOpen}
        )}
      >
        <PanelMenu model={items} className="w-full md:w-20rem"/>

        <button onClick={handleToggleSidebar} className={classNames(styles['close-sidebar'])}>
          {isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
        </button>
      </div>
    </div>
  );
}

export default AppSidebar;