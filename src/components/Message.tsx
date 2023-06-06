import { motion } from 'framer-motion';
import nl2br from 'react-nl2br';
import iconArrowWhite from '../assets/icons/msg-arrow-white.svg';
import iconArrowBlack from '../assets/icons/msg-arrow-black.svg';
import novatar from '../assets/novatar.jpg';
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface MessageProps {
  msg: any
  msgUser: any
  loadingUser: boolean
  fromSelf: boolean
  onViewProfile: Function
}

export function Message({ msg, msgUser, loadingUser, fromSelf, onViewProfile }: MessageProps) {
  const [audioObject, setAudioObject] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAndRenderAudio() {
      if (msg.audioURL) {
        const {href} = msg.audioURL;
        const blob = await fetch(href, {}).then((r) => r.blob());
        const url = URL.createObjectURL(blob);
        const object = new Audio(url);

        object.addEventListener('ended', () => setPlaying(false));

        setAudioObject(object);
  
        WaveSurfer.create({
          container: waveformRef.current!,
          waveColor: fromSelf ? '#FFF' : '#000',
          cursorColor: 'rgba(0, 0, 0, 0)',
          height: 24,
          barHeight: 3,
          url: url,
          interact: false
        });
      }
    }

    loadAndRenderAudio();
  }, []);

  function singleTap() {
    if (audioObject) {
      audioObject.currentTime = 0;
      audioObject.play();
      setPlaying(true);
    }
  }

  function doubleTap() {
    console.log('double');
  }

  return (
    <div className={`w-full mb-4 flex flex-row items-start ${fromSelf ? 'justify-end' : 'justify-start'}`} key={`m_${msg.$id}`}>
      {
        !fromSelf &&
        <motion.button
          className={`w-9 h-9 shrink-0 bg-cover bg-center rounded-md border-2 border-black ${loadingUser ? 'animate-pulse' : ''}`}
          style={{
            backgroundImage: (!loadingUser && msgUser.avatar) ? `url(${msgUser.avatar})` : `url(${novatar})`
          }}
          initial={{
            translateY: '50%',
            opacity: 0
          }}
          animate={{
            translateY: 0,
            opacity: 1
          }}
          onClick={() => !loadingUser && onViewProfile(msg.user_id)}
        />
      }

      <motion.div
        className={`relative overflow-visible p-2 border-2 border-black rounded-md ${fromSelf ? 'bg-black text-white mr-5' : 'bg-white text-black ml-7'} ${playing ? 'animate-pulse' : ''}`}
        initial={{
          opacity: 0,
          translateX: (fromSelf ? '50%' : '-50%')
        }}
        animate={{
          opacity: 1,
          translateX: 0
        }}
        onClick={singleTap}
        onDoubleClick={doubleTap}
      >
        <p>{nl2br(msg.message)}</p>

        {
          msg.audioURL &&
          <div
            className={`waveform`}
            ref={waveformRef}
          />
        }

        {
          fromSelf
          ? <img
              src={iconArrowBlack}
              alt=""
              className={`absolute top-[10px] right-[2px] translate-x-full`}
            />
          : <img
              src={iconArrowWhite}
              alt=""
              className={`absolute top-[10px] left-[2px] -translate-x-full`}
            />
        }
      </motion.div>
    </div>
  );
}