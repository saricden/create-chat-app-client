import { useLocation, useNavigate } from 'react-router-dom';
import config from '../../chat.config.json';
import novatar from '../assets/novatar.jpg';
import { ChannelBtn } from './ChannelBtn';
import { useState } from 'react';
import { ArrowLeft, X } from 'react-feather';
import { logout } from '../utils/account';
import { MyProfile } from '../views/user/MyProfile';
import { Notifications } from '../views/user/Notifications';
import { Admin } from '../views/user/Admin';

interface NavbarProps {
  locked?: boolean
  channels?: any
  user?: any
  onUserUpdate?: Function
  open: boolean
  setOpen: Function
}

export function Navbar({ locked, channels, user, onUserUpdate, open, setOpen }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const {pathname: path} = location;
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menu, setMenu] = useState<any>(null);
  const [adminMenu, setAdminMenu] = useState('');

  async function confirmLogout() {
    setLoggingOut(true);
    await logout();
    navigate('/');
  }

  function openMenu(m: any) {
    setMenu(m);
    setMenuOpen(true);
  }

  function goBack() {
    if (adminMenu === '') {
      setMenuOpen(false);
    }
    else {
      setAdminMenu('');
    }
  }

  if (locked) {
    return (
      <nav className={`z-50 bg-black text-white text-xl fixed top-0 left-0 w-full h-14 flex items-center justify-center`}>
        <img
          className={`w-7 h-7 rounded-full mr-2`}
          src="/icon.png"
          alt=""
        />

        <h1>{config.serverName}</h1>
      </nav>
    );
  }

  return (
    <>
      <nav className={`z-50 bg-black text-white text-xl fixed top-0 left-0 w-full h-14 px-3 flex items-center justify-start`}>
        <img
          className={`w-7 h-7 rounded-full mr-2`}
          src="/icon.png"
          alt=""
        />

        <h1>{config.serverName}</h1>

        <button
          className={`ml-auto w-9 h-9 bg-cover bg-center rounded-md border-2 border-white transition-all ${open ? 'opacity-0' : ''}`}
          style={{
            backgroundImage: user.avatar ? `url(${user.avatar})` : `url(${novatar})`
          }}
          onClick={() => setOpen(true)}
        />
      </nav>
      
      <nav className={`z-50 bg-black text-white fixed top-14 left-0 w-full h-14 px-2 flex items-center overflow-y-hidden overflow-x-scroll transition-all ${open ? 'pr-[20rem]' : ''}`}>
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

      <div className={`z-50 bg-black text-white fixed top-0 right-0 flex flex-col w-full max-w-xs h-full p-3 overflow-x-hidden transition-all ${open ? '' : 'translate-x-full'}`}>
        <div className={`w-full flex flex-row items-center justify-between overflow-x-hidden`}>
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

          {
            menuOpen
            ? <button onClick={goBack}>
                <ArrowLeft size={28} />
              </button>
            : <button onClick={() => setOpen(false)}>
                <X size={28} />
              </button>
          }
        </div>

        <div className={`absolute top-14 right-0 w-full p-3 flex flex-col transition-all`} style={{
          transform: menuOpen ? 'translateX(calc(-100% - 12px))' : '',
          visibility: menuOpen ? 'hidden' : 'visible',
          height: 'calc(100% - 56px)'
        }}>
          <button
            className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center transition-all delay-100 visible ${!open ? '-translate-y-1/2 opacity-0' : ''}`}
            onClick={() => openMenu('Notifications')}
          >
            Notifications
          </button>

          <button
            className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center transition-all delay-150 visible ${!open ? '-translate-y-1/2 opacity-0' : ''}`}
            onClick={() => openMenu('MyProfile')}
          >
            My Profile
          </button>

          <button
            className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center transition-all delay-200 visible ${!open ? '-translate-y-1/2 opacity-0' : ''}`}
          >
            Settings
          </button>

          {
            user.show_admin_ui &&
            <button
              className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center transition-all delay-300 visible ${!open ? '-translate-y-1/2 opacity-0' : ''}`}
              onClick={() => openMenu('Admin')}
            >
              Admin
            </button>
          }

          <button
            className={`w-full mt-auto px-4 py-2 border-2 border-red-500 rounded-md text-red-500 text-center`}
            onClick={() => setLogoutOpen(true)}
          >
            Logout
          </button>
        </div>

        <div className={`absolute top-14 left-0 w-full p-3 flex flex-1 flex-col transition-all`} style={{
          transform: menuOpen ? '' : 'translateX(calc(100% + 12px))',
          visibility: menuOpen ? 'visible' : 'hidden',
          height: 'calc(100% - 56px)'
        }}>
          {
            menu === 'Notifications' &&
            <Notifications
              user={user}
            />
          }

          {
            menu === 'MyProfile' &&
            <MyProfile
              user={user}
              onUpdate={onUserUpdate!}
            />
          }

          {
            menu === 'Admin' &&
            <Admin
              menu={adminMenu}
              setMenu={setAdminMenu}
            />
          }
          
        </div>
      </div>

      <div className={`z-50 fixed top-0 right-0 w-full max-w-xs h-full p-6 bg-black text-white flex flex-col items-center justify-center transition-all ${logoutOpen ? '' : 'opacity-0 scale-75 translate-y-full'}`}>

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