import { useState, useEffect } from "react";

export const CongratulationsSection = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Biết ơn thầy – người thắp ánh bình minh trong trí tuệ chúng em";

  useEffect(() => {
    // Create audio context for typing sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audio = new Audio('/nguoi-gieo-mam-xanh.mp3');
    
    const playTypingSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800 + Math.random() * 200;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        if (currentIndex > 0) {
          playTypingSound();
        }
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Play music after typing completes
        setTimeout(() => {
          audio.play().catch(err => console.log('Audio playback failed:', err));
        }, 500);
      }
    }, 114);
    
    return () => {
      clearInterval(typingInterval);
      audioContext.close();
      audio.pause();
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black animate-fade-in">
      <div className="max-w-4xl px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary leading-relaxed">
          {displayedText}
          <span className="animate-pulse">|</span>
        </h1>
      </div>
    </div>
  );
};
