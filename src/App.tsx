import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { SplashScreen } from './components/SplashScreen';

export type UserRole = 'admin' | 'user' | 'driver' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash screen after 5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Show splash screen for 5 seconds
  if (showSplash) {
    return <SplashScreen />;
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      {currentUser.role === 'admin' && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'user' && (
        <UserDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'driver' && (
        <DriverDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;