import React, { useEffect, useState } from 'react';
import { WinnerResult, PickerMode } from '../types';

interface ResultModalProps {
  result: WinnerResult | null;
  onClose: () => void;
  loading: boolean;
  mode: PickerMode;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose, loading, mode }) => {
  const [displayText, setDisplayText] = useState('');
  const [displayNumber, setDisplayNumber] = useState('00');
  const [showDetails, setShowDetails] = useState(false);

  // Numeric Mode Animation
  useEffect(() => {
    if (!loading && result && mode === PickerMode.NUMERIC) {
        let numIteration = 0;
        const targetNum = result.index ? result.index.toString().padStart(2, '0') : '00';
        
        // Rapid number cycling
        const numInterval = setInterval(() => {
            setDisplayNumber(Math.floor(Math.random() * 99).toString().padStart(2, '0'));
            numIteration++;
            
            // Lock onto target
            if (numIteration > 20) {
                clearInterval(numInterval);
                setDisplayNumber(targetNum);
                setDisplayText(result.name);
                setShowDetails(true);
            }
        }, 50);

        return () => clearInterval(numInterval);
    }
  }, [loading, result, mode]);

  // Standard/AI Text Decoding Animation
  useEffect(() => {
    if (!loading && result && mode !== PickerMode.NUMERIC) {
        let iteration = 0;
        const target = result.name;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        const interval = setInterval(() => {
            setDisplayText(target
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return target[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("")
            );
            
            if (iteration >= target.length) { 
                clearInterval(interval);
                setShowDetails(true);
            }
            iteration += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    } 
  }, [loading, result, mode]);

  // Reset state on close
  useEffect(() => {
    if (!result && !loading) {
        setDisplayText('');
        setDisplayNumber('00');
        setShowDetails(false);
    }
  }, [result, loading]);

  if (!loading && !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-cyber-black border border-cyber-primary shadow-[0_0_50px_rgba(6,182,212,0.3)] rounded-lg p-1">
        {/* Scanning Effect Bar */}
        {loading && (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
             <div className="w-full h-1 bg-cyber-primary shadow-[0_0_15px_#06b6d4] animate-[scan_2s_linear_infinite] top-0 absolute"></div>
          </div>
        )}

        <div className="bg-slate-900/90 p-8 rounded min-h-[300px] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {loading ? (
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-cyber-secondary border-t-transparent rounded-full animate-spin"></div>
                    <h2 className="text-xl font-mono text-cyber-primary animate-pulse">
                        {mode === PickerMode.NUMERIC ? 'CALCULATING_INDEX...' : 'PROCESSING_ALGORITHM...'}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">ACCESSING_MAINFRAME // CALCULATING_PROBABILITIES</p>
                </div>
            ) : result ? (
                <>
                    <div className="text-xs font-mono text-cyber-secondary mb-2 tracking-[0.3em]">
                        {mode === PickerMode.NUMERIC ? 'INDEX_LOCKED' : 'TARGET_ACQUIRED'}
                    </div>

                    {/* Numeric Mode Display */}
                    {mode === PickerMode.NUMERIC && (
                        <div className="mb-4 relative">
                            <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 font-mono">
                                {displayNumber}
                            </span>
                        </div>
                    )}

                    <h1 className={`${mode === PickerMode.NUMERIC ? 'text-3xl md:text-5xl' : 'text-5xl md:text-7xl'} font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary via-white to-cyber-secondary mb-6 font-mono break-all transition-all duration-500`}>
                        {mode === PickerMode.NUMERIC && !showDetails ? '---' : displayText}
                    </h1>
                    
                    <div className={`transition-opacity duration-1000 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded max-w-lg mx-auto mb-8">
                            <div className="flex justify-between items-center text-xs text-slate-500 font-mono mb-2 border-b border-slate-700 pb-1">
                                <span>MSN_ID: {result.missionId || 'N/A'}</span>
                                <span>CONFIDENCE: 99.9%</span>
                            </div>
                            <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed">
                                {result.reason || "Selected by local random number generation protocol."}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full"
                        >
                            <div className="absolute inset-0 w-0 bg-cyber-primary transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                            <span className="relative text-cyber-primary group-hover:text-white font-mono tracking-widest border border-cyber-primary px-8 py-3 rounded-full transition-colors">
                                ACKNOWLEDGE
                            </span>
                        </button>
                    </div>
                </>
            ) : null}
        </div>
      </div>
    </div>
  );
};