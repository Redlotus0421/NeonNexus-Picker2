import React, { useState, KeyboardEvent } from 'react';

interface CyberInputProps {
  onAdd: (name: string) => void;
  disabled?: boolean;
}

export const CyberInput: React.FC<CyberInputProps> = ({ onAdd, disabled }) => {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <div className="relative group w-full max-w-md mx-auto mb-8">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
      <div className="relative flex bg-cyber-black rounded p-1 items-center">
        <span className="pl-4 pr-2 text-cyber-primary font-mono text-lg animate-pulse">{'>'}</span>
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-white w-full p-3 focus:outline-none font-mono placeholder-slate-500 uppercase tracking-widest"
          placeholder="ENTER_CANDIDATE_NAME"
          autoComplete="off"
        />
        <button
          onClick={handleAdd}
          disabled={!value.trim() || disabled}
          className="px-6 py-2 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary hover:bg-cyber-primary hover:text-black transition-all duration-300 font-bold tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  );
};
