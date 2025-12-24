
"use client"

import { useState, useEffect } from 'react';

export function ClickTracker() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const handleClick = () => {
      try {
        const savedClickCount = localStorage.getItem('huzi-pk-click-count') || '0';
        let clickCount = Number(savedClickCount);
        
        clickCount++;
        
        if (clickCount >= 55) {
          window.open('https://huzi.pk', '_blank');
          clickCount = 0;
        }
        
        localStorage.setItem('huzi-pk-click-count', String(clickCount));
      } catch (error) {
        console.warn("Could not access localStorage for click tracking.");
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isClient]);

  return null;
}
