import { motion } from 'framer-motion';
import nl2br from 'react-nl2br';
import iconArrowWhite from '../assets/icons/msg-arrow-white.svg';
import iconArrowBlack from '../assets/icons/msg-arrow-black.svg';
import novatar from '../assets/novatar.jpg';

interface MessageProps {
  msg: any
  msgUser: any
  loadingUser: boolean
  fromSelf: boolean
  onViewProfile: Function
}

export function Message({ msg, msgUser, loadingUser, fromSelf, onViewProfile }: MessageProps) {

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
        className={`relative overflow-visible p-2 border-2 border-black rounded-md ${fromSelf ? 'bg-black text-white mr-5' : 'bg-white text-black ml-7'}`}
        initial={{
          opacity: 0,
          translateX: (fromSelf ? '50%' : '-50%')
        }}
        animate={{
          opacity: 1,
          translateX: 0
        }}
      >
        {nl2br(msg.message)}

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