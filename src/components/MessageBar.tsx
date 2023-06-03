import { ChangeEventHandler } from "react";
import iconSend from '../assets/icons/send.svg';
import iconHeart from '../assets/icons/heart.svg';

interface MessageBarProps {
  msg: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onSend: Function
  onReact: Function
}

export function MessageBar({ msg, onChange, onSend, onReact}: MessageBarProps) {
  const doReact = (msg.trim().length === 0);
  
  return (
    <div className={`fixed h-20 bottom-0 left-0 w-full p-2 flex flex-row items-end bg-gradient-to-t from-white to-white/0`}>
      <input
        type="text"
        className={`h-12 border-2 border-black p-2 rounded-md flex-1 mr-2 outline-none`}
        value={msg}
        onChange={onChange}
      />

      <button
        className={`w-12 h-12 bg-black rounded-md flex items-center justify-center overflow-hidden`}
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