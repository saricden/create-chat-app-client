import { useState } from 'react';
import config from '../../chat.config.json';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { account, ID } from '../utils/appwrite';
import { Loader } from '../components/Loader';
import { getQueryParam, isEmailValid } from '../utils/helpers';
import { Checkmark } from '../components/Checkmark';
import { redirect } from 'react-router-dom';
import { userIsLoggedIn } from '../utils/account';

export function Login() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [errored, setErrored] = useState(false);

  async function sendLoginLink() {
    if (isEmailValid(email)) {
      setLoading(true);

      try {
        await account.createMagicURLSession(
          ID.unique(),
          email,
          window.location.href
        );

        setSent(true);
      }
      catch (e) {
        console.warn(e);
      }

      setLoading(false);
    }
    else {
      setErrored(true);
    }
  }

  return (
    <main className={`relative w-full min-h-screen flex items-center justify-center p-4`}>
      <div className={`w-full max-w-sm flex flex-col items-center justify-center`}>
        <h1 className={`text-3xl font-extrabold mb-8`}>{config.serverName}</h1>

        <Input
          type="email"
          label="Email"
          className={`mb-4`}
          value={email}
          error={errored}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrored(false);
          }}
        />

        <Button
          label="Send login link"
          onClick={sendLoginLink}
        />
      </div>

      <div
        className={`absolute top-0 left-0 w-full h-full bg-white transition-all flex items-center justify-center p-4`}
        style={{
          opacity: loading ? '1' : '0',
          visibility: loading ? 'visible' : 'hidden'
        }}
      >
        <Loader message="Sending login link..." />
      </div>

      <div
        className={`absolute top-0 left-0 w-full h-full bg-white transition-all flex items-center justify-center p-4`}
        style={{
          opacity: sent ? '1' : '0',
          visibility: sent ? 'visible' : 'hidden'
        }}
      >
        {sent && <Checkmark message="The link successfully sent. You can now safely close this page. Please check your email for a login link." /> }
      </div>
    </main>
  );
}

export async function loginLoader() {
  const userId = getQueryParam('userId');
  const secret = getQueryParam('secret');

  // Complete login if coming from email link
  if (userId && secret) {
    try {
      await account.updateMagicURLSession(userId, secret);
    }
    catch (e) {
      console.warn(e);
    }
  }

  const isLoggedIn = await userIsLoggedIn();

  if (isLoggedIn) {
    return redirect('/u/register');
  }
  else {
    return null; // Show login screen
  }
}