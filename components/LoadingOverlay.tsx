import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl transition-all duration-300">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
      <p className="text-indigo-200 font-medium animate-pulse">Dreaming up your image...</p>
    </div>
  );
};

export default LoadingOverlay;