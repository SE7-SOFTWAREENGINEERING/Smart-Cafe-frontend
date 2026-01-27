import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
};

export default Loader;
