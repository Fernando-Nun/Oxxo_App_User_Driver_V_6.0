import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LogOut, 
  Users, 
  Car, 
  MapPin, 
  BarChart3,
  UserCheck,
  TrendingUp,
  DollarSign,
  Navigation,
  Clock,
  Phone
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AdminMonitorMap } from './AdminMonitorMap';
import { AdminTabNavigation } from './AdminTabNavigation';
import { TabContentWrapper } from './TabContentWrapper';
import oxxoLogo from '../assets/logo-sin-fondo-3.png';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const mockDrivers = [
  { id: '1', name: 'Juan Pérez', status: 'active', trips: 45, rating: 4.8 },
  { id: '2', name: 'María García', status: 'active', trips: 38, rating: 4.9 },
  { id: '3', name: 'Carlos López', status: 'offline', trips: 52, rating: 4.7 },
  { id: '4', name: 'Ana Martínez', status: 'active', trips: 41, rating: 4.9 },
];

// Sort drivers by a weighted score (trips * 0.4 + rating * 20) for top drivers
const getTopDrivers = () => {
  return [...mockDrivers]
    .map(driver => ({
      ...driver,
      score: driver.trips * 0.4 + driver.rating * 20
    }))
    .sort((a, b) => b.score - a.score);
};

const mockUsers = [
  { id: '1', name: 'Pedro Sánchez', totalTrips: 15, lastTrip: '2 horas' },
  { id: '2', name: 'Laura Torres', totalTrips: 8, lastTrip: '1 día' },
  { id: '3', name: 'Roberto Díaz', totalTrips: 23, lastTrip: '5 horas' },
  { id: '4', name: 'Sofia Ruiz', totalTrips: 12, lastTrip: '3 días' },
];

const mockTrips = [
  { id: 'VIA-001', customer: 'Pedro Sánchez', driver: 'Juan Pérez', status: 'en_curso', amount: 245, from: 'Centro', to: 'Polanco' },
  { id: 'VIA-002', customer: 'Laura Torres', driver: 'María García', status: 'completado', amount: 180, from: 'Roma Norte', to: 'Condesa' },
  { id: 'VIA-003', customer: 'Roberto Díaz', driver: 'Juan Pérez', status: 'solicitado', amount: 320, from: 'Satélite', to: 'Santa Fe' },
  { id: 'VIA-004', customer: 'Sofia Ruiz', driver: 'Ana Martínez', status: 'en_curso', amount: 150, from: 'Coyoacán', to: 'Del Valle' },
];

const mockActiveDriversMonitor = [
  {
    id: '1',
    name: 'Juan Pérez',
    vehicle: 'Toyota Corolla',
    plate: 'ABC-123-D',
    color: 'Blanco',
    passengers: 3,
    maxPassengers: 4,
    tripTime: '12 min',
    status: 'en_camino_destino',
    route: { from: 'Centro', to: 'OXXO Santa Fe' },
    phone: '+52 55 1234 5678',
    currentLocation: 'Av. Reforma, km 5.2'
  },
  {
    id: '2',
    name: 'María García',
    vehicle: 'Nissan Sentra',
    plate: 'XYZ-456-G',
    color: 'Gris',
    passengers: 2,
    maxPassengers: 4,
    tripTime: '8 min',
    status: 'recolectando',
    route: { from: 'Roma Norte', to: 'OXXO Polanco' },
    phone: '+52 55 2345 6789',
    currentLocation: 'Av. Insurgentes Sur, km 3.1'
  },
  {
    id: '4',
    name: 'Ana Martínez',
    vehicle: 'Honda Civic',
    plate: 'DEF-789-H',
    color: 'Negro',
    passengers: 1,
    maxPassengers: 4,
    tripTime: '15 min',
    status: 'en_camino_destino',
    route: { from: 'Coyoacán', to: 'OXXO Central' },
    phone: '+52 55 3456 7890',
    currentLocation: 'Calzada de Tlalpan, km 8.5'
  },
];

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [previousTab, setPreviousTab] = useState('overview');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const tabs = ['overview', 'trips', 'drivers', 'users', 'monitor'];

  const getDirection = (newTab: string) => {
    const currentIndex = tabs.indexOf(previousTab);
    const newIndex = tabs.indexOf(newTab);
    return newIndex > currentIndex ? 'right' : 'left';
  };

  const handleTabChange = (newTab: string) => {
    setPreviousTab(activeTab);
    setActiveTab(newTab);
  };

  // Driver locations for map with different routes for each
  const driverLocations = mockActiveDriversMonitor.map((driver, index) => {
    const baseLatOffset = index * 0.02;
    const baseLngOffset = index * 0.02;
    const currentLat = 19.4326 + baseLatOffset;
    const currentLng = -99.1332 + baseLngOffset;

    // Different OXXO destinations for each driver
    const destinations = [
      { lat: 19.3629, lng: -99.1763 }, // OXXO Sur
      { lat: 19.4850, lng: -99.0900 }, // OXXO Este
      { lat: 19.4500, lng: -99.1900 }, // OXXO Oeste
      { lat: 19.4000, lng: -99.1200 }, // OXXO Centro
      { lat: 19.3800, lng: -99.1500 }  // OXXO Suroeste
    ];

    const destination = destinations[index % destinations.length];

    // Generate intermediate waypoints for a realistic route
    const latDiff = destination.lat - currentLat;
    const lngDiff = destination.lng - currentLng;

    return {
      id: driver.id,
      name: driver.name,
      lat: currentLat,
      lng: currentLng,
      route: [
        { lat: currentLat + latDiff * 0.25, lng: currentLng + lngDiff * 0.25 },
        { lat: currentLat + latDiff * 0.5, lng: currentLng + lngDiff * 0.5 },
        { lat: currentLat + latDiff * 0.75, lng: currentLng + lngDiff * 0.75 },
        destination
      ]
    };
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      active: { variant: "default", label: "Activo" },
      offline: { variant: "secondary", label: "Offline" },
      en_curso: { variant: "default", label: "En curso" },
      completado: { variant: "outline", label: "Completado" },
      solicitado: { variant: "secondary", label: "Solicitado" },
      en_camino_destino: { variant: "default", label: "En camino al destino" },
      recolectando: { variant: "secondary", label: "Recolectando" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={oxxoLogo} alt="OXXO" className="h-12" />
            <div>
              <h1 className="text-gray-900">Panel Administrador</h1>
              <p className="text-sm text-gray-500">OXXO Viajes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-red-600 text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="size-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Custom Styled Tab Navigation */}
          <AdminTabNavigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />

          {/* Overview Tab */}
          <TabsContent value="overview">
            <TabContentWrapper isActive={activeTab === 'overview'} direction={getDirection('overview')}>
              {/* ROI and Savings Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Ahorro Mensual</CardTitle>
                  <TrendingUp className="size-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-700">$42,580</div>
                  <p className="text-xs text-green-600 mt-1">
                    -23% en costos operativos
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Eficiencia Rutas</CardTitle>
                  <Navigation className="size-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-blue-700">87%</div>
                  <p className="text-xs text-blue-600 mt-1">
                    +15% vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Tiempo Promedio de Espera</CardTitle>
                  <Clock className="size-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-purple-700">4.2 min</div>
                  <p className="text-xs text-purple-600 mt-1">
                    -18% vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Satisfacción</CardTitle>
                  <UserCheck className="size-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-orange-700">4.7/5</div>
                  <p className="text-xs text-orange-600 mt-1">
                    Promedio empleados
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Viajes Hoy</CardTitle>
                  <Car className="size-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">127</div>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="text-green-600">+12%</span> vs ayer
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Conductores Activos</CardTitle>
                  <UserCheck className="size-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">24</div>
                  <p className="text-xs text-gray-500 mt-1">
                    De 32 totales
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Ingresos Hoy</CardTitle>
                  <DollarSign className="size-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">$18,450</div>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="text-green-600">+8%</span> vs ayer
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Usuarios Activos</CardTitle>
                  <Users className="size-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">1,247</div>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="text-green-600">+156</span> este mes
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Viajes Recientes</CardTitle>
                  <CardDescription>Últimos viajes del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTrips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm text-gray-900">{trip.id}</p>
                          <p className="text-xs text-gray-500">{trip.customer}</p>
                          <p className="text-xs text-gray-400">{trip.from} → {trip.to}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(trip.status)}
                          <p className="text-sm text-gray-900 mt-1">${trip.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Conductores</CardTitle>
                  <CardDescription>Mejores conductores de la semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getTopDrivers().slice(0, 4).map((driver, index) => (
                      <div key={driver.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 text-red-600 size-8 rounded-full flex items-center justify-center">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{driver.name}</p>
                            <p className="text-xs text-gray-500">{driver.trips} viajes</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">⭐ {driver.rating}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            </TabContentWrapper>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips">
            <TabContentWrapper isActive={activeTab === 'trips'} direction={getDirection('trips')}>
              <Card>
              <CardHeader>
                <CardTitle>Gestión de Viajes</CardTitle>
                <CardDescription>Todos los viajes del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                          <Car className="size-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-gray-900">{trip.id}</p>
                          <p className="text-sm text-gray-500">Pasajero: {trip.customer}</p>
                          <p className="text-sm text-gray-500">Conductor: {trip.driver}</p>
                          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="size-3" />
                            {trip.from} → {trip.to}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(trip.status)}
                        <p className="text-gray-900 mt-2">${trip.amount} MXN</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </TabContentWrapper>
          </TabsContent>

          {/* Pestaña de Conductores */}
          <TabsContent value="drivers">
            <TabContentWrapper isActive={activeTab === 'drivers'} direction={getDirection('drivers')}>
              <Card>
              <CardHeader>
                <CardTitle>Gestión de Conductores</CardTitle>
                <CardDescription>Todos los conductores registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDrivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-red-600 text-white">
                            {driver.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-gray-900">{driver.name}</p>
                          <p className="text-sm text-gray-500">{driver.trips} viajes completados</p>
                          <p className="text-sm text-gray-500">⭐ {driver.rating} calificación</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(driver.status)}
                        <Button variant="outline" size="sm" className="mt-2">
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </TabContentWrapper>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <TabContentWrapper isActive={activeTab === 'users'} direction={getDirection('users')}>
              <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Todos los usuarios registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUsers.map((mockUser) => (
                    <div key={mockUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-blue-600 text-white">
                            {mockUser.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-gray-900">{mockUser.name}</p>
                          <p className="text-sm text-gray-500">{mockUser.totalTrips} viajes totales</p>
                          <p className="text-sm text-gray-500">Último viaje: hace {mockUser.lastTrip}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver historial
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </TabContentWrapper>
          </TabsContent>

          {/* Monitor Tab */}
          <TabsContent value="monitor">
            <TabContentWrapper isActive={activeTab === 'monitor'} direction={getDirection('monitor')}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left side - Conductores list */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Conductores Activos</CardTitle>
                    <CardDescription>{mockActiveDriversMonitor.length} en línea</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockActiveDriversMonitor.map((driver) => (
                        <div 
                          key={driver.id} 
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedDriver === driver.id ? 'border-red-600 bg-red-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedDriver(driver.id)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-red-600 text-white text-xs">
                                {driver.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{driver.name}</p>
                              <p className="text-xs text-gray-500">{driver.plate}</p>
                            </div>
                            <div className="size-2 rounded-full bg-green-500"></div>
                          </div>
                          {getStatusBadge(driver.status)}
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <Users className="size-3" />
                            {driver.passengers}/{driver.maxPassengers}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right side - Map and details */}
              <div className="lg:col-span-2 space-y-4">
                {/* Map */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mapa en Tiempo Real</CardTitle>
                    <CardDescription>
                      {selectedDriver 
                        ? `Monitoreando: ${mockActiveDriversMonitor.find(d => d.id === selectedDriver)?.name}`
                        : 'Selecciona un conductor para ver detalles'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminMonitorMap 
                      drivers={driverLocations}
                      selectedDriverId={selectedDriver}
                      onDriverSelect={setSelectedDriver}
                      height="400px"
                    />
                  </CardContent>
                </Card>

                {/* Detalles del conductor */}
                {selectedDriver && mockActiveDriversMonitor.find(d => d.id === selectedDriver) && (
                  <Card className="border-2 border-red-600">
                    <CardHeader>
                      <CardTitle>Detalles del Conductor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const driver = mockActiveDriversMonitor.find(d => d.id === selectedDriver)!;
                        return (
                          <div className="space-y-4">
                            {/* Información del conductor */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                              <Avatar className="size-12">
                                <AvatarFallback className="bg-red-600 text-white">
                                  {driver.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-gray-900">{driver.name}</p>
                                <p className="text-sm text-gray-500">{driver.phone}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Phone className="size-4" />
                              </Button>
                            </div>

                            {/* Vehicle Info */}
                            <div className="space-y-3">
                              <p className="text-sm text-gray-500">Información del vehículo:</p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Vehículo</p>
                                  <p className="text-sm text-gray-900">{driver.vehicle}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Placas</p>
                                  <p className="text-sm text-gray-900">{driver.plate}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Color</p>
                                  <p className="text-sm text-gray-900">{driver.color}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-500">Pasajeros</p>
                                  <p className="text-sm text-gray-900">{driver.passengers}/{driver.maxPassengers}</p>
                                </div>
                              </div>
                            </div>

                            {/* Trip Info */}
                            <div className="border-t pt-4">
                              <p className="text-sm text-gray-500 mb-3">Información del viaje:</p>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">Tiempo de viaje:</span>
                                  <span className="text-sm text-gray-900">{driver.tripTime}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">Estado:</span>
                                  {getStatusBadge(driver.status)}
                                </div>
                              </div>
                            </div>

                            {/* Route */}
                            <div className="border-t pt-4">
                              <p className="text-sm text-gray-500 mb-3">Trayecto:</p>
                              <div className="space-y-2">
                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                  <MapPin className="size-5 text-green-600 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-500">Desde:</p>
                                    <p className="text-sm text-gray-900">{driver.route.from}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                  <MapPin className="size-5 text-red-600 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-500">Hacia:</p>
                                    <p className="text-sm text-gray-900">{driver.route.to}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Current Location */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Navigation className="size-5 text-blue-600" />
                                <span className="text-sm text-gray-900">Ubicación actual:</span>
                              </div>
                              <p className="text-sm text-gray-700">{driver.currentLocation}</p>
                              <p className="text-xs text-gray-500 mt-2">Última actualización: hace 15 seg</p>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            </TabContentWrapper>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}