import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fireworks } from "@/components/Fireworks";

interface QuizSectionProps {
  onComplete: () => void;
}

const questions = [
  {
    question: "Thẻ HTML nào dùng để tạo tiêu đề chính?",
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>Ngày Nhà Giáo Việt Nam 20/11</title>
  </head>
  <body>
    <___>Chúc mừng ngày 20/11</___>
  </body>
</html>`,
    answer: "h1",
    hint: "Gợi ý: Tiêu đề cấp 1",
  },
  {
    question: "Thuộc tính nào dùng để tạo liên kết?",
    code: `<a ___="https://teachers-day.vn">
  Tri ân thầy cô
</a>`,
    answer: "href",
    hint: "Gợi ý: Hypertext Reference",
  },
  {
    question: "Thẻ HTML nào dùng để chèn ảnh?",
    code: `<___
  src="teachers.jpg"
  alt="Ngày nhà giáo"
/>`,
    answer: "img",
    hint: "Gợi ý: Image",
  },
];

export const QuizSection = ({ onComplete }: QuizSectionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFireworks, setShowFireworks] = useState(false);
  const [showError, setShowError] = useState(false);

  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const playErrorSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const handleSubmit = () => {
    if (
      userAnswer.toLowerCase().trim() ===
      questions[currentQuestion].answer.toLowerCase()
    ) {
      playSuccessSound();
      setShowFireworks(true);
      setShowError(false);

      setTimeout(() => {
        setShowFireworks(false);
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setUserAnswer("");
        } else {
          setTimeout(onComplete, 1000);
        }
      }, 2500);
    } else {
      playErrorSound();
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
    }
  };

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 animate-slide-up overflow-y-auto">
      {showFireworks && <Fireworks />}
      
      <div className="w-full max-w-4xl">
        <div className="bg-card border border-code-border rounded-xl overflow-hidden shadow-2xl">
          {/* Code Editor Header */}
          <div className="bg-secondary px-6 py-4 flex items-center gap-2 border-b border-code-border">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
            <span className="ml-4 text-muted-foreground font-mono text-sm">
              question_{currentQuestion + 1}.html
            </span>
          </div>

          {/* Question */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {question.question}
            </h2>

            {/* Code Block */}
            <div className="bg-background border border-code-border rounded-lg p-6 mb-6 font-mono text-sm">
              <pre className="text-foreground whitespace-pre-wrap">
                {question.code}
              </pre>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">{question.hint}</p>
              <div className="flex gap-4">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Nhập câu trả lời..."
                  className={`flex-1 font-mono bg-background border-code-border text-foreground placeholder:text-muted-foreground ${
                    showError ? "border-destructive animate-shake" : ""
                  }`}
                />
                <Button
                  onClick={handleSubmit}
                  className="px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold"
                >
                  Kiểm tra
                </Button>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 flex gap-2">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx <= currentQuestion ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
