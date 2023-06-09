import { useState } from 'react';
import { Input } from '../../../components/Input';
import Select, { StylesConfig, components } from 'react-select';
import * as featherIcons from 'react-feather';
import { Loader } from '../../../components/Loader';
import { createChannel } from '../../../utils/admin';

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

export function CreateChannel() {
  const [title, setTitle] = useState('');
  const slug = title.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`'"~()]/g, '').replace(/\s/g, '-');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [icon, setIcon] = useState({
    value: {
      name: 'Activity',
      icon: <featherIcons.Activity style={{ marginRight: 8 }} />
    },
    label: 'Activity'
  });
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

  async function saveNewChannel() {
    setLoading(true);

    await createChannel(
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
          An app restart is required before the new channel {title} will be visible.
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
        <header className={`text-xl mb-5`}>Create Channel</header>

        <Input
          type="text"
          label="Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          color="#FFF"
          className={`mb-4`}
        />

        <Input
          type="text"
          label="Slug"
          value={slug}
          color="#FFF"
          disabled
          className={`mb-4`}
        />

        <label className={`w-full text-md font-semibold`}>Icon</label>

        <div className={`w-full flex flex-row items-center mb-8`}>
          {icon.value.icon}
          <Select
            options={icons}
            styles={selectStyles}
            value={icon}
            onChange={(icon: any) => setIcon(icon)}
            components={{
              Option: IconOption
            }}
            isSearchable
          />
        </div>

        <button
          className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-green-500 text-green-500 text-center transition-all ${title.trim().length === 0 ? 'opacity-50' : ''}`}
          onClick={saveNewChannel}
          disabled={title.trim().length === 0}
        >
          Create Channel
        </button>

      </div>
  );
}