import { useState, useRef, useEffect } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LogOut, 
  MapPin,
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  Navigation,
  Phone,
  AlertCircle,
  User as UserIcon,
  Users,
  Activity,
  List,
  History,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { SwipeToConfirm } from './SwipeToConfirm';
import { ProfileView } from './ProfileView';
import { DriverMapView } from './DriverMapView';
import oxxoLogo from '../assets/logo-sin-fondo-3.png';

interface DriverDashboardProps {
  user: User;
  onLogout: () => void;
}

const mockAvailableTrips = [
  { 
    id: 'VIA-005', 
    customer: 'Pedro',
    pickup: 'Av. Insurgentes 456, Col. Roma',
    destination: 'OXXO Central - Santa Fe',
    distance: '8.3 km',
    payment: 245,
    estimatedDuration: '22 min'
  },
  { 
    id: 'VIA-006', 
    customer: 'Laura',
    pickup: 'Calle Morelos 123, Col. Centro',
    destination: 'OXXO Polanco',
    distance: '5.8 km',
    payment: 180,
    estimatedDuration: '15 min'
  },
];

const mockCompletedTrips = [
  { id: 'VIA-001', date: '20 Nov', customer: 'Pedro', payment: 245, rating: 5, duration: '22 min' },
  { id: 'VIA-002', date: '20 Nov', customer: 'Laura', payment: 180, rating: 4, duration: '15 min' },
  { id: 'VIA-003', date: '19 Nov', customer: 'Roberto', payment: 320, rating: 5, duration: '35 min' },
];

export function DriverDashboard({ user, onLogout }: DriverDashboardProps) {
  const [activeTab, setActiveTab] = useState('active');
  const [isOnline, setIsOnline] = useState(true);
  const [tripStatus, setTripStatus] = useState<'none' | 'going_to_pickup' | 'arrived' | 'waiting_nip' | 'in_progress'>('none');
  const [nip, setNip] = useState('');
  const [currentPassengers, setCurrentPassengers] = useState(2);
  const [showProfile, setShowProfile] = useState(false);
  const maxPassengers = 4;
  const tripInProgressRef = useRef<HTMLDivElement>(null);

  const mockActiveTrip = {
    id: 'VIA-004',
    customer: {
      name: 'Sofia',
      phone: '+52 55 9876 5432',
      rating: 4.9
    },
    pickup: 'Av. Reforma 789, Col. Polanco',
    destination: 'OXXO Central - Santa Fe',
    payment: 350,
    estimatedTime: '18 min',
    distance: '12.5 km'
  };

  const totalEarningsToday = mockCompletedTrips.reduce((sum, trip) => sum + trip.payment, 0);
  const totalTrips = mockCompletedTrips.length;

  const driverProfileData = {
    name: user.name,
    email: user.email || 'conductor@oxxo.com',
    phone: '+52 55 1234 5678',
    address: 'Col. Condesa, CDMX',
    rating: 4.8,
    totalTrips: totalTrips + 47,
    memberSince: 'Junio 2023',
    vehicle: 'Toyota Corolla 2020',
    plate: 'ABC-123-D',
    licenseNumber: 'CDMX-5678-9012'
  };

  const handleAcceptTrip = (tripId: string) => {
    setTripStatus('going_to_pickup');
    setActiveTab('active');
  };

  const handleArrivalConfirm = () => {
    setTripStatus('arrived');
  };

  const handleNIPSubmit = () => {
    // En producción, verificar el NIP con el backend
    if (nip.length === 4) {
      setTripStatus('in_progress');
      setCurrentPassengers(prev => prev + 1);
      setNip('');
    }
  };

  useEffect(() => {
    if (tripStatus === 'in_progress') {
      // Esperar a que el DOM se actualice completamente
      const scrollToTrip = () => {
        if (tripInProgressRef.current) {
          tripInProgressRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      };

      // Usar requestAnimationFrame para esperar al siguiente frame
      requestAnimationFrame(() => {
        setTimeout(scrollToTrip, 100);
      });
    }
  }, [tripStatus]);

  const handleCompleteTrip = () => {
    setTripStatus('none');
    setCurrentPassengers(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={oxxoLogo} alt="OXXO" className="h-10" />
              <Avatar className="cursor-pointer" onClick={() => setShowProfile(true)}>
                <AvatarFallback className="bg-green-600 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-gray-900">{user.name}</h1>
                <p className="text-xs text-gray-500">Conductor OXXO</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="size-4" />
            </Button>
          </div>

          {/* Online Status Toggle */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`size-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <Label htmlFor="online-mode" className="cursor-pointer">
                {isOnline ? 'En línea - Aceptando viajes' : 'Fuera de línea'}
              </Label>
            </div>
            <Switch
              id="online-mode"
              checked={isOnline}
              onCheckedChange={setIsOnline}
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <Car className="size-6 mx-auto mb-1 text-blue-600" />
              <div className="text-gray-900">{totalTrips}</div>
              <p className="text-xs text-gray-500">Viajes hoy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <DollarSign className="size-6 mx-auto mb-1 text-green-600" />
              <div className="text-gray-900">${totalEarningsToday}</div>
              <p className="text-xs text-gray-500">Ganado hoy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <CheckCircle className="size-6 mx-auto mb-1 text-purple-600" />
              <div className="text-gray-900">4.8</div>
              <p className="text-xs text-gray-500">Calificación</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Users className="size-6 mx-auto mb-1 text-orange-600" />
              <div className="text-gray-900">{currentPassengers}/{maxPassengers}</div>
              <p className="text-xs text-gray-500">Pasajeros</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

          {/* Active Trip Tab */}
          <TabsContent value="active" className="space-y-4">
            {tripStatus === 'none' ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Car className="size-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2">No tienes viajes activos</p>
                  <p className="text-sm text-gray-400">Los nuevos viajes aparecerán aquí</p>
                </CardContent>
              </Card>
            ) : tripStatus === 'going_to_pickup' ? (
              <Card className="border-2 border-blue-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>En camino al punto de recogida</CardTitle>
                    <Badge variant="default" className="bg-blue-600">Recolección</Badge>
                  </div>
                  <CardDescription>{mockActiveTrip.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Passenger Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Pasajero a recoger:</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-600 text-white">
                            {mockActiveTrip.customer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-gray-900">{mockActiveTrip.customer.name}</p>
                          <p className="text-xs text-gray-500">⭐ {mockActiveTrip.customer.rating}</p>
                          <p className="text-xs text-gray-500">{mockActiveTrip.customer.phone}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Phone className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Current Passengers */}
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="size-5 text-orange-600" />
                        <span className="text-sm text-gray-900">Pasajeros actuales en el vehículo</span>
                      </div>
                      <span className="text-sm text-gray-900">{currentPassengers}/{maxPassengers}</span>
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-2 border-green-600">
                      <MapPin className="size-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Punto de recogida:</p>
                        <p className="text-sm text-gray-900">{mockActiveTrip.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <MapPin className="size-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Destino final:</p>
                        <p className="text-sm text-gray-900">{mockActiveTrip.destination}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Distancia</p>
                        <p className="text-sm text-gray-900">{mockActiveTrip.distance}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Tiempo est.</p>
                        <p className="text-sm text-gray-900">{mockActiveTrip.estimatedTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Map */}
                  <DriverMapView 
                    height="250px"
                    currentLocation={{ lat: 19.4200, lng: -99.1500 }}
                    pickupLocation={{ lat: 19.4326, lng: -99.1332 }}
                    destination={{ lat: 19.3629, lng: -99.1763 }}
                    showNavigation={true}
                  />

                  {/* Action Buttons */}
                  <div className="space-y-3">


                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-500 mb-3 text-center">Cuando llegues al punto de recogida:</p>
                      <SwipeToConfirm
                        text="Desliza para confirmar llegada"
                        onConfirm={handleArrivalConfirm}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : tripStatus === 'arrived' ? (
              <Card className="border-2 border-yellow-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Esperando confirmación del pasajero</CardTitle>
                    <Badge variant="default" className="bg-yellow-600">En espera</Badge>
                  </div>
                  <CardDescription>{mockActiveTrip.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 p-6 rounded-lg text-center border-2 border-yellow-600">
                    <Clock className="size-12 mx-auto mb-3 text-yellow-600 animate-pulse" />
                    <p className="text-gray-900 mb-2">Esperando al pasajero</p>
                    <p className="text-sm text-gray-500">El pasajero debe confirmar que estás en el punto de recogida</p>
                  </div>

                  {/* Passenger Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {mockActiveTrip.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-900">{mockActiveTrip.customer.name}</p>
                        <p className="text-xs text-gray-500">{mockActiveTrip.customer.phone}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="size-4" />
                    </Button>
                  </div>

                  <Button 
                    onClick={() => setTripStatus('waiting_nip')} 
                    className="w-full bg-gray-600 hover:bg-gray-700"
                  >
                    Simular confirmación del pasajero
                  </Button>
                </CardContent>
              </Card>
            ) : tripStatus === 'waiting_nip' ? (
              <Card className="border-2 border-purple-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Ingresa el NIP para iniciar</CardTitle>
                    <Badge variant="default" className="bg-purple-600">Listo para iniciar</Badge>
                  </div>
                  <CardDescription>{mockActiveTrip.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-purple-50 p-6 rounded-lg text-center border-2 border-purple-600">
                    <CheckCircle className="size-12 mx-auto mb-3 text-purple-600" />
                    <p className="text-sm text-gray-500 mb-4">El pasajero te proporcionará un NIP de 4 dígitos</p>

                    <div className="max-w-xs mx-auto space-y-3">
                      <Label htmlFor="nip">Ingresa el NIP:</Label>
                      <Input
                        id="nip"
                        type="text"
                        maxLength={4}
                        placeholder="0000"
                        value={nip}
                        onChange={(e) => setNip(e.target.value.replace(/\D/g, ''))}
                        className="text-center text-2xl tracking-widest"
                      />
                      <Button 
                        onClick={handleNIPSubmit}
                        disabled={nip.length !== 4}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Iniciar viaje
                      </Button>
                    </div>
                  </div>

                  {/* Passenger Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {mockActiveTrip.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-900">{mockActiveTrip.customer.name}</p>
                        <p className="text-xs text-gray-500">Solicita el NIP al pasajero</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="size-4" />
                    </Button>
                  </div>

                  <div className="text-center text-xs text-gray-500">
                    <p>💡 Tip: El pasajero debe mostrarte el NIP en su aplicación</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div ref={tripInProgressRef}>
                <Card className="border-2 border-green-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Viaje en curso</CardTitle>
                      <Badge variant="default" className="bg-green-600">En camino</Badge>
                    </div>
                    <CardDescription>{mockActiveTrip.id}</CardDescription>
                  </CardHeader>
                <CardContent className="space-y-4">
                  {/* Real-time Map - 60% of vertical space */}
                  <DriverMapView 
                    height="60vh"
                    currentLocation={{ lat: 19.4100, lng: -99.1400 }}
                    destination={{ lat: 19.3629, lng: -99.1763 }}
                    showNavigation={true}
                  />

                  {/* Trip Info - 40% section */}
                  <div className="space-y-3">
                    {/* Current Status */}
                    <div className="bg-green-50 p-3 rounded-lg border border-green-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Estado del viaje:</span>
                        <span className="text-sm text-green-600">Camino a destino</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Pasajeros en vehículo:</span>
                        <span className="text-sm text-gray-900">{currentPassengers}/{maxPassengers}</span>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
                        <MapPin className="size-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Origen:</p>
                          <p className="text-sm text-gray-900 line-through">{mockActiveTrip.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-2 border-red-600">
                        <MapPin className="size-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Destino:</p>
                          <p className="text-sm text-gray-900">{mockActiveTrip.destination}</p>
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Distancia rest.</p>
                        <p className="text-sm text-gray-900">8.2 km</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Tiempo est.</p>
                        <p className="text-sm text-gray-900">{mockActiveTrip.estimatedTime}</p>
                      </div>
                    </div>

                    {/* Passengers List */}
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-500 mb-2">Pasajeros en el vehículo:</p>
                      <div className="space-y-2">
                        {[mockActiveTrip.customer.name, 'María', 'Carlos'].slice(0, currentPassengers).map((passenger, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {passenger.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-900">{passenger}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Swipe to Complete */}
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-500 mb-3 text-center">¿Llegaste al destino?</p>
                      <SwipeToConfirm
                        text="Desliza para completar viaje"
                        onConfirm={handleCompleteTrip}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            )}
          </TabsContent>

          {/* Available Trips Tab */}
          <TabsContent value="available" className="space-y-4">
            {isOnline ? (
              <>
                {mockAvailableTrips.map((trip) => (
                  <Card key={trip.id} className="hover:border-green-600 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-gray-900">{trip.id}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <UserIcon className="size-3" />
                            {trip.customer}
                          </p>
                        </div>
                        <Badge variant="secondary">{trip.distance}</Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="size-4 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Recoger en:</p>
                            <p className="text-sm text-gray-900">{trip.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="size-4 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Destino:</p>
                            <p className="text-sm text-gray-900">{trip.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t pt-3">
                        <div>
                          <p className="text-sm text-gray-500">Tarifa</p>
                          <p className="text-gray-900">${trip.payment} MXN</p>
                          <p className="text-xs text-gray-400">{trip.estimatedDuration} de viaje</p>
                        </div>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptTrip(trip.id)}
                          disabled={currentPassengers >= maxPassengers}
                        >
                          {currentPassengers >= maxPassengers ? 'Vehículo lleno' : 'Aceptar'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="size-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2">Estás fuera de línea</p>
                  <p className="text-sm text-gray-400">Activa el modo en línea para recibir viajes</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Viajes completados</CardTitle>
                <CardDescription>Historial de hoy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCompletedTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="size-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">{trip.id}</p>
                          <p className="text-xs text-gray-500">{trip.customer}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="size-3" />
                            {trip.date} · {trip.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">${trip.payment}</p>
                        <p className="text-xs text-gray-500 mt-1">⭐ {trip.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900">Total del día:</p>
                    <p className="text-green-600">${totalEarningsToday} MXN</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-20">
            <div className="max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 h-auto bg-transparent p-0 rounded-none">
                <TabsTrigger 
                  value="active" 
                  className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-green-600 rounded-none"
                >
                  <Activity className="size-5" />
                  <span className="text-xs">Activo</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="available" 
                  className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-green-600 rounded-none"
                >
                  <List className="size-5" />
                  <span className="text-xs">Disponibles</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-green-600 rounded-none"
                >
                  <History className="size-5" />
                  <span className="text-xs">Historial</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </nav>
        </Tabs>
      </main>

      {/* Profile View */}
      {showProfile && (
        <ProfileView
          open={showProfile}
          onClose={() => setShowProfile(false)}
          userType="driver"
          userData={driverProfileData}
        />
      )}
    </div>
  );
}