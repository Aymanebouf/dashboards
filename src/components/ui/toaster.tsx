
import React from 'react';
import { Toast } from 'primereact/toast';
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toast } = useToast();

  return (
    <Toast ref={toast} position="top-right" />
  );
}
