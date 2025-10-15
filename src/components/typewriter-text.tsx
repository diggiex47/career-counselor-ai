"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 30, onComplete }: TypewriterTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Split text into lines for line-by-line animation
  const lines = text.split('\n');

  useEffect(() => {
    if (currentLineIndex < lines.length && !isComplete) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, lines[currentLineIndex] || ""]);
        setCurrentLineIndex(prev => prev + 1);
      }, speed * 10); // Slower for line-by-line

      return () => clearTimeout(timer);
    } else if (currentLineIndex >= lines.length && !isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentLineIndex, lines, speed, onComplete, isComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedLines([]);
    setCurrentLineIndex(0);
    setIsComplete(false);
  }, [text]);

  // Format the displayed content in real-time
  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/## (.*?)$/gm, '<h3 class="text-base font-semibold mt-4 mb-3 text-gray-800 border-b border-gray-200 pb-1">$1</h3>')
      // Main numbered points (level 1)
      .replace(/^(\d+)\.\s(.+)$/gm, '<div class="flex items-start gap-3 mb-3 pl-0"><span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">$1</span><div class="flex-1 leading-relaxed">$2</div></div>')
      // Sub-points with asterisks (level 2)
      .replace(/^\*\s(.+)$/gm, '<div class="flex items-start gap-3 mb-2 pl-6"><span class="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></span><div class="flex-1 leading-relaxed">$1</div></div>')
      // Sub-points with bullets (level 2)
      .replace(/^•\s(.+)$/gm, '<div class="flex items-start gap-3 mb-2 pl-6"><span class="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></span><div class="flex-1 leading-relaxed">$1</div></div>')
      // Process arrows (level 2)
      .replace(/^→\s(.+)$/gm, '<div class="flex items-start gap-3 mb-2 pl-6"><span class="flex-shrink-0 text-green-500 font-bold mt-0.5">→</span><div class="flex-1 leading-relaxed">$1</div></div>')
      // Important actions (level 2)
      .replace(/^▶\s(.+)$/gm, '<div class="flex items-start gap-3 mb-2 pl-6"><span class="flex-shrink-0 text-purple-500 font-bold mt-0.5">▶</span><div class="flex-1 leading-relaxed">$1</div></div>')
      // Simple dashes (level 3)
      .replace(/^-\s(.+)$/gm, '<div class="flex items-start gap-3 mb-1 pl-12"><span class="flex-shrink-0 text-gray-500 mt-0.5">-</span><div class="flex-1 leading-relaxed">$1</div></div>');
  };

  const formattedContent = formatContent(displayedLines.join('\n'));

  return (
    <div className="space-y-2">
      <div 
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
      {!isComplete && (
        <span className="animate-pulse text-gray-400">|</span>
      )}
    </div>
  );
}