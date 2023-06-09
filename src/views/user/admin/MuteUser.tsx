import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Loader } from '../../../components/Loader';
import { getAllUsers, muteUser } from '../../../utils/admin';
import { getUserData } from '../../../utils/account';

interface MuteUserProps {
  onSubmit: Function
}

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

export function MuteUser({ onSubmit }: MuteUserProps) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const userOptions: any = users.map((c: any) => ({
    value: c.auth_id,
    label: `${c.username} (${c.auth_id})`
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

  async function doMuteUser() {
    setLoading(true);

    await muteUser(
      selectedUser.value,
      selectedMutePeriod.value
    );
    
    onSubmit();
  }

  if (loading) {
    return (
      <div className={`flex flex-col h-full items-center justify-center`}>
        <Loader color="#FFF" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full items-center`}>
      <header className={`text-xl mb-2`}>Mute User</header>

      <p className={`mb-5`}>
        Muting a user will temporarily disable them from sending users and interacting on this server.
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
        className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-red-500 text-red-500 text-center transition-all ${(selectedUser === null || selectedMutePeriod === null) ? 'opacity-50' : ''}`}
        onClick={doMuteUser}
        disabled={(selectedUser === null || selectedMutePeriod === null)}
      >
        Mute User
      </button>

    </div>
  );
}