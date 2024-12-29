import React from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-bounce-in">
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl text-center font-bold text-gray-800">{message}</p>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Got it! 😅
          </button>
        </div>
      </div>
    </div>
  );
} 