import * as FeatherIcon from 'react-feather';
import { Link } from 'react-router-dom';

interface ChannelBtnProps {
  title: string
  slug: string
  icon: string
  active: boolean
}

export function ChannelBtn({ title, slug, icon, active}: ChannelBtnProps) {
  // @ts-ignore
  const Icon = FeatherIcon[icon];

  return (
    <Link
      className={`flex flex-row shrink-0 items-center py-1 px-2 mx-1 border-2 rounded-md font-semibold ${active ? 'bg-white text-black border-black' : 'bg-black text-white border-white'}`}
      to={`/c/${slug}`}
    >
      <Icon className={`mr-1`} />
      <label>{title}</label>
    </Link>
  );
}