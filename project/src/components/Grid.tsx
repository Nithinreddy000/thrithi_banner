import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { gridData } from '../data/gridData';
import { Toast } from './Toast';

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const roastMessages = [
    "Wow, you're really trying to make this as colorful as your personality, aren't you? 😅",
    "Nice try! But this isn't a Jackson Pollock painting... 🎨",
    "That's about as correct as pineapple on pizza! 🍕",
    "Are you colorblind or just feeling rebellious today? 🤔",
    "Even my pet rock makes better color choices! 🪨"
  ];

  // Initialize cell numbers on component mount
  useEffect(() => {
    const numbers: { [key: string]: number } = {};
    
    // Set border cells to 1
    for (let i = 0; i < gridData[0].length; i++) {
      numbers[`top-${i}`] = 1;
      numbers[`bottom-${i}`] = 1;
    }
    
    // Set last column to 1
    numbers[`top-20`] = 1;
    numbers[`bottom-20`] = 1;
    for (let i = 0; i < gridData.length; i++) {
      numbers[`left-${i}`] = 1;
      numbers[`right-${i}`] = 1;
      // Set the rightmost cell of each row to 1
      numbers[`${i}-19`] = 1;
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
  const handleCellClick = (position: string, idx: number) => {
    if (selectedColorNumber) {
      const key = `${position}-${idx}`;
      const cellNumber = cellNumbers[key];
      
      // Check if the selected color matches the cell number
      if (cellNumber !== selectedColorNumber) {
        const randomRoast = roastMessages[Math.floor(Math.random() * roastMessages.length)];
        setToastMessage(randomRoast);
        setShowToast(true);
        return;
      }

      setSelectedColors(prev => ({
        ...prev,
        [key]: COLOR_MAP[selectedColorNumber as keyof typeof COLOR_MAP]
      }));
    }
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

  const handleFillAll = () => {
    const newColors: { [key: string]: string } = {};
    
    // Fill all cells based on their numbers
    Object.entries(cellNumbers).forEach(([key, number]) => {
      newColors[key] = COLOR_MAP[number as keyof typeof COLOR_MAP];
    });
    
    setSelectedColors(newColors);
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

      <div 
        className="grid grid-cols-[repeat(21,minmax(12px,1fr))] gap-[1px] bg-gradient-to-b from-rose-300 via-yellow-200 to-rose-300 px-1 py-4 rounded-lg"
        style={{ aspectRatio: '21/82' }}
      >
        {/* Fill All button positioned at the red mark location */}
        <div className="absolute left-[-120px] top-[5%] transform -translate-y-1/2">
          <button
            onClick={handleFillAll}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg 
                     hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg 
                     hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap text-sm"
          >
            Fill All Colors
          </button>
        </div>

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
                onClick={() => handleCellClick(String(rowIndex), colIndex)}
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

      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  );
}