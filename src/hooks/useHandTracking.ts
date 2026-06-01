import { useEffect, useRef, useCallback, useState } from 'react';
import { usePlanetStore } from '@/contexts/PlanetContext';

// MediaPipe Hands detection (optional feature)
export const useHandTracking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<unknown>(null);
  const cameraRef = useRef<{ stop: () => void } | null>(null);
  
  const {
    setHandTracking,
    setHandPosition,
    setIsPinching,
    setPinchDistance,
    setIsPalmOpen,
    showAIMessage,
  } = usePlanetStore();

  const initializeHandTracking = useCallback(async () => {
    setIsLoading(true);

    try {
      let Hands: new (options: { locateFile?: (file: string) => string }) => {
        setOptions: (options: Record<string, unknown>) => void;
        onResults: (callback: (results: { multiHandLandmarks?: { x: number; y: number; z: number }[][] }) => void) => void;
        send: (data: { image: HTMLVideoElement }) => Promise<void>;
      };
      let Camera: new (video: HTMLVideoElement, options: Record<string, unknown>) => {
        start: () => Promise<void>;
        stop: () => void;
      };

      try {
        const mpModule = await import('@mediapipe/hands');
        Hands = mpModule.Hands;
        
        const cameraModule = await import('@mediapipe/camera_utils');
        Camera = cameraModule.Camera;
      } catch (importError) {
        setIsLoading(false);
        showAIMessage('Hand tracking library not available. Using mouse mode.');
        return;
      }

      setIsSupported(true);

      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: { multiHandLandmarks?: { x: number; y: number; z: number }[][] }) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          
          const wrist = landmarks[0];
          const handX = (wrist.x - 0.5) * 4;
          const handY = -(wrist.y - 0.5) * 4;
          const handZ = (wrist.z || 0) * 2;
          
          setHandPosition({ x: handX, y: handY, z: handZ });
          
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const pinchDistance = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) +
            Math.pow(thumbTip.y - indexTip.y, 2)
          );
          
          setPinchDistance(pinchDistance);
          setIsPinching(pinchDistance < 0.08);
          
          const fingerTips = [8, 12, 16, 20];
          const fingerPips = [6, 10, 14, 18];
          let extendedCount = 0;
          for (let i = 0; i < fingerTips.length; i++) {
            if (landmarks[fingerTips[i]].y < landmarks[fingerPips[i]].y) {
              extendedCount++;
            }
          }
          setIsPalmOpen(extendedCount >= 3);
        } else {
          setHandPosition(null);
          setIsPalmOpen(false);
          setIsPinching(false);
        }
      });

      handsRef.current = hands;

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await (handsRef.current as { send: (data: { image: HTMLVideoElement }) => Promise<void> }).send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        
        cameraRef.current = camera;
        await camera.start();
      }

      setHandTracking(true);
      showAIMessage('Hand tracking enabled! Show your hand to the camera.');
      setIsLoading(false);
    } catch (err) {
      console.error('Hand tracking error:', err);
      setIsLoading(false);
      showAIMessage('Webcam access denied. Using mouse mode instead.');
    }
  }, [setHandTracking, setHandPosition, setIsPinching, setPinchDistance, setIsPalmOpen, showAIMessage]);

  const stopHandTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setHandTracking(false);
    setHandPosition(null);
  }, [setHandTracking, setHandPosition]);

  useEffect(() => {
    return () => {
      stopHandTracking();
    };
  }, [stopHandTracking]);

  return {
    videoRef,
    isLoading,
    isSupported,
    initializeHandTracking,
    stopHandTracking,
  };
};

// Mouse-based gesture simulation with magic triggers
export const useMouseGesture = () => {
  const { setHandPosition, setIsPinching, setIsPalmOpen, triggerMagic } = usePlanetStore();
  const isMouseDown = useRef(false);
  const lastClickTime = useRef(0);
  const mouseHistory = useRef<{ x: number; y: number; time: number }[]>([]);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseDown = () => {
      isMouseDown.current = true;
      isDragging.current = false;
      setIsPinching(true);
    };

    const handleMouseUp = () => {
      const wasDragging = isDragging.current;
      isMouseDown.current = false;
      setIsPinching(false);
      
      // Check for magic gesture on mouse release (if we were dragging)
      if (wasDragging) {
        const history = mouseHistory.current;
        if (history.length > 5) {
          const startX = history[0].x;
          const startY = history[0].y;
          const endX = history[history.length - 1].x;
          const endY = history[history.length - 1].y;
          const dist = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
          
          // If dragged far, trigger magic!
          if (dist > 150) {
            triggerMagic();
          }
        }
      }
      mouseHistory.current = [];
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 4;
      const y = -(e.clientY / window.innerHeight - 0.5) * 4;
      setHandPosition({ x, y, z: 0 });
      setIsPalmOpen(!isMouseDown.current);
      
      if (isMouseDown.current) {
        isDragging.current = true;
        const now = Date.now();
        mouseHistory.current.push({ x: e.clientX, y: e.clientY, time: now });
        if (mouseHistory.current.length > 30) {
          mouseHistory.current.shift();
        }
      }
    };

    const handleDoubleClick = () => {
      // Double click triggers magic!
      triggerMagic();
    };

    const handleMouseLeave = () => {
      setHandPosition(null);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [setHandPosition, setIsPinching, setIsPalmOpen, triggerMagic]);
};
