
import { useRef } from 'react';
import { useToast as usePrimeToast } from 'primereact/toast';

export const useToast = () => {
  const toast = useRef(null);
  
  const showToast = (options) => {
    if (toast.current) {
      const { title, description, variant = 'default' } = options;
      
      const severity = variant === 'destructive' ? 'error' : 'info';
      
      toast.current.show({
        severity,
        summary: title,
        detail: description,
        life: 3000
      });
    }
  };
  
  return {
    toast,
    toasts: [],
    showToast
  };
};

export const toast = {
  info: (options) => {
    return {
      id: Date.now(),
      title: options.title,
      description: options.description,
      variant: 'default'
    };
  },
  error: (options) => {
    return {
      id: Date.now(),
      title: options.title,
      description: options.description,
      variant: 'destructive'
    };
  }
};
