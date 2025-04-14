import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.scss'

import AppRoutes from "./routes/AppRoutes.tsx";

import {PrimeReactProvider} from "primereact/api";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import {AuthProvider} from "./context/AuthContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </PrimeReactProvider>
  </StrictMode>,
)
