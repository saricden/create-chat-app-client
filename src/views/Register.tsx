import nl2br from "react-nl2br";
import { Navbar } from "../components/Navbar";
import config from '../../jabberbase.config.json';
import { AvatarSelect } from "../components/AvatarSelect";
import { account } from "../utils/appwrite";
import { redirect, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Loader } from "../components/Loader";
import { register, userHasProfile, userIsLoggedIn } from "../utils/account";

export function Register() {
  const navigate = useNavigate();
  const [locked, setLocked] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<any>(null);

  async function joinServer() {
    setLoading(true);

    await register(username, avatarFile);

    navigate('/c');
  }

  return (
    <>
      <Navbar locked />

      <main className={`relative pt-20 w-full min-h-screen flex flex-col items-center p-4`}>
        <div className={`w-full max-w-sm flex flex-col items-center justify-center`}>
          <p className={`text-lg mb-6`}>{nl2br(config.welcomeMessage)}</p>

          <AvatarSelect
            className="mb-6"
            onSelect={(file: any) => setAvatarFile(file)}
          />

          <Input
            type="text"
            label="Username on server"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-6"
          />

          <Button
            label="Join server"
            onClick={joinServer}
            disabled={locked}
            pulse={locked}
          />
        </div>

        <div
          className={`absolute top-0 left-0 w-full h-full bg-white transition-all flex items-center justify-center p-4`}
          style={{
            opacity: loading ? '1' : '0',
            visibility: loading ? 'visible' : 'hidden'
          }}
        >
          <Loader message="Joining server..." />
        </div>
      </main>
    </>
  );
}

export async function registerLoader() {
  try {
    const hasProfile = await userHasProfile();

    if (hasProfile) {
      return redirect('/c');
    }
    
    const isLoggedIn = await userIsLoggedIn();

    if (isLoggedIn) {
      return null;
    }
  }
  catch (e) {
    console.warn(e);
  }

  return redirect('/');
}