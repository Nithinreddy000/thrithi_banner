import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { gridData } from '../data/gridData';

const COLOR_MAP = {
  1: '#ffeda4',
  2: '#f692cf',
  3: '#9df9fd',
  4: '#fdb487',
  5: '#daffab',
  6: '#e399f8',
  7: '#a67882',
  8: '#d37a5c',
  9: '#000000'
};

export function Grid() {
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});
  const [cellNumbers, setCellNumbers] = useState<{ [key: string]: number }>({});
  const [selectedColorNumber, setSelectedColorNumber] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Initialize cell numbers on component mount
  useEffect(() => {
    const numbers: { [key: string]: number } = {};
    
    // Set border cells to 1
    for (let i = 0; i < gridData[0].length; i++) {
      numbers[`top-${i}`] = 1;
      numbers[`bottom-${i}`] = 1;
    }
    for (let i = 0; i < gridData.length; i++) {
      numbers[`left-${i}`] = 1;
      numbers[`right-${i}`] = 1;
    }

    // Set pattern cells to 9 and remaining to random 2-8
    gridData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        if (cell === 1) {
          numbers[key] = 9;
        } else if (!numbers[key]) {
          numbers[key] = Math.floor(Math.random() * 7) + 2; // Random number between 2-8
        }
      });
    });

    setCellNumbers(numbers);
  }, []);

  const handleCellClick = (rowIndex: string | number, colIndex: number) => {
    const cellKey = typeof rowIndex === 'string' 
      ? `${rowIndex}-${colIndex}`
      : `${rowIndex}-${colIndex}`;

    const cellNumber = cellNumbers[cellKey];
    
    if (cellNumber !== selectedColorNumber) {
      setErrorMessage('Wrong color! Try again.');
      setTimeout(() => setErrorMessage(''), 2000);
      return;
    }

    setSelectedColors(prev => ({
      ...prev,
      [cellKey]: COLOR_MAP[selectedColorNumber as keyof typeof COLOR_MAP]
    }));
  };

  const getCellContent = (cellKey: string) => {
    const number = cellNumbers[cellKey];
    const color = selectedColors[cellKey];
    
    return (
      <>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold
          ${color ? 'opacity-0' : ''}`}>
          {number}
        </span>
      </>
    );
  };

  return (
    <div className="relative" style={{marginRight: '-3rem'}}>
      {/* Color palette with numbers */}
      <div className="absolute -top-20 left-0 right-0 flex justify-center gap-2" style={{marginTop: '2rem'}}>
        {Object.entries(COLOR_MAP).map(([number, color]) => (
          <div
            key={number}
            className={`relative w-8 h-8 rounded cursor-pointer ${
              selectedColorNumber === Number(number) ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColorNumber(Number(number))}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" 
                  style={{ color: number === '9' ? '#fff' : '#000' }}>
              {number}
            </span>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div className="absolute -top-8 left-0 right-0 text-red-500 text-center">
          {errorMessage}
        </div>
      )}

      <div 
        className="grid grid-cols-[repeat(21,minmax(12px,1fr))] gap-[1px] bg-gradient-to-b from-rose-300 via-yellow-200 to-rose-300 px-1 py-4 rounded-lg"
        style={{ aspectRatio: '21/82' }}
      >
        {/* Top row */}
        {Array(21).fill(0).map((_, idx) => (
          <div
            key={`top-${idx}`}
            className="relative aspect-square transition-colors duration-300 border-[0.5px] border-gray-300 cursor-pointer hover:opacity-80"
            style={{ backgroundColor: selectedColors[`top-${idx}`] || '#ffffff' }}
            onClick={() => handleCellClick('top', idx)}
          >
            {getCellContent(`top-${idx}`)}
          </div>
        ))}

        {/* Main grid */}
        {gridData.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {/* Left cell */}
            <div
              className="relative aspect-square transition-colors duration-300 border-[0.5px] border-gray-300 cursor-pointer hover:opacity-80"
              style={{ backgroundColor: selectedColors[`left-${rowIndex}`] || '#ffffff' }}
              onClick={() => handleCellClick('left', rowIndex)}
            >
              {getCellContent(`left-${rowIndex}`)}
            </div>
            
            {/* Main cells */}
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="relative aspect-square transition-colors duration-300 border-[0.5px] border-gray-300 cursor-pointer hover:opacity-80"
                style={{ backgroundColor: selectedColors[`${rowIndex}-${colIndex}`] || '#ffffff' }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {getCellContent(`${rowIndex}-${colIndex}`)}
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Bottom row */}
        {Array(21).fill(0).map((_, idx) => (
          <div
            key={`bottom-${idx}`}
            className="relative aspect-square transition-colors duration-300 border-[0.5px] border-gray-300 cursor-pointer hover:opacity-80"
            style={{ backgroundColor: selectedColors[`bottom-${idx}`] || '#ffffff' }}
            onClick={() => handleCellClick('bottom', idx)}
          >
            {getCellContent(`bottom-${idx}`)}
          </div>
        ))}
      </div>
    </div>
  );
}