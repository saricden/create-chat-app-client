import { useLocation, useNavigate } from 'react-router-dom';
import config from '../../jabberbase.config.json';
import novatar from '../assets/novatar.jpg';
import { ChannelBtn } from './ChannelBtn';
import { useState } from 'react';
import { X } from 'react-feather';
import { logout } from '../utils/account';

interface NavbarProps {
  locked?: boolean
  channels?: any
  user?: any
}

export function Navbar({ locked, channels, user }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const {pathname: path} = location;
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function confirmLogout() {
    setLoggingOut(true);
    await logout();
    navigate('/');
  }

  if (locked) {
    return (
      <nav className={`z-50 bg-black text-white text-xl fixed top-0 left-0 w-full h-14 flex items-center justify-center`}>
        <h1>{config.serverName}</h1>
      </nav>
    );
  }

  return (
    <>
      <nav className={`z-50 bg-black text-white text-xl fixed top-0 left-0 w-full h-14 px-3 flex items-center justify-start`}>
        <h1>{config.serverName}</h1>

        <button
          className={`ml-auto w-9 h-9 bg-cover bg-center rounded-md border-2 border-white transition-all ${open ? 'opacity-0' : ''}`}
          style={{
            backgroundImage: user.avatar ? `url(${user.avatar})` : `url(${novatar})`
          }}
          onClick={() => setOpen(true)}
        />
      </nav>
      
      <nav className={`z-50 bg-black text-white fixed top-14 left-0 w-full h-14 px-2 flex items-center overflow-x-scroll`}>
        {
          channels.map((channel: any) => (
            <ChannelBtn
              title={channel.title}
              slug={channel.slug}
              icon={channel.icon}
              active={path === `/c/${channel.slug}`}
              key={`c_${channel.slug}`}
            />
          ))
        }
      </nav>

      <div className={`z-50 bg-black text-white fixed top-0 right-0 flex flex-col w-full h-full p-3 transition-all ${open ? '' : 'translate-x-full'}`}>
        <div className={`w-full flex flex-row items-center justify-between`}>
          <div className={`flex flex-row items-center`}>
            <button
              className={`w-9 h-9 bg-cover bg-center rounded-md border-2 border-white mr-3 transition-all opacity-0 ${open ? 'opacity-100' : ''}`}
              style={{
                backgroundImage: user.avatar ? `url(${user.avatar})` : `url(${novatar})`
              }}
            />
            
            <div className={`text-xl transition-all delay-150 ${!open ? 'opacity-0 -translate-x-1/2' : ''}`}>
              @{user.username}
            </div>
          </div>

          <button onClick={() => setOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <button
          className={`w-full mt-auto px-4 py-2 border-2 border-red-500 rounded-md text-red-500 text-center`}
          onClick={() => setLogoutOpen(true)}
        >
          Logout
        </button>
      </div>

      <div className={`z-50 fixed top-0 left-0 w-full h-full p-6 bg-black text-white flex flex-col items-center justify-center transition-all ${logoutOpen ? '' : 'opacity-0 scale-75 translate-y-full'}`}>

        {
          loggingOut
          ? <div className={`w-full h-full p-6 flex flex-col items-center justify-center`}>
              <p className={`text-2xl`}>Bye for now 👋</p>
            </div>
          : <div className={`w-full h-full p-6 flex flex-col items-center justify-center`}>
              <p className={`text-2xl mb-12`}>Are you sure you want to log out of @{user.username}?</p>

              <button
                className={`w-full mb-4 px-4 py-2 border-2 border-red-500 rounded-md text-red-500 text-center`}
                onClick={confirmLogout}
              >
                Confirm Logout
              </button>

              <button onClick={() => setLogoutOpen(false)}>
                or Cancel Logout
              </button>
            </div>
        }
      </div>
    </>
  );
}