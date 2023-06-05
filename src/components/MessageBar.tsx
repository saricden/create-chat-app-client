import { ChangeEventHandler } from "react";
import iconSend from '../assets/icons/send.svg';
import iconHeart from '../assets/icons/heart.svg';
import TextareaAutosize from 'react-textarea-autosize';

interface MessageBarProps {
  msg: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
  onSend: Function
  onReact: Function
}

export function MessageBar({ msg, onChange, onSend, onReact}: MessageBarProps) {
  const doReact = (msg.trim().length === 0);
  
  return (
    <div className={`fixed h-20 bottom-0 left-0 w-full p-2 flex flex-row items-end bg-gradient-to-t from-white to-white/0`}>
      <TextareaAutosize
        className={`min-h-12 border-2 border-black p-2 rounded-md flex-1 mr-2 outline-none`}
        value={msg}
        onChange={onChange}
        maxRows={4}
      />

      <button
        className={`w-[44px] h-[44px] bg-black rounded-md flex items-center justify-center overflow-hidden`}
        onClick={() => doReact ? onReact() : onSend()}
      >
        {
          doReact
          ? <img src={iconHeart} alt="Heart the last message." />
          : <img src={iconSend} alt="Send your message." />
        }
      </button>
    </div>
  );
}