
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gov-blue text-white' : 'hover:bg-gray-100';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <div className="flex items-center">
            <MapPin size={24} className="text-gov-blue mr-2" />
            <h1 className="text-xl font-bold text-gov-blue">
              Road Infrastructure Monitoring
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">ADC Mahendragarh</p>
            <p className="text-xs text-gray-500">Road Nomenclature & Infrastructure</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <Link 
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/roads"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/roads')}`}
            >
              Road Registry
            </Link>
            <Link 
              to="/infra"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/infra')}`}
            >
              Infrastructure Works
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gov-blue text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm">© 2025 ADC Mahendragarh</p>
            <p className="text-xs">Road Infrastructure Monitoring System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
