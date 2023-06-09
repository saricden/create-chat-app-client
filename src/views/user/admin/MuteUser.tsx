import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Loader } from '../../../components/Loader';
import { getAllUsers } from '../../../utils/admin';
import { getUserData } from '../../../utils/account';

const selectStyles: StylesConfig = {
  container: (styles) => ({
    ...styles,
    width: '100%',
    backgroundColor: 'transparent'
  }),
  control: (styles, { menuIsOpen }) => ({
    ...styles,
    height: '40px',
    backgroundColor: 'transparent',
    borderColor: '#FFF',
    border: 'solid 2px #FFF',
    borderRadius: '0.375rem',
    borderBottomLeftRadius: menuIsOpen ? 0 : '0.375rem',
    borderBottomRightRadius: menuIsOpen ? 0 : '0.375rem'
  }),
  input: (styles) => ({
    ...styles,
    color: '#FFF'
  }),
  placeholder: (styles) => ({
    ...styles,
    color: '#FFF'
  }),
  singleValue: (styles) => ({
    ...styles,
    color: '#FFF'
  }),
  option: (styles) => ({
    ...styles,
    backgroundColor: 'transparent',
    color: '#FFF',
    display: 'flex',
    flexDirection: 'row'
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: '#000',
    border: 'solid 2px #FFF',
    borderTop: 0,
    marginTop: 0,
    borderRadius: '0.375rem',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  })
};

export function MuteUser() {
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [users, setUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const userOptions: any = users.map((c: any) => ({
    value: c.auth_id,
    label: c.username
  }));
  const muteOptions = [
    {
      value: 1000 * 60 * 30,
      label: '30 minutes'
    },
    {
      value: 1000 * 60 * 60,
      label: '1 hour'
    },
    {
      value: 1000 * 60 * 60 * 4,
      label: '4 hours'
    },
    {
      value: 1000 * 60 * 60 * 8,
      label: '8 hours'
    },
    {
      value: 1000 * 60 * 60 * 24,
      label: '1 day'
    },
    {
      value: 1000 * 60 * 60 * 24 * 3,
      label: '3 days'
    },
    {
      value: 1000 * 60 * 60 * 24 * 7,
      label: '1 week'
    },
    {
      value: 1000 * 60 * 60 * 24 * 14,
      label: '2 weeks'
    },
    {
      value: 1000 * 60 * 60 * 24 * 30,
      label: '1 month'
    }
  ];
  const [selectedMutePeriod, setSelectedMutePeriod] = useState<any>(null);

  useEffect(() => {
    async function loadUsers() {
      const currentUser = await getUserData();
      const users = await getAllUsers();
      const {$id: currentUserId} = currentUser!;
      const otherUsers = users?.filter((u) => u.$id !== currentUserId);

      setUsers(otherUsers);
      setLoading(false);
    }

    loadUsers();
  }, []);

  async function muteUser() {
    setLoading(true);

    // await archiveChannel(
    //   selectedChannel.value,
    // );
    
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className={`flex flex-col h-full items-center justify-center`}>
        <p className={`text-lg mb-5`}>
          An app restart is required before this channel will appear as archived.
          <br /><br />
          Would you like to restart now?
        </p>

        <button
          className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
          onClick={() => window.location.reload()}
        >
          Restart App
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex flex-col h-full items-center justify-center`}>
        <Loader color="#FFF" />
      </div>
    );
  }

  console.log(users);

  return (
    <div className={`flex flex-col h-full items-center`}>
        <header className={`text-xl mb-2`}>Mute User</header>

        <p className={`mb-5`}>
          Muting a user will temporarily disable sending messages for them.
        </p>

        <Select
          options={userOptions}
          placeholder="Select user..."
          styles={selectStyles}
          value={selectedUser}
          onChange={(u: any) => setSelectedUser(u)}
          isSearchable
          className={`mb-4`}
        />

        <Select
          options={muteOptions}
          placeholder="Mute for..."
          styles={selectStyles}
          value={selectedMutePeriod}
          onChange={(mp: any) => setSelectedMutePeriod(mp)}
          isSearchable
          className={`mb-4 transition-all ${selectedUser === null ? 'opacity-50' : ''}`}
          isDisabled={selectedUser === null}
        />

        <button
          className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-red-500 text-red-500 text-center transition-all ${selectedUser === null ? 'opacity-50' : ''}`}
          onClick={muteUser}
          disabled={selectedUser === null}
        >
          Mute User
        </button>

      </div>
  );
}