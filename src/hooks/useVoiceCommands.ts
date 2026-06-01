import { useEffect, useRef, useCallback, useState } from 'react';
import { usePlanetStore } from '@/contexts/PlanetContext';

interface VoiceCommands {
  [key: string]: { action: string; message?: string };
}

const voiceCommandMap: VoiceCommands = {
  'make it rain': { action: 'rain', message: 'Making it rain!' },
  'rain': { action: 'rain', message: 'Rain activated!' },
  'add rain': { action: 'rain', message: 'Adding rain...' },
  'it is raining': { action: 'rain', message: 'Here comes the rain!' },
  'make it sunny': { action: 'sun', message: 'Here comes the sun!' },
  'add sun': { action: 'sun', message: 'Adding sunlight!' },
  'sunshine': { action: 'sun', message: 'Sun is shining!' },
  'sunlight': { action: 'sun', message: 'Sunlight activated!' },
  'plant seeds': { action: 'plant', message: 'Planting seeds!' },
  'plant': { action: 'plant', message: 'Seeds planted!' },
  'grow': { action: 'plant', message: 'Growing plants!' },
  'grow trees': { action: 'plant', message: 'Trees growing!' },
  'trees': { action: 'plant', message: 'Planting trees!' },
  'clean trash': { action: 'clean', message: 'Cleaning up trash!' },
  'clean': { action: 'clean', message: 'Planet cleaned!' },
  'remove trash': { action: 'clean', message: 'Trash removed!' },
  'add animals': { action: 'animals', message: 'Animals appearing!' },
  'animals': { action: 'animals', message: 'Adding wildlife!' },
  'more animals': { action: 'animals', message: 'More animals!' },
  'add animal': { action: 'animals', message: 'Adding an animal!' },
};

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { voiceEnabled, setLastVoiceCommand, showAIMessage, applyAction } = usePlanetStore();

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition 
      || (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      showAIMessage('Voice: Use Chrome browser for voice commands!');
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setIsSupported(true);
        showAIMessage('Voice: Listening... Say "make it rain", "add sun", etc.');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results.length - 1;
        const result = event.results[last][0].transcript.toLowerCase().trim();
        setTranscript(result);
        setLastVoiceCommand(result);

        const command = voiceCommandMap[result];
        if (command) {
          applyAction(command.action as Parameters<typeof applyAction>[0]);
          showAIMessage(`Voice: ${command.message}`);
        } else {
          const partialMatch = Object.keys(voiceCommandMap).find(cmd => 
            result.includes(cmd) || cmd.includes(result)
          );
          if (partialMatch) {
            const cmd = voiceCommandMap[partialMatch];
            applyAction(cmd.action as Parameters<typeof applyAction>[0]);
            showAIMessage(`Voice: ${cmd.message}`);
          } else {
            showAIMessage(`I heard: "${result}"`);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          showAIMessage('Voice: Microphone denied. Check permissions!');
        } else if (event.error === 'no-speech') {
          // Don't show message for no-speech, just continue
        } else if (event.error === 'network') {
          showAIMessage('Voice: Network error. Try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-restart if voiceEnabled is still true
        if (voiceEnabled && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsListening(true);
          } catch (e) {
            // Ignore restart errors
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      showAIMessage('Voice: Failed to start. Try refreshing.');
    }
  }, [applyAction, setLastVoiceCommand, showAIMessage, voiceEnabled]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    toggleListening,
    startListening,
    stopListening,
    voiceEnabled,
  };
};
