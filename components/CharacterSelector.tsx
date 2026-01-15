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
        className="absolute inset-0 bg-gradient-to-br from-coffee-800/40 to-ui-lavender/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-white via-ui-peach/5 to-ui-pink/10 border-2 border-ui-coral/30 rounded-4xl p-6 w-full max-w-md shadow-soft-lg transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-ui-coral to-ui-pink bg-clip-text text-transparent">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-ui-coral hover:text-ui-pink rounded-full hover:bg-ui-coral/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => onSelect(char)}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gradient-to-br hover:from-ui-coral/10 hover:to-ui-pink/10 transition-all border border-transparent hover:border-ui-coral/30 hover:shadow-soft"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-soft group-hover:scale-110 transition-transform border-2 border-white ring-2 ring-transparent group-hover:ring-ui-coral/40">
                <img 
                  src={char.imageUrl} 
                  alt={char.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-coffee-600 font-bold group-hover:text-ui-coral">{char.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};