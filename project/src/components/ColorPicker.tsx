import React from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
  colors: string[];
  onSelect: (color: string) => void;
  onClose: () => void;
}

export function ColorPicker({ colors, onSelect, onClose }: ColorPickerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Choose a Color</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color, index) => (
            <button
              key={index}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
              style={{ backgroundColor: color }}
              onClick={() => {
                onSelect(color);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}