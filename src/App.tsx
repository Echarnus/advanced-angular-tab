import { TableDemo } from '@/components/TableDemo';
import { useTheme } from '@/hooks/useTheme';

function App() {
  // Initialize theme on app start
  useTheme();

  return (
    <div className="h-screen bg-background p-6 overflow-hidden">
      <TableDemo />
    </div>
  );
}

export default App;