import { createContext, useContext, useRef, ReactNode } from 'react';
import { Toast } from 'primereact/toast';
import {ToastOptions} from "../types/ToastOptions.interface.ts";
import {ToastContextType} from "../types/ToastContextType.interface.ts";

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useRef<Toast>(null);

  const showToast = (options: ToastOptions): void => {
    toast.current?.show(options);
  };

  const showSuccess = (
    summary: string,
    detail?: string,
    life: number = 3000
  ): void => {
    showToast({ severity: 'success', summary, detail, life });
  };

  const showError = (
    summary: string,
    detail?: string,
    life: number = 3000
  ): void => {
    showToast({ severity: 'error', summary, detail, life });
  };

  const showWarn = (
    summary: string,
    detail?: string,
    life: number = 3000
  ): void => {
    showToast({ severity: 'warn', summary, detail, life });
  };

  const showInfo = (
    summary: string,
    detail?: string,
    life: number = 3000
  ): void => {
    showToast({ severity: 'info', summary, detail, life });
  };

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarn,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};