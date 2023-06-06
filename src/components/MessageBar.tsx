import 'regenerator-runtime';
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, Send } from "react-feather";
import config from '../../jabberbase.config.json';

const appId = config.speechlyAppId;
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

interface MessageBarProps {
  msg: string
  onChange: Function
  onSend: Function
}

export function MessageBar({ msg, onChange, onSend}: MessageBarProps) {
  const doAudio = (msg.trim().length === 0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [recording, setRecording] = useState(false);
  // const [audioFile, setAudioFile] = useState<any>(null);
  const {
    transcript,
    // resetTranscript
  } = useSpeechRecognition();

  useEffect(() => {
    onChange(ucFirst(transcript));
  }, [transcript]);

  function handleUp() {
    if (!recording) {
      const audioFile = null;
      onSend(audioFile);
    }
    else {
      SpeechRecognition.stopListening();
    }

    if (focused) {
      inputRef.current?.focus();
    }

    setRecording(false);
  }

  function handleDown() {
    if (doAudio) {
      setRecording(true);
      SpeechRecognition.startListening();
    }
  }

  function delayedBlur() {
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setFocused(false);
      }
    }, 100);
  }

  function ucFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  return (
    <div className={`z-40 fixed h-20 bottom-0 left-0 w-full p-2 flex flex-row items-end bg-gradient-to-t from-white to-white/0`}>
      <TextareaAutosize
        className={`min-h-12 border-2 p-2 rounded-md flex-1 mr-2 outline-none resize-none transition-all ${recording ? 'border-red-500 bg-red-500 animate-pulse' : 'border-black'}`}
        value={msg}
        onChange={(e) => onChange(e.target.value)}
        maxRows={4}
        ref={inputRef}
        onFocus={() => setFocused(true)}
        onBlur={delayedBlur}
        disabled={recording}
      />

      <button
        className={`w-[44px] h-[44px] text-white rounded-md flex items-center justify-center overflow-hidden ${recording ? 'bg-red-500 animate-pulse' : 'bg-black'}`}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
      >
        {
          doAudio
          ? <Mic size={22} />
          : <Send size={22} />
        }
      </button>
    </div>
  );
}