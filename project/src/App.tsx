import React from 'react';
import { Grid } from './components/Grid';
import { Palette } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            
          </h1>
          <p className="text-gray-600">
          </p>
        </header>
        
        <div className="max-w-[300px] mx-auto bg-white p-4 rounded-lg shadow-xl" style={{padding: '0rem'}}>
          <Grid />
        </div>
      </div>
    </div>
  );
}

export default App;