'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  ArrowRight,
  User
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface InvitationData {
  name: string;
  email: string;
  jobTitle: string;
  company: string;
  senderName: string;
  accessLevel: 'FULL_ACCESS' | 'OWN_EVALUATIONS';
}

export default function AcceptInvitePage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [error, setError] = useState<{ message: string; status?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchInvitation();
  }, [params.token]);

  const fetchInvitation = async () => {
    try {
      const res = await fetch(`/api/team/invite/${params.token}`);
      const data = await res.json();

      if (res.ok) {
        setInvitation(data.invitation);
        setName(data.invitation.name);
      } else {
        setError({ message: data.error, status: data.status });
      }
    } catch (err) {
      console.error('Error fetching invitation:', err);
      setError({ message: 'Error al cargar la invitación' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/team/invite/${params.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, name })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success('¡Cuenta creada exitosamente!');
      } else {
        toast.error(data.error || 'Error al crear cuenta');
      }
    } catch (err) {
      console.error('Error accepting invitation:', err);
      toast.error('Error al crear cuenta');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              {error.status === 'ACCEPTED' ? (
                <>
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Invitación Ya Aceptada</h2>
                  <p className="text-gray-600 mb-6">Esta invitación ya fue utilizada. Puedes iniciar sesión con tu cuenta.</p>
                </>
              ) : error.status === 'EXPIRED' ? (
                <>
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Invitación Expirada</h2>
                  <p className="text-gray-600 mb-6">Esta invitación ha expirado. Solicita una nueva invitación a tu administrador.</p>
                </>
              ) : error.status === 'REVOKED' ? (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Invitación Revocada</h2>
                  <p className="text-gray-600 mb-6">Esta invitación fue cancelada. Contacta a tu administrador si crees que es un error.</p>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Invitación No Válida</h2>
                  <p className="text-gray-600 mb-6">{error.message}</p>
                </>
              )}
              <Link href="/auth/signin">
                <Button className="w-full">
                  Ir a Iniciar Sesión
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">¡Cuenta Creada Exitosamente!</h2>
              <p className="text-gray-600 mb-6">
                Ya puedes iniciar sesión en MotivaIQ con tu correo electrónico y contraseña.
              </p>
              <Link href="/auth/signin">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Iniciar Sesión <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">¡Bienvenido al Equipo!</CardTitle>
          <CardDescription className="text-indigo-100">
            {invitation?.senderName} te ha invitado a unirte a {invitation?.company}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Pre-filled Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Tu información</h3>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Correo</p>
                <p className="font-medium">{invitation?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Cargo</p>
                <p className="font-medium">{invitation?.jobTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Empresa</p>
                <p className="font-medium">{invitation?.company}</p>
              </div>
            </div>
            <div className="pt-2">
              <Badge className={invitation?.accessLevel === 'FULL_ACCESS' 
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
              }>
                {invitation?.accessLevel === 'FULL_ACCESS' 
                  ? 'Acceso Completo'
                  : 'Acceso a tus evaluaciones'
                }
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">Puedes ajustar tu nombre si es necesario</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Crear contraseña</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={submitting}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creando cuenta...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" />Crear mi Cuenta</>
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Al crear tu cuenta, aceptas los{' '}
            <Link href="/terms" className="text-indigo-600 hover:underline">
              Términos y Condiciones
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
