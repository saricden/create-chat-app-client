import 'regenerator-runtime';
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, Play, Send, Square, X } from "react-feather";
import { Loader } from './Loader';
// @ts-ignore
import { useAudioRecorder } from 'react-audio-voice-recorder';
import WaveSurfer from 'wavesurfer.js';
import { findByUsername } from '../utils/chat';
import novatar from '../assets/novatar.jpg';

const appId = import.meta.env.VITE_speechlyAppId;
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

interface MessageBarProps {
  msg: string
  onChange: Function
  onSend: Function
  navOpen: boolean
}

export function MessageBar({ msg, onChange, onSend, navOpen }: MessageBarProps) {
  const doAudio = (msg.trim().length === 0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [record, setRecord] = useState(false);
  const [startingRecord, setStartingRecord] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioObject, setAudioObject] = useState<any>(null);
  const [waveform, setWaveform] = useState<any>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const {
    startRecording,
    stopRecording,
    recordingBlob
  } = useAudioRecorder();
  const {
    transcript,
  } = useSpeechRecognition();
  const lastWord = msg.split(' ')[msg.split(' ').length - 1];
  const doUserSearch = lastWord.startsWith('@');
  const [userSearchResults, setUserSearchResults] = useState<any>([]);
  const [userSearchKeyIndex, setUserSearchKeyIndex] = useState<null | number>(null);
  const [taggedUsers, setTaggedUsers] = useState<any>([]);

  useEffect(() => {
    if (doUserSearch) {
      findByUsername(lastWord.replace('@', '')).then((profiles) => {
        setUserSearchResults(profiles);
      });
    }
    else {
      setUserSearchResults([]);
      setUserSearchKeyIndex(null);
    }
  }, [lastWord]);

  useEffect(() => {
    onChange(ucFirst(transcript));
  }, [transcript]);

  useEffect(() => {
    if (recordingBlob && processing) {
      // Make and set the audio file for sending
      setAudioFile(new File([recordingBlob], transcript.replace(/\s/g, '-'), {
        type: recordingBlob.type
      }));

      const url = URL.createObjectURL(recordingBlob);

      setAudioObject(new Audio(url));

      if (waveform) {
        waveform.destroy();
      }

      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: '#FFF',
        cursorColor: 'rgba(0, 0, 0, 0)',
        height: 24,
        barHeight: 3,
        url,
        interact: false
      });

      setWaveform(wavesurfer);
      setProcessing(false);
    }
  }, [recordingBlob]);

  function deleteAudioTrack() {
    if (waveform) {
      waveform.destroy();
      setWaveform(null);
    }
    setAudioFile(null);
  }

  function playAudioTrack() {
    if (audioObject) {
      audioObject.currentTime = 0;
      audioObject.play();
    }
  }

  async function handleActionBtnClick() {
    if (record || startingRecord) {
      setStartingRecord(false);

      if (record) {
        SpeechRecognition.stopListening();
        stopRecording();
        setRecord(false);
        setProcessing(true);
      }
    }
    else {
      if (doAudio) {
        setStartingRecord(true);

        startRecording();
        await SpeechRecognition.startListening();
        
        setRecord(true);
      }
      else {
        const finalTaggedUserIds: string[] = [];

        taggedUsers.forEach((maybeTaggedUser: any) => {
          const {username, auth_id} = maybeTaggedUser;

          if (msg.match(`@${username}`) && !finalTaggedUserIds.includes(auth_id)) {
            finalTaggedUserIds.push(auth_id);
          }
        });


        onSend(audioFile, finalTaggedUserIds);
        deleteAudioTrack();
        setTaggedUsers([]);
      }
    }

    // inputRef.current?.focus();
  }

  function ucFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function handleSearchSelect(e: any) {
    if (doUserSearch) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();

        if (userSearchKeyIndex == null) {
          setUserSearchKeyIndex(userSearchResults.length - 1);
        }
        else {
          if (userSearchKeyIndex + 1 >= userSearchResults.length - 1) {
            setUserSearchKeyIndex(0);
          }
          else {
            setUserSearchKeyIndex(userSearchKeyIndex + 1);
          }
        }
      }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();

        if (userSearchKeyIndex == null) {
          setUserSearchKeyIndex(0);
        }
        else {
          if (userSearchKeyIndex - 1 <= 0) {
            setUserSearchKeyIndex(userSearchResults.length - 1);
          }
          else {
            setUserSearchKeyIndex(userSearchKeyIndex - 1);
          }
        }
      }
      else if (e.key === 'Enter' && userSearchKeyIndex !== null) {
        e.preventDefault();

        tagUser(userSearchKeyIndex);
      }
    }
  }

  function tagUser(i: number) {
    const profile = userSearchResults[i];
    const {username, auth_id} = profile;

    let allWordsButLast = msg.split(' ');
    allWordsButLast.pop();
    const newMessage = `${allWordsButLast.join(' ')} @${username} `;

    setTaggedUsers([
      ...taggedUsers,
      {
        username,
        auth_id
      }
    ]);
    onChange(newMessage);
    inputRef.current?.focus();
  }
  
  return (
    <div
      className={`z-40 fixed bottom-0 left-0 w-full flex flex-row justify-center overflow-visible transition-all ${navOpen ? 'pr-[20rem]' : ''}`}
    >
      <div className={`relative w-full max-w-5xl p-2 flex flex-row items-end overflow-visible`}>
        {
          userSearchResults.length > 0 &&
          <div className={`absolute top-0 left-0 w-full -translate-y-full flex flex-col bg-black text-white rounded-md overflow-hidden`}>
            {
              userSearchResults.map((user: any, i: number) => (
                <button
                  className={`flex flex-row p-2 text-lg items-center justify-start transition-all ${userSearchKeyIndex === i ? 'pl-4 bg-white/10' : ''}`}
                  onClick={() => tagUser(i)}
                  key={`us_${i}`}
                >
                  <div
                    className={`w-9 h-9 mr-2 rounded-md border-2 border-white bg-cover bg-center`}
                    style={{
                      backgroundImage: `url(${user.avatar || novatar})`
                    }}
                  />
                  <span>@{user.username}</span>
                </button>
              ))
            }
          </div>
        }

        <div
          className={`border-2 p-2 rounded-md flex flex-col flex-1 mr-2 outline-none transition-all ${record ? 'border-red-500 bg-red-500 text-white animate-pulse' : 'border-black text-black bg-white'} `}
        >
          <TextareaAutosize
            className={`w-full min-h-12 outline-none resize-none bg-transparent`}
            value={msg}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleSearchSelect}
            maxRows={4}
            ref={inputRef}
            disabled={record}
          />

          <div className={`w-full flex flex-row items-center overflow-hidden bg-black rounded-md transition-all ${(waveform === null || record) ? 'h-0' : 'h-8 mt-2' }`}>
            <button
              className={`w-[32px] h-[32px] bg-black text-white flex items-center justify-center`}
              onClick={deleteAudioTrack}
            >
              <X strokeWidth={5} size={16} />
            </button>
            <div
              className={`waveform`}
              ref={waveformRef}
              onClick={() => {
                inputRef.current?.focus();
                inputRef.current?.setSelectionRange(msg.length, msg.length)
              }}
            />
            <button
              className={`w-[32px] h-[32px] bg-black text-white flex items-center justify-center`}
              onClick={playAudioTrack}
            >
              <Play fill='#FFF' size={16} />
            </button>
          </div>
        </div>

        <button
          className={`w-[44px] h-[44px] text-white rounded-md flex items-center justify-center overflow-hidden transition-all ${(record || startingRecord) ? 'bg-red-500 animate-pulse' : 'bg-black'}`}
          onClick={handleActionBtnClick}
          disabled={processing}
        >
          {
            processing
              ? <Loader width={22} height={22} color='#FFF' />
              : (startingRecord || record)
                ? <Square fill='#FFF' size={22} />
                : doAudio
                  ? <Mic size={22} />
                  : <Send size={22} />
          }
        </button>
      </div>
    </div>
  );
}