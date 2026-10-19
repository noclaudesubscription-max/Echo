import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Play, Pause } from "lucide-react";
import { Button, Slider } from "@heroui/react";

interface AudioPlayerProps {
  /** Audio source URL. If not provided, onLoadRequest must be provided. */
  src?: string;
  /** Called when play is clicked and no src is loaded yet. Should return the audio URL. */
  onLoadRequest?: () => Promise<string | null>;
  className?: string;
  autoPlay?: boolean;
}

interface AudioPlayerGroupContextValue {
  requestPlayback: (audio: HTMLAudioElement) => void;
  releasePlayback: (audio: HTMLAudioElement) => void;
}

const AudioPlayerGroupContext =
  createContext<AudioPlayerGroupContextValue | null>(null);

export const AudioPlayerGroup: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const value = useMemo<AudioPlayerGroupContextValue>(
    () => ({
      requestPlayback: (audio) => {
        if (activeAudioRef.current !== audio) activeAudioRef.current?.pause();
        activeAudioRef.current = audio;
      },
      releasePlayback: (audio) => {
        if (activeAudioRef.current === audio) activeAudioRef.current = null;
      },
    }),
    [],
  );

  return (
    <AudioPlayerGroupContext.Provider value={value}>
      {children}
    </AudioPlayerGroupContext.Provider>
  );
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src: initialSrc,
  onLoadRequest,
  className = "",
  autoPlay = false,
}) => {
  const group = useContext(AudioPlayerGroupContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(initialSrc ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const src = loadedSrc;
  const animationRef = useRef<number | undefined>(undefined);

  // Use a ref to avoid stale closures in the animation loop
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Stable animation loop with no dependencies
  const tick = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }

    if (isPlayingRef.current) {
      animationRef.current = requestAnimationFrame(tick);
    }
  }, []); // Empty dependency array is key!

  // Manage animation loop lifecycle
  useEffect(() => {
    if (isPlaying) {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(tick);
      }
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [isPlaying, tick]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(0);
    };

    const handleEnded = () => {
      group?.releasePlayback(audio);
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };

    const handlePlay = () => {
      group?.requestPlayback(audio);
      setIsPlaying(true);
    };
    const handlePause = () => {
      group?.releasePlayback(audio);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      group?.releasePlayback(audio);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [group]);

  // Auto-play when src becomes available (via onLoadRequest or autoPlay prop)
  const prevLoadedSrc = useRef<string | null>(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Play when loadedSrc changes from null to a value (lazy load case)
    if (loadedSrc && !prevLoadedSrc.current && onLoadRequest) {
      audio.play().catch((error) => {
        console.error("Auto-play failed:", error);
      });
    }
    // Or when autoPlay is set with initial src
    else if (autoPlay && initialSrc && !prevLoadedSrc.current) {
      audio.play().catch((error) => {
        console.error("Auto-play failed:", error);
      });
    }

    prevLoadedSrc.current = loadedSrc;
  }, [loadedSrc, autoPlay, initialSrc, onLoadRequest]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (loadedSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(loadedSrc);
      }
    };
  }, [loadedSrc]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isLoading) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        // If no src loaded yet, request it
        if (!src && onLoadRequest) {
          setIsLoading(true);
          const newSrc = await onLoadRequest();
          setIsLoading(false);
          if (newSrc) {
            setLoadedSrc(newSrc);
            // Playback will be triggered by the useEffect watching loadedSrc
          }
        } else if (src) {
          await audio.play();
        }
      }
    } catch (error) {
      console.error("Playback failed:", error);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number): string => {
    if (!isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <audio ref={audioRef} src={src ?? undefined} preload="metadata" />

      <Button
        variant="ghost"
        isIconOnly
        onPress={togglePlay}
        isDisabled={isLoading}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause width={20} height={20} fill="currentColor" />
        ) : (
          <Play width={20} height={20} fill="currentColor" />
        )}
      </Button>

      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs text-text/60 min-w-[30px] tabular-nums">
          {formatTime(currentTime)}
        </span>

        <Slider
          aria-label="Playback position"
          className="flex-1"
          minValue={0}
          maxValue={duration || 0}
          step={0.01}
          value={currentTime}
          onChange={(next) => {
            if (typeof next === "number") handleSeek(next);
          }}
        >
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>

        <span className="text-xs text-text/60 min-w-[30px] tabular-nums">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};
