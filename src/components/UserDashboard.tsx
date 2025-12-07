import { useState, useRef, useEffect } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LogOut, 
  MapPin,
  Car,
  Clock,
  Star,
  Navigation,
  DollarSign,
  Users,
  CheckCircle,
  Phone,
  Home,
  History
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { SwipeToConfirm } from './SwipeToConfirm';
import { SatisfactionSurvey } from './SatisfactionSurvey';
import { ProfileView } from './ProfileView';
import { MapView } from './MapView';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

const mockTripHistory = [
  { 
    id: 'VIA-001', 
    date: '20 Nov 2025', 
    from: 'Centro', 
    to: 'Polanco', 
    cost: 245, 
    status: 'completado',
    driver: 'Juan Pérez',
    rating: 5,
    duration: '25 min'
  },
  { 
    id: 'VIA-002', 
    date: '18 Nov 2025', 
    from: 'Roma Norte', 
    to: 'Condesa', 
    cost: 180, 
    status: 'completado',
    driver: 'María García',
    rating: 4,
    duration: '15 min'
  },
  { 
    id: 'VIA-003', 
    date: '15 Nov 2025', 
    from: 'Satélite', 
    to: 'Santa Fe', 
    cost: 320, 
    status: 'completado',
    driver: 'Carlos López',
    rating: 5,
    duration: '35 min'
  },
];

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [tripStatus, setTripStatus] = useState<'none' | 'waiting' | 'driver_arriving' | 'driver_arrived' | 'confirmed' | 'in_progress'>('none');
  const [newTripOpen, setNewTripOpen] = useState(false);
  const [generatedNIP, setGeneratedNIP] = useState('');
  const [showSurvey, setShowSurvey] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const tripInProgressRef = useRef<HTMLDivElement>(null);

  const mockDriverInfo = {
    name: 'Juan Pérez',
    phone: '+52 55 1234 5678',
    rating: 4.8,
    vehicle: 'Toyota Corolla',
    plate: 'ABC-123-D',
    color: 'Blanco',
    currentPassengers: 2,
    maxPassengers: 4,
    estimatedArrival: '5:15 AM',
    minutesToArrival: 8
  };

  const mockActiveTrip = {
    id: 'VIA-004',
    from: 'Av. Reforma 123',
    to: 'OXXO Central - Santa Fe',
    cost: 0, // Gratis para empleados
    estimatedTime: '12 min',
    progress: 60
  };

  // Map locations
  const userLocation = { lat: 19.4326, lng: -99.1332, label: 'Tu ubicación' };
  const oxxoLocation = { lat: 19.3629, lng: -99.1763, label: 'OXXO Santa Fe' };

  const userProfileData = {
    name: user.name,
    email: user.email || 'usuario@oxxo.com',
    phone: '+52 55 9876 5432',
    address: 'Av. Reforma 123, Col. Centro, CDMX',
    rating: 4.8,
    totalTrips: mockTripHistory.length,
    memberSince: 'Enero 2024'
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      en_curso: { variant: "default", label: "En curso" },
      completado: { variant: "outline", label: "Completado" },
      solicitado: { variant: "secondary", label: "Solicitado" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleNewTrip = () => {
    setNewTripOpen(false);
    setTripStatus('waiting');
    // Simular aceptación del driver después de 3 segundos
    setTimeout(() => {
      setTripStatus('driver_arriving');
    }, 3000);
  };

  const handleUserConfirmArrival = () => {
    // Generar NIP de 4 dígitos
    const nip = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedNIP(nip);
    setTripStatus('confirmed');
  };

  const handleTripStarted = () => {
    setTripStatus('in_progress');
    setGeneratedNIP('');
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

  const handleTripCompleted = () => {
    setTripStatus('none');
    setShowSurvey(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Car className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">OXXO Viajes</h1>
              <p className="text-xs text-gray-500">Tu transporte seguro</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="cursor-pointer" onClick={() => setShowProfile(true)}>
              <AvatarFallback className="bg-blue-600 text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-4">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-br from-red-600 to-red-800 text-white border-0">
              <CardContent className="pt-6">
                <h2 className="text-white mb-2">Hola, {user.name.split(' ')[0]}! 👋</h2>
                <p className="text-red-100 text-sm">¿Listo para ir a trabajar?</p>
              </CardContent>
            </Card>

            {/* New Trip Button - Solo mostrar si no hay viaje activo */}
            {tripStatus === 'none' && (
              <Dialog open={newTripOpen} onOpenChange={setNewTripOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full h-auto py-6 bg-red-600 hover:bg-red-700">
                    <Car className="size-6 mr-2" />
                    <div className="text-left">
                      <div className="text-white">Solicitar Viaje</div>
                      <div className="text-xs text-red-100">¿A dónde vamos?</div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solicitar Viaje</DialogTitle>
                    <DialogDescription>
                      Ingresa tu origen y destino
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup">Punto de recogida</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-green-600" />
                        <Input 
                          id="pickup" 
                          placeholder="Dirección de origen"
                          defaultValue="Av. Reforma 123, Col. Centro"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destino</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-red-600" />
                        <Input 
                          id="destination" 
                          placeholder="Dirección de destino"
                          defaultValue="OXXO Central - Santa Fe"
                        />
                      </div>
                    </div>

                    {/* Map */}
                    <MapView 
                      height="200px"
                      markers={[userLocation, oxxoLocation]}
                      route={[userLocation, oxxoLocation]}
                    />

                    {/* Price Info */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Viaje estimado</p>
                          <p className="text-gray-900">5.2 km · 15 min aprox.</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-600">GRATIS</p>
                          <p className="text-xs text-gray-500">Prestación OXXO</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleNewTrip} className="w-full bg-red-600 hover:bg-red-700">
                    Solicitar viaje
                  </Button>
                </DialogContent>
              </Dialog>
            )}

            {/* Esperando Conductor */}
            {tripStatus === 'waiting' && (
              <Card className="border-2 border-yellow-500">
                <CardContent className="pt-6 text-center">
                  <div className="animate-spin size-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-900 mb-2">Buscando conductor...</p>
                  <p className="text-sm text-gray-500">Estamos asignando un conductor a tu viaje</p>
                </CardContent>
              </Card>
            )}

            {/* Conductor en camino - Mostrar información del conductor */}
            {tripStatus === 'driver_arriving' && (
              <Card className="border-2 border-blue-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>¡Conductor asignado!</CardTitle>
                    <Badge variant="default" className="bg-blue-600">En camino</Badge>
                  </div>
                  <CardDescription>{mockActiveTrip.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tiempo de llegada del conductor */}
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Clock className="size-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-500">Tiempo estimado de llegada</p>
                    <p className="text-2xl text-gray-900">{mockDriverInfo.estimatedArrival}</p>
                    <p className="text-sm text-gray-500 mt-1">Llegará en {mockDriverInfo.minutesToArrival} minutos</p>
                  </div>

                  {/* Información del conductor */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-3">Tu conductor:</p>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="size-12">
                        <AvatarFallback className="bg-red-600 text-white">
                          {mockDriverInfo.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-gray-900">{mockDriverInfo.name}</p>
                        <p className="text-sm text-gray-500">⭐ {mockDriverInfo.rating}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="size-4" />
                      </Button>
                    </div>

                    {/* Vehicle Info */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Vehículo:</span>
                        <span className="text-gray-900">{mockDriverInfo.vehicle}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Placas:</span>
                        <span className="text-gray-900">{mockDriverInfo.plate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Color:</span>
                        <span className="text-gray-900">{mockDriverInfo.color}</span>
                      </div>
                    </div>
                  </div>

                  {/* Passengers Info */}
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="size-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-900">Viaje compartido</p>
                          <p className="text-xs text-gray-500">Ya hay {mockDriverInfo.currentPassengers} pasajeros a bordo</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-900">{mockDriverInfo.currentPassengers}/{mockDriverInfo.maxPassengers}</p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <MapPin className="size-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Recoger en:</p>
                        <p className="text-sm text-gray-900">{mockActiveTrip.from}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <MapPin className="size-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Destino:</p>
                        <p className="text-sm text-gray-900">{mockActiveTrip.to}</p>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Map */}
                  <MapView 
                    height="200px"
                    markers={[
                      userLocation,
                      { lat: 19.4200, lng: -99.1500, label: 'Conductor en camino' },
                      oxxoLocation
                    ]}
                    route={[
                      { lat: 19.4200, lng: -99.1500 },
                      userLocation
                    ]}
                  />

                  {/* Swipe to Confirm Arrival */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-3 text-center">Cuando el conductor llegue, desliza para confirmar:</p>
                    <SwipeToConfirm
                      text="Desliza para confirmar llegada"
                      onConfirm={handleUserConfirmArrival}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conductor llegó - Mostrar NIP */}
            {tripStatus === 'confirmed' && (
              <Card className="border-2 border-green-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>¡Conductor en el punto!</CardTitle>
                    <Badge variant="default" className="bg-green-600">Confirmado</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-6 rounded-lg text-center border-2 border-green-600">
                    <CheckCircle className="size-12 mx-auto mb-3 text-green-600" />
                    <p className="text-sm text-gray-500 mb-2">Proporciona este NIP al conductor:</p>
                    <p className="text-5xl tracking-widest text-green-600 mb-2">{generatedNIP}</p>
                    <p className="text-xs text-gray-500">El conductor debe ingresar este código para iniciar el viaje</p>
                  </div>

                  {/* Resumen del conductor */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-red-600 text-white">
                          {mockDriverInfo.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-900">{mockDriverInfo.name}</p>
                        <p className="text-xs text-gray-500">{mockDriverInfo.vehicle} - {mockDriverInfo.plate}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleTripStarted} 
                    className="w-full bg-gray-600 hover:bg-gray-700"
                  >
                    Simular inicio de viaje
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Trip in Progress */}
            {tripStatus === 'in_progress' && (
              <div ref={tripInProgressRef}>
              <Card className="border-2 border-red-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Viaje en curso</CardTitle>
                    <Badge variant="default" className="bg-red-600">En camino</Badge>
                  </div>
                  <CardDescription>{mockActiveTrip.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Real-time Map - 60% of vertical space */}
                  <MapView 
                    height="60vh"
                    markers={[
                      { ...userLocation, label: 'Usuario en camino - Conductor' },
                      { ...oxxoLocation, label: 'Destino - OXXO Santa Fe' }
                    ]}
                    route={[userLocation, oxxoLocation]}
                  />

                  {/* Trip Info - 40% section */}
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Llegada estimada</span>
                        <span className="text-red-600">{mockActiveTrip.estimatedTime}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${mockActiveTrip.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <MapPin className="size-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Origen</p>
                          <p className="text-sm text-gray-900">{mockActiveTrip.from}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <MapPin className="size-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Destino</p>
                          <p className="text-sm text-gray-900">{mockActiveTrip.to}</p>
                        </div>
                      </div>
                    </div>

                    {/* Passengers Count */}
                    <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="size-5 text-blue-600" />
                        <span className="text-sm text-gray-900">Pasajeros en el vehículo:</span>
                      </div>
                      <span className="text-sm text-gray-900">{mockDriverInfo.currentPassengers + 1}/{mockDriverInfo.maxPassengers}</span>
                    </div>

                    {/* Información del conductor */}
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-500 mb-2">Tu conductor:</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-red-600 text-white">
                              {mockDriverInfo.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-gray-900">{mockDriverInfo.name}</p>
                            <p className="text-xs text-gray-500">⭐ {mockDriverInfo.rating}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Swipe to Confirm Arrival at Destination */}
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-500 mb-3 text-center">¿Llegaste a tu destino?</p>
                      <SwipeToConfirm
                        text="Desliza para confirmar llegada"
                        onConfirm={handleTripCompleted}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            )}

            {/* Quick Stats */}
            {tripStatus === 'none' && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Car className="size-8 mx-auto mb-2 text-red-600" />
                    <div className="text-gray-900">{mockTripHistory.length}</div>
                    <p className="text-sm text-gray-500">Viajes totales</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Star className="size-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-gray-900">4.8</div>
                    <p className="text-sm text-gray-500">Tu calificación</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Viajes</CardTitle>
                <CardDescription>Todos tus viajes anteriores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTripHistory.map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-gray-900">{trip.id}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="size-3" />
                            {trip.date}
                          </p>
                        </div>
                        {getStatusBadge(trip.status)}
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="size-4 text-green-600" />
                          <span className="text-gray-900">{trip.from}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="size-4 text-red-600" />
                          <span className="text-gray-900">{trip.to}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t pt-3">
                        <div>
                          <p className="text-sm text-gray-500">Conductor: {trip.driver}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`size-3 ${i < trip.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{trip.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-20">
            <div className="max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 h-auto bg-transparent p-0 rounded-none">
                <TabsTrigger 
                  value="home" 
                  className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 rounded-none"
                >
                  <Home className="size-5" />
                  <span className="text-xs">Inicio</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 rounded-none"
                >
                  <History className="size-5" />
                  <span className="text-xs">Historial</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </nav>
        </Tabs>
      </main>

      {/* Satisfaction Survey Modal */}
      <SatisfactionSurvey
        open={showSurvey}
        onClose={() => setShowSurvey(false)}
        driverName={mockDriverInfo.name}
        tripId={mockActiveTrip.id}
      />

      {/* Profile Modal */}
      <ProfileView
        open={showProfile}
        onClose={() => setShowProfile(false)}
        userType="user"
        userData={userProfileData}
      />
    </div>
  );
}