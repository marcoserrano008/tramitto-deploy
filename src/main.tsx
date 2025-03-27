import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.scss'

import AppRoutes from "./routes/AppRoutes.tsx";

import {PrimeReactProvider} from "primereact/api";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <AppRoutes/>
    </PrimeReactProvider>
  </StrictMode>,
)
