import React from 'react';
import { Undo2, Redo2, Download, Save } from 'lucide-react';

interface ControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onUndo,
  onRedo,
  onDownload,
  onSave,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex gap-4 mt-16" style={{marginLeft: '1rem'}}>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Undo"
      >
        <Undo2 className="w-6 h-6" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Redo"
      >
        <Redo2 className="w-6 h-6" />
      </button>
      <button
        onClick={onDownload}
        className="p-2 rounded-full hover:bg-gray-100"
        title="Download Banner"
      >
        <Download className="w-6 h-6" />
      </button>
      <button
        onClick={onSave}
        className="p-2 rounded-full hover:bg-gray-100"
        title="Save Progress"
      >
        <Save className="w-6 h-6" />
      </button>
    </div>
  );
}; 