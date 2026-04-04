'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExternalResultsExportButtonProps {
  type: 'disc' | 'driving-forces' | 'eq' | 'dna' | 'acumen' | 'values' | 'stress' | 'technical';
  token: string;
  recipientName: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

// Map evaluation types to their results page URLs
const getResultsPageUrl = (type: string, token: string): string => {
  const urlMap: Record<string, string> = {
    'disc': `/external-evaluation-results/${token}`,
    'driving-forces': `/external-driving-forces-evaluation-results/${token}`,
    'eq': `/external-eq-evaluation-results/${token}`,
    'dna': `/external-dna-evaluation-results/${token}`,
    'acumen': `/external-acumen-evaluation-results/${token}`,
    'values': `/external-values-evaluation-results/${token}`,
    'stress': `/external-stress-evaluation-results/${token}`,
    'technical': `/external-technical-evaluation-results/${token}`,
  };
  return urlMap[type] || '';
};

export function ExternalResultsExportButton({
  type,
  token,
  recipientName,
  size = 'sm',
  variant = 'outline',
  className = '',
}: ExternalResultsExportButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const resultsUrl = getResultsPageUrl(type, token);
      if (!resultsUrl) {
        throw new Error('Tipo de evaluación no válido');
      }

      // Open the results page in a new window
      const printWindow = window.open(resultsUrl, '_blank');
      if (!printWindow) {
        throw new Error('No se pudo abrir la ventana. Por favor, permite las ventanas emergentes.');
      }

      // Wait for the page to fully load including data fetching
      // We need to wait longer because Next.js pages load the shell first, then fetch data
      setTimeout(() => {
        try {
          printWindow.print();
        } catch {
          // If print fails, the user can still manually print
        }
        setDownloading(false);
      }, 3500); // 3.5 seconds should be enough for the page and data to load

      toast.success('Preparando PDF para imprimir...');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error(error instanceof Error ? error.message : 'Error al descargar el PDF');
      setDownloading(false);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleDownload}
      disabled={downloading}
      className={`bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 ${className}`}
    >
      {downloading ? (
        <>
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-1" />
          Descargar PDF
        </>
      )}
    </Button>
  );
}
