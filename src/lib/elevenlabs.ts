// Utility for ElevenLabs TTS
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

export async function speakWithElevenLabs(text: string, voiceId: string = 'Rachel', modelId: string = 'eleven_multilingual_v2') {
  const url = `${ELEVENLABS_API_URL}/${voiceId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.8 }
    })
  });
  if (!response.ok) throw new Error('ElevenLabs API error');
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
  return audio;
} 