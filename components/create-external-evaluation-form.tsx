
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import {
  Send,
  Loader2,
  CheckCircle,
  Copy,
  Mail,
  Coins
} from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  recipientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  recipientEmail: z.string().email('Formato de email inválido'),
});

type FormData = z.infer<typeof formSchema>;

interface CreatedEvaluation {
  id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  evaluationLink: string;
  emailSent: boolean;
}

export default function CreateExternalEvaluationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEvaluation, setCreatedEvaluation] = useState<CreatedEvaluation | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [creditInfo, setCreditInfo] = useState<{
    credits: number;
    creditsPerEvaluation: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/credits')
      .then(res => res.json())
      .then(data => {
        setCreditInfo({
          credits: data.credits || 0,
          creditsPerEvaluation: data.creditsPerEvaluation || 2
        });
      })
      .catch(err => console.error('Error fetching credits:', err));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/external-evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la evaluación');
      }

      setCreatedEvaluation({
        id: result.evaluation.id,
        title: result.evaluation.title,
        recipientName: result.evaluation.recipientName,
        recipientEmail: result.evaluation.recipientEmail,
        evaluationLink: result.evaluationLink,
        emailSent: result.emailSent
      });

      if (result.emailSent) {
        toast.success(`¡Evaluación enviada exitosamente a ${data.recipientEmail}!`);
      } else {
        toast.error('La evaluación fue creada pero no se pudo enviar el email. Puedes compartir el enlace manualmente.');
      }

      reset();
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al enviar la evaluación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!createdEvaluation?.evaluationLink) return;
    
    try {
      await navigator.clipboard.writeText(createdEvaluation.evaluationLink);
      setLinkCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar el enlace');
    }
  };

  const handleNewEvaluation = () => {
    setCreatedEvaluation(null);
    setLinkCopied(false);
  };

  if (createdEvaluation) {
    return (
      <div className="space-y-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  ¡Evaluación Enviada Exitosamente!
                </h3>
                <p className="text-green-600">
                  La evaluación "{createdEvaluation.title}" ha sido enviada a {createdEvaluation.recipientName}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Destinatario:</strong> {createdEvaluation.recipientName}
                </div>
                <div>
                  <strong>Email:</strong> {createdEvaluation.recipientEmail}
                </div>
                <div>
                  <strong>Estado del Email:</strong> {' '}
                  <span className={createdEvaluation.emailSent ? 'text-green-600' : 'text-red-600'}>
                    {createdEvaluation.emailSent ? '✅ Enviado' : '❌ Falló'}
                  </span>
                </div>
                <div>
                  <strong>Expira en:</strong> 24 horas
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm font-medium text-gray-700">Enlace de Evaluación</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={createdEvaluation.evaluationLink}
                    readOnly
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleCopyLink}
                    variant="outline"
                    className="min-w-[100px]"
                  >
                    {linkCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
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
                <p className="text-xs text-gray-500 mt-1">
                  Comparte este enlace directamente si el email no llegó
                </p>
              </div>

              {!createdEvaluation.emailSent && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800 mb-2">
                    <Mail className="w-4 h-4" />
                    <strong>Email no enviado</strong>
                  </div>
                  <p className="text-amber-700 text-sm">
                    El correo electrónico no pudo ser enviado automáticamente. 
                    Puedes copiar y compartir el enlace manualmente con {createdEvaluation.recipientName}.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleNewEvaluation} className="bg-indigo-600 hover:bg-indigo-700">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Nueva Evaluación
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/external-evaluations?tab=manage'}>
                  Ver Todas las Evaluaciones
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título de la Evaluación *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="ej: Evaluación DISC - Equipo de Ventas"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientName">Nombre del Evaluado *</Label>
          <Input
            id="recipientName"
            {...register('recipientName')}
            placeholder="ej: María González"
            className={errors.recipientName ? 'border-red-500' : ''}
          />
          {errors.recipientName && (
            <p className="text-sm text-red-500">{errors.recipientName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipientEmail">Correo Electrónico *</Label>
        <Input
          id="recipientEmail"
          type="email"
          {...register('recipientEmail')}
          placeholder="ej: maria.gonzalez@empresa.com"
          className={errors.recipientEmail ? 'border-red-500' : ''}
        />
        {errors.recipientEmail && (
          <p className="text-sm text-red-500">{errors.recipientEmail.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción o Propósito (Opcional)</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="ej: Esta evaluación es parte del proceso de desarrollo profesional para identificar fortalezas y áreas de mejora..."
          rows={4}
        />
        <p className="text-xs text-gray-500">
          Esta descripción será incluida en el correo electrónico explicativo
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 min-w-[160px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Evaluación
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Limpiar Formulario
        </Button>
      </div>

      {/* Info de créditos */}
      {creditInfo && (
        <div className={`rounded-lg p-4 mt-6 flex items-center gap-3 ${
          creditInfo.credits < creditInfo.creditsPerEvaluation
            ? 'bg-red-50 border border-red-200'
            : 'bg-emerald-50 border border-emerald-200'
        }`}>
          <div className={`p-2 rounded-lg ${
            creditInfo.credits < creditInfo.creditsPerEvaluation
              ? 'bg-red-100'
              : 'bg-emerald-100'
          }`}>
            <Coins className={`w-5 h-5 ${
              creditInfo.credits < creditInfo.creditsPerEvaluation
                ? 'text-red-600'
                : 'text-emerald-600'
            }`} />
          </div>
          <div>
            <p className={`font-semibold text-sm ${
              creditInfo.credits < creditInfo.creditsPerEvaluation
                ? 'text-red-800'
                : 'text-emerald-800'
            }`}>
              Esta evaluación consume {creditInfo.creditsPerEvaluation} crédito{creditInfo.creditsPerEvaluation !== 1 ? 's' : ''}
            </p>
            <p className={`text-xs ${
              creditInfo.credits < creditInfo.creditsPerEvaluation
                ? 'text-red-600'
                : 'text-emerald-600'
            }`}>
              {creditInfo.credits < creditInfo.creditsPerEvaluation
                ? `Créditos insuficientes. Tienes ${creditInfo.credits} créditos disponibles.`
                : `Tienes ${creditInfo.credits} créditos disponibles.`
              }
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <h4 className="font-semibold text-blue-800 mb-2">📧 ¿Qué recibirá el evaluado?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Un correo explicativo sobre qué es la evaluación DISC</li>
          <li>• Instrucciones claras sobre cómo completar la evaluación</li>
          <li>• Un enlace seguro que expira en 24 horas</li>
          <li>• Información sobre el tiempo estimado (10-15 minutos)</li>
        </ul>
      </div>
    </form>
  );
}
