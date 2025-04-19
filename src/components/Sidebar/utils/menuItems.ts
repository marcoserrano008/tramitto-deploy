import {MenuItem} from "primereact/menuitem";
import {RoleEnum} from "../../../types/enum/Role.enum.ts";

const administratorMenuItems: MenuItem[] = [
  {
    label: 'Inicio',
    icon: 'pi pi-fw pi-home',
    url: '/administrator',
  },
  {
    label: 'Revisar tramites',
    icon: 'pi pi-fw pi-book',
    url: '/administrator/procedures-list',
  },
  {
    label: 'Tramites en proceso',
    icon: 'pi pi-fw pi-folder',
    url: '/administrator/procedures-status',
  },
  {
    label: 'Reportes',
    icon: 'pi pi-fw pi-chart-bar',
    url: '/administrator/reports',
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
    url: '/applicant',
  },
  {
    label: 'Tramites',
    icon: 'pi pi-fw pi-book',
    items: [
      {
        label: 'Legalizacion de Diploma de bachiller',
        icon: 'pi pi-fw pi-file',
        url: '/applicant/procedure-information/diploma-bachiller',
      },
      {
        label: 'Legalizacion de Diploma Academico',
        icon: 'pi pi-fw pi-file',
        url: '/applicant/procedure-information/diploma-academico',
      },
      {
        label: 'Legalizacion de Titulo en provision nacional',
        icon: 'pi pi-fw pi-file',
        url: '/applicant/procedure-information/titulo-provision',
      },
    ],
  },
  {
    label: 'Mis Tramites',
    icon: 'pi pi-fw pi-folder',
    url: '/applicant/personal-procedures',
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
    label: 'Revisar Tramites',
    icon: 'pi pi-fw pi-book',
    url: '/archives-manager/procedures-list',
  },
  {
    label: 'Reportes',
    icon: 'pi pi-fw pi-chart-bar',
    url: '/archives-manager/reports',
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
