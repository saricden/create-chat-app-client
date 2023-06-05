import { redirect, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Loader } from '../components/Loader';
import config from '../../jabberbase.config.json';
import { addMessageListener, getChannels, getLatestMessages } from '../utils/chat';
import { getUserData } from '../utils/account';
import { useEffect, useRef, useState } from 'react';
import iconArrowWhite from '../assets/icons/msg-arrow-white.svg';
import iconArrowBlack from '../assets/icons/msg-arrow-black.svg';
import novatar from '../assets/novatar.jpg';
import { MessageBar } from '../components/MessageBar';
import { ID, db } from '../utils/appwrite';
import { motion } from 'framer-motion';
import nl2br from 'react-nl2br';

export function Chats() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [channels, setChannels] = useState<any>([]);
  const location = useLocation();
  const [messages, setMessages] = useState<any>({}); // [channelId] => message[]
  const {pathname: path} = location;
  const currentSlug = path.slice(3);
  const currentChannel = channels.find((c: any) => c.slug === currentSlug);
  const currentMessages: any = (currentChannel === undefined) ? [] : messages[currentChannel.$id];
  const [userCache, setUserCache] = useState<any>({});
  const [message, setMessage] = useState('');
  const messagePanelRef = useRef<HTMLDivElement>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [page, setPage] = useState(0);
  const [messagesPanelScrollHeight, setMessagePanelScrollHeight] = useState(0);

  function cacheUser(userId: string, userData: any) {
    setUserCache((cache: any) => ({
      ...cache,
      [userId]: userData
    }));
  }

  function sendMessage() {
    db.createDocument(
      config.databaseId,
      config.messagesCollectionId,
      ID.unique(),
      {
        channel_id: currentChannel.$id,
        message,
        user_id: user.auth_id,
        posted_at: new Date()
      }
    );

    setMessage('');
  }

  function sendReaction() {
    console.log('todo');
  }

  function scrollToBottom() {
    if (messagePanelRef && messagePanelRef.current) {
      const {current} = messagePanelRef;
      current.scrollTo({
        top: current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  async function loadMoreMessages() {
    setLoadingMessages(true);

    const nextPage = (page + 1);
    const {$id: channelId} = currentChannel;
    const nextMessages = await getLatestMessages(channelId, nextPage);

    nextMessages.forEach(async (msg: any) => {
      if (userCache[msg.user_id] === undefined) {
        const userData = await getUserData(msg.user_id);

        cacheUser(msg.user_id, userData);
      }
    });

    const channelMessages = [
      ...nextMessages,
      ...currentMessages
    ];

    setMessages({
      ...messages,
      [channelId]: channelMessages
    });
    setPage(nextPage);
    setLoadingMessages(false);
  }

  function handleMessageScroll(e: any) {
    const {scrollTop} = e.target;

    if (scrollTop === 0) {
      loadMoreMessages();
    }
  }

  useEffect(() => {
    if (messagePanelRef && messagePanelRef.current) {
      const {scrollHeight} = messagePanelRef.current;
      const scrollDiff = (scrollHeight - messagesPanelScrollHeight - 64);

      messagePanelRef.current.scrollTo({
        top: scrollDiff,
        behavior: 'auto'
      });
    }
  }, [page]);

  useEffect(() => {
    if (messagePanelRef && messagePanelRef.current) {
      const {scrollHeight} = messagePanelRef.current;
      setMessagePanelScrollHeight(scrollHeight);
    }
  }, [currentMessages]);

  useEffect(() => {
    async function initChats() {
      const user = await getUserData();
      const channels = await getChannels();
      let initMessages: any = {};

      if (user === null) {
        navigate('/', {
          replace: true
        });
      }

      for (let i = 0; i < channels.length; i++) {
        const {$id: channelId}: any = channels[i];
        const channelMessages = await getLatestMessages(channelId);

        initMessages[channelId] = channelMessages;

        channelMessages.forEach(async (msg: any) => {
          if (userCache[msg.user_id] === undefined) {
            const userData = await getUserData(msg.user_id);

            cacheUser(msg.user_id, userData);
          }
        });

        setUser(user);
        setChannels(channels);
        setMessages(initMessages);
        scrollToBottom();
      }
    }

    initChats();

    addMessageListener(async ({events, payload: msg}: any) => {
      const event = events[0].split('.')[events[0].split('.').length - 1];

      if (event === 'create') {
        setMessages((m: any) => ({
          ...m,
          [currentChannel.$id]: [
            ...m[currentChannel.$id],
            msg
          ]
        }));

        if (userCache[msg.user_id] === undefined) {
          const userData = await getUserData(msg.user_id);

          cacheUser(msg.user_id, userData);
        }

        if (msg.user_id === user.auth_id) {
          scrollToBottom();
        }
      }
    });
  }, []);

  if (!user) {
    return (
      <BootView />
    );
  }

  return (
    <>
      <Navbar
        user={user}
        channels={channels}
      />

      <div
        className={`h-screen w-full flex flex-col items-start justify-start p-4 pt-32 pb-16 overflow-y-scroll`}
        ref={messagePanelRef}
        onScroll={handleMessageScroll}
      >
        {
          loadingMessages &&
          <div className={`w-full flex items-center justify-center mb-4`}>
            <Loader />
          </div>
        }
        {
          currentMessages && currentMessages.map((msg: any) => {
            const msgUser = userCache[msg.user_id];
            const loadingUser = (msgUser === undefined);

            return (
              <div className={`w-full mb-4 flex flex-row items-start ${msg.user_id === user.auth_id ? 'justify-end' : 'justify-start'}`} key={`m_${msg.$id}`}>
                {
                  msg.user_id !== user.auth_id &&
                  <motion.button
                    className={`w-9 h-9 shrink-0 bg-cover bg-center rounded-md border-2 border-black`}
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
                  />
                }

                <motion.div
                  className={`relative overflow-visible w-full p-2 border-2 border-black rounded-md ${msg.user_id === user.auth_id ? 'bg-black text-white mr-5' : 'bg-white text-black ml-7'}`}
                  initial={{
                    opacity: 0,
                    translateX: (msg.user_id === user.auth_id ? '50%' : '-50%')
                  }}
                  animate={{
                    opacity: 1,
                    translateX: 0
                  }}
                >
                  {nl2br(msg.message)}

                  {
                    msg.user_id === user.auth_id
                    ? <img
                        src={iconArrowBlack}
                        alt=""
                        className={`absolute top-[10px] right-[1px] translate-x-full`}
                      />
                    : <img
                        src={iconArrowWhite}
                        alt=""
                        className={`absolute top-[10px] left-[1px] -translate-x-full`}
                      />
                  }
                </motion.div>
              </div>
            );
          })
        }
      </div>

      <MessageBar
        msg={message}
        onChange={(e) => setMessage(e.target.value)}
        onSend={sendMessage}
        onReact={sendReaction}
      />
    </>
  );
}

export async function bootServer() {
  try {
    const channels = await getChannels();

    if (channels && channels.length > 0) {
      const [firstChannel] = channels;
      const {slug} = firstChannel;

      return redirect(`/c/${slug}`);
    }
  }
  catch (e) {
    console.warn(e);
  }

  return null;
}

export function BootView() {
  return (
    <main className={`w-full min-h-screen flex items-center justify-center p-4`}>
      <Loader message={`${config.serverName} is booting...`} />
    </main>
  );
}