import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { User } from '../App';
import { Car } from 'lucide-react';
import oxxoLogo from '../assets/logo-sin-fondo-2.png';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

// Usuarios de demostración
const demoUsers = [
  { id: '1', name: 'Admin OXXO', email: 'admin@oxxo.com', role: 'admin' as const },
  { id: '2', name: 'Carlos Usuario', email: 'usuario@oxxo.com', role: 'user' as const },
  { id: '3', name: 'Juan Conductor', email: 'conductor@oxxo.com', role: 'driver' as const },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user' | 'driver'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = demoUsers.find(u => u.role === selectedRole);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-600 to-red-800 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={oxxoLogo} alt="OXXO" className="h-24" />
        </div>
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-600 p-4 rounded-full">
                <Car className="size-8 text-white" />
              </div>
            </div>
            <CardTitle>OXXO Viajes</CardTitle>
            <CardDescription>Selecciona tu rol para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label>Selecciona tu perfil</Label>
                <RadioGroup value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'admin' | 'user' | 'driver')}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex-1 cursor-pointer">
                      <div>
                        <p className="text-gray-900">Administrador</p>
                        <p className="text-sm text-gray-500">Gestión completa del sistema</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="flex-1 cursor-pointer">
                      <div>
                        <p className="text-gray-900">Usuario</p>
                        <p className="text-sm text-gray-500">Solicitar viajes</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="driver" id="driver" />
                    <Label htmlFor="driver" className="flex-1 cursor-pointer">
                      <div>
                        <p className="text-gray-900">Conductor</p>
                        <p className="text-sm text-gray-500">Realizar viajes</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Iniciar sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}