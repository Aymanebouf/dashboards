
import { useRef } from 'react';

export const useToast = () => {
  const toast = useRef(null);

  const showToast = (severity, summary, detail, life = 3000) => {
    toast.current?.show({ severity, summary, detail, life });
  };

  return {
    toast,
    showSuccess: (summary, detail, life) => showToast('success', summary, detail, life),
    showInfo: (summary, detail, life) => showToast('info', summary, detail, life),
    showWarn: (summary, detail, life) => showToast('warn', summary, detail, life),
    showError: (summary, detail, life) => showToast('error', summary, detail, life)
  };
};

const toast = {
  success: (summary, detail, life = 3000) => {
    const toastInstance = window.PrimeReact?.toast;
    toastInstance?.show({ severity: 'success', summary, detail, life });
  },
  info: (summary, detail, life = 3000) => {
    const toastInstance = window.PrimeReact?.toast;
    toastInstance?.show({ severity: 'info', summary, detail, life });
  },
  warn: (summary, detail, life = 3000) => {
    const toastInstance = window.PrimeReact?.toast;
    toastInstance?.show({ severity: 'warn', summary, detail, life });
  },
  error: (summary, detail, life = 3000) => {
    const toastInstance = window.PrimeReact?.toast;
    toastInstance?.show({ severity: 'error', summary, detail, life });
  }
};

export { toast };
