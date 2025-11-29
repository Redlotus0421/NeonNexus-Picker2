import React from 'react';
import { NameEntry } from '../types';

interface CandidateListProps {
  candidates: NameEntry[];
  onRemove: (id: string) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, onRemove }) => {
  if (candidates.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-slate-700 rounded-lg">
        <p className="text-slate-500 font-mono text-sm tracking-widest">NO_DATA_DETECTED // WAITING_FOR_INPUT</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {candidates.map((candidate, index) => (
        <div 
          key={candidate.id}
          className="relative group bg-cyber-dark border border-slate-800 p-4 rounded hover:border-cyber-primary transition-colors duration-300 overflow-hidden"
        >
           {/* Corner Accents */}
           <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-600 group-hover:border-cyber-primary transition-colors"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-600 group-hover:border-cyber-primary transition-colors"></div>
           
           <div className="flex justify-between items-center">
             <div className="flex items-center overflow-hidden">
                <span className="text-slate-600 font-mono text-xs mr-2 shrink-0 group-hover:text-cyber-primary transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <span className="text-cyan-100 font-mono truncate mr-2">{candidate.name}</span>
             </div>
             <button
               onClick={() => onRemove(candidate.id)}
               className="text-slate-600 hover:text-red-500 transition-colors shrink-0"
               aria-label="Remove"
             >
               &times;
             </button>
           </div>
           <div className="text-[10px] text-slate-600 font-mono mt-1">ID: {candidate.id.slice(0, 4)}</div>
        </div>
      ))}
    </div>
  );
};