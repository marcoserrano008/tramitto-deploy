import {ToastOptions} from "./ToastOptions.interface.ts";

export interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  showSuccess: (summary: string, detail?: string, life?: number) => void;
  showError: (summary: string, detail?: string, life?: number) => void;
  showWarn: (summary: string, detail?: string, life?: number) => void;
  showInfo: (summary: string, detail?: string, life?: number) => void;
}