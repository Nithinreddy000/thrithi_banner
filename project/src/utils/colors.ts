export function generateColors(): string[] {
  return [
    '#FF69B4', // Hot Pink
    '#FFB6C1', // Light Pink
    '#FFA07A', // Light Salmon
    '#FFD700', // Gold
    '#FFA500', // Orange
    '#FF8C00', // Dark Orange
    '#FF6347', // Tomato
    '#FF4500', // Orange Red
    '#FF1493'  // Deep Pink
  ];
}

export function getRandomColor(): string {
  const colors = generateColors();
  return colors[Math.floor(Math.random() * colors.length)];
}