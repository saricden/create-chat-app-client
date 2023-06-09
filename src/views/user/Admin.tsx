import { useState } from 'react';
import { CreateChannel } from './admin/CreateChannel';

interface AdminProps {
  menu: string
  setMenu: Function
}

export function Admin({ menu, setMenu }: AdminProps) {
  
  if (menu === 'create-channel') {
    return <CreateChannel />;
  }

  return (
    <div className={`flex flex-col h-full items-center`}>
      <header className={`text-xl mb-5`}>Channels</header>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
        onClick={() => setMenu('create-channel')}
      >
        Create Channel
      </button>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
      >
        Archive Channel
      </button>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
      >
        Edit Channel
      </button>

      <header className={`text-xl mb-5 mt-4`}>Users</header>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
      >
        Timeout User
      </button>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
      >
        Ban User
      </button>

      <header className={`text-xl mb-5 mt-4`}>Messages</header>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
      >
        Unsend Message
      </button>
    </div>
  );
}