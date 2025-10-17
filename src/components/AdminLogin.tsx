import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

// Credenciales de administrador (en producción deberían estar en variables de entorno)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Duración de la sesión: 7 días en milisegundos
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar si ya hay una sesión válida al cargar el componente
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = () => {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (sessionData) {
        const { timestamp, authenticated } = JSON.parse(sessionData);
        const now = Date.now();
        
        // Verificar si la sesión aún es válida (menos de 7 días)
        if (authenticated && (now - timestamp) < SESSION_DURATION) {
          console.log('Sesión válida encontrada, iniciando sesión automáticamente');
          onLogin();
          return;
        } else {
          // Sesión expirada, limpiar
          localStorage.removeItem('admin_session');
          console.log('Sesión expirada, requiere nuevo login');
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      localStorage.removeItem('admin_session');
    }
  };

  const saveSession = () => {
    const sessionData = {
      authenticated: true,
      timestamp: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION
    };
    localStorage.setItem('admin_session', JSON.stringify(sessionData));
    console.log('Sesión guardada por 7 días');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simular un pequeño delay para mejor UX
      await new Promise(resolve => setTimeout(resolve, 500));

      if (credentials.username === ADMIN_CREDENTIALS.username && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        
        // Guardar sesión por 7 días
        saveSession();
        
        console.log('Login exitoso, sesión guardada');
        onLogin();
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getRemainingSessionTime = () => {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (sessionData) {
        const { timestamp } = JSON.parse(sessionData);
        const elapsed = Date.now() - timestamp;
        const remaining = SESSION_DURATION - elapsed;
        
        if (remaining > 0) {
          const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
          const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          return { days, hours, valid: true };
        }
      }
    } catch (error) {
      console.error('Error al calcular tiempo de sesión:', error);
    }
    return { days: 0, hours: 0, valid: false };
  };

  const sessionInfo = getRemainingSessionTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Panel de Administración
            </CardTitle>
            <p className="text-gray-400 mt-2">
              Los Ángeles Motors
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {sessionInfo.valid && (
              <Alert className="border-green-500 bg-green-500/10">
                <AlertDescription className="text-green-400">
                  Sesión activa: {sessionInfo.days} días, {sessionInfo.hours} horas restantes
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Ingresa tu usuario"
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Ingresa tu contraseña"
                    className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                La sesión se mantendrá activa por 7 días
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Credenciales: admin / admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}