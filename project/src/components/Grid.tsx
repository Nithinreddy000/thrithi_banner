import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import { gridData } from '../data/gridData';
import { generateColors } from '../utils/colors';

export function Grid() {
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});
  const [activeCell, setActiveCell] = useState<string | null>(null);

  const handleCellClick = (rowIndex: string | number, colIndex: number) => {
    let cellKey;
    
    // Handle border cells
    if (rowIndex === 'top') {
      cellKey = `top-${colIndex}`;
    } else if (rowIndex === 'bottom') {
      cellKey = `bottom-${colIndex}`;
    } else if (rowIndex === 'left') {
      cellKey = `left-${colIndex}`;
    } else {
      // Handle main grid cells
      const cellValue = gridData[rowIndex as number][colIndex];
      if (cellValue === 1) {
        setSelectedColors((prev) => ({
          ...prev,
          [`${rowIndex}-${colIndex}`]: '#000000',
        }));
        return;
      }
      cellKey = `${rowIndex}-${colIndex}`;
    }
    
    setActiveCell(cellKey);
  };

  const handleColorSelect = (color: string) => {
    if (activeCell) {
      setSelectedColors((prev) => ({
        ...prev,
        [activeCell]: color,
      }));
      setActiveCell(null);
    }
  };

  const revealAll = () => {
    const newColors = { ...selectedColors };
    gridData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          newColors[`${rowIndex}-${colIndex}`] = '#000000';
        }
      });
    });
    setSelectedColors(newColors);
  };

  return (
    <div className="relative" style={{marginRight: '-3rem'}}>
      <button
        onClick={revealAll}
        className="absolute -top-12 right-0 -mr-12 px-4 py-2 bg-orange-500 text-white rounded-lg 
                 flex items-center gap-2 hover:bg-orange-600 transition-colors"
      >
        <Eye size={18} />
        Reveal All
      </button>

      <div 
        className="grid grid-cols-[repeat(21,minmax(12px,1fr))] gap-[1px] bg-gradient-to-b from-rose-300 via-yellow-200 to-rose-300 px-1 py-4 rounded-lg"
        style={{ aspectRatio: '21/82' }}
      >
        {/* Top color selection row */}
        {Array(21).fill(0).map((_, idx) => {
          const cellKey = `top-${idx}`;
          return (
            <div
              key={cellKey}
              className="aspect-square transition-colors duration-300 border-[0.5px] border-gray-300 cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: selectedColors[cellKey] || '#ffffff'
              }}
              onClick={() => handleCellClick('top', idx)}
            />
          );
        })}

        {/* Main grid with left column */}
        {gridData.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {/* Left color cell */}
            <div
              className="aspect-square transition-colors duration-300 border-[0.5px] border-gray-300 cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: selectedColors[`left-${rowIndex}`] || '#ffffff'
              }}
              onClick={() => handleCellClick('left', rowIndex)}
            />
            
            {/* Main grid cells */}
            {row.map((cell, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              return (
                <div
                  key={cellKey}
                  className="aspect-square transition-colors duration-300 border-[0.5px] border-gray-300 cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: selectedColors[cellKey] || '#ffffff'
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              );
            })}
          </React.Fragment>
        ))}

        {/* Bottom color selection row */}
        {Array(21).fill(0).map((_, idx) => {
          const cellKey = `bottom-${idx}`;
          return (
            <div
              key={cellKey}
              className="aspect-square transition-colors duration-300 border-[0.5px] border-gray-300 cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: selectedColors[cellKey] || '#ffffff'
              }}
              onClick={() => handleCellClick('bottom', idx)}
            />
          );
        })}
      </div>

      {activeCell && (
        <ColorPicker
          colors={generateColors()}
          onSelect={handleColorSelect}
          onClose={() => setActiveCell(null)}
        />
      )}
    </div>
  );
}