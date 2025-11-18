import { useEffect, useRef } from "react";

interface VideoSectionProps {
  onComplete: () => void;
}

export const VideoSection = ({ onComplete }: VideoSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
      videoRef.current.play();
    }
  }, []);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center animate-fade-in">
      <video
        ref={videoRef}
        src="/video.mp4"
        className="w-full h-full object-cover cursor-pointer"
        onEnded={onComplete}
        onClick={handleVideoClick}
        playsInline
      />
    </div>
  );
};
