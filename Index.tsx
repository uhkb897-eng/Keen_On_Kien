import { useState } from "react";
import { PuzzleGame } from "@/components/PuzzleGame";
import { QuizSection } from "@/components/QuizSection";
import { VideoSection } from "@/components/VideoSection";
import { CongratulationsSection } from "@/components/CongratulationsSection";

type Stage = "puzzle" | "quiz" | "video" | "congratulations";

const Index = () => {
  const [stage, setStage] = useState<Stage>("puzzle");

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {stage === "puzzle" && (
        <PuzzleGame onComplete={() => setStage("quiz")} />
      )}
      {stage === "quiz" && (
        <QuizSection onComplete={() => setStage("video")} />
      )}
      {stage === "video" && (
        <VideoSection onComplete={() => setStage("congratulations")} />
      )}
      {stage === "congratulations" && <CongratulationsSection />}
    </div>
  );
};

export default Index;
