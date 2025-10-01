import {MenuItem} from "primereact/menuitem";
import {RoleEnum} from "../../../types/enum/Role.enum.ts";

const administratorMenuItems: MenuItem[] = [
  {
    label: 'Inicio',
    icon: 'pi pi-fw pi-home',
    url: '/administrator',
  },
  {
    label: 'Revisar Trámites',
    icon: 'pi pi-fw pi-book',
    items: [
      {
        label: 'Legalización de Diploma de Bachiller',
        icon: 'pi pi-fw pi-file',
        url: '/administrator/procedures-list/diploma-bachiller',
      },
      {
        label: 'Legalización de Diploma Académico',
        icon: 'pi pi-fw pi-file',
        url: '/administrator/procedures-list/diploma-academico',
      },
      {
        label: 'Legalización de Título en Provisión Nacional',
        icon: 'pi pi-fw pi-file',
        url: '/administrator/procedures-list/titulo-provision',
      },
    ],
  },
  {
    label: 'Historial de revisión',
    icon: 'pi pi-fw pi-folder',
    url: '/administrator/historial',
  },
  {
    label: 'Editar Trámites',
    icon: 'pi pi-fw pi-file-edit',
    url: '/administrator/editar-tramites',
  },
  {
    label: 'Validar Firmas',
    icon: 'pi pi-fw pi-pencil',
    url: '/administrator/validar-firmas',
  },
  {
    label: 'Administrar usuarios',
    icon: 'pi pi-fw pi-users',
    url: '/administrator/administrar-usuarios',
  },
  {
    label: 'Preguntas Frecuentes',
    icon: 'pi pi-fw pi-question-circle',
    url: '/faq',
  }
];

const applicantMenuItems: MenuItem[] = [
  {
    label: 'Inicio',
    icon: 'pi pi-fw pi-home',
    url: '/usuario',
  },
  {
    label: 'Trámites',
    icon: 'pi pi-fw pi-book',
    items: [
      {
        label: 'Legalización de Diploma de Bachiller',
        icon: 'pi pi-fw pi-file',
        url: '/usuario/informacion-tramite/diploma-bachiller',
      },
      {
        label: 'Legalización de Diploma Académico',
        icon: 'pi pi-fw pi-file',
        url: '/usuario/informacion-tramite/diploma-academico',
      },
      {
        label: 'Legalización de Título en Provisión Nacional',
        icon: 'pi pi-fw pi-file',
        url: '/usuario/informacion-tramite/titulo-provision',
      }
    ],
  },
  {
    label: 'Mis Trámites',
    icon: 'pi pi-fw pi-folder',
    url: '/usuario/personal-procedures',
  },
  {
    label: 'Validar firmas',
    icon: 'pi pi-fw pi-pencil',
    url: '/validar-firmas',
  },
  {
    label: 'Preguntas Frecuentes',
    icon: 'pi pi-fw pi-question-circle',
    url: '/faq',
  },
];

const archivesManagerMenuItems: MenuItem[] = [
  {
    label: 'Inicio',
    icon: 'pi pi-fw pi-home',
    url: '/archives-manager',
  },
  {
    label: 'Revisar Trámites',
    icon: 'pi pi-fw pi-book',
    items: [
      {
        label: 'Legalización de Diploma de Bachiller',
        icon: 'pi pi-fw pi-file',
        url: '/archives-manager/procedures-list/diploma-bachiller',
      },
      {
        label: 'Legalización de Diploma Académico',
        icon: 'pi pi-fw pi-file',
        url: '/archives-manager/procedures-list/diploma-academico',
      },
      {
        label: 'Legalización de Título en Provisión Nacional',
        icon: 'pi pi-fw pi-file',
        url: '/archives-manager/procedures-list/titulo-provision',
      },
    ],
  },
  {
    label: 'Historial de revisión',
    icon: 'pi pi-fw pi-folder',
    url: '/archives-manager/historial',
  },
  {
    label: 'Reportes',
    icon: 'pi pi-fw pi-chart-bar',
    url: '/archives-manager/reports',
  },
  {
    label: 'Validar firmas',
    icon: 'pi pi-fw pi-pencil',
    url: '/validar-firmas',
  },
  {
    label: 'Preguntas Frecuentes',
    icon: 'pi pi-fw pi-question-circle',
    url: '/faq',
  }
];

const generalSecretaryMenuItems: MenuItem[] = [
  {
    label: 'Inicio',
    icon: 'pi pi-fw pi-home',
    url: '/general-secretary',
  },
  {
    label: 'Revisar Tramites',
    icon: 'pi pi-fw pi-book',
    url: '/general-secretary/procedures-list',
  },
  {
    label: 'Reportes',
    icon: 'pi pi-fw pi-chart-bar',
    url: '/general-secretary/reports',
  },
  {
    label: 'Validar firmas',
    icon: 'pi pi-fw pi-pencil',
    url: '/validar-firmas',
  },
  {
    label: 'Preguntas Frecuentes',
    icon: 'pi pi-fw pi-question-circle',
    url: '/faq',
  }
];

export const getMenuItemsByRole = (role: RoleEnum | undefined): MenuItem[] => {
  if (!role) {
    return [];
  }

  switch (role) {
    case RoleEnum.APPLICANT:
      return applicantMenuItems;
    case RoleEnum.ADMINISTRATOR:
      return administratorMenuItems;
    case RoleEnum.ARCHIVES_MANAGER:
      return archivesManagerMenuItems;
    case RoleEnum.GENERAL_SECRETARY:
      return generalSecretaryMenuItems;
    default:
      console.warn("Unknown user role for sidebar:", role);
      return [];
  }
};
