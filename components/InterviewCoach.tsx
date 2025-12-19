
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import { PhoneIcon, XIcon, SparklesIcon } from './Icons';

interface InterviewCoachProps {
  questions: { question: string; answer: string }[];
  context: string;
}

const InterviewCoach: React.FC<InterviewCoachProps> = ({ questions, context }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [orbScale, setOrbScale] = useState(1);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopSession = () => {
    if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
    nextStartTimeRef.current = 0;
  };

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outputAudioContext;

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setIsActive(true);
              setIsConnecting(false);
              
              // Set up microphone streaming
              const source = inputAudioContext.createMediaStreamSource(stream);
              const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                
                sessionPromise.then((session) => {
                  if (session) {
                    session.sendRealtimeInput({ media: pcmBlob });
                  }
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContext.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle Interruption
              if (message.serverContent?.interrupted) {
                  // In a more complex app, we'd clear the audio queue here.
                  // For now, we just reset the timing.
                  nextStartTimeRef.current = outputAudioContext.currentTime;
              }

              const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioData) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                const buffer = await decodeAudioData(decode(audioData), outputAudioContext);
                const source = outputAudioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(outputAudioContext.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                
                // Visual feedback
                setOrbScale(1.4);
                setTimeout(() => setOrbScale(1), 300);
              }
              
              if (message.serverContent?.outputTranscription) {
                const newText = message.serverContent.outputTranscription.text;
                setTranscript(prev => {
                    const last = prev[prev.length - 1];
                    // Very basic logic to append or start new line
                    if (prev.length > 0 && last.length < 100) {
                        return [...prev.slice(0, -1), last + " " + newText];
                    }
                    return [...prev.slice(-5), newText];
                });
              }
            },
            onerror: (e) => {
                console.error("Live API Error:", e);
                stopSession();
            },
            onclose: () => {
                setIsActive(false);
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: `You are an expert hiring manager conducting a mock interview. 
            Job Context: ${context}
            Use these questions as a guide: ${questions.map(q => q.question).join(', ')}.
            
            BEHAVIOR:
            1. Start by introducing yourself and asking the first question.
            2. Listen carefully to the user's response.
            3. Provide a brief, constructive piece of feedback or follow-up before moving to the next question.
            4. Keep the conversation natural and encouraging.`,
            outputAudioTranscription: {},
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
            }
          },
        });

        sessionRef.current = await sessionPromise;
    } catch (err) {
        console.error("Failed to start session:", err);
        setIsConnecting(false);
        alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  // Helper Functions
  function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-brand-primary" />
          AI Interview Coach
        </h3>
        {isActive && (
          <button 
            onClick={stopSession} 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            title="End Session"
          >
            <XIcon className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {!isActive ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400 mb-6 px-4">
            Practice your interview skills out loud. The AI recruiter will listen and respond to your answers in real-time.
          </p>
          <button 
            onClick={startSession}
            disabled={isConnecting}
            className="bg-brand-primary hover:bg-indigo-600 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 mx-auto disabled:opacity-50 shadow-lg hover:shadow-indigo-500/20"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Connecting...
              </>
            ) : (
              <>
                <PhoneIcon className="w-5 h-5" /> 
                Start Mock Interview
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 py-4">
          <div className="relative">
              <div 
                className="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary shadow-[0_0_50px_rgba(79,70,229,0.3)] flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${orbScale})` }}
              >
                <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden border border-white/10">
                   <div className="animate-pulse w-full h-full bg-indigo-500/5 rounded-full"></div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-500 w-4 h-4 rounded-full animate-pulse border-2 border-gray-900"></div>
          </div>
          
          <div className="w-full space-y-2 bg-gray-800/50 p-4 rounded-xl border border-white/5 max-h-40 overflow-y-auto">
             {transcript.length === 0 ? (
                 <p className="text-xs text-gray-500 italic text-center">Recruiter is speaking...</p>
             ) : (
                transcript.map((line, i) => (
                    <p key={i} className={`text-xs leading-relaxed ${i === transcript.length - 1 ? 'text-indigo-300 font-medium' : 'text-gray-500'}`}>
                        {line}
                    </p>
                ))
             )}
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] text-brand-primary font-black tracking-[0.2em] uppercase">Recruiter Active</p>
            <p className="text-[9px] text-gray-500">The AI can hear you now. Speak naturally.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCoach;
