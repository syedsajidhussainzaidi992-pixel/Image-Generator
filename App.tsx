import React, { useState } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import LoadingOverlay from './components/LoadingOverlay';
import HistoryGallery from './components/HistoryGallery';
import { generateImageFromGemini } from './services/gemini';
import { GeneratedImage, AspectRatio } from './types';
import { Download, Maximize2, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default prompt based on user request
  const initialPrompt = "a cat who is selling an apple on the road";

  const handleGenerate = async (prompt: string, aspectRatio: AspectRatio) => {
    setIsGenerating(true);
    setError(null);

    try {
      const newImage = await generateImageFromGemini(prompt, aspectRatio);
      setGeneratedImages((prev) => [newImage, ...prev]);
      setCurrentImage(newImage);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectImage = (image: GeneratedImage) => {
    setCurrentImage(image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Controls */}
        <ControlPanel 
          isGenerating={isGenerating} 
          onGenerate={handleGenerate} 
          initialPrompt={initialPrompt}
        />

        {/* Right Side: Display Area */}
        <div className="flex-grow flex flex-col gap-6">
          
          {/* Main Preview Area */}
          <div className="relative w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden min-h-[400px] flex items-center justify-center shadow-2xl">
            
            <LoadingOverlay isVisible={isGenerating} />
            
            {currentImage ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                 {/* Image Container with max dimensions logic */}
                <div className="relative group max-w-full max-h-[70vh]">
                  <img
                    src={currentImage.url}
                    alt={currentImage.prompt}
                    className="max-w-full max-h-[70vh] rounded-lg shadow-lg object-contain"
                  />
                  
                  {/* Floating Action Bar */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={currentImage.url}
                      download={`gemini-${currentImage.id}.png`}
                      className="bg-white text-slate-900 p-2 rounded-full shadow-lg hover:bg-slate-100 transition-colors"
                      title="Download Image"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                
                {/* Prompt Display (Bottom Left of container) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none">
                   <p className="text-sm text-slate-300 font-medium max-w-2xl mx-auto text-center line-clamp-2">
                     "{currentImage.prompt}"
                   </p>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="text-center p-8 max-w-md">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Maximize2 className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Ready to Create</h3>
                <p className="text-slate-500">
                  Enter a prompt in the panel to generate your first AI masterpiece. 
                  Try the default prompt for a quick start!
                </p>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
               <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6">
                 <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl max-w-md text-center">
                   <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                   <h3 className="text-lg font-bold text-red-400 mb-2">Generation Failed</h3>
                   <p className="text-red-200/80 text-sm mb-4">{error}</p>
                   <button 
                     onClick={() => setError(null)}
                     className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                   >
                     Dismiss
                   </button>
                 </div>
               </div>
            )}
          </div>

          {/* History Section */}
          <HistoryGallery images={generatedImages} onSelect={handleSelectImage} />
        </div>
      </main>
    </div>
  );
};

export default App;