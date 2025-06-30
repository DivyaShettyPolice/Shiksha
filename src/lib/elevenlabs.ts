// Utility for ElevenLabs TTS
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

export async function speakWithElevenLabs(
  text: string, 
  voiceId: string = 'Rachel', 
  modelId: string = 'eleven_multilingual_v2'
): Promise<HTMLAudioElement> {
  if (!ELEVENLABS_API_KEY) {
    console.warn('ElevenLabs API key not configured. Using browser speech synthesis.');
    return useBrowserSpeech(text);
  }

  try {
    const url = `${ELEVENLABS_API_URL}/${voiceId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text.slice(0, 2500), // Limit text length
        model_id: modelId,
        voice_settings: { 
          stability: 0.5, 
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Clean up URL after audio ends
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl);
    });
    
    await audio.play();
    return audio;
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    return useBrowserSpeech(text);
  }
}

function useBrowserSpeech(text: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Find an English voice
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      speechSynthesis.speak(utterance);
      
      // Create a dummy audio element for consistency
      const dummyAudio = new Audio();
      resolve(dummyAudio);
    } else {
      reject(new Error('Speech synthesis not supported'));
    }
  });
}

export function stopAllSpeech() {
  // Stop browser speech synthesis
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  
  // Stop all audio elements
  const audios = document.getElementsByTagName('audio');
  for (let audio of audios) {
    audio.pause();
    audio.currentTime = 0;
  }
}