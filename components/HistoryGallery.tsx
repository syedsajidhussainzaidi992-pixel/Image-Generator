import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Clock } from 'lucide-react';

interface HistoryGalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const HistoryGallery: React.FC<HistoryGalleryProps> = ({ images, onSelect }) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-12 w-full">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        Recent Creations
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.slice().reverse().map((img) => (
          <div 
            key={img.id} 
            className="group relative aspect-square rounded-lg overflow-hidden border border-slate-700 cursor-pointer bg-slate-800 transition-transform hover:scale-105"
            onClick={() => onSelect(img)}
          >
            <img 
              src={img.url} 
              alt={img.prompt} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
              <p className="text-xs text-white line-clamp-2 mb-1">{img.prompt}</p>
              <div className="flex justify-end">
                <a 
                  href={img.url} 
                  download={`gemini-${img.id}.png`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm"
                  title="Download"
                >
                  <Download className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGallery;