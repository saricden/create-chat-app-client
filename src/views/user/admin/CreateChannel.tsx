import { MouseEventHandler, useState } from 'react';
import { Input } from '../../../components/Input';
import Select, { StylesConfig, components } from 'react-select';
import * as featherIcons from 'react-feather';

interface CreateChannelProps {
  
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

const {Option} = components;

function IconOption(props: any) {
  return (
    <Option {...props}>
      {props.data.value.icon}
      <label>{props.data.label}</label>
    </Option>
  );
}

export function CreateChannel({ }: CreateChannelProps) {
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

  return (
    <div className={`flex flex-col h-full items-center`}>
        <header className={`text-xl mb-5`}>Create Channel</header>

        <Input
          type="text"
          label="Name"
          color="#FFF"
          className={`mb-4`}
        />

        <Input
          type="text"
          label="Slug"
          color="#FFF"
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
          className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-green-500 text-green-500 text-center`}
          // onClick={saveProfile}
        >
          Create Channel
        </button>

      </div>
  );
}