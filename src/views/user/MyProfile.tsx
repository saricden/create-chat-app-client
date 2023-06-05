import { useState } from "react";
import { AvatarSelect } from "../../components/AvatarSelect";
import { Input } from "../../components/Input";

interface MyProfileProps {
  user: any
}

export function MyProfile({ user }: MyProfileProps) {
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [username, setUsername] = useState<string>(user.username);
  const [bio, setBio] = useState<string>(user.bio || '(no bio yet)');

  if (editing) {
    return (
      <div className={`flex flex-col h-full items-center justify-center`}>
        <AvatarSelect
          className={`mb-4 border-white`}
          onSelect={(file: any) => setAvatarFile(file)}
          initSrc={user.avatar}
          color="white"
        />

        <Input
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          color="white"
          className={`mb-4`}
        />

        <Input
          type="textarea"
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          color="white"
        />

        <button
          className={`w-full mt-auto px-4 py-2 border-2 rounded-md mb-3 border-green-500 text-green-500 text-center`}
          onClick={() => setEditing(true)}
        >
          Save Profile
        </button>

        <button
          onClick={() => setEditing(false)}
        >
          or Cancel
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full items-center justify-center`}>
      <img
        src={user.avatar}
        alt={`${user.username}'s profile picture.`}
        className={`w-32 h-32 border-2 border-white rounded-md bg-cover bg-center mb-4`}
        style={{
          backgroundImage: `url(${user.avatar})`
        }}
      />
      
      <h1 className={`text-2xl mb-4`}>@{user.username}</h1>

      <p>{user.bio || "(no bio yet)"}</p>
      
      <button
        className={`w-full mt-auto px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
        onClick={() => setEditing(true)}
      >
        Edit Profile
      </button>
    </div>
  );
}