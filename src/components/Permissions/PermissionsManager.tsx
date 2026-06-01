import { useEffect, useState } from 'react';
import { Camera, Mic, X, AlertCircle } from 'lucide-react';
import { usePlanetStore } from '@/contexts/PlanetContext';

interface PermissionStatus {
  camera: 'pending' | 'granted' | 'denied';
  microphone: 'pending' | 'granted' | 'denied';
}

export function PermissionsManager() {
  const { showAIMessage } = usePlanetStore();
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: 'pending',
    microphone: 'pending',
  });
  const [showPermissionBanner, setShowPermissionBanner] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setPermissions(prev => ({ ...prev, camera: cameraPermission.state as 'granted' | 'denied' }));
          
          const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissions(prev => ({ ...prev, microphone: micPermission.state as 'granted' | 'denied' }));

          cameraPermission.onchange = () => {
            setPermissions(prev => ({ ...prev, camera: cameraPermission.state as 'granted' | 'denied' }));
          };
          micPermission.onchange = () => {
            setPermissions(prev => ({ ...prev, microphone: micPermission.state as 'granted' | 'denied' }));
          };
        }
      } catch {
        setPermissions({ camera: 'pending', microphone: 'pending' });
      }
    };
    checkPermissions();
  }, []);

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, camera: 'granted' }));
      showAIMessage('Camera permission granted!');
    } catch {
      setPermissions(prev => ({ ...prev, camera: 'denied' }));
      showAIMessage('Camera permission denied');
    }
  };

  const requestMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, microphone: 'granted' }));
      showAIMessage('Microphone permission granted!');
    } catch {
      setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      showAIMessage('Microphone permission denied');
    }
  };

  const anyDenied = permissions.camera === 'denied' || permissions.microphone === 'denied';

  if (!showPermissionBanner) return null;

  return (
    <div className="fixed top-2 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-80 z-50 animate-fadeIn">
      <div className="bg-gray-900/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <span className="text-xs font-medium text-white">Permissions</span>
          <button
            onClick={() => setShowPermissionBanner(false)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-3">
          <div className="flex gap-3 justify-center">
            {/* Camera Button */}
            <button
              onClick={requestCamera}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                permissions.camera === 'granted' 
                  ? 'bg-green-500/30 ring-2 ring-green-400' 
                  : permissions.camera === 'denied'
                  ? 'bg-red-500/30 ring-2 ring-red-400'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Camera className={`w-5 h-5 ${
                permissions.camera === 'granted' ? 'text-green-400' 
                : permissions.camera === 'denied' ? 'text-red-400' 
                : 'text-white/60'
              }`} />
              <span className="text-[10px] font-medium text-white/80">
                {permissions.camera === 'granted' ? 'Camera ✓' 
                 : permissions.camera === 'denied' ? 'Camera ✗'
                 : 'Camera'}
              </span>
            </button>

            {/* Microphone Button */}
            <button
              onClick={requestMicrophone}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                permissions.microphone === 'granted' 
                  ? 'bg-green-500/30 ring-2 ring-green-400' 
                  : permissions.microphone === 'denied'
                  ? 'bg-red-500/30 ring-2 ring-red-400'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Mic className={`w-5 h-5 ${
                permissions.microphone === 'granted' ? 'text-green-400' 
                : permissions.microphone === 'denied' ? 'text-red-400' 
                : 'text-white/60'
              }`} />
              <span className="text-[10px] font-medium text-white/80">
                {permissions.microphone === 'granted' ? 'Mic ✓' 
                 : permissions.microphone === 'denied' ? 'Mic ✗'
                 : 'Mic'}
              </span>
            </button>
          </div>
          
          {anyDenied && (
            <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-red-400">
              <AlertCircle className="w-3 h-3" />
              Some permissions denied
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
