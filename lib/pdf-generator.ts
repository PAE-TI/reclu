
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

export class PDFGenerator {
  static async generateFromHTML(htmlContent: string, options: ExportOptions = {}) {
    const {
      filename = 'reporte-disc.pdf',
      format = 'a4',
      orientation = 'portrait'
    } = options;

    try {
      // Crear un elemento temporal para el HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      document.body.appendChild(tempDiv);

      // Convertir HTML a canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight
      });

      // Remover el elemento temporal
      document.body.removeChild(tempDiv);

      // Crear PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF(orientation, 'mm', format);

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calcular dimensiones proporcionales
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;

      let pdfWidth = pageWidth - 20; // 10mm margin on each side
      let pdfHeight = pdfWidth / ratio;

      // Si la imagen es muy alta, ajustar para que entre en múltiples páginas
      if (pdfHeight > pageHeight - 20) {
        // Dividir en múltiples páginas
        let yPosition = 0;
        let pageNum = 1;

        while (yPosition < imgHeight) {
          if (pageNum > 1) {
            pdf.addPage();
          }

          const remainingHeight = imgHeight - yPosition;
          const pageCanvasHeight = Math.min(
            remainingHeight,
            (pageHeight - 20) * (imgWidth / pdfWidth)
          );

          // Crear canvas para esta página
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = pageCanvasHeight;
          const pageCtx = pageCanvas.getContext('2d')!;

          pageCtx.drawImage(
            canvas,
            0, yPosition,
            imgWidth, pageCanvasHeight,
            0, 0,
            imgWidth, pageCanvasHeight
          );

          const pageImgData = pageCanvas.toDataURL('image/png');
          const actualPdfHeight = (pageCanvasHeight / imgWidth) * pdfWidth;

          pdf.addImage(
            pageImgData,
            'PNG',
            10,
            10,
            pdfWidth,
            actualPdfHeight
          );

          yPosition += pageCanvasHeight;
          pageNum++;
        }
      } else {
        // La imagen entra en una sola página
        pdf.addImage(
          imgData,
          'PNG',
          10,
          10,
          pdfWidth,
          pdfHeight
        );
      }

      return pdf;

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Error al generar el PDF');
    }
  }

  static async downloadPDF(htmlContent: string, options: ExportOptions = {}) {
    const pdf = await this.generateFromHTML(htmlContent, options);
    pdf.save(options.filename || 'reporte-disc.pdf');
  }

  static async getPDFBlob(htmlContent: string, options: ExportOptions = {}) {
    const pdf = await this.generateFromHTML(htmlContent, options);
    return pdf.output('blob');
  }
}
