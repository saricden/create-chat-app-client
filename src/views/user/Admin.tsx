import { ArchiveChannel } from './admin/ArchiveChannel';
import { CreateChannel } from './admin/CreateChannel';
import { EditChannel } from './admin/EditChannel';
import { RestoreChannel } from './admin/RestoreChannel';
import { MuteUser } from './admin/MuteUser';

interface AdminProps {
  menu: string
  setMenu: Function
}

export function Admin({ menu, setMenu }: AdminProps) {
  
  if (menu === 'create-channel') {
    return <CreateChannel />;
  }
  else if (menu === 'edit-channel') {
    return <EditChannel />;
  }
  else if (menu === 'archive-channel') {
    return <ArchiveChannel />
  }
  else if (menu === 'restore-channel') {
    return <RestoreChannel />;
  }
  else if (menu === 'mute-user') {
    return <MuteUser />
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
        onClick={() => setMenu('edit-channel')}
      >
        Edit Channel
      </button>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
        onClick={() => setMenu('archive-channel')}
      >
        Archive Channel
      </button>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
        onClick={() => setMenu('restore-channel')}
      >
        Restore Channel
      </button>

      <header className={`text-xl mb-5 mt-4`}>Users</header>

      <button
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
        onClick={() => setMenu('mute-user')}
      >
        Mute User
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