import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// React component wrapper - using iframe for React app
const ReactApp: React.FC = () => {
  return (
    <div className="w-full" style={{ height: '800px' }}>
      <iframe 
        src="http://localhost:5000" 
        width="100%" 
        height="100%" 
        frameBorder="0"
        title="React Data Table App"
        className="rounded-lg shadow-sm"
      />
    </div>
  );
};

// Angular component wrapper - using iframe for Angular app
const AngularApp: React.FC = () => {
  return (
    <div className="w-full" style={{ height: '800px' }}>
      <iframe 
        src="http://localhost:4201" 
        width="100%" 
        height="100%" 
        frameBorder="0"
        title="Angular Data Table App"
        className="rounded-lg shadow-sm"
      />
    </div>
  );
};

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<'home' | 'react' | 'angular'>('home');

  const navigation = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'react', label: 'React App', path: '/react' },
    { id: 'angular', label: 'Angular App', path: '/angular' }
  ];

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Advanced Data Table - Federated
                </h1>
              </div>
              <nav className="flex space-x-4">
                {navigation.map((nav) => (
                  <Link
                    key={nav.id}
                    to={nav.path}
                    onClick={() => setCurrentApp(nav.id as any)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentApp === nav.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {nav.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/react" 
              element={<ReactApp />}
            />
            <Route path="/angular" element={<AngularApp />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const Home: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to the Federated Data Table Demo
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          This application demonstrates micro frontend architecture using Module Federation.
          It combines both React and Angular implementations of an advanced data table component.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">React Implementation</h3>
            <p className="text-gray-600 mb-4">
              Built with React 19, Vite, and TailwindCSS. Features modern hooks,
              comprehensive table functionality with sorting, pagination, and theming.
            </p>
            <Link
              to="/react"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View React App
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Angular Implementation</h3>
            <p className="text-gray-600 mb-4">
              Built with Angular 19 using standalone components. Implements the same
              advanced table features with Angular's reactive approach.
            </p>
            <Link
              to="/angular"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              View Angular App
            </Link>
          </div>
        </div>
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Architecture Overview</h3>
          <div className="text-left max-w-4xl mx-auto">
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Shell Application:</strong> This federated host manages navigation and integration</li>
              <li>• <strong>React Remote:</strong> Standalone React app exposed as a micro frontend</li>
              <li>• <strong>Angular Remote:</strong> Standalone Angular app exposed as a micro frontend</li>
              <li>• <strong>Module Federation:</strong> Enables runtime integration of independently deployable applications</li>
              <li>• <strong>Shared Dependencies:</strong> Common libraries are shared between applications for efficiency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;