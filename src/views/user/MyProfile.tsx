import { useState } from "react";
import { AvatarSelect } from "../../components/AvatarSelect";
import { Input } from "../../components/Input";
import { getUserData, updateUser } from "../../utils/account";
import { Loader } from "../../components/Loader";
import { UserProfile } from "../../components/UserProfile";

interface MyProfileProps {
  user: any
  onUpdate: Function
}

export function MyProfile({ user, onUpdate }: MyProfileProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [username, setUsername] = useState<string>(user.username);
  const [bio, setBio] = useState<string | undefined>(user.bio ? user.bio : undefined);

  async function saveProfile() {
    setSaving(true);

    await updateUser(
      user.auth_id,
      username,
      bio ? bio : null,
      avatarFile
    );

    const updatedUserData = await getUserData(user.auth_id);

    onUpdate(updatedUserData);

    setSaving(false);
    setEditing(false);
  }

  if (saving) {
    return (
      <div className={`h-full flex items-center justify-center`}>
        <Loader color="#FFF" message="Saving profile..." />
      </div>
    );
  }

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
          onClick={saveProfile}
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
      
      <UserProfile user={user} />
      
      <button
        className={`w-full mt-auto px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center`}
        onClick={() => setEditing(true)}
      >
        Edit Profile
      </button>
    </div>
  );
}