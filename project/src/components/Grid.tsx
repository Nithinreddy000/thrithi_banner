import React, { useState, useEffect, useRef } from 'react';
import { Eye } from 'lucide-react';
import { gridData } from '../data/gridData';
import { Toast } from './Toast';
import { Controls } from './Controls';
import html2canvas from 'html2canvas';

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
  const [history, setHistory] = useState<{[key: string]: string}[]>([{}]);
  const [currentStep, setCurrentStep] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

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
      
      if (cellNumber !== selectedColorNumber) {
        const randomRoast = roastMessages[Math.floor(Math.random() * roastMessages.length)];
        setToastMessage(randomRoast);
        setShowToast(true);
        return;
      }

      // Create new state
      const newColors = {
        ...selectedColors,
        [key]: COLOR_MAP[selectedColorNumber]
      };

      // Add to history, removing any future steps if we're not at the end
      const newHistory = [...history.slice(0, currentStep + 1), newColors];
      setHistory(newHistory);
      setCurrentStep(currentStep + 1);
      setSelectedColors(newColors);
    }
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedColors(history[currentStep - 1]);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedColors(history[currentStep + 1]);
    }
  };

  const handleSave = () => {
    localStorage.setItem('gridColors', JSON.stringify(selectedColors));
    alert('Progress saved!');
  };

  const handleDownload = async () => {
    if (gridRef.current) {
      try {
        // First capture at a higher resolution
        const canvas = await html2canvas(gridRef.current, {
          backgroundColor: null,
          scale: 10, // Increased scale for higher quality
          width: 512, // Doubled base width
          height: 2560, // Doubled base height
          useCORS: true,
          removeContainer: true,
          logging: false,
          windowWidth: 512,
          windowHeight: 2560,
          onclone: (document) => {
            const clonedGrid = document.querySelector('[data-html2canvas-clone]');
            if (clonedGrid && clonedGrid instanceof HTMLElement) {
              clonedGrid.style.width = '512px';
              clonedGrid.style.height = '2560px';
              clonedGrid.style.display = 'grid';
              clonedGrid.style.gridTemplateColumns = 'repeat(21, 1fr)';
              clonedGrid.style.gap = '0';
              clonedGrid.style.padding = '0';
              clonedGrid.style.margin = '0';
              clonedGrid.style.position = 'relative';
              
              // Enhance cell quality
              const cells = clonedGrid.querySelectorAll('div');
              cells.forEach(cell => {
                if (cell instanceof HTMLElement) {
                  cell.style.width = '100%';
                  cell.style.height = '100%';
                  cell.style.padding = '0';
                  cell.style.margin = '0';
                  cell.style.display = 'block';
                  cell.style.imageRendering = 'pixelated'; // Sharper edges
                }
              });
            }
          }
        });

        // Create a temporary canvas with even higher resolution
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 1024;  // 4x original width
        tempCanvas.height = 5120; // 4x original height
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx) {
          // Enable better image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw the captured content with higher resolution
          ctx.drawImage(canvas, 0, 0, 1024, 5120);
          
          // Convert to PNG with maximum quality
          const link = document.createElement('a');
          link.download = 'thrithi-banner-hd.png';
          link.href = tempCanvas.toDataURL('image/png', 1.0);
          
          // Add metadata for better quality
          const img = new Image();
          img.src = link.href;
          img.onload = () => {
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = 1024;
            finalCanvas.height = 5120;
            const finalCtx = finalCanvas.getContext('2d');
            
            if (finalCtx) {
              finalCtx.imageSmoothingEnabled = true;
              finalCtx.imageSmoothingQuality = 'high';
              finalCtx.drawImage(img, 0, 0, 1024, 5120);
              
              // Download with maximum quality
              link.href = finalCanvas.toDataURL('image/png', 1.0);
              link.click();
            }
          };
        }
      } catch (error) {
        console.error('Error generating HD image:', error);
        alert('Failed to download HD image. Please try again.');
      }
    }
  };

  // Load saved progress on mount
  useEffect(() => {
    const savedColors = localStorage.getItem('gridColors');
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      setSelectedColors(colors);
      setHistory([{}, colors]);
      setCurrentStep(1);
    }
  }, []);

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
        ref={gridRef}
        className="grid grid-cols-[repeat(21,minmax(12px,1fr))] bg-gradient-to-b from-rose-300 via-yellow-200 to-rose-300 rounded-lg overflow-hidden"
        style={{ 
          aspectRatio: '0/82',
          lineHeight: 0,
          fontSize: 0,
          padding: 0,
          margin: 0
        }}
      >
        {/* Fill All button */}
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
            className="relative aspect-square transition-colors duration-300 cursor-pointer hover:opacity-80 border-[0.25px] border-gray-300 leading-[0] block"
            style={{ 
              backgroundColor: selectedColors[`top-${idx}`] || '#ffffff',
              fontSize: 0,
              lineHeight: 0,
              margin: 0,
              padding: 0
            }}
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
              className="relative aspect-square transition-colors duration-300 cursor-pointer hover:opacity-80 border-[0.25px] border-gray-300 leading-[0] block"
              style={{ 
                backgroundColor: selectedColors[`left-${rowIndex}`] || '#ffffff',
                fontSize: 0,
                lineHeight: 0,
                margin: 0,
                padding: 0
              }}
              onClick={() => handleCellClick('left', rowIndex)}
            >
              {getCellContent(`left-${rowIndex}`)}
            </div>
            
            {/* Main cells */}
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="relative aspect-square transition-colors duration-300 cursor-pointer hover:opacity-80 border-[0.25px] border-gray-300 leading-[0] block"
                style={{ 
                  backgroundColor: selectedColors[`${rowIndex}-${colIndex}`] || '#ffffff',
                  fontSize: 0,
                  lineHeight: 0,
                  margin: 0,
                  padding: 0
                }}
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
            className="relative aspect-square transition-colors duration-300 cursor-pointer hover:opacity-80 border-[0.25px] border-gray-300 leading-[0] block"
            style={{ 
              backgroundColor: selectedColors[`bottom-${idx}`] || '#ffffff',
              fontSize: 0,
              lineHeight: 0,
              margin: 0,
              padding: 0
            }}
            onClick={() => handleCellClick('bottom', idx)}
          >
            {getCellContent(`bottom-${idx}`)}
          </div>
        ))}
      </div>

      <Controls
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDownload={handleDownload}
        onSave={handleSave}
        canUndo={currentStep > 0}
        canRedo={currentStep < history.length - 1}
      />

      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  );
}