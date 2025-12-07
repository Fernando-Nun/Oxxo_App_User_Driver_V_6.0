import { useState, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

interface SwipeToConfirmProps {
  onConfirm: () => void;
  text: string;
  icon?: React.ReactNode;
}

export function SwipeToConfirm({ onConfirm, text, icon }: SwipeToConfirmProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current || !buttonRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();
    const maxPosition = container.width - button.width - 8;

    let newPosition = clientX - container.left - button.width / 2;
    newPosition = Math.max(0, Math.min(newPosition, maxPosition));

    setPosition(newPosition);

    // Si llega al final, confirmar
    if (newPosition >= maxPosition * 0.95) {
      setIsDragging(false);
      onConfirm();
      setPosition(0);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setPosition(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-200 rounded-full h-14 overflow-hidden select-none cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-gray-600 text-sm">{text}</p>
      </div>

      <div
        ref={buttonRef}
        className="absolute top-1 left-1 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-transform"
        style={{ transform: `translateX(${position}px)` }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {icon || <ChevronRight className="size-6 text-white" />}
      </div>
    </div>
  );
}
