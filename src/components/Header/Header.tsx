import {MenuItem} from "primereact/menuitem";
import {InputText} from "primereact/inputtext";
import {Avatar} from "primereact/avatar";
import {Menubar} from "primereact/menubar";
import {Badge} from "primereact/badge";
import styles from "./Header.module.css"

function Header() {
  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
    </a>
  );
  const items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home'
    },
    {
      label: 'Tramites',
      icon: 'pi pi-search',
      items: [
        {
          label: 'Legalizacion Titulo de bachiller',
          icon: 'pi pi-bolt',
          template: itemRenderer
        },
        {
          label: 'Legalizacion Diploma Academico',
          icon: 'pi pi-server',
          template: itemRenderer
        },
        {
          label: 'Legalizacion Titulo en Provision Nacional',
          icon: 'pi pi-pencil',
          template: itemRenderer
        },
        {
          separator: true
        },
        {
          label: 'Templates',
          icon: 'pi pi-palette',
          items: [
            {
              label: 'Apollo',
              icon: 'pi pi-palette',
              badge: 2,
              template: itemRenderer
            },
            {
              label: 'Ultima',
              icon: 'pi pi-palette',
              badge: 3,
              template: itemRenderer
            }
          ]
        }
      ]
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope',
      badge: 3,
      template: itemRenderer
    }
  ];

  const start = <h1 className={styles['header-styles']}>Tramito</h1>;
  const end = (
    <div className="flex align-items-center gap-2">
      <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  )
}

export default Header;