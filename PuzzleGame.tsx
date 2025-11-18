import { useState, useEffect } from "react";
import puzzleImage from "@/quiz-preview-large.png";

interface PuzzleGameProps {
  onComplete: () => void;
}

export const PuzzleGame = ({ onComplete }: PuzzleGameProps) => {
  const [pieces, setPieces] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);
  const gridSize = 4;
  const totalPieces = gridSize * gridSize;

  useEffect(() => {
    // Start with shuffled pieces
    const shuffled = Array.from({ length: totalPieces }, (_, i) => i).sort(
      () => Math.random() - 0.5
    );
    setPieces(shuffled);

    // Auto-solve the puzzle
    let currentPieces = [...shuffled];
    let solveCount = 0;
    
    // Create audio context for puzzle solving sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playPieceSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 400 + Math.random() * 300;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    const interval = setInterval(() => {
      // Find next piece that's out of place
      const wrongIndex = currentPieces.findIndex((piece, idx) => piece !== idx);
      const wrongPiecesCount = currentPieces.filter((piece, idx) => piece !== idx).length;
      
      // When almost complete (only 2 pieces left wrong) in first round, start second round
      if (wrongPiecesCount <= 2 && solveCount === 0) {
        solveCount++;
        
        // Trigger glitch effect
        setIsGlitching(true);
        
        setTimeout(() => {
          const newShuffled = Array.from({ length: totalPieces }, (_, i) => i).sort(
            () => Math.random() - 0.5
          );
          currentPieces = [...newShuffled];
          setPieces(newShuffled);
          
          setTimeout(() => {
            setIsGlitching(false);
          }, 300);
        }, 200);
        
        return;
      }
      
      if (wrongIndex === -1) {
        // Puzzle complete
        solveCount++;
        
        if (solveCount < 2) {
          // This shouldn't happen now since we transition early
          const newShuffled = Array.from({ length: totalPieces }, (_, i) => i).sort(
            () => Math.random() - 0.5
          );
          currentPieces = [...newShuffled];
          setPieces(newShuffled);
        } else {
          // Second round complete
          clearInterval(interval);
          setTimeout(() => {
            setIsAnimating(false);
            setTimeout(onComplete, 500);
          }, 800);
        }
        return;
      }

      // Find where the correct piece currently is
      const correctPiece = wrongIndex;
      const currentIndex = currentPieces.indexOf(correctPiece);

      // Swap to correct position
      const newPieces = [...currentPieces];
      [newPieces[wrongIndex], newPieces[currentIndex]] = [
        newPieces[currentIndex],
        newPieces[wrongIndex],
      ];
      currentPieces = newPieces;
      setPieces(newPieces);
      playPieceSound();
    }, 300);

    return () => {
      clearInterval(interval);
      audioContext.close();
    };
  }, [onComplete, totalPieces]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="w-full max-w-4xl mx-auto" style={{ aspectRatio: "16/9" }}>
        <div 
          className={`grid grid-cols-4 gap-0.5 sm:gap-1 w-full h-full ${
            isGlitching ? 'glitch-effect' : ''
          }`}
        >
          {pieces.map((pieceIndex, currentIndex) => (
            <div
              key={`${currentIndex}-${pieceIndex}`}
              className="relative transition-all duration-300 ease-out"
              style={{
                backgroundImage: `url(${puzzleImage})`,
                backgroundSize: `${gridSize * 100}%`,
                backgroundPosition: `${(pieceIndex % gridSize) * (100 / (gridSize - 1))}% ${
                  Math.floor(pieceIndex / gridSize) * (100 / (gridSize - 1))
                }%`,
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--code-border))",
                overflow: "hidden",
              }}
            >
              <div className="absolute inset-0 bg-primary/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
