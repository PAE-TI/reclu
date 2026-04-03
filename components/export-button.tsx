
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PDFGenerator } from '@/lib/pdf-generator';

interface ExportButtonProps {
  evaluationId: string;
  title?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

export default function ExportButton({ 
  evaluationId, 
  title = 'Exportar PDF',
  variant = 'outline',
  size = 'default'
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Obtener datos para el PDF
      const response = await fetch(`/api/export/pdf/${evaluationId}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los datos del reporte');
      }

      const data = await response.json();
      
      // Generar nombre del archivo
      const filename = `reporte-disc-${data.evaluation.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;

      // Generar y descargar PDF
      await PDFGenerator.downloadPDF(data.html, {
        filename,
        format: 'a4',
        orientation: 'portrait'
      });

      toast.success('PDF generado y descargado exitosamente');
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Error al generar el PDF. Intenta nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport}
      disabled={isExporting}
      variant={variant}
      size={size}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {isExporting ? 'Generando PDF...' : title}
    </Button>
  );
}
