import { useEffect, useState } from 'react';
import { Input } from '../../../components/Input';
import Select, { StylesConfig, components } from 'react-select';
import * as featherIcons from 'react-feather';
import { Loader } from '../../../components/Loader';
import { updateChannel } from '../../../utils/admin';
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

const {Option} = components;

function IconOption(props: any) {
  return (
    <Option {...props}>
      {props.data.value.icon}
      <label>{props.data.label}</label>
    </Option>
  );
}

export function EditChannel() {
  const [title, setTitle] = useState('');
  const slug = title.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`'"~()]/g, '').replace(/\s/g, '-');
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [channels, setChannels] = useState<any>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [icon, setIcon] = useState<any>(null);
  const icons = Object.keys(featherIcons).map((iconName) => {
    // @ts-ignore
    const Icon = featherIcons[iconName];

    return ({
      value: {
        name: iconName,
        icon: <Icon style={{ marginRight: 8 }} />
      },
      label: iconName
    })
  });
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

  useEffect(() => {
    if (selectedChannel) {
      const {value: id} = selectedChannel;
      const channel = channels.find((c: any) => c.$id === id);

      if (channel) {
        const icon = icons.find((i: any) => i.value.name === channel.icon);
        
        setTitle(channel.title);
        setIcon(icon);
      }
    }
  }, [selectedChannel]);

  async function saveChannel() {
    setLoading(true);

    await updateChannel(
      selectedChannel.value,
      title,
      slug,
      icon.value.name
    );
    
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className={`flex flex-col h-full items-center justify-center`}>
        <p className={`text-lg mb-5`}>
          An app restart is required before edits to channel {title} will be visible. Would you like to restart now?
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
        <header className={`text-xl mb-5`}>Edit Channel</header>

        <Select
          options={channelOptions}
          placeholder="Select channel..."
          styles={selectStyles}
          value={selectedChannel}
          onChange={(c: any) => setSelectedChannel(c)}
          isSearchable
          className={`mb-4`}
        />

        <Input
          type="text"
          label="Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          color="#FFF"
          className={`mb-4`}
          disabled={selectedChannel === null}
        />

        <Input
          type="text"
          label="Slug"
          value={slug}
          color="#FFF"
          disabled
          className={`mb-4`}
        />

        <label className={`w-full text-md font-semibold transition-all ${selectedChannel === null ? 'opacity-50' : ''}`}>Icon</label>

        <div className={`w-full flex flex-row items-center mb-8 transition-all ${selectedChannel === null ? 'opacity-50' : ''}`}>
          {
            icon === null
            ? <div className={`w-[40px]`} />
            : icon.value.icon
          }
          <Select
            options={icons}
            styles={selectStyles}
            value={icon}
            onChange={(icon: any) => setIcon(icon)}
            components={{
              Option: IconOption
            }}
            isSearchable
            isDisabled={selectedChannel === null}
          />
        </div>

        <button
          className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-green-500 text-green-500 text-center transition-all ${(selectedChannel === null || title.trim().length === 0) ? 'opacity-50' : ''}`}
          onClick={saveChannel}
          disabled={(selectedChannel === null || title.trim().length === 0)}
        >
          Save Channel
        </button>

      </div>
  );
}