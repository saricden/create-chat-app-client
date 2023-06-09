import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { Loader } from '../../../components/Loader';
import { archiveChannel } from '../../../utils/admin';
import { getChannels } from '../../../utils/chat';

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

export function ArchiveChannel() {
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [channels, setChannels] = useState<any>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const channelOptions: any = channels.map((c: any) => ({
    value: c.$id,
    label: c.title
  }));

  useEffect(() => {
    async function loadChannels() {
      const channels = await getChannels();

      setChannels(channels);
      setLoading(false);
    }

    loadChannels();
  }, []);

  async function saveChannel() {
    setLoading(true);

    await archiveChannel(
      selectedChannel.value,
    );
    
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

  return (
    <div className={`flex flex-col h-full items-center`}>
        <header className={`text-xl mb-5`}>Archive Channel</header>

        <Select
          options={channelOptions}
          placeholder="Select channel..."
          styles={selectStyles}
          value={selectedChannel}
          onChange={(c: any) => setSelectedChannel(c)}
          isSearchable
          className={`mb-4`}
        />

        <button
          className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-red-500 text-red-500 text-center transition-all ${selectedChannel === null ? 'opacity-50' : ''}`}
          onClick={saveChannel}
          disabled={selectedChannel === null}
        >
          Archive Channel
        </button>

      </div>
  );
}