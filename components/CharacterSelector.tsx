import React from 'react';
import { X } from 'lucide-react';
import { AVAILABLE_CHARACTERS } from '../constants';
import { Character } from '../types';

interface CharacterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (character: Character) => void;
  title: string;
}

// Helper to generate a placeholder image URL (duplicated logic for standalone component usage if needed)
const getCharacterImageUrl = (char: Character) => {
  const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${char.color}" rx="20" />
      <text x="50" y="55" font-family="sans-serif" font-size="28" font-weight="bold" fill="${char.textColor}" text-anchor="middle" dominant-baseline="middle">${char.iconChar}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ isOpen, onClose, onSelect, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {AVAILABLE_CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => onSelect(char)}
              className="group flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-800 transition-all border border-transparent hover:border-gray-600"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                <img 
                  src={getCharacterImageUrl(char)} 
                  alt={char.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-300 font-medium group-hover:text-white">{char.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};