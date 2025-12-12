import React from 'react';
import { X } from 'lucide-react';
import { Character } from '../types';

interface CharacterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (character: Character) => void;
  title: string;
  characters: Character[];
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  title,
  characters 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-coffee-800/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white border-2 border-cream-300 rounded-3xl p-6 w-full max-w-md shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-coffee-800">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-coffee-400 hover:text-coffee-600 rounded-full hover:bg-cream-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => onSelect(char)}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-cream-50 transition-all border border-transparent hover:border-cream-300"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-md group-hover:scale-110 transition-transform border-2 border-white ring-2 ring-transparent group-hover:ring-cream-300">
                <img 
                  src={char.imageUrl} 
                  alt={char.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-coffee-600 font-bold group-hover:text-coffee-800">{char.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};