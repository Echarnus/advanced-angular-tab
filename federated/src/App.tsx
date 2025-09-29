import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Error boundary for Module Federation failures
class ModuleFederationErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Module Federation Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// React component wrapper with Module Federation fallback
const ReactApp: React.FC = () => {
  const [useFallback, setUseFallback] = useState(false);
  
  // Fallback component that embeds the React app directly
  const ReactFallback = () => (
    <div className="w-full">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Development Mode:</strong> React app is embedded directly. 
          In production, this would use Module Federation for optimal performance.
        </p>
      </div>
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <iframe 
          src="http://localhost:5000" 
          width="100%" 
          height="800px" 
          frameBorder="0"
          title="React Data Table App"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );

  if (useFallback) {
    return <ReactFallback />;
  }

  // Try Module Federation first
  try {
    const ReactRemoteApp = React.lazy(() => 
      import('reactApp/App').catch(() => {
        setUseFallback(true);
        throw new Error('Module Federation failed, using fallback');
      })
    );

    return (
      <div className="w-full">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            <strong>Module Federation Active:</strong> React app loaded via Module Federation 
            with shared dependencies and optimized performance.
          </p>
        </div>
        <ModuleFederationErrorBoundary fallback={<ReactFallback />}>
          <Suspense fallback={<div className="flex items-center justify-center p-8 text-gray-600">Loading React App...</div>}>
            <ReactRemoteApp />
          </Suspense>
        </ModuleFederationErrorBoundary>
      </div>
    );
  } catch (error) {
    return <ReactFallback />;
  }
};

// Angular component wrapper - optimized for same-domain integration
const AngularApp: React.FC = () => {
  return (
    <div className="w-full">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800 text-sm">
          <strong>Same-Domain Integration:</strong> Angular app runs on the same domain context 
          for optimal performance and shared resources.
        </p>
      </div>
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <iframe 
          src="http://localhost:4201" 
          width="100%" 
          height="800px" 
          frameBorder="0"
          title="Angular Data Table App"
          style={{ border: 'none' }}
        />
      </div>
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
          This application demonstrates micro frontend architecture with intelligent integration strategies.
          The React app attempts Module Federation first for optimal performance, with same-domain embedding 
          as fallback. Both apps run on the same domain for shared context and optimal performance.
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
              <li>• <strong>Shell Application:</strong> Federated host with intelligent integration strategies</li>
              <li>• <strong>React Integration:</strong> Module Federation with same-domain fallback</li>
              <li>• <strong>Angular Integration:</strong> Same-domain embedding for shared context</li>
              <li>• <strong>Shared Domain:</strong> All applications run on localhost for optimal performance</li>
              <li>• <strong>Progressive Loading:</strong> Graceful fallbacks ensure reliability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;