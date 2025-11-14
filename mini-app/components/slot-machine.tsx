'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from '@/components/share';
import { url } from '@/lib/metadata';
import { cn } from '@/lib/utils';

const fruits = ['🍎', '🍌', '🍒', '🍋'];

function getRandomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit)));
  const [isSpinning, setIsSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWin(null);
    const interval = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        // shift rows down
        newGrid[2] = newGrid[1];
        newGrid[1] = newGrid[0];
        newGrid[0] = Array.from({ length: 3 }, getRandomFruit);
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      // check win
      const center = grid[1];
      if (center[0] === center[1] && center[1] === center[2]) {
        setWin(center[0]);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="grid grid-cols-3 gap-1">
          {grid.map((row, rIdx) =>
            row.map((fruit, cIdx) => (
              <div key={`${rIdx}-${cIdx}`} className="w-12 h-12 flex items-center justify-center bg-white border rounded">
                {fruit}
              </div>
            ))
          )}
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 bg-primary" />
      </div>
      <Button onClick={spin} disabled={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Spin'}
      </Button>
      {win && (
        <div className="p-4 bg-green-100 rounded">
          <p className="text-green-800">You won with {win}!</p>
          <Share text={`I just won with ${win} on the Slot Machine Mini App! ${url}`} />
        </div>
      )}
    </div>
  );
}
