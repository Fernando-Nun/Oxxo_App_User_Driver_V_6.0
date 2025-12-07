
import { ReactNode, useEffect, useState } from 'react';

interface TabContentWrapperProps {
  children: ReactNode;
  isActive: boolean;
  direction?: 'left' | 'right';
}

export function TabContentWrapper({ children, isActive, direction = 'right' }: TabContentWrapperProps) {
  const [shouldRender, setShouldRender] = useState(isActive);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!shouldRender) return null;

  // Determinar dirección de entrada/salida
  const translateX = direction === 'right' ? 'translate-x-8' : '-translate-x-8';
  const exitTranslateX = direction === 'right' ? '-translate-x-8' : 'translate-x-8';

  return (
    <div
      className={`
        transition-all duration-400 ease-out transform
        ${isAnimating 
          ? 'opacity-100 translate-x-0 scale-100' 
          : `opacity-0 ${translateX} scale-98`
        }
      `}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  );
}
