
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Share2, 
  Copy, 
  Mail, 
  Download,
  ChevronDown,
  Check,
  Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PDFGenerator } from '@/lib/pdf-generator';

interface ShareButtonProps {
  evaluationId: string;
  evaluationTitle: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

export default function ShareButton({ 
  evaluationId, 
  evaluationTitle,
  variant = 'outline',
  size = 'default'
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'pdf'>('link');

  // Generar link de compartir
  const shareUrl = `${window.location.origin}/results/${evaluationId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar el enlace');
    }
  };

  const handleEmailShare = async (email: string, message: string) => {
    setIsSharing(true);
    
    try {
      const subject = encodeURIComponent(`Reporte DISC: ${evaluationTitle}`);
      const body = encodeURIComponent(
        `${message}\n\nPuedes ver el reporte completo en: ${shareUrl}\n\n` +
        `Este reporte fue generado por el Sistema Reclu.`
      );
      
      const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
      window.open(mailtoUrl);
      
      toast.success('Cliente de email abierto');
      setIsOpen(false);
    } catch (error) {
      toast.error('Error al abrir el cliente de email');
    } finally {
      setIsSharing(false);
    }
  };

  const handlePDFShare = async () => {
    setIsSharing(true);
    
    try {
      // Obtener datos para el PDF
      const response = await fetch(`/api/export/pdf/${evaluationId}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los datos del reporte');
      }

      const data = await response.json();
      
      // Generar PDF como blob
      const pdfBlob = await PDFGenerator.getPDFBlob(data.html, {
        format: 'a4',
        orientation: 'portrait'
      });

      // Crear URL temporal para el blob
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      // Crear enlace temporal para descarga
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `reporte-disc-${evaluationTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Limpiar URL temporal
      URL.revokeObjectURL(blobUrl);

      toast.success('PDF generado para compartir');
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setIsSharing(false);
    }
  };

  const ShareMethodContent = () => {
    switch (shareMethod) {
      case 'link':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="share-url">Enlace para compartir</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className="min-w-[100px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'email':
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;
            const message = formData.get('message') as string;
            handleEmailShare(email, message);
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="destinatario@email.com"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">Mensaje personal (opcional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Hola, te comparto mi reporte de evaluación DISC..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSharing}
              >
                {isSharing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {isSharing ? 'Preparando email...' : 'Abrir cliente de email'}
              </Button>
            </div>
          </form>
        );
        
      case 'pdf':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Genera un PDF del reporte que puedes adjuntar y enviar manualmente.
            </p>
            <Button 
              onClick={handlePDFShare}
              className="w-full"
              disabled={isSharing}
            >
              {isSharing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isSharing ? 'Generando PDF...' : 'Descargar PDF para compartir'}
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="w-4 h-4 mr-2" />
          Compartir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Reporte</DialogTitle>
          <DialogDescription>
            Comparte tu reporte DISC con colegas, supervisores o coaches.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Method Selector */}
          <div>
            <Label>Método de compartir</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between mt-1">
                  {shareMethod === 'link' && (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar enlace
                    </>
                  )}
                  {shareMethod === 'email' && (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar por email
                    </>
                  )}
                  {shareMethod === 'pdf' && (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={() => setShareMethod('link')}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar enlace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShareMethod('email')}>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar por email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShareMethod('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Method Content */}
          <ShareMethodContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
