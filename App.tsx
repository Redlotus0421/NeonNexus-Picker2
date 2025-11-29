import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CyberInput } from './components/CyberInput';
import { CandidateList } from './components/CandidateList';
import { ResultModal } from './components/ResultModal';
import { NameEntry, PickerMode, WinnerResult } from './types';
import { selectWinnerWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<NameEntry[]>([]);
  const [isPicking, setIsPicking] = useState(false);
  const [result, setResult] = useState<WinnerResult | null>(null);
  const [mode, setMode] = useState<PickerMode>(PickerMode.STANDARD);

  const addCandidate = (name: string) => {
    // Check for duplicates
    if (candidates.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert("DUPLICATE_ENTRY_DETECTED");
        return;
    }
    const newEntry: NameEntry = {
      id: uuidv4(),
      name,
      active: true,
    };
    setCandidates([...candidates, newEntry]);
  };

  const removeCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  const initiateSequence = async () => {
    if (candidates.length === 0) return;

    setIsPicking(true);
    setResult(null);

    // Artificial delay for standard/numeric mode to build tension, real latency for AI
    const minDelay = 1500; 
    const startTime = Date.now();

    try {
      let finalResult: WinnerResult;

      if (mode === PickerMode.AI_ORACLE) {
        const names = candidates.map(c => c.name);
        finalResult = await selectWinnerWithAI(names);
      } else {
        // Standard RNG or Numeric
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const winner = candidates[randomIndex];
        finalResult = {
          name: winner.name,
          missionId: `STD-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
          reason: mode === PickerMode.NUMERIC 
            ? `ID #${(randomIndex + 1).toString().padStart(2, '0')} extracted from the pool.`
            : "Selected via standard high-velocity randomization algorithm."
        };
      }

      // Map the winner back to their index in the current list for Numeric display
      // We search by name (assuming unique names enforced by addCandidate)
      const foundIndex = candidates.findIndex(c => c.name === finalResult.name);
      if (foundIndex !== -1) {
          finalResult.index = foundIndex + 1;
      }

      // Ensure minimum animation time
      const elapsed = Date.now() - startTime;
      if (elapsed < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
      }

      setResult(finalResult);

    } catch (e) {
      console.error(e);
      // Fallback result in case of total failure
      setResult({
        name: "ERROR",
        reason: "System Malfunction. Reboot Required."
      });
    } finally {
      // Don't set isPicking to false immediately, we want the modal to transition from loading to result
      setIsPicking(false);
    }
  };

  const clearAll = () => {
    if (window.confirm("PURGE ALL DATA?")) {
        setCandidates([]);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto">
      {/* Header */}
      <header className="w-full text-center mb-12 mt-8">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary via-purple-400 to-cyber-secondary uppercase tracking-tighter mb-2 animate-pulse-fast">
          Neon<span className="text-white">Nexus</span>
        </h1>
        <p className="text-cyan-500/60 font-mono tracking-[0.5em] text-xs md:text-sm">QUANTUM_SELECTION_ENGINE_V2.5</p>
      </header>

      {/* Main Controls */}
      <main className="w-full flex-grow flex flex-col items-center">
        
        <CyberInput onAdd={addCandidate} disabled={isPicking} />

        {/* Mode Toggle */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 bg-slate-900/50 p-2 rounded-full border border-slate-700">
            <button 
                onClick={() => setMode(PickerMode.STANDARD)}
                className={`px-4 py-1 rounded-full text-xs font-mono transition-all ${mode === PickerMode.STANDARD ? 'bg-cyber-primary text-black font-bold shadow-[0_0_10px_#06b6d4]' : 'text-slate-400 hover:text-white'}`}
            >
                STANDARD_RNG
            </button>
            <button 
                onClick={() => setMode(PickerMode.NUMERIC)}
                className={`px-4 py-1 rounded-full text-xs font-mono transition-all ${mode === PickerMode.NUMERIC ? 'bg-white text-black font-bold shadow-[0_0_10px_#ffffff]' : 'text-slate-400 hover:text-white'}`}
            >
                NUMERIC_PROTOCOL
            </button>
            <button 
                onClick={() => setMode(PickerMode.AI_ORACLE)}
                className={`px-4 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${mode === PickerMode.AI_ORACLE ? 'bg-cyber-secondary text-black font-bold shadow-[0_0_10px_#d946ef]' : 'text-slate-400 hover:text-white'}`}
            >
                AI_ORACLE 
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
            </button>
        </div>

        {/* Action Button */}
        <div className="mb-12 flex gap-4">
             <button
                onClick={initiateSequence}
                disabled={candidates.length === 0 || isPicking}
                className="relative group px-8 py-4 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-cyber-black border border-slate-500 group-hover:border-white px-8 py-4 rounded-lg flex items-center space-x-2 transition-all">
                    <span className="text-white font-bold font-mono tracking-widest text-lg">INITIATE_SEQUENCE</span>
                </div>
             </button>

             {candidates.length > 0 && (
                 <button 
                    onClick={clearAll}
                    disabled={isPicking}
                    className="px-4 border border-red-900/50 text-red-500/50 hover:text-red-500 hover:border-red-500 rounded-lg font-mono text-xs transition-colors"
                 >
                    PURGE
                 </button>
             )}
        </div>

        {/* Candidate Grid */}
        <div className="w-full max-w-4xl">
            <div className="flex justify-between items-end mb-2 border-b border-slate-800 pb-2">
                <span className="text-slate-500 font-mono text-xs">MEMORY_POOL</span>
                <span className="text-cyber-primary font-mono text-xs">{candidates.length} CANDIDATES</span>
            </div>
            <CandidateList candidates={candidates} onRemove={removeCandidate} />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-slate-700 font-mono text-xs">
         SYSTEM_STATUS: ONLINE // SECURE_CONNECTION
      </footer>

      {/* Results Overlay */}
      {(isPicking || result) && (
        <ResultModal 
            loading={isPicking} 
            result={result} 
            mode={mode}
            onClose={() => setResult(null)} 
        />
      )}
    </div>
  );
};

export default App;