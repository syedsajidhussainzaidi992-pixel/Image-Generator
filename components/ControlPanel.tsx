import React, { useState } from 'react';
import { AspectRatio } from '../types';
import { Wand2, Image as ImageIcon, LayoutTemplate } from 'lucide-react';

interface ControlPanelProps {
  isGenerating: boolean;
  onGenerate: (prompt: string, aspectRatio: AspectRatio) => void;
  initialPrompt?: string;
}

const ASPECT_RATIOS: { value: AspectRatio; label: string; icon: string }[] = [
  { value: "1:1", label: "Square (1:1)", icon: "aspect-square" },
  { value: "16:9", label: "Landscape (16:9)", icon: "aspect-video" },
  { value: "9:16", label: "Portrait (9:16)", icon: "h-[20px] w-[12px] border-2" },
  { value: "3:4", label: "Portrait (3:4)", icon: "h-[18px] w-[14px] border-2" },
  { value: "4:3", label: "Landscape (4:3)", icon: "h-[14px] w-[18px] border-2" },
];

const ControlPanel: React.FC<ControlPanelProps> = ({ isGenerating, onGenerate, initialPrompt = "" }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt, aspectRatio);
  };

  return (
    <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm h-fit">
      <div>
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" />
          Image Settings
        </h2>
        <p className="text-slate-400 text-sm">Configure your prompt and dimensions below.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium text-slate-300">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
            disabled={isGenerating}
          />
        </div>

        {/* Aspect Ratio Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" />
            Aspect Ratio
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => setAspectRatio(ratio.value)}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border ${
                  aspectRatio === ratio.value
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {/* Simple CSS shapes for icons if not generic lucide */}
                {ratio.value === "1:1" && <div className="w-4 h-4 border-2 border-current rounded-sm" />}
                {ratio.value === "16:9" && <div className="w-5 h-3 border-2 border-current rounded-sm" />}
                {ratio.value === "9:16" && <div className="w-3 h-5 border-2 border-current rounded-sm" />}
                {ratio.value === "4:3" && <div className="w-4 h-3.5 border-2 border-current rounded-sm" />}
                {ratio.value === "3:4" && <div className="w-3.5 h-4 border-2 border-current rounded-sm" />}
                <span>{ratio.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
            isGenerating || !prompt.trim()
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20'
          }`}
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Image
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ControlPanel;