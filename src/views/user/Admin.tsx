import { useState } from 'react';
import { CreateChannel } from './admin/CreateChannel';

interface AdminProps {

}

export function Admin({}: AdminProps) {
  const [view, setView] = useState('root');
  

  if (view === 'create-channel') {
    return <CreateChannel onCancel={() => setView('root')} />;
  }

  return (
    <div className={`flex flex-col h-full items-center`}>
      <header className={`text-xl mb-5`}>Channels</header>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
        onClick={() => setView('create-channel')}
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