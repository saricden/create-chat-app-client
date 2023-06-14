import { redirect, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Loader } from '../components/Loader';
import { addMessageListener, getChannels, getLatestMessages } from '../utils/chat';
import { getUserData } from '../utils/account';
import { useEffect, useRef, useState } from 'react';
import { MessageBar } from '../components/MessageBar';
import { ID, db, storage } from '../utils/appwrite';
import { UserProfile } from '../components/UserProfile';
import { X } from 'react-feather';
import { Message } from '../components/Message';
// import { Loader2 } from '../components/Loader2';

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
  const [lockScroll, setLockScroll] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [navOpen, setNavOpen] = useState(window.innerWidth >= 700);

  function cacheUser(userId: string, userData: any) {
    setUserCache((cache: any) => ({
      ...cache,
      [userId]: userData
    }));
  }

  async function sendMessage(audioFile: any, taggedUserIds: string[]) {
    try {
      let messageData: any = {
        channel_id: currentChannel.$id,
        message,
        user_id: user.auth_id,
        from_user_avatar_url: user.avatar,
        posted_at: new Date()
      };

      setMessage('');
      setLockScroll(true);

      if (audioFile) {
        const file = await storage.createFile('audio_messages', ID.unique(), audioFile);
        const {$id: audio_id} = file;

        messageData = {
          ...messageData,
          audio_id
        };
      }

      if (taggedUserIds.length > 0) {
        messageData = {
          ...messageData,
          tagged_user_ids: taggedUserIds
        };
      }
      
      db.createDocument(
        'chat',
        'messages',
        ID.unique(),
        messageData
      );
    }
    catch (e) {
      console.warn(e);
    }
  }

  function scrollToBottom(behavior: 'auto' | 'smooth') {
    if (messagePanelRef && messagePanelRef.current) {
      const {current} = messagePanelRef;
      current.scrollTo({
        top: current.scrollHeight,
        behavior
      });
    }
  }

  async function loadMoreMessages() {
    setLoadingMessages(true);

    const nextPage = (page + 1);
    const {$id: channelId} = currentChannel;
    let nextMessages = await getLatestMessages(channelId, nextPage);

    if (nextMessages) {
      nextMessages.forEach(async (msg: any, i: number) => {
        if (userCache[msg.user_id] === undefined) {
          const userData = await getUserData(msg.user_id);
  
          cacheUser(msg.user_id, userData);
        }
        
        if (msg.audio_id) {
          try {
            // @ts-ignore
            nextMessages[i].audioURL = await storage.getFileView('audio_messages', msg.audio_id);
          }
          catch (e) {
            console.warn(e);
          }
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
    }

    setLoadingMessages(false);
  }

  function handleMessageScroll(e: any) {
    const {scrollTop, scrollHeight, clientHeight} = e.target;

    if (scrollTop === 0) {
      loadMoreMessages();
    }
    
    if (Math.abs(scrollHeight - scrollTop - clientHeight) < 1) {
      setLockScroll(true);
    }
    else {
      setLockScroll(false);
    }
  }

  function viewProfile(userId: string) {
    if (userCache[userId]) {
      setProfile(userCache[userId]);
      setProfileOpen(true);
    }
  }

  async function handleNewMessage({events, payload: msg}: any) {
    const event = events[0].split('.')[events[0].split('.').length - 1];

    if (event === 'create') {
      let newMessage = msg;

      if (userCache[msg.user_id] === undefined) {
        const userData = await getUserData(msg.user_id);

        cacheUser(msg.user_id, userData);
      }

      if (msg.audio_id) {
        try {
          newMessage.audioURL = await storage.getFileView('audio_messages', msg.audio_id);
        }
        catch (e) {
          console.warn(e);
        }
      }

      setMessages((m: any) => ({
        ...m,
        [currentChannel.$id]: [
          ...m[currentChannel.$id],
          newMessage
        ]
      }));
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
    if (lockScroll) {
      scrollToBottom('auto');
    }

    if (messagePanelRef && messagePanelRef.current) {
      const {scrollHeight} = messagePanelRef.current;
      setMessagePanelScrollHeight(scrollHeight);
    }
  }, [currentMessages]);

  useEffect(() => {
    const unsubscribe = addMessageListener(handleNewMessage);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [handleNewMessage]);

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

      if (channels) {
        for (let i = 0; i < channels.length; i++) {
          const {$id: channelId}: any = channels[i];
          const channelMessages = await getLatestMessages(channelId);
  
          initMessages[channelId] = channelMessages;
  
          if (channelMessages) {
            for (let i = 0; i < channelMessages.length; i++) {
              const msg = initMessages[channelId][i];
    
              if (userCache[msg.user_id] === undefined) {
                getUserData(msg.user_id).then((userData) => {
                  cacheUser(msg.user_id, userData);
                });
              }
    
              if (msg.audio_id) {
                try {
                  initMessages[channelId][i].audioURL = await storage.getFileDownload('audio_messages', msg.audio_id);
                }
                catch (e) {
                  console.warn(e);
                }
              }
            }
          }
  
          setUser(user);
          setChannels(channels);
          setMessages(initMessages);
          scrollToBottom('smooth');
  
        }
      }
    }
    
    initChats();
  }, []);

  if (!user) {
    return (
      <BootView />
    );
  }

  return (
    <>
      <Navbar
        open={navOpen}
        setOpen={setNavOpen}
        user={user}
        channels={channels}
        onUserUpdate={(user: any) => setUser(user)}
      />

      <div className={`h-screen w-full flex flex-col items-center transition-all overflow-x-hidden ${navOpen ? 'pr-[20rem]' : ''}`}>
        <div
          className={`h-screen w-full max-w-5xl min-w-[375px] flex flex-col items-start justify-start p-4 pt-32 pb-16 overflow-y-scroll`}
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
            currentMessages && currentMessages.map((msg: any, i: number) => {
              const msgUser = userCache[msg.user_id];
              const loadingUser = (msgUser === undefined);
              const fromSelf = (msg.user_id === user.auth_id);

              return (
                <Message
                  msg={msg}
                  msgUser={msgUser}
                  loadingUser={loadingUser}
                  fromSelf={fromSelf}
                  onViewProfile={viewProfile}
                  key={`m_${i}`}
                />
              );
            })
          }

          {/* <Loader2 /> */}
        </div>
      </div>

      <MessageBar
        msg={message}
        onChange={(val: string) => setMessage(val)}
        onSend={sendMessage}
        navOpen={navOpen}
      />

      <div
        className={`z-50 bg-transparent fixed top-0 left-0 w-full h-full ${profileOpen ? 'visible' : 'hidden'}`}
        onClick={() => setProfileOpen(false)}
      />

      <div className={`z-50 fixed left-0 bottom-0 w-full h-2/3 flex flex-col items-center justify-start pointer-events-none transition-all ${profileOpen ? '' : 'translate-y-full'}`}>
        <div className={`relative w-full h-full max-w-3xl p-3 pt-12 bg-black text-white flex flex-col items-center justify-start rounded-t-md pointer-events-auto`}>
          <button
            className={`absolute right-3 top-3`}
            onClick={() => setProfileOpen(false)}
          >
            <X size={28} />
          </button>

          <UserProfile user={profile} />
        </div>
      </div>
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
      <Loader message={`${import.meta.env.VITE_serverName} is booting...`} />
    </main>
  );
}