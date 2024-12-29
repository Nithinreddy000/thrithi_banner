import { T_PATTERN } from './letters/T';
import { H_PATTERN } from './letters/H';
import { R_PATTERN } from './letters/R';
import { I_PATTERN } from './letters/I';
import { TWO_PATTERN, FIVE_PATTERN, K_PATTERN } from './letters/numbers';

// Helper function to create empty row
const createEmptyRow = (width: number) => new Array(width).fill(0);

// Helper function to add padding around a pattern
const addPadding = (pattern: number[][], leftPad: number = 7, rightPad: number = 8) => {
  const width = pattern[0].length + leftPad + rightPad;
  return pattern.map(row => [
    ...new Array(leftPad).fill(0),
    ...row,
    ...new Array(rightPad).fill(0)
  ]);
};

// Combine all patterns vertically with proper spacing
const createFullGrid = () => {
  const gridWidth = 20;
  const fullGrid: number[][] = [];
  
  // Add T
  fullGrid.push(...addPadding(T_PATTERN));
  fullGrid.push(...Array(2).fill(createEmptyRow(gridWidth)));
  
  // Add H
  fullGrid.push(...addPadding(H_PATTERN));
  fullGrid.push(...Array(2).fill(createEmptyRow(gridWidth)));
  
  // Add R
  fullGrid.push(...addPadding(R_PATTERN));
  fullGrid.push(...Array(2).fill(createEmptyRow(gridWidth)));
  
  // Add I
  fullGrid.push(...addPadding(I_PATTERN));
  fullGrid.push(...Array(2).fill(createEmptyRow(gridWidth)));
  
  // Add T
  fullGrid.push(...addPadding(T_PATTERN));
  fullGrid.push(...Array(2).fill(createEmptyRow(gridWidth)));
  
  // Add H
  fullGrid.push(...addPadding(H_PATTERN));
  fullGrid.push(...Array(2).fill(createEmptyRow(gridWidth)));
  
  // Add I
  fullGrid.push(...addPadding(I_PATTERN));
  fullGrid.push(...Array(3).fill(createEmptyRow(gridWidth)));
  
  // Add 2K25 in a single line
  for (let i = 0; i < 5; i++) { // Add 5 rows for the numbers
    const row = new Array(gridWidth).fill(0);
    
    // Add 2
    TWO_PATTERN[i].forEach((val, idx) => {
      row[0 + idx] = val;
    });
    
    // Add K
    K_PATTERN[i].forEach((val, idx) => {
      row[5 + idx] = val;
    });
    
    // Add 2
    TWO_PATTERN[i].forEach((val, idx) => {
      row[10 + idx] = val;
    });
    
    // Add 5
    FIVE_PATTERN[i].forEach((val, idx) => {
      row[15 + idx] = val;
    });
    
    fullGrid.push(row);
  }

  return fullGrid;
};

export const gridData = createFullGrid();