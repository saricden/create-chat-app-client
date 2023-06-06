import { motion } from "framer-motion";
import novatar from '../assets/novatar.jpg';
import { Loader2 } from "./Loader2";

interface UsersTypingProps {
  users: any[]
}

export function UsersTyping({ users }: UsersTypingProps) {
  const maxPicturesToDisplay = 5;
  // const maxNamesToDisplay = 3;
  // // let message = '';

  // // if (users.length === 0) {
  // //   return null;
  // // }
  
  // // message = users[0].username;
  
  // // for (let i = 1; i < maxNamesToDisplay; i++) {
  // //   message += users[i].username;
  // // }
  
  return (
    <div className={`w-full flex flex-col items-center justify-center`}>
      <div className={`w-full flex flex-row items-center justify-center`}>
        {
          users.map(({ avatar, i }) => {
            if (i + 1 > maxPicturesToDisplay) {
              return null;
            }

            return (
              <motion.div
                className={`w-9 h-9 shrink-0 bg-cover bg-center rounded-md border-2 border-black`}
                style={{
                  backgroundImage: avatar ? `url(${avatar})` : `url(${novatar})`
                }}
                initial={{
                  translateY: '50%',
                  opacity: 0
                }}
                animate={{
                  translateY: 0,
                  opacity: 1
                }}
              />
            );
          })
        }
      </div>

      <Loader2 />

      <div className={`w-full text-center`}>
        
      </div>
    </div>
  );
}