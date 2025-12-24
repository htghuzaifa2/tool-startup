
"use client"

import React, { useRef, useEffect } from 'react';
import '@/app/new-button.css';

interface GetStartedButtonProps {
    children: React.ReactNode;
}

export const GetStartedButton = ({ children }: GetStartedButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const blobRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const blob = blobRef.current;

    if (!btn || !blob) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top } = btn.getBoundingClientRect();
      blob.style.left = `${clientX - left}px`;
      blob.style.top = `${clientY - top}px`;
    };

    btn.addEventListener('mousemove', handleMouseMove);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  return (
    <button ref={btnRef} className="fancy-btn">
      <span ref={textRef} className="text">
        {children}
      </span>
      <span ref={blobRef} className="blob"></span>
    </button>
  );
};
