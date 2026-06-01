import { useEffect, useState } from 'react';
import { Camera, Mic, Check, X, AlertCircle } from 'lucide-react';
import { usePlanetStore } from '@/contexts/PlanetContext';

interface PermissionStatus {
  camera: 'pending' | 'granted' | 'denied';
  microphone: 'pending' | 'granted' | 'denied';
}

export function PermissionsManager() {
  const { showAIMessage, setWebcamActive } = usePlanetStore();
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: 'pending',
    microphone: 'pending',
  });
  const [showPermissionBanner, setShowPermissionBanner] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      // Check camera permission
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setPermissions(prev => ({ ...prev, camera: cameraPermission.state as 'granted' | 'denied' }));
          
          const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissions(prev => ({ ...prev, microphone: micPermission.state as 'granted' | 'denied' }));

          // Listen for permission changes
          cameraPermission.onchange = () => {
            setPermissions(prev => ({ ...prev, camera: cameraPermission.state as 'granted' | 'denied' }));
          };
          micPermission.onchange = () => {
            setPermissions(prev => ({ ...prev, microphone: micPermission.state as 'granted' | 'denied' }));
          };
        } else {
          // Fallback: try to get media devices
          setPermissions({ camera: 'pending', microphone: 'pending' });
        }
      } catch (err) {
        console.log('Permission check not supported');
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

  const bothGranted = permissions.camera === 'granted' && permissions.microphone === 'granted';
  const anyDenied = permissions.camera === 'denied' || permissions.microphone === 'denied';

  if (!showPermissionBanner) return null;

  return (
    <div className="fixed top-2 sm:top-4 left-2 sm:left-1/2 sm:-translate-x-1/2 right-2 sm:right-auto z-50 animate-fadeIn">
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="flex gap-2 sm:gap-3">
            {/* Camera Status */}
            <button
              onClick={requestCamera}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-xl transition-all ${
                permissions.camera === 'granted' 
                  ? 'bg-green-500/30 ring-2 ring-green-400' 
                  : permissions.camera === 'denied'
                  ? 'bg-red-500/30 ring-2 ring-red-400'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Camera className={`w-5 h-5 sm:w-6 sm:h-6 ${
                permissions.camera === 'granted' ? 'text-green-400' 
                : permissions.camera === 'denied' ? 'text-red-400' 
                : 'text-white/60'
              }`} />
              <span className="text-[8px] sm:text-[10px] font-medium">
                {permissions.camera === 'granted' ? '✓' 
                 : permissions.camera === 'denied' ? '✗'
                 : ''}
              </span>
            </button>

            {/* Microphone Status */}
            <button
              onClick={requestMicrophone}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-xl transition-all ${
                permissions.microphone === 'granted' 
                  ? 'bg-green-500/30 ring-2 ring-green-400' 
                  : permissions.microphone === 'denied'
                  ? 'bg-red-500/30 ring-2 ring-red-400'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Mic className={`w-5 h-5 sm:w-6 sm:h-6 ${
                permissions.microphone === 'granted' ? 'text-green-400' 
                : permissions.microphone === 'denied' ? 'text-red-400' 
                : 'text-white/60'
              }`} />
              <span className="text-[8px] sm:text-[10px] font-medium">
                {permissions.microphone === 'granted' ? '✓' 
                 : permissions.microphone === 'denied' ? '✗'
                 : ''}
              </span>
            </button>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-medium text-white mb-1">Enable Features</h3>
            <p className="text-xs text-white/60 leading-relaxed hidden sm:block">
              Click each button to grant permissions for:
            </p>
            <div className="flex gap-2 mt-1.5">
              <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full">
                🎥 Camera
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                🎤 Mic
              </span>
            </div>
            
            {anyDenied && (
              <div className="flex items-center gap-1 mt-2 text-[10px] text-red-400">
                <AlertCircle className="w-3 h-3" />
                Some denied - features may not work
              </div>
            )}
          </div>

          {/* Always show close button */}
          <button
            onClick={() => setShowPermissionBanner(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>
      </div>
    </div>
  );
}
