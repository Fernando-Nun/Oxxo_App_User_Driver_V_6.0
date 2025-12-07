import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Mail, Phone, MapPin, Star, Car, Calendar, Award } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProfileViewProps {
  open: boolean;
  onClose: () => void;
  userType: 'user' | 'driver';
  userData: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    rating?: number;
    totalTrips?: number;
    memberSince?: string;
    // Específico del conductor
    vehicle?: string;
    plate?: string;
    licenseNumber?: string;
  };
}

export function ProfileView({ open, onClose, userType, userData }: ProfileViewProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {userType === 'driver' ? 'Perfil del Conductor' : 'Mi Perfil'}
          </DialogTitle>
          <DialogDescription>
            Información personal y estadísticas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar and Name */}
          <div className="text-center">
            <Avatar className="size-24 mx-auto mb-4">
              <AvatarFallback className={`text-2xl ${userType === 'driver' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                {userData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-gray-900 mb-1">{userData.name}</h3>
            <Badge variant="secondary" className="mb-2">
              {userType === 'driver' ? 'Conductor OXXO' : 'Usuario OXXO Viajes'}
            </Badge>
            {userData.rating && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="size-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm text-gray-700">{userData.rating} / 5.0</span>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm text-gray-500">Información de contacto</h4>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="size-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Correo electrónico</p>
                <p className="text-sm text-gray-900">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="size-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Teléfono</p>
                <p className="text-sm text-gray-900">{userData.phone}</p>
              </div>
            </div>

            {userData.address && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="size-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Dirección</p>
                  <p className="text-sm text-gray-900">{userData.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Información específica del conductor */}
          {userType === 'driver' && userData.vehicle && (
            <div className="space-y-3">
              <h4 className="text-sm text-gray-500">Información del vehículo</h4>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Car className="size-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Vehículo</p>
                  <p className="text-sm text-gray-900">{userData.vehicle}</p>
                </div>
              </div>

              {userData.plate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Award className="size-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Placas</p>
                    <p className="text-sm text-gray-900">{userData.plate}</p>
                  </div>
                </div>
              )}

              {userData.licenseNumber && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Award className="size-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Licencia</p>
                    <p className="text-sm text-gray-900">{userData.licenseNumber}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Statistics */}
          <div className="space-y-3">
            <h4 className="text-sm text-gray-500">Estadísticas</h4>

            <div className="grid grid-cols-2 gap-3">
              {userData.totalTrips && (
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl text-blue-600">{userData.totalTrips}</p>
                  <p className="text-xs text-gray-600">Viajes totales</p>
                </div>
              )}

              {userData.memberSince && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="size-4 text-green-600" />
                    <p className="text-xs text-gray-600">Miembro desde</p>
                  </div>
                  <p className="text-sm text-gray-900">{userData.memberSince}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}